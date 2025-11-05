/* eslint-disable @typescript-eslint/no-explicit-any */
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
    actionItems.forEach((item) => {
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
    // Build a prioritized candidate list using env hint, common names, and (if possible) live ListModels discovery
    const envModel = process.env.GEMINI_MODEL || process.env.NEXT_PUBLIC_GEMINI_MODEL;

    // Common model ids across API versions/accounts
    const commonNames = [
      // latest tags first
      "gemini-1.5-flash-latest",
      "gemini-1.5-pro-latest",
      // numbered revisions
      "gemini-1.5-flash-001",
      "gemini-1.5-pro-001",
      // generic 1.5 names
      "gemini-1.5-flash",
      "gemini-1.5-flash-8b",
      "gemini-1.5-pro",
      // legacy
      "gemini-pro",
      "gemini-1.0-pro",
    ];

    // Try to discover available models dynamically
    async function discoverModels(): Promise<string[]> {
      try {
        // Some SDK versions support listModels, others do not — guard calls accordingly
        const anyGenAI: any = genAI as any;
        if (typeof anyGenAI.listModels !== "function") return [];

        const res = await anyGenAI.listModels();
        const list = (res?.models || res || []) as any[];
        const names: string[] = [];
        for (const m of list) {
          const name = m?.name as string | undefined;
          const methods: string[] = (m?.generationMethods || []) as string[];
          // Prefer models that support generateContent (new) or generateText (older)
          const supports = methods?.some((x) => /generate(content|text)/i.test(x));
          if (name && supports) names.push(name.replace(/^models\//, ""));
        }
        // Rank by preference: flash > pro > others, then 1.5 > 1.0
        names.sort((a, b) => {
          const score = (n: string) =>
            (/(flash)/.test(n) ? 100 : 0) +
            (/(pro)/.test(n) ? 50 : 0) +
            (/(1\.5)/.test(n) ? 10 : 0) +
            (/(latest|001)/.test(n) ? 5 : 0);
          return score(b) - score(a);
        });
        return names;
      } catch (e) {
        console.warn("[gemini] listModels not available or failed:", (e as any)?.message || String(e));
        return [];
      }
    }

    const discovered = await discoverModels();
    const candidateModels = [envModel, ...commonNames, ...discovered]
      .filter(Boolean)
      // Deduplicate while preserving order
      .filter((v, i, arr) => arr.indexOf(v) === i) as string[];

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

    // Helper: call REST v1 endpoint directly to avoid v1beta issues
    async function generateWithV1Rest(modelId: string, body: any, timeoutMs = 30000): Promise<string> {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), timeoutMs);
      try {
        const url = `https://generativelanguage.googleapis.com/v1/models/${encodeURIComponent(modelId)}:generateContent?key=${encodeURIComponent(process.env.GOOGLE_API_KEY || "")}`;
        const res = await fetch(url, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
          signal: controller.signal,
        });
        if (!res.ok) {
          const text = await res.text();
          throw new Error(`${res.status} ${res.statusText}: ${text}`);
        }
        const data = await res.json();
        const parts = data?.candidates?.[0]?.content?.parts || data?.candidates?.[0]?.content?.parts || [];
        const firstText = parts.find((p: any) => typeof p?.text === "string")?.text;
        if (!firstText) throw new Error("No text returned by model");
        return firstText as string;
      } finally {
        clearTimeout(timer);
      }
    }

    let lastErr: any = null;
    for (const modelId of candidateModels) {
      try {
        console.log(`[gemini] Trying model (REST v1): ${modelId}`);
        const body = {
          contents: [
            {
              role: "user",
              parts: [{ text: prompt }],
            },
          ],
          generationConfig: {
            maxOutputTokens: 1000,
            temperature: 0.7,
          },
        };

        const text = await generateWithV1Rest(modelId, body, 30000);
        console.log(`[gemini] Success with model (REST v1): ${modelId}`);
        return { summary: text, method: "ai" };
      } catch (err: any) {
        lastErr = err;
        const msg = err?.message || String(err);
        if (/404|not found|unsupported|is not found|is not supported/i.test(msg)) {
          console.warn(`[gemini] Model ${modelId} not available on v1 or unsupported. Trying next.`);
          continue;
        }
        if (/429|quota|rate limit/i.test(msg)) {
          throw Object.assign(new Error(msg), { __type: "rate" });
        }
        if (/timeout|aborted/i.test(msg)) {
          throw Object.assign(new Error(msg), { __type: "timeout" });
        }
        console.warn(`[gemini] Error with model ${modelId}: ${msg}. Trying next model.`);
        continue;
      }
    }

    // If we exhausted models, throw the last error to be handled below
    if (lastErr) throw lastErr;
    throw new Error("No compatible Gemini models succeeded.");

  } catch (error: any) {
    console.error('AI summary generation failed:', error?.message || String(error));
    
    // Handle specific error types
    if (error.__type === 'rate' || error.message?.includes('429') || error.message?.includes('quota')) {
      return {
        summary: generateFallbackSummary(notes, meetingName, meetingDate) + 
          `\n\n*AI summary temporarily unavailable due to rate limits.*`,
        method: 'rate-limited'
      };
    }

    if (error.__type === 'timeout' || error.message?.includes('timeout')) {
      return {
        summary: generateFallbackSummary(notes, meetingName, meetingDate) + 
          `\n\n*AI summary timed out. Generated fallback summary instead.*`,
        method: 'fallback'
      };
    }

    // For any other error, use fallback
    return {
      summary: generateFallbackSummary(notes, meetingName, meetingDate) + 
        `\n\n*AI summary failed: ${(error && error.message) || String(error)}. Generated fallback summary instead.*`,
      method: 'fallback'
    };
  }
}