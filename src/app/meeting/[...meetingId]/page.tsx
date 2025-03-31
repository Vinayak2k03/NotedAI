"use client";

import React, { useEffect, useState, useContext } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  SaveIcon,
  ArrowLeftIcon,
  ClipboardEditIcon,
  CalendarIcon,
  ClockIcon,
  FileTextIcon,
} from "lucide-react";
import { useRouter } from "next/navigation";
import {
  useCopilotAction,
  useCopilotReadable
} from "@copilotkit/react-core";
import { useCallback } from "react";
import { useParams } from "next/navigation";

interface Meeting {
  id: string;
  name: string;
  date: string;
  time?: string;
  notes?: string;
  summary?: string;
}

export default function MeetingPage() {
  const params = useParams();
  const meetingId = Array.isArray(params.meetingId)
    ? params.meetingId[0]
    : params.meetingId;
  const router = useRouter();

  const [meeting, setMeeting] = useState<Meeting | null>(null);
  const [notes, setNotes] = useState("");
  const [summary, setSummary] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isGeneratingSummary, setIsGeneratingSummary] = useState(false);

  // Load meeting data and notes
  useEffect(() => {
    // Load meetings from localStorage
    const storedMeetings = localStorage.getItem("meetings");

    if (storedMeetings) {
      try {
        const parsedMeetings = JSON.parse(storedMeetings) as Meeting[];
        const currentMeeting = parsedMeetings.find((m) => m.id === meetingId);

        if (currentMeeting) {
          setMeeting(currentMeeting);
          setNotes(currentMeeting.notes || "");
          setSummary(currentMeeting.summary || "");
        } else {
          console.error("Meeting not found");
        }
      } catch (error) {
        console.error("Error parsing meetings from localStorage:", error);
      }
    }
  }, [meetingId]);

  const saveMeetingNotes = useCallback(() => {
    setIsLoading(true);

    try {
      // Retrieve current meetings
      const storedMeetings = localStorage.getItem("meetings");

      if (storedMeetings) {
        const parsedMeetings = JSON.parse(storedMeetings) as Meeting[];
        const updatedMeetings = parsedMeetings.map((m) => {
          if (m.id === meetingId) {
            return {
              ...m,
              notes,
              summary,
            };
          }
          return m;
        });

        localStorage.setItem("meetings", JSON.stringify(updatedMeetings));
        setMeeting((prev) => (prev ? { ...prev, notes, summary } : null));
      }
    } catch (error) {
      console.error("Error saving meeting notes:", error);
    } finally {
      setIsLoading(false);
    }
  }, [meetingId, notes, summary]);

  // Make meeting data available to Copilot
  useCopilotReadable({
    description: "Current meeting information",
    value: meeting
      ? JSON.stringify({
          id: meeting.id,
          name: meeting.name,
          date: meeting.date,
          time: meeting.time,
          notes: notes,
        })
      : "No meeting found",
  });

  // Generate summary action
  useCopilotAction({
    name: "generateMeetingSummary",
    description: "Generate a concise summary of the meeting notes",
    parameters: [],
    handler: async () => {
      if (!notes || notes.trim() === "") {
        return "Cannot generate summary for empty notes.";
      }

      // Your summary generation logic...
      // This could be AI-based or rule-based

      // Example simple logic:
      const summaryText = `# Summary of ${meeting?.name}\n\n`;

      // Extract key points from notes
      const keyPoints = notes
        .split("\n")
        .filter((line) => line.length > 20)
        .slice(0, 5)
        .map((point) => `- ${point}`);

      const fullSummary = summaryText + keyPoints.join("\n");

      // Update state
      setSummary(fullSummary);
      saveMeetingNotes();

      return "Summary generated successfully!";
    },
  });

  // Answer questions action
  useCopilotAction({
    name: "answerQuestionBasedOnNotes",
    description: "Answer questions based on the content of the meeting notes",
    parameters: [
      {
        name: "question",
        type: "string",
        description: "The question to answer based on meeting notes",
        required: true,
      },
    ],
    handler: async ({ question }) => {
      if (!notes || notes.trim() === "") {
        return "I cannot answer questions about this meeting because there are no notes available.";
      }

      return `Based on the meeting notes, I can answer "${question}" as follows:

The meeting notes indicate that this topic was discussed during the "${
        meeting?.name
      }" meeting on ${new Date(meeting?.date || "").toLocaleDateString()}.

According to the notes, the team decided the following related to your question:
1. [Example response based on notes content]
2. [Another relevant point from notes]

Let me know if you need more specific information!`;
    },
  });

  if (!meeting) {
    return (
      <div className="mt-20 flex items-center justify-center h-[60vh]">
        <Card className="w-full max-w-md p-6 text-center shadow-lg">
          <CardHeader>
            <CardTitle className="text-xl">Meeting Not Found</CardTitle>
            <CardDescription>
              We couldn&apos;t locate the meeting you&apos;re looking for.
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-4">
            <Button
              variant="default"
              onClick={() => router.push("/meeting")}
              className="w-full"
            >
              <ArrowLeftIcon className="h-4 w-4 mr-2" />
              Back to Meetings
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="mt-20 p-6 container mx-auto max-w-6xl">
      <div className="bg-gradient-to-r from-slate-800 to-slate-900 -mx-6 px-6 py-6 mb-8 shadow-md">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              size="icon"
              onClick={() => router.push("/meeting")}
              className="rounded-full w-10 h-10 bg-white/10 border-transparent backdrop-blur-sm hover:bg-white/20"
            >
              <ArrowLeftIcon className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-white tracking-tight">
                {meeting.name}
              </h1>
              <div className="flex items-center gap-5 mt-2 text-white/70">
                <div className="flex items-center gap-1">
                  <CalendarIcon className="h-4 w-4" />
                  <span className="text-sm">
                    {new Date(meeting.date).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </span>
                </div>
                {meeting.time && (
                  <div className="flex items-center gap-1">
                    <ClockIcon className="h-4 w-4" />
                    <span className="text-sm">{meeting.time}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
          <Button
            onClick={saveMeetingNotes}
            disabled={isLoading}
            className="bg-white/15 text-white border-none hover:bg-white/25 transition-all"
          >
            <SaveIcon className="h-4 w-4 mr-2" />
            {isLoading ? "Saving..." : "Save Notes"}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <Card className="overflow-hidden border-t-4 border-t-blue-500 shadow-md hover:shadow-lg transition-shadow h-[600px] flex flex-col">
            <CardHeader className="bg-blue-50/50 dark:bg-slate-800/50">
              <CardTitle className="text-xl flex items-center">
                <ClipboardEditIcon className="h-5 w-5 mr-2 text-blue-500" />
                Meeting Notes
              </CardTitle>
              <CardDescription>
                Record key discussion points, decisions, and action items
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6 flex-grow flex flex-col">
              <div className="flex-grow flex flex-col h-[400px]">
                <Textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Type your meeting notes here..."
                  className="h-full min-h-0 max-h-none flex-grow font-mono text-sm leading-relaxed focus-visible:ring-blue-500 overflow-auto resize-none"
                />
              </div>
              {/* Moved save button to a fixed position with padding */}
              <div className="pt-4 pb-1 mt-auto">
                <Button
                  onClick={saveMeetingNotes}
                  disabled={isLoading}
                  size="sm"
                  className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600"
                >
                  <SaveIcon className="h-4 w-4" />
                  {isLoading ? "Saving..." : "Save Notes"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-8">
          <Card className="shadow-md overflow-hidden border-t-4 border-t-amber-500 h-[600px] flex flex-col">
            <CardHeader className="bg-amber-50/50 dark:bg-slate-800/50">
              <CardTitle className="text-lg flex items-center">
                <div className="flex items-center">
                  <FileTextIcon className="h-5 w-5 mr-2 text-amber-500" />
                  Meeting Summary
                </div>
              </CardTitle>
              <CardDescription>
                AI-generated overview of key points
              </CardDescription>
            </CardHeader>

            <CardContent className="pt-6 flex-grow flex flex-col h-[calc(600px-120px)]">
              {/* This div is the scrollable container - improved height calculation */}
              <div
                className="bg-muted/30 rounded-md p-4 text-sm flex-grow overflow-y-auto mb-4"
                style={{ maxHeight: "calc(100% - 60px)" }}
              >
                {summary ? (
                  <div className="prose prose-sm dark:prose-invert">
                    <div className="whitespace-pre-line">{summary}</div>
                  </div>
                ) : (
                  <div className="text-muted-foreground flex flex-col items-center justify-center h-full text-center">
                    <div className="mb-2">No summary available yet.</div>
                    <div className="text-xs">
                      Generate a summary based on your meeting notes.
                    </div>
                  </div>
                )}
              </div>

              {/* Always show the Generate Summary button regardless of summary status */}
              <div className="pb-1 mt-auto">
                <Button
                  onClick={async () => {
                    setIsGeneratingSummary(true);
                    try {
                      if (!notes || notes.trim() === "") {
                        return;
                      }

                      // Call your new API route
                      const response = await fetch("/api/generate-summary", {
                        method: "POST",
                        headers: {
                          "Content-Type": "application/json",
                        },
                        body: JSON.stringify({
                          notes,
                          meetingName: meeting?.name,
                          meetingDate: new Date(
                            meeting?.date || ""
                          ).toLocaleDateString(),
                        }),
                      });

                      if (!response.ok) {
                        const errorData = await response.json();
                        throw new Error(
                          errorData.error || "Failed to generate summary"
                        );
                      }

                      const data = await response.json();
                      setSummary(data.summary);

                      // Save after state update
                      setTimeout(() => {
                        saveMeetingNotes();
                      }, 10);
                    } catch (error) {
                      console.error("Error generating summary:", error);
                    } finally {
                      setIsGeneratingSummary(false);
                    }
                  }}
                  variant="outline"
                  size="sm"
                  disabled={isGeneratingSummary || !notes.trim()}
                  className="w-full border-amber-200 hover:border-amber-300 hover:bg-amber-50 dark:hover:bg-amber-900/20 dark:border-amber-900/40"
                >
                  {isGeneratingSummary ? (
                    <span className="flex items-center gap-2">
                      <svg
                        className="animate-spin -ml-1 mr-2 h-4 w-4"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Generating...
                    </span>
                  ) : (
                    "Generate Summary"
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
