"use client";

import { useState } from "react";
import { format, addDays, startOfWeek } from "date-fns";
import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { Input } from "~/components/ui/input";
import { PlusCircle, Trash2, Pencil } from "lucide-react";
import type { Timesheet, Entry, WorkType } from "@prisma/client";

interface TimesheetTableProps {
  timesheet: (Timesheet & {
    entries: (Entry & {
      type: WorkType;
    })[];
  }) | null | undefined;
  workTypes: WorkType[];
  isLoading: boolean;
  onSave: (entry: {
    id?: string;
    date: Date;
    workTypeId: string;
    hours: number;
    projectCode?: string | null;
  }) => void;
  onDelete: (id: string) => void;
}

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

  const getDayEntries = (date: Date) => {
    return (
      timesheet?.entries.filter(
        (entry) =>
          format(new Date(entry.date), "yyyy-MM-dd") ===
          format(date, "yyyy-MM-dd")
      ) ?? []
    );
  };

  const getDayTotal = (date: Date) => {
    return getDayEntries(date).reduce((sum, entry) => sum + entry.hours, 0);
  };

  const getWeekTotal = () => {
    return timesheet?.entries.reduce((sum, entry) => sum + entry.hours, 0) ?? 0;
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-7 gap-4 mb-4">
        {weekDays.map((date) => (
          <div
            key={date.toISOString()}
            className="border rounded-lg p-4 space-y-4"
          >
            <div className="text-center">
              <div className="font-medium">{format(date, "EEEE")}</div>
              <div className="text-sm text-muted-foreground">
                {format(date, "MMM d")}
              </div>
            </div>

            <div className="space-y-2">
              {getDayEntries(date).map((entry) => (
                <DayEntry
                  key={entry.id}
                  entry={entry}
                  workTypes={workTypes}
                  onSave={onSave}
                  onDelete={onDelete}
                />
              ))}
            </div>

            <AddEntryDialog
              date={date}
              workTypes={workTypes}
              onSave={onSave}
            />

            <div className="text-sm text-right pt-2 border-t">
              Total: {getDayTotal(date)} hours
            </div>
          </div>
        ))}
      </div>

      <div className="text-right font-medium">
        Week Total: {getWeekTotal()} hours
      </div>
    </div>
  );
}

interface DayEntryProps {
  entry: Entry & { type: WorkType };
  workTypes: WorkType[];
  onSave: TimesheetTableProps["onSave"];
  onDelete: (id: string) => void;
}

function getContrastColor(hexcolor: string) {
  // Convert hex to RGB
  const r = parseInt(hexcolor.slice(1, 3), 16);
  const g = parseInt(hexcolor.slice(3, 5), 16);
  const b = parseInt(hexcolor.slice(5, 7), 16);
  
  // Calculate luminance
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  
  // Return black or white based on luminance
  return luminance > 0.5 ? '#000000' : '#FFFFFF';
}

function DayEntry({ entry, workTypes, onSave, onDelete }: DayEntryProps) {
  const [isEditing, setIsEditing] = useState(false);

  return (
    <div
      className="p-2 rounded text-sm space-y-1"
      style={{ 
        backgroundColor: entry.type.color,
        border: `1px solid ${entry.type.borderColor}`,
        color: getContrastColor(entry.type.color),
      }}
    >
      <div className="flex justify-between items-center">
        <span className="font-medium truncate" title={entry.type.name}>{entry.type.name}</span>
        <div className="flex gap-2">
          <Button
            size="sm"
            className="h-6 w-6 p-0 bg-blue-500/50 hover:bg-blue-500/70"
            onClick={() => setIsEditing(true)}
          >
            <Pencil className="h-4 w-4" />
          </Button>
          <Button
            size="sm"
            className="h-6 w-6 p-0 text-destructive bg-red-500/40 hover:bg-red-500/60"
            onClick={() => onDelete(entry.id)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
      {entry.projectCode && (
        <div className="text-xs px-2 py-1 bg-black/5 rounded truncate" title={entry.projectCode}>
          {entry.projectCode}
        </div>
      )}
      <div>{entry.hours} hours</div>

      {isEditing && (
        <EntryForm
          entry={entry}
          date={entry.date}
          workTypes={workTypes}
          onSave={(values) => {
            onSave({ id: entry.id, ...values });
            setIsEditing(false);
          }}
          onCancel={() => setIsEditing(false)}
        />
      )}
    </div>
  );
}

interface AddEntryDialogProps {
  date: Date;
  workTypes: WorkType[];
  onSave: TimesheetTableProps["onSave"];
}

function AddEntryDialog({ date, workTypes, onSave }: AddEntryDialogProps) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" className="w-full bg-gray-100 hover:bg-gray-200 text-purple-300">
          <PlusCircle className="h-4 w-4 mr-2" />
          Add Entry
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Time Entry for {format(date, "MMM d, yyyy")}</DialogTitle>
        </DialogHeader>
        <EntryForm
          date={date}
          workTypes={workTypes}
          onSave={(values) => {
            onSave(values);
            setOpen(false);
          }}
        />
      </DialogContent>
    </Dialog>
  );
}

interface EntryFormProps {
  entry?: Entry & { type: WorkType };
  date: Date;
  workTypes: WorkType[];
  onSave: (values: {
    date: Date;
    workTypeId: string;
    hours: number;
    projectCode?: string | null;
  }) => void;
  onCancel?: () => void;
}

function EntryForm({ entry, date, workTypes, onSave, onCancel }: EntryFormProps) {
  const [workTypeId, setWorkTypeId] = useState(entry?.workTypeId ?? "");
  const [projectCode, setProjectCode] = useState(entry?.projectCode ?? "");
  const [hours, setHours] = useState(entry?.hours.toString() ?? "");

  const selectedWorkType = workTypes.find((wt) => wt.id === workTypeId);
  const showProjectCode = selectedWorkType?.name === "Project";

  const handleSave = () => {
    if (workTypeId && hours) {
      onSave({
        date,
        workTypeId,
        hours: parseFloat(hours),
        projectCode: showProjectCode ? projectCode : null,
      });
    }
  };

  return (
    <div className="space-y-4 pt-4">
      <Select value={workTypeId} onValueChange={setWorkTypeId}>
        <SelectTrigger>
          <SelectValue placeholder="Select entry type" />
        </SelectTrigger>
        <SelectContent>
          {workTypes.map((type) => (
            <SelectItem key={type.id} value={type.id}>
              {type.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {showProjectCode && (
        <Input
          placeholder="Project Code"
          value={projectCode}
          onChange={(e) => setProjectCode(e.target.value)}
        />
      )}

      <Input
        type="number"
        placeholder="Hours"
        min="0"
        max="24"
        step="0.5"
        value={hours}
        onChange={(e) => setHours(e.target.value)}
      />

      <div className="flex flex-col justify-end gap-2">
        {onCancel && (
          <Button variant="outline" onClick={onCancel}>
            Cancel
          </Button>
        )}
        <Button onClick={handleSave}>Save Entry</Button>
      </div>
    </div>
  );
} 