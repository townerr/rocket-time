"use client";

import { format, addDays, startOfWeek } from "date-fns";
import { Clock } from "lucide-react";
import { DayEntry } from "./DayEntry";
import { AddEntryDialog } from "./widgets/AddEntryDialog";
import { 
  type TimesheetTableProps,
} from "./utils/types";
import { 
  getEntriesForDate, 
  getDayTotalHours, 
} from "./utils/helpers";

export function TimesheetTable({
  timesheet,
  workTypes,
  isLoading,
  onSave,
  onDelete,
}: TimesheetTableProps) {
  const weekDays = Array.from({ length: 7 }, (_, i) =>
    addDays(startOfWeek(new Date(timesheet?.weekStart ?? Date.now()), { weekStartsOn: 1 }), i)
  );

  if (isLoading) {
    return <div className="flex justify-center py-10">Loading...</div>;
  }

  return (
    <div className="w-full">
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-7 gap-4 mb-6">
        {weekDays.map((date) => {
          const dayEntries = getEntriesForDate(timesheet?.entries, date);
          const dayTotal = getDayTotalHours(timesheet?.entries, date);
          
          return (
            <div
              key={date.toISOString()}
              className="border rounded-lg overflow-hidden bg-white dark:bg-gray-900 shadow-sm"
            >
              <div className="text-center py-2 bg-gray-50 dark:bg-gray-800 border-b">
                <div className="font-medium">{format(date, "EEEE")}</div>
                <div className="text-sm text-muted-foreground">
                  {format(date, "MMM d")}
                </div>
              </div>

              <div className="p-3 space-y-3">
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
                  <div className="text-center py-6 text-sm text-muted-foreground">
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

              <div className="flex justify-between items-center p-3 border-t bg-gray-50 dark:bg-gray-800">
                <span className="text-sm text-muted-foreground">Total</span>
                <div className="flex items-center font-medium">
                  <Clock className="h-3.5 w-3.5 mr-1 text-muted-foreground" />
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