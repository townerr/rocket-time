import { format } from "date-fns";
import type { EnhancedEntry } from "./types";

/**
 * Calculates whether to use white or black text based on background color luminance
 */
export function getContrastColor(hexcolor: string): string {
  if (!hexcolor || !hexcolor.startsWith("#") || hexcolor.length !== 7) {
    return "#000000"; // Default to black text for invalid colors
  }

  // Convert hex to RGB
  const r = parseInt(hexcolor.slice(1, 3), 16);
  const g = parseInt(hexcolor.slice(3, 5), 16);
  const b = parseInt(hexcolor.slice(5, 7), 16);

  // Check if conversion resulted in valid numbers
  if (isNaN(r) || isNaN(g) || isNaN(b)) {
    return "#000000";
  }

  // Calculate luminance
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;

  // Return black or white based on luminance
  return luminance > 0.5 ? "#000000" : "#FFFFFF";
}

/**
 * Filters entries for a specific date
 */
export function getEntriesForDate(
  entries: EnhancedEntry[] | undefined,
  date: Date,
): EnhancedEntry[] {
  if (!entries) return [];

  return entries.filter(
    (entry) =>
      format(new Date(entry.date), "yyyy-MM-dd") === format(date, "yyyy-MM-dd"),
  );
}

/**
 * Calculates total hours for a specific date
 */
export function getDayTotalHours(
  entries: EnhancedEntry[] | undefined,
  date: Date,
): number {
  const dayEntries = getEntriesForDate(entries, date);
  return dayEntries.reduce((sum, entry) => sum + entry.hours, 0);
}

/**
 * Calculates total hours for the entire timesheet
 */
export function getWeekTotalHours(
  entries: EnhancedEntry[] | undefined,
): number {
  if (!entries) return 0;
  return entries.reduce((sum, entry) => sum + entry.hours, 0);
}
