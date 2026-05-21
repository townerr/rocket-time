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

import {
  getStatusBadgeClasses,
  getStatusLabel,
  type TimesheetStatus,
} from "~/lib/status-colors";

// Function to format date ranges
const formatDateRange = (startDate: Date) => {
  const endDate = new Date(startDate);
  endDate.setDate(endDate.getDate() + 6);
  return `${format(startDate, "MMM d")} - ${format(endDate, "MMM d, yyyy")}`;
};

// Component for status badge
const StatusBadge = ({ status }: { status: TimesheetStatus }) => {
  return (
    <Badge className={getStatusBadgeClasses(status)}>
      {getStatusLabel(status)}
    </Badge>
  );
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
      <div className="py-8 text-center text-muted-foreground">
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
                  <User className="h-4 w-4 text-primary" />
                  <span>{timesheet.employeeName || "Unknown Employee"}</span>
                </div>
              </TableCell>
              <TableCell>
                <div className="flex items-center space-x-2">
                  <Calendar className="h-4 w-4 text-primary" />
                  <span>{formatDateRange(timesheet.weekStart)}</span>
                </div>
              </TableCell>
              <TableCell>
                <div className="flex items-center space-x-2">
                  <Clock className="h-4 w-4 text-primary" />
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
                      className="border-status-approved/30 text-status-approved hover:bg-status-approved-bg hover:text-status-approved"
                    >
                      <CheckCircle className="mr-1 h-4 w-4" />
                      Approve
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onReject(timesheet.id)}
                      className="border-status-rejected/30 text-status-rejected hover:bg-status-rejected-bg hover:text-status-rejected"
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
    <Card className="mx-auto max-w-5xl overflow-hidden border-t-4 border-t-primary shadow-brand">
      <CardHeader className="bg-secondary/50">
        <CardTitle>Timesheet Approvals</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex justify-center py-8">
            <div className="animate-pulse space-y-4">
              <div className="h-4 w-64 rounded bg-muted"></div>
              <div className="h-40 rounded bg-muted"></div>
            </div>
          </div>
        ) : (
          <Tabs
            defaultValue="pending"
            value={activeTab}
            onValueChange={(value) => setActiveTab(value as TimesheetStatus)}
          >
            <TabsList className="mb-4 bg-secondary">
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
