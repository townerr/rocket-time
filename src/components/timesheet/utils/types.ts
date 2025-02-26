import type { Timesheet, Entry, WorkType } from "@prisma/client";

export interface TimesheetEntryData {
  id?: string
  timesheetId?: string
  date: Date
  workTypeId: string
  hours: number
  projectCode?: string | null
}

export type EnhancedEntry = Entry & {
  type: WorkType;
};

export type EnhancedTimesheet = Timesheet & {
  entries: EnhancedEntry[];
};

export interface TimesheetHistoryProps {
  timesheets: (Timesheet & {
    entries: (Entry & {
      type: WorkType;
    })[];
  })[];
  isLoading: boolean;
}

export interface TimesheetTableProps {
  timesheet: (Timesheet & {
    entries: (Entry & {
      type: WorkType;
    })[];
  }) | null | undefined;
  workTypes: WorkType[];
  isLoading: boolean;
  onSave: (entry: TimesheetEntryData) => void;
  onDelete: (id: string) => void;
}

export interface TimesheetPageProps {}

export interface DayEntryProps {
  entry: Entry & { type: WorkType };
  workTypes: WorkType[];
  onSave: (entry: {
    id?: string;
    date: Date;
    workTypeId: string;
    hours: number;
    projectCode?: string | null;
  }) => void;
  onDelete: (id: string) => void;
}

export interface EntryFormProps {
  entry?: Entry & { type: WorkType };
  date: Date;
  workTypes: WorkType[];
  onSave: (values: {
    date: Date;
    workTypeId: string;
    hours: number;
    projectCode?: string | null;
  }) => void;
}

export interface AddEntryDialogProps {
  date: Date;
  workTypes: WorkType[];
  onSave: (entry: TimesheetEntryData) => void;
}

export interface WeekPickerProps {
  value: Date;
  onChange: (date: Date) => void;
}