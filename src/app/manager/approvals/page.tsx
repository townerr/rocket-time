"use client";

import { useState } from "react";
import { api } from "~/trpc/react";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import { Button } from "~/components/ui/button";
import { Badge } from "~/components/ui/badge";
import { format } from "date-fns";
import { CheckCircle, XCircle, User, Calendar, Clock } from "lucide-react";
import { useToast } from "~/hooks/use-toast";
import type { Timesheet, Entry, WorkType } from "@prisma/client";

// Define types for our data
type TimesheetWithEntries = Timesheet & {
  entries: Entry[];
  employeeName?: string;
  status?: string | null;
  submitted?: boolean;
  approved?: boolean;
  rejected?: boolean;
  user?: {
    id: string;
    name: string | null;
  };
};

type Employee = {
  id: string;
  name: string;
  email: string;
};

type TimesheetStatus = "draft" | "pending" | "approved" | "rejected";

// Function to format date ranges
const formatDateRange = (startDate: Date) => {
  const endDate = new Date(startDate);
  endDate.setDate(endDate.getDate() + 6);
  return `${format(startDate, "MMM d")} - ${format(endDate, "MMM d, yyyy")}`;
};

// Component for status badge
const StatusBadge = ({ status }: { status: TimesheetStatus }) => {
  const statusConfig = {
    draft: {
      label: "Draft",
      className:
        "bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-300",
    },
    pending: {
      label: "Pending Approval",
      className:
        "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-500",
    },
    approved: {
      label: "Approved",
      className:
        "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-500",
    },
    rejected: {
      label: "Rejected",
      className: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-500",
    },
  };

  const config = statusConfig[status];
  return <Badge className={config.className}>{config.label}</Badge>;
};

// Helper to determine timesheet status
const getTimesheetStatus = (
  timesheet: TimesheetWithEntries,
): TimesheetStatus => {
  if (
    timesheet.submitted === false ||
    timesheet.status === "draft" ||
    !timesheet.status
  )
    return "draft";
  if (timesheet.approved || timesheet.status === "approved") return "approved";
  if (timesheet.rejected || timesheet.status === "rejected") return "rejected";
  return "pending";
};

