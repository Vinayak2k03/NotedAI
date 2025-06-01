// src/lib/gemini.ts
import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialize the Google AI SDK
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY || "");

export async function generateSummary(
  notes: string,
  meetingName: string,
  meetingDate: string
) {
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" }); // Use "gemini-1.0-pro" if you don't have access to 1.5

  const prompt = `
You are an expert meeting notes summarizer. Based on the following meeting notes, 
create a concise and well-organized summary that extracts key points,
decisions made, and action items. Focus on the most important information.

Meeting name: ${meetingName}
Meeting date: ${meetingDate}

MEETING NOTES:
${notes}

Format the summary with Markdown, using headings and bullet points for clarity.
Start with a brief overview, then organize into "Key Points", "Decisions Made", 
and "Action Items" if applicable.
`;

  const result = await model.generateContent(prompt);
  const response = await result.response;
  const text = response.text();
  return text;
}
