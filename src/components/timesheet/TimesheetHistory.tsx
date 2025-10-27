"use client";

import { format } from "date-fns";
import { motion, AnimatePresence } from "framer-motion";
import { CalendarDays, Clock, FileText, Tag } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "~/components/ui/accordion";
import { Badge } from "~/components/ui/badge";
import { Skeleton } from "~/components/ui/skeleton";
import { Separator } from "~/components/ui/separator";
import type { Timesheet, Entry, WorkType } from "@prisma/client";
import { type TimesheetHistoryProps } from "./utils/types";

export function TimesheetHistory({
  timesheets,
  isLoading,
}: TimesheetHistoryProps) {
  if (isLoading) {
    return <TimesheetHistorySkeleton />;
  }

  return (
    <Card className="shadow-md">
      <CardHeader className="rounded-t-lg border-b bg-gradient-to-r from-indigo-50 to-blue-50 dark:from-indigo-950/50 dark:to-blue-950/50">
        <CardTitle className="flex items-center text-2xl font-bold">
          <CalendarDays className="mr-2 h-5 w-5 text-indigo-500" />
          Timesheet History
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <Accordion type="single" collapsible className="w-full">
          {timesheets.length === 0 ? (
            <div className="py-12 text-center">
              <FileText className="mx-auto mb-3 h-12 w-12 text-gray-300" />
              <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300">
                No timesheets found
              </h3>
              <p className="mt-1 text-gray-500 dark:text-gray-400">
                Your submitted timesheets will appear here
              </p>
            </div>
          ) : (
            timesheets.map((timesheet) => (
              <TimesheetCard key={timesheet.id} timesheet={timesheet} />
            ))
          )}
        </Accordion>
      </CardContent>
    </Card>
  );
}

function TimesheetCard({
  timesheet,
}: {
  timesheet: Timesheet & {
    entries: (Entry & { type: WorkType })[];
  };
}) {
  const totalHours = timesheet.entries.reduce(
    (sum, entry) => sum + entry.hours,
    0,
  );

  // Group entries by date for better organization
  const entriesByDate = timesheet.entries.reduce(
    (groups, entry) => {
      const date = format(new Date(entry.date), "yyyy-MM-dd");
      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].push(entry);
      return groups;
    },
    {} as Record<string, (Entry & { type: WorkType })[]>,
  );

  return (
    <AccordionItem value={timesheet.id} className="border-b last:border-b-0">
      <AccordionTrigger className="group px-6 py-4 transition-colors hover:bg-gray-50 hover:no-underline dark:hover:bg-gray-900/20">
        <div className="flex flex-1 items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-100 dark:bg-indigo-900/50">
              <CalendarDays className="h-5 w-5 text-indigo-500" />
            </div>
            <div className="text-left">
              <div className="text-base font-medium">
                {format(new Date(timesheet.weekStart), "MMM d")} -{" "}
                {format(new Date(timesheet.weekEnd), "MMM d, yyyy")}
              </div>
              <div className="flex items-center text-sm text-muted-foreground">
                <Clock className="mr-1 h-3.5 w-3.5" />
                {totalHours} hours total
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Badge
              variant={timesheet.status === "pending" ? "secondary" : "outline"}
              className={`mr-2 px-2 py-1 text-xs ${
                timesheet.status === "pending"
                  ? "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300"
                  : "bg-gray-100 text-gray-800 dark:bg-gray-800/50 dark:text-gray-300"
              }`}
            >
              {timesheet.status === "pending" ? "Pending" : "Draft"}
            </Badge>
          </div>
        </div>
      </AccordionTrigger>
      <AccordionContent className="overflow-hidden">
        <div className="space-y-4 px-6 py-4">
          <AnimatePresence>
            {Object.entries(entriesByDate).map(([date, entries]) => (
              <motion.div
                key={date}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <div className="mb-2 text-sm font-medium text-gray-600 dark:text-gray-400">
                  {format(new Date(date), "EEEE, MMMM d")}
                </div>
                <div className="space-y-2">
                  {entries.map((entry) => (
                    <div
                      key={entry.id}
                      className="flex items-center justify-between rounded-lg p-3"
                      style={{
                        backgroundColor: `${entry.type.color}15`,
                        border: `1px solid ${entry.type.color}40`,
                      }}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className="h-3 w-3 rounded-full"
                          style={{ backgroundColor: entry.type.color }}
                        />
                        <div>
                          <div className="font-medium">{entry.type.name}</div>
                          {entry.projectCode && (
                            <div className="mt-1 flex items-center text-xs text-muted-foreground">
                              <Tag className="mr-1 h-3 w-3" />
                              {entry.projectCode}
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="font-medium">{entry.hours} hours</div>
                    </div>
                  ))}
                </div>
                <Separator className="mt-4" />
              </motion.div>
            ))}
          </AnimatePresence>

          <div className="flex items-center justify-between pt-2">
            <span className="text-sm text-muted-foreground">
              Submitted{" "}
              {timesheet.status === "pending"
                ? format(new Date(timesheet.updatedAt), "MMM d, yyyy")
                : "Not yet"}
            </span>
            <div className="text-right text-sm">
              <span className="font-medium">Total Hours:</span> {totalHours}
            </div>
          </div>
        </div>
      </AccordionContent>
    </AccordionItem>
  );
}

function TimesheetHistorySkeleton() {
  return (
    <Card className="shadow-md">
      <CardHeader className="rounded-t-lg border-b bg-gradient-to-r from-indigo-50 to-blue-50 dark:from-indigo-950/50 dark:to-blue-950/50">
        <CardTitle className="text-2xl font-bold">Timesheet History</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6 p-6">
        {[1, 2, 3].map((i) => (
          <div key={i} className="space-y-4 rounded-lg border p-4">
            <div className="flex flex-col items-start gap-4 md:flex-row md:items-center">
              <div className="flex items-center gap-3">
                <Skeleton className="h-10 w-10 rounded-full" />
                <div className="space-y-2">
                  <Skeleton className="h-5 w-40" />
                  <Skeleton className="h-4 w-20" />
                </div>
              </div>
              <div className="ml-auto">
                <Skeleton className="h-6 w-20" />
              </div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
