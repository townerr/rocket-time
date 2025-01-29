"use client";

import { format } from "date-fns";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "~/components/ui/accordion";
import { Badge } from "~/components/ui/badge";
import { Skeleton } from "~/components/ui/skeleton";
import type { Timesheet, Entry, WorkType } from "@prisma/client";

interface TimesheetHistoryProps {
  timesheets: (Timesheet & {
    entries: (Entry & {
      type: WorkType;
    })[];
  })[];
  isLoading: boolean;
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
          {timesheets.map((timesheet) => (
            <AccordionItem
              key={timesheet.id}
              value={timesheet.id}
              className="border rounded-lg px-6"
            >
              <AccordionTrigger className="hover:no-underline">
                <div className="flex flex-1 items-center justify-between pr-4">
                  <div className="flex flex-col gap-1">
                    <div className="font-semibold">
                      {format(new Date(timesheet.weekStart), "MMM d")} -{" "}
                      {format(new Date(timesheet.weekEnd), "MMM d, yyyy")}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Total Hours: {timesheet.entries.reduce((sum, entry) => sum + entry.hours, 0)}
                    </div>
                  </div>
                  <Badge
                    variant={timesheet.status === "pending" ? "secondary" : "outline"}
                  >
                    {timesheet.status === "pending" ? "Pending" : "Draft"}
                  </Badge>
                </div>
              </AccordionTrigger>
              <AccordionContent className="pt-4 pb-2">
                <div className="space-y-4">
                  {timesheet.entries.map((entry) => (
                    <div
                      key={entry.id}
                      className="flex items-center justify-between rounded-lg p-3"
                      style={{
                        backgroundColor: `${entry.type.color}20`,
                        border: `1px solid ${entry.type.borderColor}`,
                      }}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: entry.type.color }}
                        />
                        <div className="flex flex-col gap-1">
                          <div className="font-medium">{entry.type.name}</div>
                          {entry.projectCode && (
                            <div className="text-sm py-1">
                            Project Code: <span className="bg-black/5 px-2 py-1 rounded">{entry.projectCode}</span>
                            </div>
                          )}
                          <div className="text-sm text-muted-foreground">
                            {format(new Date(entry.date), "EEEE, MMM d")}
                          </div>
                        </div>
                      </div>
                      <div className="font-medium">{entry.hours} hours</div>
                    </div>
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}

          {timesheets.length === 0 && (
            <div className="text-center text-muted-foreground py-8">
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