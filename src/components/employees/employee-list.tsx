"use client";

import { User } from "@prisma/client";
import { Search } from "lucide-react";
import { Input } from "~/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import { EmployeeRow } from "./employee-row";

interface EmployeeListProps {
  employees: User[];
  searchQuery: string;
  onSearchChange: (value: string) => void;
}

export function EmployeeList({ employees, searchQuery, onSearchChange }: EmployeeListProps) {
  const filteredEmployees = employees?.filter(employee => 
    employee.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    employee.email?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
        <Input
          placeholder="Search employees..."
          className="pl-10"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Employee</TableHead>
              <TableHead>Email</TableHead>
              <TableHead className="hidden md:table-cell">Department</TableHead>
              <TableHead className="hidden md:table-cell">Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredEmployees?.map((employee) => (
              <EmployeeRow key={employee.id} employee={employee} />
            ))}
          </TableBody>
        </Table>
      </div>
    </>
  );
} 