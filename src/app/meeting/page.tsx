"use client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { DeleteIcon, Plus, CalendarCheck, Clock, ArrowUpRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface MeetingProps {
  id: string;
  name: string;
  date: string;
  time?: string;
}

export default function Meeting() {
  // Default meetings data
  const defaultMeetings = [
    {
      id: "1",
      name: "Weekly Team Sync",
      date: "2025-03-28",
      time: "10:00 AM"
    },
    {
      id: "2",
      name: "Product Roadmap Planning",
      date: "2025-03-30",
      time: "2:30 PM"
    },
    {
      id: "3",
      name: "Client Presentation: ProjectX",
      date: "2025-04-02",
      time: "11:15 AM"
    },
    {
      id: "4",
      name: "Engineering Standup",
      date: "2025-04-04",
      time: "9:00 AM"
    },
    {
      id: "5",
      name: "Quarterly Review",
      date: "2025-04-10",
      time: "3:00 PM"
    }
  ];

  const [meetings, setMeetings] = useState<MeetingProps[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);
  const router = useRouter();
  
  // Load meetings on component mount - only once
  useEffect(() => {
    const storedMeetings = localStorage.getItem('meetings');
    if (storedMeetings) {
      try {
        const parsedMeetings = JSON.parse(storedMeetings);
        setMeetings(parsedMeetings);
      } catch (error) {
        console.error("Error parsing meetings from localStorage:", error);
        setMeetings(defaultMeetings);
        localStorage.setItem('meetings', JSON.stringify(defaultMeetings));
      }
    } else {
      setMeetings(defaultMeetings);
      localStorage.setItem('meetings', JSON.stringify(defaultMeetings));
    }
    setIsInitialized(true);
  }, []);

  const addMeeting = () => {
    const newMeeting = {
      id: Date.now().toString(),
      name: `New Meeting ${meetings.length + 1}`,
      date: new Date().toISOString().split('T')[0],
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    
    const updatedMeetings = [...meetings, newMeeting];
    setMeetings(updatedMeetings);
    localStorage.setItem('meetings', JSON.stringify(updatedMeetings));
  };

  const handleDelete = (id: string) => {
    const updatedMeetings = meetings.filter(meeting => meeting.id !== id);
    setMeetings(updatedMeetings);
    localStorage.setItem('meetings', JSON.stringify(updatedMeetings));
  };

  // Get today's date for highlighting
  const today = new Date().toDateString();

  return (
    <main className="mt-20 container mx-auto max-w-7xl">
      {/* Header with gradient background */}
      <div className="bg-gradient-to-r from-slate-800 to-slate-900 -mx-6 px-6 py-8 mb-8 shadow-md">
        <div className="container mx-auto max-w-7xl flex justify-between items-center">
          <h1 className="text-3xl font-bold text-white tracking-tight">Your Meetings</h1>
          <Button 
            onClick={addMeeting}
            className="flex items-center gap-2 bg-white/15 text-white border-none hover:bg-white/25 transition-all"
          >
            <Plus className="h-4 w-4" />
            Create Meeting
          </Button>
        </div>
      </div>
      
      <div className="px-6">
        {meetings.length > 0 ? (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {meetings.map((meeting) => {
                const isToday = new Date(meeting.date).toDateString() === today;
                const isPast = new Date(meeting.date) < new Date(today);
                const borderColor = isToday ? 'border-t-blue-500' : 
                                   isPast ? 'border-t-gray-400' : 'border-t-green-500';
                const statusBadge = isToday ? 
                  <span className="bg-blue-500/10 text-blue-600 dark:text-blue-400 text-xs font-medium px-2 py-1 rounded-full">Today</span> : 
                  isPast ? 
                  <span className="bg-gray-500/10 text-gray-600 dark:text-gray-400 text-xs font-medium px-2 py-1 rounded-full">Past</span> :
                  <span className="bg-green-500/10 text-green-600 dark:text-green-400 text-xs font-medium px-2 py-1 rounded-full">Upcoming</span>;
                
                return (
                  <Card 
                    key={meeting.id} 
                    className={`flex flex-col overflow-hidden shadow-md hover:shadow-lg transition-all border border-border ${borderColor} border-t-4`}
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
                      <CardTitle className="text-lg font-semibold mt-1 line-clamp-2">
                        {meeting.name}
                      </CardTitle>
                    </CardHeader>
                    
                    <CardContent className="pb-4 pt-0">
                      <div className="flex flex-col space-y-2 text-sm text-muted-foreground">
                        <div className="flex items-center gap-2">
                          <CalendarCheck className="h-4 w-4 text-slate-500" />
                          <span>{new Date(meeting.date).toLocaleDateString("en-US", {
                            weekday: "short",
                            month: "short",
                            day: "numeric"
                          })}</span>
                        </div>
                        {meeting.time && (
                          <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4 text-slate-500" />
                            <span>{meeting.time}</span>
                          </div>
                        )}
                      </div>
                    </CardContent>
                    
                    <CardFooter className="pt-2 mt-auto">
                      <Button
                        variant="secondary"
                        className="w-full border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors flex items-center justify-center gap-2"
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
            
            <div className="mt-8 text-center text-sm text-muted-foreground">
              Showing {meetings.length} {meetings.length === 1 ? 'meeting' : 'meetings'}
            </div>
          </>
        ) : (
          <div className="rounded-lg border border-dashed border-slate-300 dark:border-slate-700 p-16 text-center">
            <div className="flex flex-col items-center justify-center gap-2">
              <div className="rounded-full p-3 bg-slate-100 dark:bg-slate-800">
                <CalendarCheck className="h-10 w-10 text-slate-400" />
              </div>
              <h3 className="text-lg font-medium mt-2">No meetings found</h3>
              <p className="text-muted-foreground max-w-sm mx-auto mb-4">
                Create your first meeting to get started with organizing notes and summaries.
              </p>
              <Button 
                onClick={addMeeting}
                className="flex items-center gap-2"
              >
                <Plus className="h-4 w-4" />
                Create Meeting
              </Button>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}