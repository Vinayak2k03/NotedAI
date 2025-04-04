"use client";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import googleCalendarPlugin from "@fullcalendar/google-calendar";
import { useCallback, useEffect, useRef, useState } from "react";
import { useEvents } from "@/hooks/useEvents";
import { EventClickArg, EventDropArg } from "@fullcalendar/core";
import { Event } from "@/lib/types";
import { useCopilotFeatures } from "@/hooks/useCopilotFeatures";
import EventDialog from "./eventDialog";
import { Badge } from "@/components/ui/badge";
import {
  CalendarIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ClockIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

// New AllEventsDialog component that shows only current month events
function AllEventsDialog({
  events,
  isOpen,
  onClose,
  currentMonth,
  currentYear,
}: {
  events: Event[];
  isOpen: boolean;
  onClose: () => void;
  currentMonth: number;
  currentYear: number;
}) {
  // Filter events for the current month only
  const currentMonthEvents = events.filter((event) => {
    const eventDate = new Date(event.date);
    return (
      eventDate.getMonth() === currentMonth &&
      eventDate.getFullYear() === currentYear
    );
  });

  // Sort filtered events by date
  const sortedEvents = [...currentMonthEvents].sort((a, b) => {
    const dateA = new Date(a.date);
    const dateB = new Date(b.date);
    return dateA.getTime() - dateB.getTime();
  });

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="text-xl flex items-center gap-2">
            <CalendarIcon className="h-5 w-5 text-primary" />
            Events for{" "}
            {new Date(currentYear, currentMonth).toLocaleString("default", {
              month: "long",
            })}{" "}
            {currentYear}
          </DialogTitle>
        </DialogHeader>

        <div className="overflow-y-auto pr-2 flex-grow">
          {sortedEvents.length === 0 ? (
            <div className="text-center py-8 text-slate-400">
              No events scheduled for this month
            </div>
          ) : (
            <div className="space-y-4">
              {sortedEvents.map((event) => (
                <div
                  key={event.id}
                  className="p-3 border border-slate-800/50 rounded-md hover:bg-slate-800/20 transition-colors"
                  style={{
                    borderLeft: `4px solid ${event.color || "#3b82f6"}`,
                  }}
                >
                  <div className="flex justify-between">
                    <h3 className="font-medium text-white">{event.title}</h3>
                    <Badge
                      className="bg-slate-800/80 hover:bg-slate-700/80 text-xs"
                      style={{ color: event.color || "#3b82f6" }}
                    >
                      {new Date(event.date).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                      })}
                    </Badge>
                  </div>

                  {event.time && (
                    <div className="flex items-center gap-1 text-xs text-slate-400 mt-1">
                      <ClockIcon className="h-3 w-3" />
                      <span>{event.time}</span>
                    </div>
                  )}

                  {event.description && (
                    <p className="text-sm text-slate-300 mt-2">
                      {event.description}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default function Calendar() {
  const calendarRef = useRef<FullCalendar>(null);
  const { events, addEvent, deleteEvent, updateEvent } = useEvents();
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [showAllEvents, setShowAllEvents] = useState(false); // New state for showing all events dialog

  useCopilotFeatures({ events, selectedEvent, addEvent, deleteEvent });

  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const nextMonth = () => {
    const calendarApi = calendarRef.current?.getApi();
    if (calendarApi) {
      calendarApi.next();
      const currentDate = calendarApi.getDate();
      setCurrentMonth(currentDate.getMonth());
      setCurrentYear(currentDate.getFullYear());
    }
  };

  const prevMonth = () => {
    const calendarApi = calendarRef.current?.getApi();
    if (calendarApi) {
      calendarApi.prev();
      const currentDate = calendarApi.getDate();
      setCurrentMonth(currentDate.getMonth());
      setCurrentYear(currentDate.getFullYear());
    }
  };

  const handleEventClick = useCallback(
    (clickInfo: EventClickArg) => {
      const event = events.find((e) => e.id === clickInfo.event.id);
      setSelectedEvent(event || null);
    },
    [events]
  );

  const handleEventDrop = useCallback(
    (dropInfo: EventDropArg) => {
      const { event: droppedEvent } = dropInfo;

      const existingEvent = events.find((e) => e.id === droppedEvent.id);
      if (!existingEvent) return;

      const droppedDate = new Date(droppedEvent.start!);
      droppedDate.setDate(droppedDate.getDate() + 1);

      const updatedEvent = {
        ...existingEvent,
        date: droppedDate.toISOString().split("T")[0],
      };

      try {
        updateEvent(updatedEvent);
      } catch (err) {
        console.error("Error updating event:", err);
        dropInfo.revert();
      }
    },
    [events, updateEvent]
  );

  useEffect(() => {
    const calendarApi = calendarRef.current?.getApi();
    if (!calendarApi) return;

    calendarApi.removeAllEvents();

    events.forEach((e) => {
      calendarApi.addEvent({
        id: e.id,
        title: e.title,
        start: e.date,
        description: e.description,
        color: e.color,
        allDay: true,
        extendedProps: { ...e },
      });
    });
  }, [events]);

  return (
    <div className="calendar-container h-full flex flex-col">
      <div className="calendar-header flex justify-between items-center mb-4 pb-2 border-b border-slate-800/30">
        <div className="flex items-center gap-4">
          <div className="bg-primary/10 p-2 rounded-lg">
            <CalendarIcon className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h2 className="text-lg font-medium text-white">Calendar</h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Manage your schedule
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center bg-slate-800/40 rounded-md p-1 mr-2">
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 rounded-md text-slate-400 hover:text-white hover:bg-slate-700/50"
              onClick={prevMonth}
            >
              <ChevronLeftIcon className="h-4 w-4" />
            </Button>
            <span className="text-sm font-medium text-white px-2">
              {months[currentMonth]} {currentYear}
            </span>
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 rounded-md text-slate-400 hover:text-white hover:bg-slate-700/50"
              onClick={nextMonth}
            >
              <ChevronRightIcon className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      <div className="today-events px-3 py-2 mb-4 border border-slate-800/30 rounded-md bg-slate-900/50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Badge className="bg-primary/20 text-primary hover:bg-primary/30 border-none px-2 py-1">
              Today
            </Badge>
            <span className="text-sm text-slate-300">
              {events.filter(
                (e) => e.date === new Date().toISOString().split("T")[0]
              ).length > 0
                ? `You have ${
                    events.filter(
                      (e) => e.date === new Date().toISOString().split("T")[0]
                    ).length
                  } events today`
                : "No events scheduled for today"}
            </span>
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="text-xs text-slate-400 hover:text-primary hover:bg-transparent"
            onClick={() => setShowAllEvents(true)}
          >
            View all events
          </Button>
        </div>
      </div>

      <div className="calendar-wrapper flex-grow">
        <FullCalendar
          ref={calendarRef}
          plugins={[dayGridPlugin, googleCalendarPlugin, interactionPlugin]}
          initialView="dayGridMonth"
          googleCalendarApiKey={
            process.env["NEXT_PUBLIC_GOOGLE_CALENDAR_API_KEY"]
          }
          events={[]}
          weekends={true}
          eventClick={handleEventClick}
          eventDisplay="block"
          eventClassNames="cursor-pointer"
          eventDrop={handleEventDrop}
          dragRevertDuration={0}
          eventDragMinDistance={5}
          rerenderDelay={0}
          editable={true}
          displayEventEnd={false}
          allDayMaintainDuration={false}
          nextDayThreshold="00:00:00"
          headerToolbar={false} // Hide the default header
          height="100%"
          dayMaxEventRows={3}
          firstDay={1} // Monday as first day
        />
      </div>

      {/* Event details dialog */}
      <EventDialog
        event={selectedEvent}
        onClose={() => setSelectedEvent(null)}
      />

      {/* All events dialog */}
      <AllEventsDialog
        events={events}
        isOpen={showAllEvents}
        onClose={() => setShowAllEvents(false)}
        currentMonth={currentMonth}
        currentYear={currentYear}
      />
    </div>
  );
}
