"use client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import {
  DeleteIcon,
  Plus,
  CalendarCheck,
  Clock,
  ArrowUpRight,
  Sun,
  Moon,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ArrowLeftIcon } from "lucide-react";
import { useTheme } from "next-themes";

interface MeetingProps {
  id: string;
  name: string;
  date: string;
  time?: string;
}

export default function Meeting() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newMeetingName, setNewMeetingName] = useState("");
  const [meetings, setMeetings] = useState<MeetingProps[]>([]);
  const [mounted, setMounted] = useState(false);
  const router = useRouter();
  const { theme, setTheme } = useTheme();

  // Prevent hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  // Default meetings data
  const defaultMeetings = [
    {
      id: "1",
      name: "Weekly Team Sync",
      date: "2025-03-28",
      time: "10:00 AM",
    },
    {
      id: "2",
      name: "Product Roadmap Planning",
      date: "2025-03-30",
      time: "2:30 PM",
    },
    {
      id: "3",
      name: "Client Presentation: ProjectX",
      date: "2025-04-02",
      time: "11:15 AM",
    },
    {
      id: "4",
      name: "Engineering Standup",
      date: "2025-04-04",
      time: "9:00 AM",
    },
    {
      id: "5",
      name: "Quarterly Review",
      date: "2025-04-10",
      time: "3:00 PM",
    },
  ];

  // Load meetings on component mount - only once
  useEffect(() => {
    const storedMeetings = localStorage.getItem("meetings");
    if (storedMeetings) {
      try {
        const parsedMeetings = JSON.parse(storedMeetings);
        setMeetings(parsedMeetings);
      } catch (error) {
        console.error("Error parsing meetings from localStorage:", error);
        setMeetings(defaultMeetings);
        localStorage.setItem("meetings", JSON.stringify(defaultMeetings));
      }
    } else {
      setMeetings(defaultMeetings);
      localStorage.setItem("meetings", JSON.stringify(defaultMeetings));
    }
  }, []);

  const addMeeting = () => {
    if (!newMeetingName.trim()) return;

    const newMeeting = {
      id: Date.now().toString(),
      name: newMeetingName,
      date: new Date().toISOString().split("T")[0],
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    const updatedMeetings = [...meetings, newMeeting];
    setMeetings(updatedMeetings);
    localStorage.setItem("meetings", JSON.stringify(updatedMeetings));

    setNewMeetingName("");
    setIsDialogOpen(false);
  };

  const handleDelete = (id: string) => {
    const updatedMeetings = meetings.filter((meeting) => meeting.id !== id);
    setMeetings(updatedMeetings);
    localStorage.setItem("meetings", JSON.stringify(updatedMeetings));
  };

  // Get today's date for highlighting
  const today = new Date().toDateString();

  // Toggle theme function
  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  return (
    <main className="mt-20 container mx-auto max-w-7xl">
      {/* Header with gradient background */}
      <div className="bg-gradient-to-r from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-900 -mx-6 px-6 py-8 mb-8 shadow-md transition-colors">
        <div className="container mx-auto max-w-7xl flex justify-between items-center">
          <div className='flex items-center gap-4'>
            <Button
              variant="outline"
              size="icon"
              onClick={() => router.push("/dashboard")}
              className="rounded-full w-10 h-10 bg-background/50 dark:bg-white/10 border-border dark:border-transparent backdrop-blur-sm hover:bg-accent/50 dark:hover:bg-white/20 transition-all"
            >
              <ArrowLeftIcon className="h-5 w-5 text-foreground dark:text-white" />
            </Button>
            <h1 className="text-3xl font-bold text-foreground dark:text-white tracking-tight">
              Your Meetings
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <Button
              onClick={() => setIsDialogOpen(true)}
              className="flex items-center gap-2 bg-primary/80 dark:bg-white/15 text-primary-foreground dark:text-white border-none hover:bg-primary dark:hover:bg-white/25 transition-all"
            >
              <Plus className="h-4 w-4" />
              Create Meeting
            </Button>
          </div>
        </div>
      </div>

      <div className="px-6">
        {meetings.length > 0 ? (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {meetings.map((meeting) => {
                const isToday = new Date(meeting.date).toDateString() === today;
                const isPast = new Date(meeting.date) < new Date(today);
                const borderColor = isToday
                  ? "border-t-blue-500"
                  : isPast
                  ? "border-t-gray-400"
                  : "border-t-green-500";
                const statusBadge = isToday ? (
                  <span className="bg-blue-500/10 text-blue-600 dark:text-blue-400 text-xs font-medium px-2 py-1 rounded-full">
                    Today
                  </span>
                ) : isPast ? (
                  <span className="bg-gray-500/10 text-gray-600 dark:text-gray-400 text-xs font-medium px-2 py-1 rounded-full">
                    Past
                  </span>
                ) : (
                  <span className="bg-green-500/10 text-green-600 dark:text-green-400 text-xs font-medium px-2 py-1 rounded-full">
                    Upcoming
                  </span>
                );

                return (
                  <Card
                    key={meeting.id}
                    className={`flex flex-col overflow-hidden shadow-md hover:shadow-lg transition-all border border-border dark:border-slate-700/50 ${borderColor} border-t-4 bg-card dark:bg-slate-900/80`}
                  >
                    <CardHeader className="pb-3">
                      <div className="flex justify-between items-start mb-1">
                        {statusBadge}
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(meeting.id);
                          }}
                          className="h-8 w-8 text-muted-foreground hover:text-destructive flex-shrink-0 -mr-2 -mt-2"
                        >
                          <DeleteIcon className="h-4 w-4" />
                        </Button>
                      </div>
                      <CardTitle className="text-lg font-semibold mt-1 line-clamp-2 text-foreground dark:text-white">
                        {meeting.name}
                      </CardTitle>
                    </CardHeader>

                    <CardContent className="pb-4 pt-0">
                      <div className="flex flex-col space-y-2 text-sm text-muted-foreground dark:text-slate-400">
                        <div className="flex items-center gap-2">
                          <CalendarCheck className="h-4 w-4 text-slate-500 dark:text-slate-400" />
                          <span>
                            {new Date(meeting.date).toLocaleDateString(
                              "en-US",
                              {
                                weekday: "short",
                                month: "short",
                                day: "numeric",
                              }
                            )}
                          </span>
                        </div>
                        {meeting.time && (
                          <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4 text-slate-500 dark:text-slate-400" />
                            <span>{meeting.time}</span>
                          </div>
                        )}
                      </div>
                    </CardContent>

                    <CardFooter className="pt-2 mt-auto">
                      <Button
                        variant="secondary"
                        className="w-full border border-border dark:border-slate-700/50 hover:bg-accent dark:hover:bg-slate-800 transition-colors flex items-center justify-center gap-2 text-foreground dark:text-white"
                        onClick={() => router.push(`/meeting/${meeting.id}`)}
                      >
                        <span>Open Meeting</span>
                        <ArrowUpRight className="h-3.5 w-3.5" />
                      </Button>
                    </CardFooter>
                  </Card>
                );
              })}
            </div>

            <div className="mt-8 text-center text-sm text-muted-foreground dark:text-slate-400">
              Showing {meetings.length}{" "}
              {meetings.length === 1 ? "meeting" : "meetings"}
            </div>
          </>
        ) : (
          <div className="rounded-lg border border-dashed border-border dark:border-slate-700/50 p-16 text-center bg-background/50 dark:bg-slate-900/30">
            <div className="flex flex-col items-center justify-center gap-2">
              <div className="rounded-full p-3 bg-accent/50 dark:bg-slate-800/80">
                <CalendarCheck className="h-10 w-10 text-slate-400 dark:text-slate-400" />
              </div>
              <h3 className="text-lg font-medium mt-2 text-foreground dark:text-white">No meetings found</h3>
              <p className="text-muted-foreground dark:text-slate-400 max-w-sm mx-auto mb-4">
                Create your first meeting to get started with organizing notes
                and summaries.
              </p>
              <Button onClick={()=>setIsDialogOpen(true)} className="flex items-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground">
                <Plus className="h-4 w-4" />
                Create Meeting
              </Button>
            </div>
          </div>
        )}
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[425px] bg-background dark:bg-slate-900 border-border dark:border-slate-700/50">
          <DialogHeader>
            <DialogTitle className="text-foreground dark:text-white">Create New Meeting</DialogTitle>
            <DialogDescription className="text-muted-foreground dark:text-slate-400">
              Enter a name for your new meeting.
            </DialogDescription>
          </DialogHeader>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              addMeeting();
            }}
          >
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right text-foreground dark:text-white">
                  Name
                </Label>
                <Input
                  id="name"
                  value={newMeetingName}
                  onChange={(e) => setNewMeetingName(e.target.value)}
                  placeholder="Weekly Team Sync"
                  className="col-span-3 bg-background dark:bg-slate-800/80 border-input dark:border-slate-700"
                  autoComplete="off"
                  autoFocus
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsDialogOpen(false)}
                className="border-input dark:border-slate-700 text-foreground dark:text-white"
              >
                Cancel
              </Button>
              <Button 
                type="submit"
                className="bg-primary hover:bg-primary/90 text-primary-foreground"
              >
                Create Meeting
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </main>
  );
}