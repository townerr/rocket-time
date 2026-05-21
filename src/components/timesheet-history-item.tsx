import { format } from "date-fns";
import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "~/components/ui/accordion";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import { Badge } from "~/components/ui/badge";
import {
  getEntryTypeBadgeClasses,
  getStatusBadgeClasses,
} from "~/lib/status-colors";

interface TimesheetEntry {
  id: string;
  date: Date;
  type: string;
  hours: number;
  projectCode?: string | null;
}

interface Timesheet {
  id: string;
  weekStart: Date;
  weekEnd: Date;
  status: string | null;
  entries: TimesheetEntry[];
}

interface TimesheetHistoryItemProps {
  timesheet: Timesheet;
}

export function TimesheetHistoryItem({ timesheet }: TimesheetHistoryItemProps) {
  const totalHours = timesheet.entries.reduce(
    (sum, entry) => sum + entry.hours,
    0,
  );

  return (
    <AccordionItem value={timesheet.id} className="rounded-lg border px-4">
      <AccordionTrigger className="py-4 hover:no-underline">
        <div className="flex w-full flex-col items-start gap-4 text-left md:flex-row md:items-center">
          <div className="flex-1">
            <div className="font-semibold">
              {format(timesheet.weekStart, "MMM d")} -{" "}
              {format(timesheet.weekEnd, "MMM d, yyyy")}
            </div>
            <div className="text-sm text-muted-foreground">
              {totalHours} hours total
            </div>
          </div>
          <Badge
            variant="secondary"
            className={getStatusBadgeClasses(timesheet.status)}
          >
            {timesheet.status || "Draft"}
          </Badge>
        </div>
      </AccordionTrigger>
      <AccordionContent>
        <div className="overflow-x-auto pb-4">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Hours</TableHead>
                <TableHead>Details</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {timesheet.entries.map((entry) => (
                <TableRow key={entry.id}>
                  <TableCell>{format(entry.date, "MMM d, yyyy")}</TableCell>
                  <TableCell>
                    <Badge
                      variant="secondary"
                      className={getEntryTypeBadgeClasses(entry.type)}
                    >
                      {entry.type}
                    </Badge>
                  </TableCell>
                  <TableCell>{entry.hours} hours</TableCell>
                  <TableCell>
                    {entry.projectCode && (
                      <span className="text-sm text-muted-foreground">
                        Project: {entry.projectCode}
                      </span>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </AccordionContent>
    </AccordionItem>
  );
}
