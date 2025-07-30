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
    results: []
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

  // Extract Key Stats section - Enhanced table detection
  const keyStatsMatch = cleanText.match(/Key Stats[:\n](.*?)$/is);
  if (keyStatsMatch) {
    const statsText = keyStatsMatch[1].trim();
    console.log('Raw Key Stats text:', statsText.substring(0, 300));
    
    const lines = statsText.split('\n').map(l => l.trim()).filter(l => l.length > 3);
    console.log('Key Stats lines:', lines.slice(0, 10));
    
    // Try to detect table-like structures (common in DOCX extractions)
    const tableRows = [];
    const results: { metric: string; value: string; description: string }[] = [];
    
    // First pass: look for table rows with separators
    for (const line of lines) {
      // Look for lines that might be table rows (contain tabs or multiple spaces)
      if (line.includes('\t') || /\s{3,}/.test(line)) {
        const cells = line.split(/\t|\s{3,}/).filter(cell => cell.trim());
        if (cells.length >= 2) {
          tableRows.push(cells);
          console.log('Found table row:', cells);
        }
      }
      
      // Also look for structured patterns like "Metric | Value | Description"
      const structuredMatch = line.match(/^([^|]+)\|([^|]+)\|(.+)$/);
      if (structuredMatch) {
        tableRows.push([
          structuredMatch[1].trim(),
          structuredMatch[2].trim(),
          structuredMatch[3].trim()
        ]);
        console.log('Found structured row:', structuredMatch.slice(1));
      }
    }
    
    console.log('Total table rows found:', tableRows.length);
    
    // Process table rows if found
    if (tableRows.length > 0) {
      for (const row of tableRows) {
        if (row.length >= 2) {
          const metric = row[0];
          const value = row[1];
          const description = row[2] || `${metric}: ${value}`;
          
          // Skip header rows
          if (!metric.toLowerCase().includes('metric') && 
              !metric.toLowerCase().includes('result') &&
              !metric.toLowerCase().includes('outcome') &&
              (value.includes('%') || value.includes('$') || value.includes('x') || /\d/.test(value))) {
            results.push({
              metric: metric.trim(),
              value: value.trim(),
              description: description.trim()
            });
            console.log('Added result:', { metric, value, description });
          }
        }
      }
    } else {
      console.log('No table rows found, trying pattern matching...');
      // Fallback to pattern matching for unstructured text
      const metricPatterns = [
        /(\d+%)\s+(.+?)(?:\s+(.{10,}))?$/,                    // "50% improvement description"
        /(\$[\d,]+)\s+(.+?)(?:\s+(.{10,}))?$/,                // "$50,000 savings description"
        /(\d+x)\s+(.+?)(?:\s+(.{10,}))?$/,                    // "2x increase description"
        /(.+?):\s*(\d+%|\$[\d,]+|\d+x|\d+)\s*(.*)$/,          // "Metric: 50% description"
        /(\d+)\s*(increase|decrease|improvement|reduction|growth)\s*in\s*(.+)/i,
        /(.+?)\s*[-–]\s*(\d+%|\$[\d,]+|\d+x|\d+[^%$x]*)/,     // "Description - 50%"
        /^(.+?)\s+(\d+%|\$[\d,]+|\d+x)(.*)$/                  // "Description 50% more text"
      ];
      
      for (const line of lines) {
        // Skip obvious header or introductory lines
        if (line.toLowerCase().includes('key results') || 
            line.toLowerCase().includes('metrics') ||
            line.toLowerCase().includes('outcomes') ||
            line.length < 5) {
          continue;
        }
        
        console.log('Testing line for patterns:', line);
        
        for (const pattern of metricPatterns) {
          const match = line.match(pattern);
          if (match) {
            console.log('Pattern matched:', match);
            let metric, value, description;
            
            if (pattern.source.includes('increase|decrease')) {
              value = match[1];
              metric = match[3];
              description = `${match[1]} ${match[2]} in ${match[3]}`;
            } else if (pattern.source.includes(':')) {
              metric = match[1];
              value = match[2];
              description = match[3] || line;
            } else if (pattern.source.includes('[-–]')) {
              metric = match[1];
              value = match[2];
              description = line;
            } else {
              metric = match[1];
              value = match[2];
              description = match[3] || line;
            }
            
            if (metric && value && metric.length <= 100) {
              results.push({
                metric: metric.trim(),
                value: value.trim(),
                description: (description || line).trim()
              });
              console.log('Added result from pattern:', { metric, value, description });
              break;
            }
          }
        }
      }
    }
    
    content.results = results.slice(0, 3);
    console.log('Final Key Stats results:', content.results.length, content.results);
  } else {
    console.log('No Key Stats section found in text');
    // Try alternative section names
    const alternativeMatches = [
      cleanText.match(/Results[:\n](.*?)$/is),
      cleanText.match(/Outcomes[:\n](.*?)$/is),
      cleanText.match(/Impact[:\n](.*?)$/is),
      cleanText.match(/Metrics[:\n](.*?)$/is)
    ];
    
    for (const altMatch of alternativeMatches) {
      if (altMatch) {
        console.log('Found alternative results section:', altMatch[0].substring(0, 50));
        // Use the same parsing logic as above but with alternative section
        const statsText = altMatch[1].trim();
        const lines = statsText.split('\n').map(l => l.trim()).filter(l => l.length > 3);
        
        for (const line of lines.slice(0, 5)) {
          const simpleMatch = line.match(/(.+?)\s*[-–:]\s*(\d+%|\$[\d,]+|\d+x|\d+)/);
          if (simpleMatch) {
            content.results.push({
              metric: simpleMatch[1].trim(),
              value: simpleMatch[2].trim(),
              description: line
            });
          }
        }
        break;
      }
    }
    
    console.log('Alternative parsing results:', content.results.length);
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
  
  if (file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
    text = await parseDocxFile(file);
  } else if (file.type === 'application/pdf') {
    text = await parsePdfFile(file);
  } else {
    throw new Error('Unsupported file type');
  }
  
  return extractStructuredContent(text);
}