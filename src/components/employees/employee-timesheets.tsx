import { api } from "~/trpc/react";
import { TimesheetHistory } from "~/components/timesheet-history";

interface EmployeeTimesheetsProps {
  userId: string;
}

export function EmployeeTimesheets({ userId }: EmployeeTimesheetsProps) {
  const { data: timesheets, isLoading } = api.manager.getEmployeeTimesheets.useQuery({ userId });
  
  return (
    <TimesheetHistory 
      timesheets={timesheets ?? []} 
      isLoading={isLoading} 
    />
  );
} 