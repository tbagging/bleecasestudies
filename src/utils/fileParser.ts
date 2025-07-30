import * as mammoth from 'mammoth';
import { getDocument } from 'pdfjs-dist';

// Set up PDF.js worker
import { GlobalWorkerOptions } from 'pdfjs-dist';
GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/4.0.379/pdf.worker.min.js`;

export interface ParsedCaseStudyContent {
  clientSnapshot: string;
  background: string;
  challenge: string;
  process: { phase: string; description: string }[];
  results: { metric: string; value: string; description: string }[];
  companySize?: string;
  timeline?: string;
  images: string[];
}

export async function parseDocxFile(file: File): Promise<string> {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const result = await mammoth.extractRawText({ arrayBuffer });
    return result.value;
  } catch (error) {
    console.error('Error parsing DOCX file:', error);
    throw new Error('Failed to parse DOCX file');
  }
}

export async function extractImagesFromDocx(file: File): Promise<string[]> {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const images: string[] = [];
    
    const result = await mammoth.convertToHtml(
      { arrayBuffer },
      {
        convertImage: mammoth.images.imgElement(function(image) {
          return image.read("base64").then(function(imageBuffer) {
            const base64 = imageBuffer;
            const dataUrl = `data:${image.contentType};base64,${base64}`;
            images.push(dataUrl);
            return {
              src: dataUrl
            };
          });
        })
      }
    );
    
    return images;
  } catch (error) {
    console.error('Error extracting images from DOCX file:', error);
    return [];
  }
}

export async function parsePdfFile(file: File): Promise<string> {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await getDocument({ data: arrayBuffer }).promise;
    let fullText = '';
    
    for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
      const page = await pdf.getPage(pageNum);
      const textContent = await page.getTextContent();
      const pageText = textContent.items
        .map((item: any) => item.str)
        .join(' ');
      fullText += pageText + '\n';
    }
    
    return fullText;
  } catch (error) {
    console.error('Error parsing PDF file:', error);
    throw new Error('Failed to parse PDF file');
  }
}

export function extractStructuredContent(text: string): ParsedCaseStudyContent {
  const content: ParsedCaseStudyContent = {
    clientSnapshot: '',
    background: '',
    challenge: '',
    process: [],
    results: [],
    images: []
  };

  console.log('Parsing text:', text.substring(0, 500) + '...');
  
  // Clean up the text and preserve line breaks for section identification
  const cleanText = text.replace(/\r\n/g, '\n').replace(/\r/g, '\n');
  
  // Extract Client Snapshot section
  const clientSnapshotMatch = cleanText.match(/Client Snapshot[:\n](.*?)(?=\n\s*(?:Overview|Challenge|The Process|Key Stats|$))/is);
  if (clientSnapshotMatch) {
    content.clientSnapshot = clientSnapshotMatch[1].trim();
    console.log('Found Client Snapshot:', content.clientSnapshot.substring(0, 100));
  }
  
  // Extract Overview section (maps to background)
  const overviewMatch = cleanText.match(/Overview[:\n](.*?)(?=\n\s*(?:Client Snapshot|Challenge|The Process|Key Stats|$))/is);
  if (overviewMatch) {
    content.background = overviewMatch[1].trim();
    console.log('Found Overview:', content.background.substring(0, 100));
  }

  // Extract Challenge section
  const challengeMatch = cleanText.match(/Challenge[:\n](.*?)(?=\n\s*(?:Client Snapshot|Overview|The Process|Key Stats|$))/is);
  if (challengeMatch) {
    content.challenge = challengeMatch[1].trim();
    console.log('Found Challenge:', content.challenge.substring(0, 100));
  }

  // Extract The Process section
  const processMatch = cleanText.match(/The Process[:\n](.*?)(?=\n\s*(?:Client Snapshot|Overview|Challenge|Key Stats|$))/is);
  if (processMatch) {
    const processText = processMatch[1].trim();
    
    // Skip introductory sentences and find actual process steps
    const introductoryPhrases = [
      'the process included',
      'our process consisted of',
      'we followed',
      'the methodology',
      'our approach',
      'process overview'
    ];
    
    // Look for actual phase names with descriptions
    const phasePatterns = [
      // Pattern for "Phase Name:" followed by description
      /([^:\n]+):\s*([^\n]+(?:\n(?!.*:)[^\n]+)*)/g,
      // Pattern for numbered items "1. Phase Name - description"
      /(\d+\.\s*[^-\n]+)\s*[-–]\s*([^\n]+(?:\n(?!\d+\.)[^\n]+)*)/g,
      // Pattern for bullet points with descriptions
      /[•\-\*]\s*([^:\n]+):\s*([^\n]+(?:\n(?![•\-\*])[^\n]+)*)/g
    ];
    
    let steps: { phase: string; description: string }[] = [];
    
    for (const pattern of phasePatterns) {
      const matches = Array.from(processText.matchAll(pattern));
      if (matches.length > 0) {
        steps = matches.map(match => ({
          phase: match[1].trim(),
          description: match[2].trim()
        })).filter(step => {
          // Filter out introductory sentences
          const isIntroductory = introductoryPhrases.some(phrase => 
            step.phase.toLowerCase().includes(phrase)
          );
          return !isIntroductory && step.phase.length >= 3 && step.phase.length <= 50;
        });
        break;
      }
    }
    
    // Fallback: split by numbered items or bullet points if no patterns match
    if (steps.length === 0) {
      const processLines = processText.split(/\n/).map(line => line.trim()).filter(line => line.length > 0);
      
      for (const line of processLines) {
        // Skip introductory sentences
        const isIntroductory = introductoryPhrases.some(phrase => 
          line.toLowerCase().includes(phrase)
        );
        
        if (isIntroductory || line.length > 80) {
          continue;
        }
        
        // Look for numbered, bulleted, or titled items
        const stepPatterns = [
          /^\d+\.\s*([^.]+?)(?:\s*[:.]\s|$)/,  // "1. Step name"
          /^•\s*([^.]+?)(?:\s*[:.]\s|$)/,      // "• Step name"
          /^-\s*([^.]+?)(?:\s*[:.]\s|$)/,      // "- Step name"
          /^([A-Z][^.!?]*?):\s/,              // "Step Name: description"
          /^([A-Z][a-zA-Z\s&]{3,25})$/        // Standalone phase names
        ];
        
        for (const pattern of stepPatterns) {
          const match = line.match(pattern);
          if (match) {
            const stepName = (match[1] || match[0]).trim();
            if (stepName && stepName.length >= 3 && stepName.length <= 50) {
              const restOfLine = line.replace(match[0], '').trim();
              steps.push({
                phase: stepName,
                description: restOfLine || stepName
              });
              break;
            }
          }
        }
      }
    }
    
    content.process = steps.slice(0, 6);
    console.log('Found Process steps:', steps.length, steps.map(s => s.phase));
  }

  // Extract Key Stats section - Enhanced detection
  console.log('Looking for results section in text...');
  
  // Try multiple section name patterns
  const resultSectionPatterns = [
    /Key Stats[:\n](.*?)(?=\n\s*(?:[A-Z][^:\n]*:|$))/is,
    /Results[:\n](.*?)(?=\n\s*(?:[A-Z][^:\n]*:|$))/is,
    /Outcomes[:\n](.*?)(?=\n\s*(?:[A-Z][^:\n]*:|$))/is,
    /Impact[:\n](.*?)(?=\n\s*(?:[A-Z][^:\n]*:|$))/is,
    /Metrics[:\n](.*?)(?=\n\s*(?:[A-Z][^:\n]*:|$))/is,
    /Key Results[:\n](.*?)(?=\n\s*(?:[A-Z][^:\n]*:|$))/is
  ];
  
  let statsText = '';
  let sectionFound = '';
  
  for (const pattern of resultSectionPatterns) {
    const match = cleanText.match(pattern);
    if (match) {
      statsText = match[1].trim();
      sectionFound = pattern.source.split('[')[0];
      console.log(`Found ${sectionFound} section:`, statsText.substring(0, 200));
      break;
    }
  }
  
  if (statsText) {
    const lines = statsText.split('\n').map(l => l.trim()).filter(l => l.length > 3);
    console.log('Processing lines:', lines.slice(0, 10));
    
    const results: { metric: string; value: string; description: string }[] = [];
    
    // Enhanced pattern matching for different formats
    const patterns = [
      // Table-like formats with separators
      /^([^|\t]+)[\|\t]+([^|\t]+)[\|\t]+(.+)$/,
      
      // "Metric: Value Description" format
      /^([^:]+?):\s*(\d+%|\$[\d,]+|\d+x|\d+(?:\.\d+)?[kmb]?)\s*(.*)$/i,
      
      // "Value Metric Description" format
      /^(\d+%|\$[\d,]+|\d+x|\d+(?:\.\d+)?[kmb]?)\s+([^.]+?)(?:\s+(.+))?$/,
      
      // "Metric - Value Description" format
      /^([^-]+?)\s*[-–]\s*(\d+%|\$[\d,]+|\d+x|\d+(?:\.\d+)?[kmb]?)\s*(.*)$/,
      
      // "Value improvement/increase in Metric" format
      /^(\d+%|\$[\d,]+|\d+x|\d+(?:\.\d+)?[kmb]?)\s*(improvement|increase|growth|reduction|decrease)\s*(?:in\s*)?(.+)$/i,
      
      // Lines that start with numbers/percentages/currency
      /^(\d+%|\$[\d,]+|\d+x)\s*(.+)$/,
      
      // Multi-space separated (common in DOCX table exports)
      /^([^\s]+(?:\s+[^\s]+)*?)\s{3,}(\d+%|\$[\d,]+|\d+x|\d+(?:\.\d+)?[kmb]?)\s{3,}(.+)$/,
    ];
    
    for (let i = 0; i < lines.length && results.length < 4; i++) {
      const line = lines[i];
      
      // Skip obvious headers
      if (line.toLowerCase().includes('metric') && line.toLowerCase().includes('value')) {
        console.log('Skipping header line:', line);
        continue;
      }
      
      if (line.toLowerCase().includes('key stats') || 
          line.toLowerCase().includes('results') ||
          line.length < 5) {
        continue;
      }
      
      console.log(`Testing line ${i}:`, line);
      
      for (const [index, pattern] of patterns.entries()) {
        const match = line.match(pattern);
        if (match) {
          console.log(`Pattern ${index} matched:`, match);
          
          let metric, value, description;
          
          if (index === 0) { // Table format
            metric = match[1].trim();
            value = match[2].trim();
            description = match[3].trim();
          } else if (index === 1) { // "Metric: Value Description"
            metric = match[1].trim();
            value = match[2].trim();
            description = match[3].trim() || `${metric}: ${value}`;
          } else if (index === 2) { // "Value Metric Description"
            value = match[1].trim();
            metric = match[2].trim();
            description = match[3]?.trim() || `${value} ${metric}`;
          } else if (index === 3) { // "Metric - Value Description"
            metric = match[1].trim();
            value = match[2].trim();
            description = match[3].trim() || `${metric}: ${value}`;
          } else if (index === 4) { // "Value improvement in Metric"
            value = match[1].trim();
            metric = match[3].trim();
            description = `${value} ${match[2]} in ${metric}`;
          } else if (index === 5) { // "Value something"
            value = match[1].trim();
            metric = match[2].trim().split(' ').slice(0, 3).join(' ');
            description = match[2].trim();
          } else if (index === 6) { // Multi-space separated
            metric = match[1].trim();
            value = match[2].trim();
            description = match[3].trim();
          }
          
          // Validate the result
          if (value && metric && metric.length <= 100 && value.length <= 50) {
            results.push({
              metric: metric,
              value: value,
              description: description || `${metric}: ${value}`
            });
            console.log('Added result:', { metric, value, description });
            break;
          }
        }
      }
    }
    
    // If no patterns worked, try a simple fallback
    if (results.length === 0) {
      console.log('No patterns matched, trying simple extraction...');
      for (const line of lines.slice(0, 8)) {
        // Look for any numbers/percentages in the line
        const numberMatch = line.match(/(\d+%|\$[\d,]+|\d+x|\d+)/);
        if (numberMatch && line.length > 10 && line.length < 200) {
          const value = numberMatch[1];
          const remaining = line.replace(numberMatch[1], '').trim();
          results.push({
            metric: remaining.substring(0, 50) || 'Key Result',
            value: value,
            description: line
          });
          console.log('Added fallback result:', line);
          if (results.length >= 3) break;
        }
      }
    }
    
    content.results = results.slice(0, 3);
    console.log('Final results extracted:', content.results);
  } else {
    console.log('No results section found at all');
  }

  // Extract company size and timeline if mentioned anywhere
  const sizeMatch = cleanText.match(/(\d+(?:,\d+)*)\s*(?:employees|staff|people|team members)/i);
  if (sizeMatch) {
    content.companySize = `${sizeMatch[1]} employees`;
  }

  const timelineMatch = cleanText.match(/(\d+)\s*(?:months?|weeks?|days?)\s*(?:project|timeline|duration)/i);
  if (timelineMatch) {
    content.timeline = `${timelineMatch[1]} ${timelineMatch[0].includes('week') ? 'weeks' : timelineMatch[0].includes('day') ? 'days' : 'months'}`;
  }

  console.log('Final parsed content:', {
    hasClientSnapshot: !!content.clientSnapshot,
    hasBackground: !!content.background,
    hasChallenge: !!content.challenge,
    processCount: content.process.length,
    resultsCount: content.results.length
  });

  return content;
}

export async function parseFile(file: File): Promise<ParsedCaseStudyContent> {
  let text: string;
  let images: string[] = [];
  
  if (file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
    text = await parseDocxFile(file);
    images = await extractImagesFromDocx(file);
  } else if (file.type === 'application/pdf') {
    text = await parsePdfFile(file);
  } else {
    throw new Error('Unsupported file type');
  }
  
  const content = extractStructuredContent(text);
  content.images = images;
  
  return content;
}