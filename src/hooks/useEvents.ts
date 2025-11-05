import { Event } from "@/lib/types";
import { parseDate } from "@/lib/utils";
import { useEffect, useState, useCallback, useRef } from "react";

export const useEvents = (addDefaultEvents = true) => {
  const defaultEvents: Event[] = addDefaultEvents
    ? [
        {
          id: "1",
          title: "Office Meeting",
          date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 12)
            .toISOString()
            .split("T")[0],
          time: "10:00",
          description: "Discuss project progress and next steps.",
          color: "#03A9F4",
        },
        {
          id: "2",
          title: "Doctor Appointment",
          date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2)
            .toISOString()
            .split("T")[0],
          time: "10:00",
          description: "Get a checkup",
          color: "#FF9800",
        },
        {
          id: "3",
          title: "Coffee with John",
          date: new Date(Date.now()).toISOString().split("T")[0],
          time: "10:00",
          description: "Talk about the future of the company",
          color: "#4CAF50",
        },
        {
          id: "4",
          title: "Hangout with friends",
          date: new Date(Date.now() + 1000 * 60 * 60 * 24 * 10)
            .toISOString()
            .split("T")[0],
          time: "10:00",
          description: "Go to the park and hangout with friends",
          color: "#FF5722",
        },
      ]
    : [];

  const [events, setEvents] = useState<Event[]>(defaultEvents);
  const lastAddSigRef = useRef<{ sig: string; at: number } | null>(null);

  useEffect(() => {
    const storedItems = localStorage.getItem("events");
    if (storedItems) {
      setEvents(JSON.parse(storedItems));
    }
  }, []);

  // Deterministic color picker to ensure events always have a color
  const colorPalette = [
    "#3b82f6", // blue-500
    "#10b981", // emerald-500
    "#f59e0b", // amber-500
    "#ef4444", // red-500
    "#8b5cf6", // violet-500
    "#06b6d4", // cyan-500
    "#f43f5e", // rose-500
    "#22c55e", // green-500
  ];

  const pickDeterministicColor = (seed: string) => {
    let hash = 0;
    for (let i = 0; i < seed.length; i++) {
      hash = (hash * 31 + seed.charCodeAt(i)) >>> 0;
    }
    return colorPalette[hash % colorPalette.length];
  };

  const addEvent = (
    title: string,
    date: string,
    time?: string,
    description?: string,
    color?: string
  ) => {
    const { date: parsedDate, time: parsedTime } = parseDate(date, time);

    if (isNaN(parsedDate.getTime())) {
      console.error("Invalid date format: ", date);
      return;
    }

    // Default the color deterministically when not provided or empty
    const safeColor = color && color.trim() !== "" ? color : pickDeterministicColor(title);

    // Build a signature to guard against duplicate rapid invocations (e.g., StrictMode double-call)
    const dateOnly = parsedDate.toISOString().split("T")[0];
    const sig = `${title.trim().toLowerCase()}|${dateOnly}|${(parsedTime || "").trim()}`;
    const now = Date.now();
    if (lastAddSigRef.current && lastAddSigRef.current.sig === sig && now - lastAddSigRef.current.at < 3000) {
      // Ignore duplicate add within 3 seconds
      return;
    }
    lastAddSigRef.current = { sig, at: now };

    // Prevent duplicates already existing in state (same title/date/time)
    const exists = events.some(
      (e) =>
        e.title.trim().toLowerCase() === title.trim().toLowerCase() &&
        e.date === dateOnly &&
        (e.time || "") === (parsedTime || "")
    );
    if (exists) {
      return;
    }

    const newEvent: Event = {
      id: Date.now().toString(),
      title,
      date: dateOnly,
      time: parsedTime,
      description,
      color: safeColor,
    };

    setEvents((prevEvents) => {
      const updatedEvents = [...prevEvents, newEvent];
      localStorage.setItem("events", JSON.stringify(updatedEvents));
      return updatedEvents;
    });
  };

  const deleteEvent = (id: string) => {
    setEvents((prevEvents) => {
      const updatedEvents = prevEvents.filter((event) => event.id !== id);
      localStorage.setItem("events", JSON.stringify(updatedEvents));
      return updatedEvents;
    });
  };

  const updateEvent = useCallback((updatedEvent: Event) => {
    setEvents((prevEvents) => {
      const updatedEvents = prevEvents.map((event) =>
        event.id === updatedEvent.id ? updatedEvent : event
      );
      localStorage.setItem("events", JSON.stringify(updatedEvents));
      return updatedEvents;
    });
  }, []);

  return { events, setEvents, addEvent, deleteEvent, updateEvent };
};
