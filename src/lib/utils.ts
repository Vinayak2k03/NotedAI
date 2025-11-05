import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function parseDate(
  dateString: string,
  timeString?: string
): { date: Date; time: string | undefined } {
  let date = new Date(dateString);
  let time: string | undefined;

  if (!isNaN(date.getTime())) {  //check if date is valid
    if (timeString) {
      const normalized = normalizeTimeString(timeString);
      if (normalized) {
        const [hour, minutes] = normalized.split(":").map(Number);
        date.setHours(hour, minutes, 0, 0);
        time = normalized;
      }
    }
    return { date, time };
  }

  const parts = dateString.split("-");
  if (parts.length === 3) {
    date = new Date(
      // ["YYYY", "MM", "DD"]
      parseInt(parts[0]), // Year
      parseInt(parts[1]) - 1, //Month (0-indexed)
      parseInt(parts[2]) //Day
    );
    if (!isNaN(date.getTime())) {
      if (timeString) {
        const normalized = normalizeTimeString(timeString);
        if (normalized) {
          const [hours, minutes] = normalized.split(":").map(Number);
          date.setHours(hours, minutes, 0, 0);
          time = normalized;
        }
      }
      return { date, time };
    }
  }
  return { date: new Date(), time: undefined };
}

export function formatDate(date: Date): string {
  return `${date.toLocaleDateString("en-US", { dateStyle: "long" })} at ${date.toLocaleTimeString("en-US", { timeStyle: "short", hour12: true })}`;
}

// Accept common user-entered time formats and return 24h HH:MM string
function normalizeTimeString(input: string): string | undefined {
  const s = input.trim().toLowerCase();

  // Match formats like "9", "09", "9:30", "09:30", optionally with am/pm
  const m = s.match(/^\s*(\d{1,2})(?::(\d{2}))?\s*(am|pm)?\s*$/i);
  if (!m) return undefined;

  let hours = parseInt(m[1], 10);
  const minutes = m[2] ? parseInt(m[2], 10) : 0;
  const meridiem = m[3]?.toLowerCase();

  if (meridiem === "am") {
    if (hours === 12) hours = 0; // 12am -> 00
  } else if (meridiem === "pm") {
    if (hours !== 12) hours += 12; // 1pm -> 13
  }

  if (hours < 0 || hours > 23 || minutes < 0 || minutes > 59) return undefined;

  const hh = hours.toString().padStart(2, "0");
  const mm = minutes.toString().padStart(2, "0");
  return `${hh}:${mm}`;
}
