import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialize the Google AI SDK
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY || "");

// Rate limiting helper
class RateLimiter {
  private requests: number[] = [];
  private readonly maxRequests: number;
  private readonly timeWindow: number;

  constructor(maxRequests: number = 10, timeWindowMs: number = 60000) {
    this.maxRequests = maxRequests;
    this.timeWindow = timeWindowMs;
  }

  canMakeRequest(): boolean {
    const now = Date.now();
    this.requests = this.requests.filter(time => now - time < this.timeWindow);
    
    if (this.requests.length >= this.maxRequests) {
      return false;
    }
    
    this.requests.push(now);
    return true;
  }

  getWaitTime(): number {
    if (this.requests.length === 0) return 0;
    const oldestRequest = Math.min(...this.requests);
    return Math.max(0, this.timeWindow - (Date.now() - oldestRequest));
  }
}

const rateLimiter = new RateLimiter(8, 60000); // Conservative: 8 requests per minute

// Simple fallback summary generator
function generateFallbackSummary(
  notes: string,
  meetingName: string,
  meetingDate: string
): string {
  const lines = notes.split('\n').filter(line => line.trim().length > 0);
  const wordCount = notes.split(' ').length;
  
  // Extract potential action items
  const actionWords = ['todo', 'action', 'follow up', 'next steps', 'assign', 'complete', 'schedule', 'deadline'];
  const actionItems = lines.filter(line => 
    actionWords.some(word => line.toLowerCase().includes(word))
  ).slice(0, 5);

  // Extract key sentences
  const keyWords = ['decision', 'important', 'critical', 'deadline', 'budget', 'timeline', 'agreed', 'discussed'];
  const keyPoints = lines.filter(line => 
    line.length > 30 || 
    line.includes('?') || 
    keyWords.some(word => line.toLowerCase().includes(word))
  ).slice(0, 5);

  let summary = `# Meeting Summary: ${meetingName}\n\n`;
  summary += `**Date:** ${meetingDate}\n`;
  summary += `**Duration:** ~${Math.ceil(wordCount / 150)} minutes (estimated)\n\n`;
  
  if (keyPoints.length > 0) {
    summary += `## Key Discussion Points\n`;
    keyPoints.forEach((point, index) => {
      summary += `${index + 1}. ${point.trim()}\n`;
    });
    summary += `\n`;
  }
  
  if (actionItems.length > 0) {
    summary += `## Action Items\n`;
    actionItems.forEach((item, index) => {
      summary += `- ${item.trim()}\n`;
    });
    summary += `\n`;
  }
  
  summary += `## Overview\n`;
  summary += `This meeting covered ${lines.length} discussion points with approximately ${wordCount} words of notes. `;
  summary += `The summary above was automatically generated from the meeting content.\n\n`;
  summary += `*Note: This is a fallback summary. For AI-powered analysis, ensure your API configuration is correct.*`;
  
  return summary;
}

export async function generateSummary(
  notes: string,
  meetingName: string,
  meetingDate: string
): Promise<{ summary: string; method: 'ai' | 'fallback' | 'rate-limited' }> {
  // Validate inputs
  if (!notes || notes.trim() === "") {
    throw new Error("Notes cannot be empty");
  }

  // Check environment
  if (!process.env.GOOGLE_API_KEY) {
    console.warn("Google API key not found, using fallback summary");
    return {
      summary: generateFallbackSummary(notes, meetingName, meetingDate),
      method: 'fallback'
    };
  }

  // Check rate limiting
  if (!rateLimiter.canMakeRequest()) {
    const waitTime = rateLimiter.getWaitTime();
    console.log(`Rate limited. Need to wait ${Math.ceil(waitTime / 1000)} seconds`);
    
    return {
      summary: generateFallbackSummary(notes, meetingName, meetingDate) + 
        `\n\n*Rate limit reached. Try again in ${Math.ceil(waitTime / 1000)} seconds for AI summary.*`,
      method: 'rate-limited'
    };
  }

  try {
    const model = genAI.getGenerativeModel({ 
      model: "gemini-1.5-flash",
      generationConfig: {
        maxOutputTokens: 1000,
        temperature: 0.7,
      }
    });

    // Truncate notes if too long to avoid token limits
    const maxNotesLength = 3000;
    const truncatedNotes = notes.length > maxNotesLength 
      ? notes.substring(0, maxNotesLength) + "...\n\n[Note: Content was truncated due to length]"
      : notes;

    const prompt = `
You are an expert meeting notes summarizer. Create a concise summary in under 500 words.

Meeting: ${meetingName}
Date: ${meetingDate}

Notes:
${truncatedNotes}

Format with:
# Summary
## Key Points (3-5 bullets)
## Decisions Made (if any)
## Action Items (if any)

Be concise and focus on the most important information.
`;

    // Set a timeout for the API call
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error('API request timeout')), 30000); // 30 second timeout
    });

    const apiPromise = model.generateContent(prompt);
    
    const result = await Promise.race([apiPromise, timeoutPromise]) as any;
    const response = await result.response;
    const text = response.text();
    
    return {
      summary: text,
      method: 'ai'
    };

  } catch (error: any) {
    console.error('AI summary generation failed:', error.message);
    
    // Handle specific error types
    if (error.message?.includes('429') || error.message?.includes('quota')) {
      return {
        summary: generateFallbackSummary(notes, meetingName, meetingDate) + 
          `\n\n*AI summary temporarily unavailable due to rate limits.*`,
        method: 'rate-limited'
      };
    }

    if (error.message?.includes('timeout')) {
      return {
        summary: generateFallbackSummary(notes, meetingName, meetingDate) + 
          `\n\n*AI summary timed out. Generated fallback summary instead.*`,
        method: 'fallback'
      };
    }

    // For any other error, use fallback
    return {
      summary: generateFallbackSummary(notes, meetingName, meetingDate) + 
        `\n\n*AI summary failed: ${error.message}. Generated fallback summary instead.*`,
      method: 'fallback'
    };
  }
}