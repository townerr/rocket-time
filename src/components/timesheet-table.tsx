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
import { PlusCircle, Trash2, Pencil, Clock, MoreHorizontal } from "lucide-react";
import type { Timesheet, Entry, WorkType } from "@prisma/client";
import { Badge } from "~/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";

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
    return <div className="flex justify-center py-10">Loading...</div>;
  }

  return (
    <div className="w-full">
      <div className="grid grid-cols-1 lg:grid-cols-7 gap-3 mb-4">
        {weekDays.map((date) => (
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
              {getDayEntries(date).length > 0 ? (
                getDayEntries(date).map((entry) => (
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
                {getDayTotal(date)}h
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="text-right font-semibold p-3 border-t">
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
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const contrastColor = getContrastColor(entry.type.color);

  return (
    <div className="w-full">
      <div
        className="rounded-md shadow-sm overflow-hidden"
        style={{ 
          backgroundColor: entry.type.color,
          border: `1px solid ${entry.type.borderColor}`,
          color: contrastColor,
        }}
      >
        <div className="px-3 py-2">
          <div className="flex justify-between items-start">
            <div>
              <div className="font-medium pr-2">{entry.type.name}</div>
              <div className="mt-1 flex items-center">
                <Clock className="h-3.5 w-3.5 mr-1 opacity-75" />
                <span className="font-semibold">{entry.hours}h</span>
              </div>
            </div>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="h-6 w-6 p-0 rounded-full hover:bg-black/10 mt-0.5"
                  style={{ color: contrastColor }}
                >
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setEditDialogOpen(true)}>
                  <Pencil className="h-4 w-4 mr-2" />
                  Edit
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={() => onDelete(entry.id)}
                  className="text-destructive"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          
          {entry.projectCode && (
            <div 
              className="mt-2 px-2 py-1 rounded-sm text-xs"
              style={{ backgroundColor: `${contrastColor === '#000000' ? 'rgba(0,0,0,0.05)' : 'rgba(255,255,255,0.15)'}` }}
            >
              <span className="opacity-70">Project:</span> {entry.projectCode}
            </div>
          )}
        </div>
      </div>

      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Time Entry</DialogTitle>
          </DialogHeader>
          <EntryForm
            entry={entry}
            date={entry.date}
            workTypes={workTypes}
            onSave={(values) => {
              onSave({ id: entry.id, ...values });
              setEditDialogOpen(false);
            }}
          />
        </DialogContent>
      </Dialog>
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
        <Button variant="outline" className="w-full flex items-center gap-1">
          <PlusCircle className="h-4 w-4" />
          <span>Add Entry</span>
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
}

function EntryForm({ entry, date, workTypes, onSave }: EntryFormProps) {
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

      <Button onClick={handleSave} className="w-full">Save Entry</Button>
    </div>
  );
} 