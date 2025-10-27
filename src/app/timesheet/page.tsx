"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "~/trpc/react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { WeekPicker } from "~/components/timesheet/widgets/WeekPicker";
import { TimesheetTable } from "~/components/timesheet/TimesheetTable";
import { useToast } from "~/hooks/use-toast";
import { startOfWeek, format, addDays, endOfWeek } from "date-fns";
import {
  CalendarIcon,
  ClockIcon,
  CheckIcon,
  AlertCircleIcon,
} from "lucide-react";
import {
  type TimesheetEntryData,
  type TimesheetPageProps,
} from "~/components/timesheet/utils/types";

// Component for loading state
const TimesheetSkeleton = () => (
  <div className="space-y-4">
    <div className="mb-4 h-8 w-48 animate-pulse rounded bg-gray-200 dark:bg-gray-700"></div>
    <div className="h-[400px] animate-pulse rounded bg-gray-200 dark:bg-gray-700"></div>
  </div>
);

// Component for week summary
const WeekSummary = ({ weekHours }: { weekHours: number }) => (
  <div className="flex items-center space-x-2 text-sm">
    <ClockIcon className="h-4 w-4 text-muted-foreground" />
    <span className="font-medium">{weekHours.toFixed(1)}</span>
    <span className="text-muted-foreground">hours this week</span>
  </div>
);

// Component for action buttons
const ActionButtons = ({
  onSubmit,
  isSubmitting,
  canSubmit,
}: {
  onSubmit: () => void;
  isSubmitting: boolean;
  canSubmit: boolean;
}) => (
  <div className="flex justify-end space-x-4">
    <Button
      variant="default"
      onClick={onSubmit}
      disabled={isSubmitting || !canSubmit}
      className="flex items-center space-x-2"
    >
      <CheckIcon className="h-4 w-4" />
      <span>Submit Timesheet</span>
    </Button>
  </div>
);

export default function TimesheetPage({}: TimesheetPageProps) {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const router = useRouter();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const weekStart = startOfWeek(selectedDate, { weekStartsOn: 1 });
  const weekEnd = endOfWeek(selectedDate, { weekStartsOn: 1 });

  // Format dates for display
  const formattedDateRange = `${format(weekStart, "MMM d")} - ${format(weekEnd, "MMM d, yyyy")}`;

  const { data: timesheet, isLoading: timesheetLoading } =
    api.timesheet.getCurrentTimesheet.useQuery(
      { weekStart },
      {
        refetchOnWindowFocus: false,
      },
    );

  const { data: workTypes, isLoading: workTypesLoading } =
    api.timesheet.getWorkTypes.useQuery(undefined, {
      refetchOnWindowFocus: false,
    });

  const utils = api.useUtils();

  const { mutate: saveEntry } = api.timesheet.saveEntry.useMutation({
    onSuccess: () => {
      toast({
        title: "Entry saved",
        description: "Your timesheet entry has been saved successfully.",
      });
      void utils.timesheet.getCurrentTimesheet.invalidate({ weekStart });
    },
    onError: (error) => {
      toast({
        title: "Error saving entry",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const { mutate: deleteEntry } = api.timesheet.deleteEntry.useMutation({
    onSuccess: () => {
      toast({
        title: "Entry deleted",
        description: "Your timesheet entry has been deleted successfully.",
      });
      void utils.timesheet.getCurrentTimesheet.invalidate({ weekStart });
    },
    onError: (error) => {
      toast({
        title: "Error deleting entry",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const { mutate: submitTimesheet } = api.timesheet.submitTimesheet.useMutation(
    {
      onSuccess: () => {
        setIsSubmitting(false);
        toast({
          title: "Timesheet submitted",
          description: "Your timesheet has been submitted successfully.",
        });
        void utils.timesheet.getCurrentTimesheet.invalidate({ weekStart });
      },
      onError: (error) => {
        setIsSubmitting(false);
        toast({
          title: "Error submitting timesheet",
          description: error.message,
          variant: "destructive",
        });
      },
    },
  );

  const handleDateChange = (date: Date) => {
    setSelectedDate(date);
  };

  const handleSave = (entry: TimesheetEntryData) => {
    if (!timesheet) return;

    saveEntry({
      id: entry.id,
      timesheetId: timesheet.id,
      date: entry.date,
      workTypeId: entry.workTypeId,
      hours: entry.hours,
      projectCode: entry.projectCode,
    });
  };

  const handleDelete = (entryId: string) => {
    deleteEntry({ id: entryId });
  };

  const handleSubmit = () => {
    if (!timesheet) return;
    setIsSubmitting(true);
    submitTimesheet({ id: timesheet.id });
  };

  // Calculate total hours for the week
  const weekHours =
    timesheet?.entries.reduce((acc, entry) => acc + entry.hours, 0) || 0;

  // Check if the timesheet has been submitted
  const isSubmitted = timesheet?.status === "pending";

  // Check if timesheet can be submitted
  const canSubmit = timesheet && !isSubmitted && timesheet.entries.length > 0;

  const isLoading = timesheetLoading || workTypesLoading;

  return (
    <div className="container mx-auto max-w-7xl py-6">
      <Card>
        <CardHeader>
          <div className="flex flex-col space-y-2 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
            <div>
              <CardTitle>Weekly Timesheet</CardTitle>
              <CardDescription>Record your hours for the week</CardDescription>
            </div>
            <WeekPicker value={selectedDate} onChange={handleDateChange} />
          </div>

          <div className="mt-4 flex items-center text-sm">
            <CalendarIcon className="mr-2 h-4 w-4 text-muted-foreground" />
            {formattedDateRange}
            {isSubmitted && (
              <div className="ml-4 inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800 dark:bg-green-800/30 dark:text-green-400">
                Submitted
              </div>
            )}
          </div>
        </CardHeader>

        <CardContent>
          {isLoading ? (
            <TimesheetSkeleton />
          ) : (
            <>
              <TimesheetTable
                timesheet={timesheet}
                workTypes={workTypes || []}
                isLoading={isLoading}
                onSave={handleSave}
                onDelete={handleDelete}
              />

              {!timesheet?.entries.length && (
                <div className="p-8 text-center text-muted-foreground">
                  <p>
                    No timesheet entries for this week yet. Add your first
                    entry.
                  </p>
                </div>
              )}
            </>
          )}
        </CardContent>

        <CardFooter className="flex flex-col items-start justify-between space-y-4 sm:flex-row sm:items-center sm:space-y-0">
          <WeekSummary weekHours={weekHours} />

          {timesheet && !isSubmitted && (
            <ActionButtons
              onSubmit={handleSubmit}
              isSubmitting={isSubmitting}
              canSubmit={!!canSubmit}
            />
          )}
        </CardFooter>
      </Card>
    </div>
  );
}
