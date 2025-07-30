import * as mammoth from 'mammoth';
import { getDocument } from 'pdfjs-dist';

// Set up PDF.js worker
import { GlobalWorkerOptions } from 'pdfjs-dist';
GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/4.0.379/pdf.worker.min.js`;

export interface ParsedCaseStudyContent {
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
    background: '',
    challenge: [],
    process: [],
    results: []
  };

  // Clean up the text
  const cleanText = text.replace(/\s+/g, ' ').trim();
  
  // Extract background section
  const backgroundMatch = cleanText.match(/(background|overview|introduction|context):\s*([^.]*(?:\.[^.]*){0,5})/i);
  if (backgroundMatch) {
    content.background = backgroundMatch[2].trim();
  } else {
    // Try to get first paragraph as background
    const sentences = cleanText.split('.').slice(0, 3);
    content.background = sentences.join('.').trim();
  }

  // Extract challenges
  const challengeSection = cleanText.match(/(challenge|problem|issue)s?:\s*(.*?)(?=(?:solution|process|approach|result)|$)/is);
  if (challengeSection) {
    const challenges = challengeSection[2]
      .split(/[•\n\-\*]/)
      .filter(item => item.trim().length > 10)
      .map(item => item.trim())
      .slice(0, 5);
    content.challenge = challenges;
  }

  // Extract process/approach
  const processSection = cleanText.match(/(process|approach|methodology|solution):\s*(.*?)(?=(?:result|outcome|conclusion)|$)/is);
  if (processSection) {
    const steps = processSection[2]
      .split(/[•\n\-\*]|\d+\.|step \d+/i)
      .filter(item => item.trim().length > 10)
      .map((item, index) => ({
        phase: `Step ${index + 1}`,
        description: item.trim()
      }))
      .slice(0, 5);
    content.process = steps;
  }

  // Extract results/metrics
  const resultsSection = cleanText.match(/(result|outcome|achievement|impact)s?:\s*(.*?)$/is);
  if (resultsSection) {
    const metrics = resultsSection[2]
      .match(/(\d+%|\d+x|\$\d+|\d+\s*(?:million|thousand|hours|days|months))/gi) || [];
    
    content.results = metrics.slice(0, 3).map((metric, index) => ({
      metric: metric,
      value: `Improvement ${index + 1}`,
      description: `Key result achieved through our intervention`
    }));
  }

  // Extract company size and timeline if mentioned
  const sizeMatch = cleanText.match(/(\d+(?:,\d+)*)\s*(?:employees|staff|people|team members)/i);
  if (sizeMatch) {
    content.companySize = `${sizeMatch[1]} employees`;
  }

  const timelineMatch = cleanText.match(/(\d+)\s*(?:months?|weeks?|days?)\s*(?:project|timeline|duration)/i);
  if (timelineMatch) {
    content.timeline = `${timelineMatch[1]} ${timelineMatch[0].includes('week') ? 'weeks' : timelineMatch[0].includes('day') ? 'days' : 'months'}`;
  }

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