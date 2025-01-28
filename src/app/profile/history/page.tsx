"use client";

import { useState } from "react";
import { format } from "date-fns";
import { api } from "~/trpc/react";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "~/components/ui/accordion";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import { Skeleton } from "~/components/ui/skeleton";
import { Badge } from "~/components/ui/badge";

const ENTRY_TYPE_COLORS = {
  Project: 'bg-blue-100 text-blue-800 hover:bg-blue-100',
  Vacation: 'bg-green-100 text-green-800 hover:bg-green-100',
  Sick: 'bg-orange-100 text-orange-800 hover:bg-orange-100',
  Holiday: 'bg-purple-100 text-purple-800 hover:bg-purple-100',
} as const;

const STATUS_COLORS = {
  pending: 'bg-yellow-100 text-yellow-800 hover:bg-yellow-100',
  approved: 'bg-green-100 text-green-800 hover:bg-green-100',
  rejected: 'bg-red-100 text-red-800 hover:bg-red-100',
  draft: 'bg-gray-100 text-gray-800 hover:bg-gray-100',
} as const;

export default function HistoryPage() {
  const { data: timesheets, isLoading } = api.profile.getTimesheetHistory.useQuery();

  if (isLoading) {
    return <HistorySkeleton />;
  }

  return (
    <div className="container mx-auto py-8">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Timesheet History</CardTitle>
        </CardHeader>
        <CardContent>
          <Accordion type="single" collapsible className="space-y-4">
            {timesheets?.map((timesheet) => {
              const totalHours = timesheet.entries.reduce(
                (sum, entry) => sum + entry.hours,
                0
              );

              return (
                <AccordionItem
                  key={timesheet.id}
                  value={timesheet.id}
                  className="border rounded-lg px-4"
                >
                  <AccordionTrigger className="py-4 hover:no-underline">
                    <div className="flex flex-col md:flex-row w-full items-start md:items-center gap-4 text-left">
                      <div className="flex-1">
                        <div className="font-semibold">
                          {format(timesheet.weekStart, "MMM d")} -{" "}
                          {format(timesheet.weekEnd, "MMM d, yyyy")}
                        </div>
                        <div className="text-sm text-gray-500">
                          {totalHours} hours total
                        </div>
                      </div>
                      <Badge
                        variant="secondary"
                        className={`${
                          STATUS_COLORS[
                            (timesheet.status?.toLowerCase() ?? "draft") as keyof typeof STATUS_COLORS
                          ]
                        }`}
                      >
                        {timesheet.status || "Draft"}
                      </Badge>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="overflow-x-auto pb-4">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Date</TableHead>
                            <TableHead>Type</TableHead>
                            <TableHead>Hours</TableHead>
                            <TableHead>Details</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {timesheet.entries.map((entry) => (
                            <TableRow key={entry.id}>
                              <TableCell>
                                {format(entry.date, "MMM d, yyyy")}
                              </TableCell>
                              <TableCell>
                                <Badge
                                  variant="secondary"
                                  className={`${
                                    ENTRY_TYPE_COLORS[
                                      entry.type as keyof typeof ENTRY_TYPE_COLORS
                                    ]
                                  }`}
                                >
                                  {entry.type}
                                </Badge>
                              </TableCell>
                              <TableCell>{entry.hours} hours</TableCell>
                              <TableCell>
                                {entry.projectCode && (
                                  <span className="text-sm text-gray-600">
                                    Project: {entry.projectCode}
                                  </span>
                                )}
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              );
            })}

            {timesheets?.length === 0 && (
              <div className="text-center text-gray-500 py-8">
                No timesheet history found
              </div>
            )}
          </Accordion>
        </CardContent>
      </Card>
    </div>
  );
}

function HistorySkeleton() {
  return (
    <div className="container mx-auto py-8">
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
    </div>
  );
}
