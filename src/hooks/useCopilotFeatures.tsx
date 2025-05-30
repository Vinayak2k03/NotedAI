import { Event } from "@/lib/types";
import { useCopilotAction, useCopilotReadable } from "@copilotkit/react-core";
import { useCopilotChatSuggestions } from "@copilotkit/react-ui";

interface useCopilotFeaturesProps {
  events: Event[];
  selectedEvent: Event | null;
  addEvent: (
    title: string,
    date: string,
    time?: string,
    description?: string,
    color?: string
  ) => void;
  deleteEvent: (id: string) => void;
}

export const useCopilotFeatures = ({
  events,
  selectedEvent,
  addEvent,
  deleteEvent,
}: useCopilotFeaturesProps) => {
  useCopilotReadable({
    description: "Detailed overview of current calendar events",
    value: JSON.stringify(
      events.map((e) => ({
        id: e.id,
        title: e.title,
        date: e.date,
        time: e.time,
        description: e.description || "No description provided",
        color: e.color || "Default color (blue)",
        formattedDateTime: e.time
          ? `${new Date(e.date).toLocaleDateString("en-US", {
              dateStyle: "long",
            })} at ${e.time}`
          : new Date(e.date).toLocaleDateString("en-US", { dateStyle: "full" }),
      }))
    ),
  });

  useCopilotReadable({
    description: "Comprehensive details of the currently selected event",
    value: selectedEvent
      ? JSON.stringify({
          id: selectedEvent.id,
          title: selectedEvent.title,
          date: selectedEvent.date,
          time: selectedEvent.time,
          description: selectedEvent.description || "No description provided",
          color: selectedEvent.color || "Default color (blue)",
          formattedDateTime: selectedEvent.time
            ? `${new Date(selectedEvent.date).toLocaleDateString("en-US", {
                dateStyle: "long",
              })} at ${selectedEvent.time}`
            : new Date(selectedEvent.date).toLocaleDateString("en-US", {
                dateStyle: "full",
              }),
          daysUntilEvent: Math.ceil(
            (new Date(selectedEvent.date).getTime() - new Date().getTime()) /
              (1000 * 3600 * 24)
          ),
        })
      : "No event selected",
  });

  useCopilotReadable({
    description: "Current date and time information",
    value: JSON.stringify({
      currentDate: new Date().toISOString().split("T")[0],
      formattedDate: new Date().toLocaleDateString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      }),
      currentTime: new Date().toLocaleTimeString("en-US"),
      currentWeek: `Week ${Math.ceil((new Date().getDate() + new Date(new Date().getFullYear(), new Date().getMonth(), 1).getDay()) / 7)} of the month`,
    }),
  });

  useCopilotAction({
    name: "addEvent",
    description: "Add a new event to the calendar with detailed information",
    parameters: [
      {
        name: "title",
        type: "string",
        description: "The title or name of the event (required)",
        required: true,
      },
      {
        name: "date",
        type: "string",
        description: "The date of the event in YYYY-MM-DD format (required)",
        required: true,
      },
      {
        name: "time",
        type: "string",
        description: "The time of the event in HH:MM format (optional)",
      },
      {
        name: "description",
        type: "string",
        description: "A detailed description of the event (optional)",
      },
      {
        name: "color",
        type: "string",
        description: "The color for the event in hexadecimal format (optional)",
      },
    ],
    handler: ({ title, date, time, description, color }) => {
      if (!title || !date) {
        throw new Error("Title and date are required fields");
      }

      addEvent(title, date, time, description, color);
      return `Event "${title}" successfully added for ${new Date(date).toLocaleDateString("en-US", { dateStyle: "full" })}${time ? ` at ${time}` : ""}`
      },
   
    render: ({ status,result }) => (
      <div className="flex justify-center items-center text-sm">
        {status !== "complete" && <p>Adding event to calendar...</p>}
        {status === "complete" && (
          <div className="flex gap-2">
            <span>✅</span>
            <span className="font-semibold">{result}</span>
          </div>
        )}
      </div>
    ),
  });

  useCopilotAction({
    name: "deleteEvent",
    description:
      "Remove a specific event from the calendar using its unique identifier",
    parameters: [
      {
        name: "id",
        type: "string",
        description:
          "The unique identifier of the event to be deleted (required)",
        required: true,
      },
    ],
    handler: ({ id }) => {
      if (!id) {
        throw new Error("Event ID is required for deleting an event.");
      }
      const eventToDelete = events.find((e) => e.id === id);
      if (!eventToDelete) {
        throw new Error(`No event found with ID: ${id}`);
      }
      deleteEvent(id);
      return `Event "${eventToDelete.title}" scheduled for ${new Date(eventToDelete.date).toLocaleDateString("en-US", { dateStyle: "full" })} has been successfully removed from the calendar.`;
    },
  });

  useCopilotAction({
    name: "showEventsForPeriod",
    description: "Display events for a specific time period",
    parameters: [
      {
        name: "period",
        type: "string",
        description: "Time period (today/this week/next week/this month/next month)",
        required: true,
      },
    ],
    handler: ({ period }) => {
      if (!period) throw new Error("Time period is required.");
      
      const today = new Date();
      const eventDateFilter = (eventDate: Date) => {
        switch (period) {
          case "today":
            return eventDate.toDateString() === today.toDateString();
          case "this week": {
            const startOfWeek = new Date(today);
            startOfWeek.setDate(today.getDate() - today.getDay());
            const endOfWeek = new Date(startOfWeek);
            endOfWeek.setDate(startOfWeek.getDate() + 6);
            return eventDate >= startOfWeek && eventDate <= endOfWeek;
          }
          case "next week": {
            const startOfNextWeek = new Date(today);
            startOfNextWeek.setDate(today.getDate() - today.getDay() + 7);
            const endOfNextWeek = new Date(startOfNextWeek);
            endOfNextWeek.setDate(startOfNextWeek.getDate() + 6);
            return eventDate >= startOfNextWeek && eventDate <= endOfNextWeek;
          }
          case "this month":
            return (
              eventDate.getMonth() === today.getMonth() &&
              eventDate.getFullYear() === today.getFullYear()
            );
          case "next month": {
            const nextMonth = new Date(today.getFullYear(), today.getMonth() + 1, 1);
            return (
              eventDate.getMonth() === nextMonth.getMonth() &&
              eventDate.getFullYear() === nextMonth.getFullYear()
            );
          }
          default:
            throw new Error(`Invalid period: ${period}`);
        }
      };
      
      const filteredEvents = events.filter((e) => eventDateFilter(new Date(e.date)));
      return JSON.stringify(
        filteredEvents.map((e) => ({
          ...e,
          formattedDate: new Date(e.date).toLocaleDateString("en-US", { dateStyle: "full" }),
        }))
      );
    },
    // render items here
  });

  
  useCopilotChatSuggestions({
    instructions: `Suggest helpful actions for managing the calendar. You can:
    1. Show today's events and provide a brief summary.
    2. Display upcoming events for the next week or month.
    3. Count and categorize events (e.g., by type or color).
    4. Suggest clearing all events if the calendar looks cluttered.
    5. Recommend adding important events like holidays or birthdays.
    6. Offer to find gaps in the schedule for potential new events.
    7. Propose rescheduling conflicting events if any are detected.
    8. Suggest reviewing and updating event descriptions for clarity.

    When making suggestions, consider the current date, upcoming important dates, and the overall distribution of events in the calendar. Provide context for why each suggestion might be helpful to the user.`,
  });
};


