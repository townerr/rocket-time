"use client";

import { useState } from "react";
import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { Clock, MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import { getContrastColor } from "./utils/helpers";
import { EntryForm } from "./EntryForm";
import { type DayEntryProps } from "./utils/types";

export function DayEntry({ entry, workTypes, onSave, onDelete }: DayEntryProps) {
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const backgroundColor = entry.type.color || "#888888";
  const borderColor = entry.type.borderColor || "#666666";
  const textColor = getContrastColor(backgroundColor);

  return (
    <div className="w-full">
      <div
        className="rounded-md shadow-sm overflow-hidden"
        style={{ 
          backgroundColor: backgroundColor,
          border: `1px solid ${borderColor}`,
          color: textColor,
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
                  style={{ color: textColor }}
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
              style={{ backgroundColor: `${textColor === '#000000' ? 'rgba(0,0,0,0.05)' : 'rgba(255,255,255,0.15)'}` }}
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
            onSave={(values: {
              date: Date;
              workTypeId: string;
              hours: number;
              projectCode?: string | null;
            }) => {
              onSave({ id: entry.id, ...values });
              setEditDialogOpen(false);
            }}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
} 