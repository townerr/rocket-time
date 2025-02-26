"use client";

import { useState, useMemo } from "react";
import { api } from "~/trpc/react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "~/components/ui/select";
import { startOfMonth, endOfMonth, startOfWeek, endOfWeek, format, subMonths } from "date-fns";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { Loader2, FileBarChart, AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "~/components/ui/alert";

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

// Default placeholder data for empty charts
const DEFAULT_EMPLOYEE_DATA = [
  { name: "No data", hours: 0 }
];

const DEFAULT_PROJECT_DATA = [
  { name: "No data", value: 1 }
];

const DEFAULT_STATUS_DATA = [
  { name: "Draft", value: 0 },
  { name: "Pending Approval", value: 0 },
  { name: "Approved", value: 0 }
];

// Define types for our chart data
interface EmployeeHoursData {
  name: string;
  hours: number;
}

interface ProjectDistributionData {
  name: string;
  value: number;
}

interface StatusData {
  name: string;
  value: number;
}

export default function AnalyticsPage() {
  const [timeRange, setTimeRange] = useState<"week" | "month" | "quarter">("month");
  
  // Calculate date range based on selection
  const getDateRange = () => {
    const now = new Date();
    
    switch (timeRange) {
      case "week":
        return {
          start: startOfWeek(now, { weekStartsOn: 1 }),
          end: endOfWeek(now, { weekStartsOn: 1 }),
          label: `Week of ${format(startOfWeek(now, { weekStartsOn: 1 }), 'MMM d, yyyy')}`
        };
      case "quarter":
        const threeMonthsAgo = subMonths(now, 3);
        return {
          start: startOfMonth(threeMonthsAgo),
          end: endOfMonth(now),
          label: `${format(startOfMonth(threeMonthsAgo), 'MMM d, yyyy')} - ${format(endOfMonth(now), 'MMM d, yyyy')}`
        };
      case "month":
      default:
        return {
          start: startOfMonth(now),
          end: endOfMonth(now),
          label: format(now, 'MMMM yyyy')
        };
    }
  };
  
  const dateRange = getDateRange();
  
  // Using our new analytics-specific TRPC routes
  const { 
    data: employeeHoursData, 
    isLoading: employeeHoursLoading,
    error: employeeHoursError
  } = api.manager.getEmployeeHoursStats.useQuery({
    startDate: dateRange.start,
    endDate: dateRange.end
  });
  
  const { 
    data: projectDistributionData, 
    isLoading: projectDistributionLoading,
    error: projectDistributionError
  } = api.manager.getProjectDistribution.useQuery({
    startDate: dateRange.start,
    endDate: dateRange.end
  });
  
  const { 
    data: timesheetStatusData, 
    isLoading: timesheetStatusLoading,
    error: timesheetStatusError
  } = api.manager.getTimesheetStatusStats.useQuery({
    startDate: dateRange.start,
    endDate: dateRange.end
  });
  
  const isLoading = employeeHoursLoading || projectDistributionLoading || timesheetStatusLoading;
  const hasError = employeeHoursError || projectDistributionError || timesheetStatusError;
  
  // Check if we have data with actual values (not just zeros)
  const hasEmployeeData = employeeHoursData && employeeHoursData.length > 0 && 
    employeeHoursData.some(item => item.hours > 0);

  const hasProjectData = projectDistributionData && projectDistributionData.length > 0 &&
    projectDistributionData.some(item => item.value > 0);

  const hasStatusData = timesheetStatusData && timesheetStatusData.length > 0 && 
    timesheetStatusData.some(item => item.value > 0);
    
  // Use empty state data if we don't have real data
  const displayedEmployeeData = hasEmployeeData ? employeeHoursData : DEFAULT_EMPLOYEE_DATA;
  const displayedProjectData = hasProjectData ? projectDistributionData : DEFAULT_PROJECT_DATA;
  const displayedStatusData = hasStatusData ? timesheetStatusData : DEFAULT_STATUS_DATA;
  
  // Message component for empty charts
  const EmptyChartMessage = ({ message }: { message: string }) => (
    <div className="flex flex-col items-center justify-center h-40 text-center p-4">
      <FileBarChart className="h-10 w-10 text-muted-foreground mb-2" />
      <p className="text-muted-foreground">{message}</p>
    </div>
  );
  
  return (
    <div className="container mx-auto py-8 px-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-2xl font-bold">Analytics Dashboard</CardTitle>
            <CardDescription>
              Team performance and timesheet analytics for {dateRange.label}
            </CardDescription>
          </div>
          <Select
            value={timeRange}
            onValueChange={(value) => setTimeRange(value as "week" | "month" | "quarter")}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select time range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="week">This Week</SelectItem>
              <SelectItem value="month">This Month</SelectItem>
              <SelectItem value="quarter">Last 3 Months</SelectItem>
            </SelectContent>
          </Select>
        </CardHeader>
        
        <CardContent>
          {hasError && (
            <Alert variant="destructive" className="mb-6">
              <AlertCircle className="h-4 w-4" />
              <div>
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>
                  There was an error loading the analytics data. Please try again later.
                </AlertDescription>
              </div>
            </Alert>
          )}
          
          {isLoading ? (
            <div className="flex justify-center items-center h-80">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : (
            <Tabs defaultValue="hours" className="mt-6">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="hours">Hours by Employee</TabsTrigger>
                <TabsTrigger value="projects">Project Distribution</TabsTrigger>
                <TabsTrigger value="status">Timesheet Status</TabsTrigger>
              </TabsList>
              
              <TabsContent value="hours" className="space-y-4">
                {hasEmployeeData ? (
                  <div className="h-80 mt-6">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={displayedEmployeeData}
                        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis label={{ value: 'Hours', angle: -90, position: 'insideLeft' }} />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="hours" fill="#8884d8" name="Total Hours" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                ) : (
                  <EmptyChartMessage message="No timesheet data available for this period. Try selecting a different time range or add some timesheets." />
                )}
                
                <div className="text-center text-sm text-muted-foreground">
                  Total users with logged hours: {hasEmployeeData ? employeeHoursData?.length || 0 : 0}
                </div>
              </TabsContent>
              
              <TabsContent value="projects" className="space-y-4">
                {hasProjectData ? (
                  <div className="h-80 mt-6">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={displayedProjectData}
                          cx="50%"
                          cy="50%"
                          labelLine={true}
                          label={({ name, percent }: { name: string; percent: number }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                          outerRadius={100}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {(displayedProjectData).map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip formatter={(value: number) => [`${value} hours`, 'Hours']} />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                ) : (
                  <EmptyChartMessage message="No project data available for this period. Try selecting a different time range or add project codes to your timesheets." />
                )}
                
                <div className="text-center text-sm text-muted-foreground">
                  Total projects: {hasProjectData ? projectDistributionData?.length || 0 : 0}
                </div>
              </TabsContent>
              
              <TabsContent value="status" className="space-y-4">
                {hasStatusData ? (
                  <div className="h-80 mt-6">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={displayedStatusData}
                          cx="50%"
                          cy="50%"
                          labelLine={true}
                          label={({ name, percent }: { name: string; percent: number }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                          outerRadius={100}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          <Cell fill="#8884d8" /> {/* Draft */}
                          <Cell fill="#FFC107" /> {/* Pending */}
                          <Cell fill="#4CAF50" /> {/* Approved */}
                        </Pie>
                        <Tooltip formatter={(value: number) => [`${value} timesheets`, 'Count']} />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                ) : (
                  <EmptyChartMessage message="No timesheet status data available for this period. Try selecting a different time range or add some timesheets." />
                )}
                
                <div className="text-center text-sm text-muted-foreground">
                  Total timesheets: {hasStatusData ? (timesheetStatusData?.reduce((sum, item) => sum + item.value, 0) || 0) : 0}
                </div>
              </TabsContent>
            </Tabs>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
