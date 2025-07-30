import * as mammoth from 'mammoth';
import { getDocument } from 'pdfjs-dist';

// Set up PDF.js worker
import { GlobalWorkerOptions } from 'pdfjs-dist';
GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/4.0.379/pdf.worker.min.js`;

export interface ParsedCaseStudyContent {
  clientSnapshot: string;
  background: string;
  challenge: string[];
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
    challenge: [],
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
    const challengeText = challengeMatch[1].trim();
    const challenges = challengeText
      .split(/[\n•\-\*]|(?:\d+\.)|(?:Challenge \d+)/i)
      .filter(item => item.trim().length > 15)
      .map(item => item.trim())
      .slice(0, 6);
    content.challenge = challenges;
    console.log('Found Challenges:', challenges.length);
  }

  // Extract The Process section
  const processMatch = cleanText.match(/The Process[:\n](.*?)(?=\n\s*(?:Client Snapshot|Overview|Challenge|Key Stats|$))/is);
  if (processMatch) {
    const processText = processMatch[1].trim();
    const steps = processText
      .split(/[\n•\-\*]|(?:\d+\.)|(?:Step \d+)|(?:Phase \d+)/i)
      .filter(item => item.trim().length > 15)
      .map((item, index) => ({
        phase: `Phase ${index + 1}`,
        description: item.trim()
      }))
      .slice(0, 6);
    content.process = steps;
    console.log('Found Process steps:', steps.length);
  }

  // Extract Key Stats section
  const keyStatsMatch = cleanText.match(/Key Stats[:\n](.*?)$/is);
  if (keyStatsMatch) {
    const statsText = keyStatsMatch[1].trim();
    
    // Extract metrics from the stats section
    const metrics = statsText.match(/(\d+%|\d+x|\$[\d,]+|\d+\s*(?:million|thousand|hours|days|months|weeks))/gi) || [];
    
    // Also look for bullet points or lines that might contain results
    const statLines = statsText
      .split(/[\n•\-\*]/)
      .filter(line => line.trim().length > 10)
      .slice(0, 4);
    
    if (metrics.length > 0) {
      content.results = metrics.slice(0, 3).map((metric, index) => ({
        metric: metric,
        value: statLines[index] || `Key Result ${index + 1}`,
        description: statLines[index] || 'Significant improvement achieved'
      }));
    } else if (statLines.length > 0) {
      content.results = statLines.slice(0, 3).map((line, index) => ({
        metric: `Result ${index + 1}`,
        value: line.substring(0, 50),
        description: line.trim()
      }));
    }
    console.log('Found Key Stats:', content.results.length);
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
    challengeCount: content.challenge.length,
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