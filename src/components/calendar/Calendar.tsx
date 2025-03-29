"use client";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import googleCalendarPlugin from "@fullcalendar/google-calendar";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useEvents } from "@/hooks/useEvents";
import { useUser } from "../context/auth-provider";
import { EventClickArg, EventDropArg } from "@fullcalendar/core";
import { Event } from "@/lib/types";
import { useCopilotFeatures } from "@/hooks/useCopilotFeatures";

export default function Calendar() {
  const calendarRef = useRef<FullCalendar>(null);
  const { events, addEvent, deleteEvent, updateEvent } = useEvents();
  const [showGoogleCalendarEvents, setShowGoogleCalendarEvents] =
    useState(false);
  const user = useUser();
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);

  useCopilotFeatures({ events, selectedEvent, addEvent, deleteEvent });

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

  const googleCalendarSource = useMemo(
    () => ({
      googleCalendarId: showGoogleCalendarEvents
        ? user?.current?.userId
        : undefined,
    }),
    [showGoogleCalendarEvents, user]
  );

  return (
    <div className="min-h-[500px]">
      <FullCalendar
        ref={calendarRef}
        plugins={[dayGridPlugin, googleCalendarPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        googleCalendarApiKey={
          process.env["NEXT_PUBLIC_GOOGLE_CALENDAR_API_KEY"]
        }
        events={[]}
        eventSources={[googleCalendarSource]}
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
      />
    </div>
  );
}
