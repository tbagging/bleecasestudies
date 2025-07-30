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
        }));
        break;
      }
    }
    
    // Fallback: split by numbered items or bullet points if no patterns match
    if (steps.length === 0) {
      const fallbackSteps = processText
        .split(/(?:\n|^)(?:\d+\.|[•\-\*])\s*/)
        .filter(item => item.trim().length > 15)
        .map((item, index) => {
          const lines = item.trim().split('\n');
          const phase = lines[0].includes(':') ? lines[0].split(':')[0] : `Phase ${index + 1}`;
          const description = lines[0].includes(':') ? lines.slice(0).join('\n').split(':').slice(1).join(':').trim() : item.trim();
          return { phase: phase.trim(), description };
        })
        .slice(0, 6);
      steps = fallbackSteps;
    }
    
    content.process = steps;
    console.log('Found Process steps:', steps.length, steps.map(s => s.phase));
  }

  // Extract Key Stats section
  const keyStatsMatch = cleanText.match(/Key Stats[:\n](.*?)$/is);
  if (keyStatsMatch) {
    const statsText = keyStatsMatch[1].trim();
    
    // Look for table-like structures with metrics, values, and descriptions
    const tableRows = statsText.split(/\n+/).filter(line => line.trim().length > 5);
    
    // Try to detect table format (metric | value | description)
    const results: { metric: string; value: string; description: string }[] = [];
    
    for (const row of tableRows.slice(0, 4)) {
      // Look for table separators (|, tabs, multiple spaces)
      const cells = row.split(/\s*[\|\t]\s*|\s{3,}/).filter(cell => cell.trim().length > 0);
      
      if (cells.length >= 3) {
        // Table format with 3+ columns
        results.push({
          metric: cells[0].trim(),
          value: cells[1].trim(),
          description: cells.slice(2).join(' ').trim()
        });
      } else if (cells.length === 2) {
        // Two column format
        results.push({
          metric: cells[0].trim(),
          value: cells[1].trim(),
          description: cells[1].trim()
        });
      } else {
        // Single line format - try to extract metric and value
        const metricMatch = row.match(/(\d+%|\d+x|\$[\d,]+|\d+\s*(?:million|thousand|hours|days|months|weeks))/i);
        if (metricMatch) {
          const metric = metricMatch[0];
          const description = row.replace(metricMatch[0], '').trim();
          results.push({
            metric,
            value: metric,
            description: description || 'Key improvement achieved'
          });
        } else {
          // Fallback: treat as description with generic metric
          results.push({
            metric: `Result ${results.length + 1}`,
            value: row.substring(0, 30).trim() + '...',
            description: row.trim()
          });
        }
      }
    }
    
    content.results = results.slice(0, 3);
    console.log('Found Key Stats:', content.results.length, content.results.map(r => r.metric));
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