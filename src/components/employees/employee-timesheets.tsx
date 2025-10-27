import { api } from "~/trpc/react";
import { TimesheetHistory } from "~/components/timesheet-history";

interface EmployeeTimesheetsProps {
  userId: string;
}

export function EmployeeTimesheets({ userId }: EmployeeTimesheetsProps) {
  const { data: timesheets, isLoading } =
    api.manager.getEmployeeTimesheets.useQuery({ userId });

  // TypeScript needs the entries to have the 'type' property
  // The Prisma query in manager.ts already includes this, but there may be a type cache issue
  const typedTimesheets = timesheets ?? [];

  return (
    <TimesheetHistory 
      timesheets={typedTimesheets as Parameters<typeof TimesheetHistory>[0]['timesheets']} 
      isLoading={isLoading} 
    />
  );
}
