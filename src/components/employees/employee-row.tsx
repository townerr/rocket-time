import { User } from "@prisma/client";
import { Button } from "~/components/ui/button";
import { TableCell, TableRow } from "~/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { Dialog, DialogTrigger } from "~/components/ui/dialog";
import { EmployeeDetails } from "./employee-details";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { MoreHorizontal, UserCheck, UserMinus, UserX } from "lucide-react";
import { useState } from "react";
import { api } from "~/trpc/react";
import { useToast } from "~/components/ui/use-toast";

interface EmployeeRowProps {
  employee: User;
  onStatusChange?: () => void;
}

export function EmployeeRow({ employee, onStatusChange }: EmployeeRowProps) {
  const [isUpdating, setIsUpdating] = useState(false);
  const { toast } = useToast();

  const updateEmployeeStatus = api.manager.updateEmployeeStatus.useMutation({
    onSuccess: () => {
      toast({
        title: "Success",
        description: `Employee status updated successfully`,
      });
      if (onStatusChange) onStatusChange();
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update employee status",
        variant: "destructive",
      });
    },
    onSettled: () => {
      setIsUpdating(false);
    },
  });

  const handleStatusChange = (status: "active" | "inactive" | "terminated") => {
    setIsUpdating(true);
    updateEmployeeStatus.mutate({
      employeeId: employee.id,
      status,
    });
  };

  // Helper function to get status display info
  const getStatusDisplay = (status: string | null | undefined) => {
    switch (status) {
      case "active":
        return { color: "bg-green-500", text: "Active" };
      case "inactive":
        return { color: "bg-amber-500", text: "Inactive" };
      case "terminated":
        return { color: "bg-red-500", text: "Terminated" };
      default:
        return { color: "bg-green-500", text: "Active" };
    }
  };

  const statusDisplay = getStatusDisplay(employee.status);

  return (
    <TableRow>
      <TableCell>
        <div className="flex items-center gap-3">
          <Avatar>
            <AvatarImage src={employee.image ?? undefined} />
            <AvatarFallback>
              {employee.name
                ?.split(" ")
                .map((n) => n[0])
                .join("")}
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
      <TableCell className="hidden md:table-cell">{employee.email}</TableCell>
      <TableCell className="hidden md:table-cell">Engineering</TableCell>
      <TableCell className="hidden md:table-cell">
        <div className="flex items-center gap-2">
          <div className={`h-2 w-2 rounded-full ${statusDisplay.color}`} />
          {statusDisplay.text}
        </div>
      </TableCell>
      <TableCell className="text-right">
        <div className="flex items-center justify-end gap-2">
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm">
                View Details
              </Button>
            </DialogTrigger>
            <EmployeeDetails employee={employee} />
          </Dialog>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" disabled={isUpdating}>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Change Status</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => handleStatusChange("active")}
                disabled={employee.status === "active" || isUpdating}
              >
                <UserCheck className="mr-2 h-4 w-4" />
                <span>Set as Active</span>
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => handleStatusChange("inactive")}
                disabled={employee.status === "inactive" || isUpdating}
              >
                <UserMinus className="mr-2 h-4 w-4" />
                <span>Set as Inactive</span>
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => handleStatusChange("terminated")}
                disabled={employee.status === "terminated" || isUpdating}
                className="text-red-600"
              >
                <UserX className="mr-2 h-4 w-4" />
                <span>Terminate Employee</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </TableCell>
    </TableRow>
  );
}
