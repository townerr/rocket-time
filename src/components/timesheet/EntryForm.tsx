"use client";

import { useState, useEffect } from "react";
import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { type EntryFormProps } from "./utils/types";

export function EntryForm({ entry, date, workTypes, onSave }: EntryFormProps) {
  const [workTypeId, setWorkTypeId] = useState(entry?.workTypeId ?? "");
  const [projectCode, setProjectCode] = useState(entry?.projectCode ?? "");
  const [hours, setHours] = useState(entry?.hours?.toString() ?? "");

  // Update form values when entry changes
  useEffect(() => {
    if (entry) {
      setWorkTypeId(entry.workTypeId);
      setProjectCode(entry.projectCode ?? "");
      setHours(entry.hours.toString());
    }
  }, [entry]);

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