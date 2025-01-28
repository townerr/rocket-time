"use client";

import { api } from "~/trpc/react";
import { TimesheetHistory } from "~/components/timesheet-history";

export default function HistoryPage() {
  const { data: timesheets, isLoading } = api.profile.getTimesheetHistory.useQuery();

  return (
    <div className="container mx-auto py-8">
      <TimesheetHistory
        timesheets={timesheets ?? []}
        isLoading={isLoading}
      />
    </div>
  );
}
