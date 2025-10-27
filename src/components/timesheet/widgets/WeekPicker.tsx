"use client";

import { format, addWeeks, startOfWeek, endOfWeek } from "date-fns";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "~/components/ui/button";
import { type WeekPickerProps } from "../utils/types";

export function WeekPicker({ value, onChange }: WeekPickerProps) {
  const weekStart = startOfWeek(value, { weekStartsOn: 1 });
  const weekEnd = endOfWeek(value, { weekStartsOn: 1 });

  const handlePreviousWeek = () => {
    onChange(addWeeks(value, -1));
  };

  const handleNextWeek = () => {
    onChange(addWeeks(value, 1));
  };

  return (
    <div className="flex items-center gap-4">
      <Button variant="outline" size="icon" onClick={handlePreviousWeek}>
        <ChevronLeft className="h-4 w-4" />
      </Button>

      <div className="text-sm">
        <span className="font-medium">
          {format(weekStart, "MMM d")} - {format(weekEnd, "MMM d, yyyy")}
        </span>
      </div>

      <Button variant="outline" size="icon" onClick={handleNextWeek}>
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  );
}