// Component for the timesheet table
const TimesheetsTable = ({
  timesheets,
  status,
  onApprove,
  onReject,
}: {
  timesheets: TimesheetWithEntries[];
  status: TimesheetStatus;
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
}) => {
  const filteredTimesheets = timesheets.filter((timesheet) => {
    const timesheetStatus = getTimesheetStatus(timesheet);
    return timesheetStatus === status;
  });

  if (filteredTimesheets.length === 0) {
    return (
      <div className="py-8 text-center text-gray-500">
        No timesheets found with {status} status.
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[180px]">Employee</TableHead>
          <TableHead>Period</TableHead>
          <TableHead>Hours</TableHead>
          <TableHead>Status</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {filteredTimesheets.map((timesheet) => {
          // Calculate total hours
          const totalHours = timesheet.entries.reduce(
            (acc, entry) => acc + entry.hours,
            0,
          );

          // Get timesheet status
          const timesheetStatus = getTimesheetStatus(timesheet);

          return (
            <TableRow key={timesheet.id}>
              <TableCell className="font-medium">
                <div className="flex items-center space-x-2">
                  <User className="h-4 w-4 text-gray-500" />
                  <span>{timesheet.employeeName || "Unknown Employee"}</span>
                </div>
              </TableCell>
              <TableCell>
                <div className="flex items-center space-x-2">
                  <Calendar className="h-4 w-4 text-gray-500" />
                  <span>{formatDateRange(timesheet.weekStart)}</span>
                </div>
              </TableCell>
              <TableCell>
                <div className="flex items-center space-x-2">
                  <Clock className="h-4 w-4 text-gray-500" />
                  <span>{totalHours.toFixed(1)}</span>
                </div>
              </TableCell>
              <TableCell>
                <StatusBadge status={timesheetStatus} />
              </TableCell>
              <TableCell className="text-right">
                {timesheetStatus === "pending" && (
                  <div className="flex justify-end space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onApprove(timesheet.id)}
                      className="border-green-200 text-green-600 hover:bg-green-50 hover:text-green-700 dark:border-green-900 dark:hover:bg-green-900/20"
                    >
                      <CheckCircle className="mr-1 h-4 w-4" />
                      Approve
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onReject(timesheet.id)}
                      className="border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700 dark:border-red-900 dark:hover:bg-red-900/20"
                    >
                      <XCircle className="mr-1 h-4 w-4" />
                      Reject
                    </Button>
                  </div>
                )}
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
};

export default function ApprovalsPage() {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<TimesheetStatus>("pending");

  const { data: employees, isLoading: employeesLoading } =
    api.manager.getEmployees.useQuery();

  // Fetch all employee timesheets
  const {
    data: timesheets = [],
    isLoading: timesheetsLoading,
    refetch: refetchTimesheets,
  } = api.manager.getAllEmployeeTimesheets.useQuery(undefined, {
    enabled: !!employees,
    select: (data) =>
      data.map((timesheet) => ({
        ...timesheet,
        employeeName: timesheet.user?.name || "Unknown Employee",
      })) as TimesheetWithEntries[],
  });

  const approveTimesheet = api.manager.approveTimesheet.useMutation({
    onSuccess: () => {
      toast({
        title: "Timesheet approved",
        description: "The timesheet has been approved successfully.",
      });
      void refetchTimesheets();
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const rejectTimesheet = api.manager.rejectTimesheet.useMutation({
    onSuccess: () => {
      toast({
        title: "Timesheet rejected",
        description: "The timesheet has been rejected.",
      });
      void refetchTimesheets();
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleApprove = (timesheetId: string) => {
    approveTimesheet.mutate({ timesheetId });
  };

  const handleReject = (timesheetId: string) => {
    rejectTimesheet.mutate({ timesheetId });
  };

  const isLoading = employeesLoading || timesheetsLoading;

  return (
    <Card className="mx-auto max-w-5xl">
      <CardHeader>
        <CardTitle>Timesheet Approvals</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex justify-center py-8">
            <div className="animate-pulse space-y-4">
              <div className="h-4 w-64 rounded bg-gray-200 dark:bg-gray-700"></div>
              <div className="h-40 rounded bg-gray-200 dark:bg-gray-700"></div>
            </div>
          </div>
        ) : (
          <Tabs
            defaultValue="pending"
            value={activeTab}
            onValueChange={(value) => setActiveTab(value as TimesheetStatus)}
          >
            <TabsList className="mb-4">
              <TabsTrigger value="pending">Pending Approval</TabsTrigger>
              <TabsTrigger value="approved">Approved</TabsTrigger>
              <TabsTrigger value="rejected">Rejected</TabsTrigger>
              <TabsTrigger value="draft">Drafts</TabsTrigger>
            </TabsList>

            <TabsContent value="pending">
              <TimesheetsTable
                timesheets={timesheets}
                status="pending"
                onApprove={handleApprove}
                onReject={handleReject}
              />
            </TabsContent>

            <TabsContent value="approved">
              <TimesheetsTable
                timesheets={timesheets}
                status="approved"
                onApprove={handleApprove}
                onReject={handleReject}
              />
            </TabsContent>

            <TabsContent value="rejected">
              <TimesheetsTable
                timesheets={timesheets}
                status="rejected"
                onApprove={handleApprove}
                onReject={handleReject}
              />
            </TabsContent>

            <TabsContent value="draft">
              <TimesheetsTable
                timesheets={timesheets}
                status="draft"
                onApprove={handleApprove}
                onReject={handleReject}
              />
            </TabsContent>
          </Tabs>
        )}
      </CardContent>
    </Card>
  );
}
