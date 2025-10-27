export interface TimesheetEntry {
  id: string;
  date: Date;
  type: string;
  hours: number;
  projectCode?: string | null;
}

export interface Timesheet {
  id: string;
  weekStart: Date;
  weekEnd: Date;
  status: string | null;
  entries: TimesheetEntry[];
}
