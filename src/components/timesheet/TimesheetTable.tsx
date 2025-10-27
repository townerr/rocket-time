"use client";

import { format, addDays, startOfWeek } from "date-fns";
import { Clock } from "lucide-react";
import { DayEntry } from "./DayEntry";
import { AddEntryDialog } from "./widgets/AddEntryDialog";
import { type TimesheetTableProps } from "./utils/types";
import { getEntriesForDate, getDayTotalHours } from "./utils/helpers";

export function TimesheetTable({
  timesheet,
  workTypes,
  isLoading,
  onSave,
  onDelete,
}: TimesheetTableProps) {
  const weekDays = Array.from({ length: 7 }, (_, i) =>
    addDays(
      startOfWeek(new Date(timesheet?.weekStart ?? Date.now()), {
        weekStartsOn: 1,
      }),
      i,
    ),
  );

  if (isLoading) {
    return <div className="flex justify-center py-10">Loading...</div>;
  }

  return (
    <div className="w-full">
      <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-3 lg:grid-cols-7">
        {weekDays.map((date) => {
          const dayEntries = getEntriesForDate(timesheet?.entries, date);
          const dayTotal = getDayTotalHours(timesheet?.entries, date);

          return (
            <div
              key={date.toISOString()}
              className="flex h-full min-h-[300px] flex-col overflow-hidden rounded-lg border bg-white shadow-sm dark:bg-gray-900"
            >
              <div className="border-b bg-gray-50 py-2 text-center dark:bg-gray-800">
                <div className="font-medium">{format(date, "EEEE")}</div>
                <div className="text-sm text-muted-foreground">
                  {format(date, "MMM d")}
                </div>
              </div>

              <div className="flex min-h-[150px] flex-grow flex-col space-y-3 overflow-y-auto p-3">
                {dayEntries.length > 0 ? (
                  dayEntries.map((entry) => (
                    <DayEntry
                      key={entry.id}
                      entry={entry}
                      workTypes={workTypes}
                      onSave={onSave}
                      onDelete={onDelete}
                    />
                  ))
                ) : (
                  <div className="flex flex-grow items-center justify-center py-6 text-center text-sm text-muted-foreground">
                    No entries
                  </div>
                )}
              </div>

              <div className="px-3 pb-3">
                <AddEntryDialog
                  date={date}
                  workTypes={workTypes}
                  onSave={onSave}
                />
              </div>

              <div className="mt-auto flex items-center justify-between border-t bg-gray-50 p-3 dark:bg-gray-800">
                <span className="text-sm text-muted-foreground">Total</span>
                <div className="flex items-center font-medium">
                  <Clock className="mr-1 h-3.5 w-3.5 text-muted-foreground" />
                  {dayTotal}h
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
