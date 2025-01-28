import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Accordion } from "~/components/ui/accordion";
import { Skeleton } from "~/components/ui/skeleton";
import { TimesheetHistoryItem } from "~/components/timesheet-history-item";
import type { Timesheet } from "~/types/timesheet"; // You might want to move interfaces to a types file

interface TimesheetHistoryProps {
  timesheets: Timesheet[];
  isLoading?: boolean;
}

export function TimesheetHistory({ timesheets, isLoading }: TimesheetHistoryProps) {
  if (isLoading) {
    return <TimesheetHistorySkeleton />;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl font-bold">Timesheet History</CardTitle>
      </CardHeader>
      <CardContent>
        <Accordion type="single" collapsible className="space-y-4">
          {timesheets?.map((timesheet) => (
            <TimesheetHistoryItem
              key={timesheet.id}
              timesheet={timesheet}
            />
          ))}

          {timesheets?.length === 0 && (
            <div className="text-center text-gray-500 py-8">
              No timesheet history found
            </div>
          )}
        </Accordion>
      </CardContent>
    </Card>
  );
}

function TimesheetHistorySkeleton() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl font-bold">Timesheet History</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="border rounded-lg p-4 space-y-4">
            <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
              <div className="flex-1 space-y-2">
                <Skeleton className="h-6 w-48" />
                <Skeleton className="h-4 w-24" />
              </div>
              <Skeleton className="h-6 w-20" />
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
} 