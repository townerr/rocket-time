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

const ENTRY_TYPE_COLORS = {
  Project: 'bg-blue-100 text-blue-800 hover:bg-blue-100',
  Vacation: 'bg-green-100 text-green-800 hover:bg-green-100',
  Sick: 'bg-orange-100 text-orange-800 hover:bg-orange-100',
  Holiday: 'bg-purple-100 text-purple-800 hover:bg-purple-100',
} as const;

const STATUS_COLORS = {
  pending: 'bg-yellow-100 text-yellow-800 hover:bg-yellow-100',
  approved: 'bg-green-100 text-green-800 hover:bg-green-100',
  rejected: 'bg-red-100 text-red-800 hover:bg-red-100',
  draft: 'bg-gray-100 text-gray-800 hover:bg-gray-100',
} as const;

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
    0
  );

  return (
    <AccordionItem
      value={timesheet.id}
      className="border rounded-lg px-4"
    >
      <AccordionTrigger className="py-4 hover:no-underline">
        <div className="flex flex-col md:flex-row w-full items-start md:items-center gap-4 text-left">
          <div className="flex-1">
            <div className="font-semibold">
              {format(timesheet.weekStart, "MMM d")} -{" "}
              {format(timesheet.weekEnd, "MMM d, yyyy")}
            </div>
            <div className="text-sm text-gray-500">
              {totalHours} hours total
            </div>
          </div>
          <Badge
            variant="secondary"
            className={`${
              STATUS_COLORS[
                (timesheet.status?.toLowerCase() ?? "draft") as keyof typeof STATUS_COLORS
              ]
            }`}
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
                  <TableCell>
                    {format(entry.date, "MMM d, yyyy")}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="secondary"
                      className={`${
                        ENTRY_TYPE_COLORS[
                          entry.type as keyof typeof ENTRY_TYPE_COLORS
                        ]
                      }`}
                    >
                      {entry.type}
                    </Badge>
                  </TableCell>
                  <TableCell>{entry.hours} hours</TableCell>
                  <TableCell>
                    {entry.projectCode && (
                      <span className="text-sm text-gray-600">
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