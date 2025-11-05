import { NextRequest, NextResponse } from "next/server";
import { generateSummary } from "@/lib/gemini";

export async function POST(req: NextRequest) {
  try {
    // Set a timeout for the entire request
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error('Request timeout')), 45000); // 45 second timeout
    });

    const processRequest = async () => {
      const { notes, meetingName, meetingDate } = await req.json();

      if (!notes || typeof notes !== "string" || notes.trim() === "") {
        return NextResponse.json(
          { error: "Notes are required" },
          { status: 400 }
        );
      }

      // Validate input length
      if (notes.length > 15000) {
        return NextResponse.json(
          { error: "Notes too long. Please keep under 15,000 characters." },
          { status: 400 }
        );
      }

      console.log('Starting summary generation...', {
        notesLength: notes.length,
        meetingName: meetingName || 'Untitled',
        hasApiKey: !!process.env.GOOGLE_API_KEY
      });

      const result = await generateSummary(
        notes,
        meetingName || "Untitled Meeting",
        meetingDate || new Date().toLocaleDateString()
      );

      console.log('Summary generation completed:', result.method);

      return NextResponse.json({
        summary: result.summary,
        method: result.method,
        timestamp: new Date().toISOString()
      });
    };

    const result = await Promise.race([processRequest(), timeoutPromise]);
    return result as NextResponse;

  } catch (error: unknown) {
    const message = (error as Error)?.message || String(error);
    console.error("Error in generate-summary API:", message);
    
    // If it's a timeout, return a specific response
    if (typeof message === 'string' && message.includes('timeout')) {
      return NextResponse.json(
        { 
          error: "Request timed out",
          details: "The summary generation took too long. Please try again with shorter notes.",
          method: 'timeout'
        },
        { status: 408 }
      );
    }
    
    return NextResponse.json(
      { 
        error: "Failed to generate summary",
        details: process.env.NODE_ENV === 'development' ? message : "An unexpected error occurred",
        method: 'error'
      },
      { status: 500 }
    );
  }
}

// Set runtime config for deployment
export const runtime = 'nodejs';
export const maxDuration = 60; // 60 seconds max duration