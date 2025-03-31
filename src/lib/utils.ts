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
      const [hour, minutes] = timeString.split(":").map(Number);
      date.setHours(hour, minutes);
      time = timeString;
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
        const [hours, minutes] = timeString.split(":").map(Number);
        date.setHours(hours, minutes);
        time = timeString;
      }
      return { date, time };
    }
  }
  return { date: new Date(), time: undefined };
}

export function formatDate(date: Date): string {
  return `${date.toLocaleDateString("en-US", { dateStyle: "long" })} at ${date.toLocaleTimeString("en-US", { timeStyle: "short", hour12: true })}`;
}
