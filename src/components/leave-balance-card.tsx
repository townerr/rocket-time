import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Progress } from "~/components/ui/progress";
import { Skeleton } from "~/components/ui/skeleton";

interface LeaveBalanceCardProps {
  type: "sick" | "vacation";
  balance: number | undefined;
  totalHours: number;
  isLoading?: boolean;
}

export function LeaveBalanceCard({
  type,
  balance,
  totalHours,
  isLoading,
}: LeaveBalanceCardProps) {
  if (isLoading) {
    return <LeaveBalanceCardSkeleton type={type} />;
  }

  const title = type === "sick" ? "Sick Leave" : "Vacation Leave";
  const usedHours = totalHours - (balance ?? 0);
  const progressValue = ((balance ?? 0) / totalHours) * 100;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl font-semibold">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="text-3xl font-bold">{balance} hours</div>
          <div className="space-y-2">
            <div className="flex justify-between text-sm text-gray-500">
              <span>Used: {usedHours} hours</span>
              <span>Total: {totalHours} hours</span>
            </div>
            <Progress value={progressValue} className="h-2" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function LeaveBalanceCardSkeleton({ type }: { type: "sick" | "vacation" }) {
  const title = type === "sick" ? "Sick Leave" : "Vacation Leave";

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl font-semibold">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <Skeleton className="h-8 w-32" />
          <div className="space-y-2">
            <div className="flex justify-between">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-4 w-20" />
            </div>
            <Skeleton className="h-2 w-full" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
