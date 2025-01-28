import { format } from "date-fns";
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

interface LeaveHistoryEntry {
  id: string;
  date: Date;
  type: string;
  hours: number;
  timesheet: {
    weekStart: Date;
    weekEnd: Date;
    status: string | null;
  };
}

interface LeaveHistoryProps {
  history: LeaveHistoryEntry[];
  isLoading?: boolean;
}

export function LeaveHistory({ history, isLoading }: LeaveHistoryProps) {
  if (isLoading) {
    return <LeaveHistorySkeleton />;
  }

  return (
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
              {history.map((entry) => (
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
              {history.length === 0 && (
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
  );
}

function LeaveHistorySkeleton() {
  return (
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
  );
} 