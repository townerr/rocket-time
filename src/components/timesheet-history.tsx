"use client";

import { format } from "date-fns";
import { motion, AnimatePresence } from "framer-motion";
import { CalendarDays, Clock, ChevronDown, FileText, Tag } from "lucide-react";
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
    <Card className="shadow-md">
      <CardHeader className="bg-gradient-to-r from-indigo-50 to-blue-50 dark:from-indigo-950/50 dark:to-blue-950/50 rounded-t-lg border-b">
        <CardTitle className="flex items-center text-2xl font-bold">
          <CalendarDays className="mr-2 h-5 w-5 text-indigo-500" /> 
          Timesheet History
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <Accordion type="single" collapsible className="w-full">
          {timesheets.length === 0 ? (
            <div className="py-12 text-center">
              <FileText className="h-12 w-12 text-gray-300 mx-auto mb-3" />
              <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300">No timesheets found</h3>
              <p className="text-gray-500 dark:text-gray-400 mt-1">Your submitted timesheets will appear here</p>
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

function TimesheetCard({ timesheet }: { 
  timesheet: Timesheet & { 
    entries: (Entry & { type: WorkType })[] 
  } 
}) {
  const totalHours = timesheet.entries.reduce((sum, entry) => sum + entry.hours, 0);
  
  // Group entries by date for better organization
  const entriesByDate = timesheet.entries.reduce((groups, entry) => {
    const date = format(new Date(entry.date), "yyyy-MM-dd");
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(entry);
    return groups;
  }, {} as Record<string, (Entry & { type: WorkType })[]>);
  
  return (
    <AccordionItem
      value={timesheet.id}
      className="border-b last:border-b-0"
    >
      <AccordionTrigger className="px-6 py-4 hover:no-underline hover:bg-gray-50 dark:hover:bg-gray-900/20 group transition-colors">
        <div className="flex flex-1 items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-indigo-100 dark:bg-indigo-900/50 flex items-center justify-center">
              <CalendarDays className="h-5 w-5 text-indigo-500" />
            </div>
            <div className="text-left">
              <div className="font-medium text-base">
                {format(new Date(timesheet.weekStart), "MMM d")} - {format(new Date(timesheet.weekEnd), "MMM d, yyyy")}
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
              className={`text-xs px-2 py-1 ${
                timesheet.status === "pending" 
                  ? "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300" 
                  : "bg-gray-100 text-gray-800 dark:bg-gray-800/50 dark:text-gray-300"
              }`}
            >
              {timesheet.status === "pending" ? "Pending" : "Draft"}
            </Badge>
            <ChevronDown className="h-4 w-4 text-muted-foreground transition-transform duration-200 group-data-[state=open]:rotate-180" />
          </div>
        </div>
      </AccordionTrigger>
      <AccordionContent className="overflow-hidden">
        <div className="px-6 py-4 space-y-4">
          <AnimatePresence>
            {Object.entries(entriesByDate).map(([date, entries]) => (
              <motion.div
                key={date}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <div className="mb-2 font-medium text-sm text-gray-600 dark:text-gray-400">
                  {format(new Date(date), "EEEE, MMMM d")}
                </div>
                <div className="space-y-2">
                  {entries.map((entry) => (
                    <div
                      key={entry.id}
                      className="flex items-center justify-between rounded-lg p-3"
                      style={{
                        backgroundColor: `${entry.type.color}15`,
                        border: `1px solid ${entry.type.borderColor}40`,
                      }}
                    >
                      <div className="flex items-center gap-3">
                        <div 
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: entry.type.color }}
                        />
                        <div>
                          <div className="font-medium">{entry.type.name}</div>
                          {entry.projectCode && (
                            <div className="text-xs text-muted-foreground flex items-center mt-1">
                              <Tag className="w-3 h-3 mr-1" />
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
          
          <div className="flex justify-between items-center pt-2">
            <span className="text-sm text-muted-foreground">
              Submitted {timesheet.status ? format(new Date(timesheet.updatedAt), "MMM d, yyyy") : "Not yet"}
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
      <CardHeader className="bg-gradient-to-r from-indigo-50 to-blue-50 dark:from-indigo-950/50 dark:to-blue-950/50 rounded-t-lg border-b">
        <CardTitle className="text-2xl font-bold">Timesheet History</CardTitle>
      </CardHeader>
      <CardContent className="p-6 space-y-6">
        {[1, 2, 3].map((i) => (
          <div key={i} className="border rounded-lg p-4 space-y-4">
            <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
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