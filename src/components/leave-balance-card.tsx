import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Progress } from "~/components/ui/progress";
import { Skeleton } from "~/components/ui/skeleton";
import { cn } from "~/lib/utils";

interface LeaveBalanceCardProps {
  type: "sick" | "vacation";
  balance: number | undefined;
  totalHours: number;
  isLoading?: boolean;
}

const TYPE_STYLES = {
  sick: {
    border: "border-t-type-sick",
    indicator: "bg-type-sick",
    accent: "text-type-sick",
  },
  vacation: {
    border: "border-t-type-vacation",
    indicator: "bg-type-vacation",
    accent: "text-type-vacation",
  },
} as const;

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
  const styles = TYPE_STYLES[type];

  return (
    <Card className={cn("border-t-4 shadow-brand", styles.border)}>
      <CardHeader>
        <CardTitle className="text-xl font-semibold">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className={cn("text-3xl font-bold", styles.accent)}>
            {balance} hours
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>Used: {usedHours} hours</span>
              <span>Total: {totalHours} hours</span>
            </div>
            <Progress
              value={progressValue}
              className="h-2"
              indicatorClassName={styles.indicator}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function LeaveBalanceCardSkeleton({ type }: { type: "sick" | "vacation" }) {
  const title = type === "sick" ? "Sick Leave" : "Vacation Leave";

  return (
    <Card className={cn("border-t-4 shadow-brand", TYPE_STYLES[type].border)}>
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
