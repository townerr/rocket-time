"use client";

import { format } from "date-fns";
import { api } from "~/trpc/react";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import { Skeleton } from "~/components/ui/skeleton";
import { Progress } from "~/components/ui/progress";

export default function BalancesPage() {
  const { data, isLoading } = api.profile.getBalances.useQuery();

  if (isLoading) {
    return <BalancesSkeleton />;
  }

  const totalSickHours = 40; // Maximum sick hours per year
  const totalVacationHours = 120; // Maximum vacation hours per year

  return (
    <div className="container mx-auto py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <Card>
          <CardHeader>
            <CardTitle className="text-xl font-semibold">Sick Leave</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="text-3xl font-bold">
                {data?.balances?.sickBalance} hours
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm text-gray-500">
                  <span>Used: {totalSickHours - (data?.balances?.sickBalance ?? 0)} hours</span>
                  <span>Total: {totalSickHours} hours</span>
                </div>
                <Progress
                  value={(data?.balances?.sickBalance ?? 0) / totalSickHours * 100}
                  className="h-2"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-xl font-semibold">Vacation Leave</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="text-3xl font-bold">
                {data?.balances?.vacationBalance} hours
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm text-gray-500">
                  <span>Used: {totalVacationHours - (data?.balances?.vacationBalance ?? 0)} hours</span>
                  <span>Total: {totalVacationHours} hours</span>
                </div>
                <Progress
                  value={(data?.balances?.vacationBalance ?? 0) / totalVacationHours * 100}
                  className="h-2"
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-xl font-semibold">Leave History</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Hours</TableHead>
                  <TableHead>Week</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data?.history.map((entry) => (
                  <TableRow key={entry.id}>
                    <TableCell>{format(entry.date, 'MMM d, yyyy')}</TableCell>
                    <TableCell>
                      <span
                        className={`inline-block px-2 py-1 rounded text-sm ${
                          entry.type === 'Vacation'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-orange-100 text-orange-800'
                        }`}
                      >
                        {entry.type}
                      </span>
                    </TableCell>
                    <TableCell>{entry.hours} hours</TableCell>
                    <TableCell>
                      {format(entry.timesheet.weekStart, 'MMM d')} -{' '}
                      {format(entry.timesheet.weekEnd, 'MMM d, yyyy')}
                    </TableCell>
                    <TableCell>
                      <span
                        className={`inline-block px-2 py-1 rounded text-sm ${
                          entry.timesheet.status === 'pending'
                            ? 'bg-yellow-100 text-yellow-800'
                            : entry.timesheet.status
                            ? 'bg-green-100 text-green-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {entry.timesheet.status || 'Draft'}
                      </span>
                    </TableCell>
                  </TableRow>
                ))}
                {data?.history.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center text-gray-500">
                      No leave history found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function BalancesSkeleton() {
  return (
    <div className="container mx-auto py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <Card>
          <CardHeader>
            <CardTitle className="text-xl font-semibold">Sick Leave</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Skeleton className="h-8 w-32" />
              <div className="space-y-2">
                <div className="flex justify-between">
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-4 w-20" />
                </div>
                <Skeleton className="h-2 w-full" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-xl font-semibold">Vacation Leave</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Skeleton className="h-8 w-32" />
              <div className="space-y-2">
                <div className="flex justify-between">
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-4 w-20" />
                </div>
                <Skeleton className="h-2 w-full" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-xl font-semibold">Leave History</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
