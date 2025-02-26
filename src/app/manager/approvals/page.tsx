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
import { CheckCircle, XCircle } from "lucide-react";
import { useToast } from "~/hooks/use-toast";
import type { Timesheet, Entry, WorkType } from "@prisma/client";

// Define types for our timesheets
type TimesheetWithEntries = Timesheet & {
  entries: Entry[];
};

export default function ApprovalsPage() {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("draft");
  
  const { data: employees, isLoading: employeesLoading } = api.manager.getEmployees.useQuery();
  
  // Prefetch all employee timesheets
  const { data: timesheets, isLoading: timesheetsLoading, refetch: refetchTimesheets } = 
    api.manager.getAllEmployeeTimesheets.useQuery(undefined, {
      enabled: !!employees,
    });
  
  const approveTimesheet = api.manager.approveTimesheet.useMutation({
    onSuccess: () => {
      toast({
        title: "Timesheet approved",
        description: "The timesheet has been approved successfully.",
      });
      void refetchTimesheets();
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
  });

  // Filter timesheets by status
  const draftTimesheets = timesheets?.filter(
    (timesheet: TimesheetWithEntries) => timesheet.status === "pending"
  ) || [];
  
  const approvedTimesheets = timesheets?.filter(
    (timesheet: TimesheetWithEntries) => timesheet.status === "approved"
  ) || [];

  const handleApprove = (timesheetId: string) => {
    approveTimesheet.mutate({ timesheetId });
  };

  const handleReject = (timesheetId: string) => {
    rejectTimesheet.mutate({ timesheetId });
  };

  if (employeesLoading || timesheetsLoading) {
    return (
      <div className="container mx-auto py-8 px-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl font-bold">Timesheet Approvals</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-96 flex items-center justify-center">
              <div className="text-center">
                <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
                <p>Loading timesheets...</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Timesheet Approvals</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="draft" value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-4">
              <TabsTrigger value="draft">
                Pending Approval
                {draftTimesheets.length > 0 && (
                  <Badge className="ml-2" variant="secondary">
                    {draftTimesheets.length}
                  </Badge>
                )}
              </TabsTrigger>
              <TabsTrigger value="approved">
                Approved
                {approvedTimesheets.length > 0 && (
                  <Badge className="ml-2" variant="secondary">
                    {approvedTimesheets.length}
                  </Badge>
                )}
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="draft" className="space-y-4">
              {draftTimesheets.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  No timesheets pending approval
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Employee</TableHead>
                      <TableHead>Week</TableHead>
                      <TableHead className="text-right">Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {draftTimesheets.map((timesheet: TimesheetWithEntries) => (
                      <TableRow key={timesheet.id}>
                        <TableCell className="font-medium">
                          {employees?.find(emp => emp.id === timesheet.userId)?.name || "Unknown"}
                        </TableCell>
                        <TableCell>
                          {format(new Date(timesheet.weekStart), "MMM d")} - {format(new Date(timesheet.weekEnd), "MMM d, yyyy")}
                        </TableCell>
                        <TableCell className="text-right">
                          <Badge variant="secondary">Pending</Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              className="h-8 gap-1"
                              onClick={() => handleApprove(timesheet.id)}
                              disabled={approveTimesheet.isPending}
                            >
                              <CheckCircle className="h-4 w-4" />
                              Approve
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              className="h-8 gap-1 text-destructive hover:text-destructive"
                              onClick={() => handleReject(timesheet.id)}
                              disabled={rejectTimesheet.isPending}
                            >
                              <XCircle className="h-4 w-4" />
                              Reject
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </TabsContent>
            
            <TabsContent value="approved" className="space-y-4">
              {approvedTimesheets.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  No approved timesheets
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Employee</TableHead>
                      <TableHead>Week</TableHead>
                      <TableHead className="text-right">Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {approvedTimesheets.map((timesheet: TimesheetWithEntries) => (
                      <TableRow key={timesheet.id}>
                        <TableCell className="font-medium">
                          {employees?.find(emp => emp.id === timesheet.userId)?.name || "Unknown"}
                        </TableCell>
                        <TableCell>
                          {format(new Date(timesheet.weekStart), "MMM d")} - {format(new Date(timesheet.weekEnd), "MMM d, yyyy")}
                        </TableCell>
                        <TableCell className="text-right">
                          <Badge className="bg-green-100 text-green-800">Approved</Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
