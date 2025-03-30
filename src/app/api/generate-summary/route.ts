// src/app/api/generate-summary/route.ts
import { NextRequest, NextResponse } from "next/server";
import { generateSummary } from "@/lib/gemini";

export async function POST(req: NextRequest) {
  try {
    const { notes, meetingName, meetingDate } = await req.json();

    if (!notes || typeof notes !== "string" || notes.trim() === "") {
      return NextResponse.json(
        { error: "Notes are required" },
        { status: 400 }
      );
    }

    const summary = await generateSummary(
      notes,
      meetingName || "Untitled Meeting",
      meetingDate || new Date().toLocaleDateString()
    );

    return NextResponse.json({ summary });
  } catch (error) {
    console.error("Error generating summary:", error);
    return NextResponse.json(
      { error: "Failed to generate summary" },
      { status: 500 }
    );
  }
}