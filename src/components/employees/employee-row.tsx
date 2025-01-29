import { User } from "@prisma/client";
import { Button } from "~/components/ui/button";
import { TableCell, TableRow } from "~/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { Dialog, DialogTrigger } from "~/components/ui/dialog";
import { EmployeeDetails } from "./employee-details";

interface EmployeeRowProps {
  employee: User;
}

export function EmployeeRow({ employee }: EmployeeRowProps) {
  return (
    <TableRow>
      <TableCell>
        <div className="flex items-center gap-3">
          <Avatar>
            <AvatarImage src={employee.image ?? undefined} />
            <AvatarFallback>
              {employee.name?.split(" ").map(n => n[0]).join("")}
            </AvatarFallback>
          </Avatar>
          <div>
            <div className="font-medium">{employee.name}</div>
            <div className="text-sm text-muted-foreground md:hidden">
              {employee.email}
            </div>
          </div>
        </div>
      </TableCell>
      <TableCell className="hidden md:table-cell">
        {employee.email}
      </TableCell>
      <TableCell className="hidden md:table-cell">
        Engineering
      </TableCell>
      <TableCell className="hidden md:table-cell">
        <div className="flex items-center gap-2">
          <div className="h-2 w-2 rounded-full bg-green-500" />
          Active
        </div>
      </TableCell>
      <TableCell className="text-right">
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm">View Details</Button>
          </DialogTrigger>
          <EmployeeDetails employee={employee} />
        </Dialog>
      </TableCell>
    </TableRow>
  );
} 