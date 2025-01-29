"use client";

import { useState } from "react";
import { api } from "~/trpc/react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card";
import { EmployeeList } from "~/components/employees/employee-list";
import { EmployeesPageSkeleton } from "~/components/employees/employees-page-skeleton";

export default function EmployeesPage() {
  const [search, setSearch] = useState("");
  const { data: employees, isLoading } = api.manager.getEmployees.useQuery();

  if (isLoading) return <EmployeesPageSkeleton />;

  return (
    <div className="container mx-auto py-8 px-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Employee Management</CardTitle>
          <CardDescription>
            View and manage your team members
          </CardDescription>
        </CardHeader>
        <CardContent>
          <EmployeeList 
            employees={employees ?? []} 
            searchQuery={search}
            onSearchChange={setSearch}
          />
        </CardContent>
      </Card>
    </div>
  );
}
