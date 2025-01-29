import { User } from "@prisma/client";
import { Mail, Phone, Building2 } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import {
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { EmployeeBalances } from "./employee-balances";
import { EmployeeTimesheets } from "./employee-timesheets";

interface EmployeeDetailsProps {
  employee: User;
}

export function EmployeeDetails({ employee }: EmployeeDetailsProps) {
  return (
    <DialogContent className="max-w-3xl">
      <DialogHeader>
        <DialogTitle>Employee Details</DialogTitle>
        <DialogDescription>
          View and manage employee information
        </DialogDescription>
      </DialogHeader>
      
      <Tabs defaultValue="profile" className="mt-4">
        <TabsList>
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="balances">Balances</TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
        </TabsList>
        
        <TabsContent value="profile" className="space-y-4">
          <div className="flex items-center gap-4">
            <Avatar className="h-20 w-20">
              <AvatarImage src={employee.image ?? undefined} />
              <AvatarFallback className="text-lg">
                {employee.name?.split(" ").map(n => n[0]).join("")}
              </AvatarFallback>
            </Avatar>
            <div>
              <h3 className="text-2xl font-semibold">{employee.name}</h3>
              <div className="text-muted-foreground">Engineering</div>
            </div>
          </div>
          
          <div className="grid gap-4 md:grid-cols-2">
            <div className="flex items-center gap-2">
              <Mail className="h-4 w-4 text-muted-foreground" />
              {employee.email}
            </div>
            <div className="flex items-center gap-2">
              <Phone className="h-4 w-4 text-muted-foreground" />
              (555) 123-4567
            </div>
            <div className="flex items-center gap-2">
              <Building2 className="h-4 w-4 text-muted-foreground" />
              New York Office
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="balances">
          <EmployeeBalances userId={employee.id} />
        </TabsContent>
        
        <TabsContent value="history">
          <EmployeeTimesheets userId={employee.id} />
        </TabsContent>
      </Tabs>
    </DialogContent>
  );
} 