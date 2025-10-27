import { api } from "~/trpc/react";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";

interface EmployeeBalancesProps {
  userId: string;
}

export function EmployeeBalances({ userId }: EmployeeBalancesProps) {
  const { data: balances, isLoading } =
    api.manager.getEmployeeBalances.useQuery({ userId });

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">
            Vacation Balance
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {balances?.vacation || 0} days
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Sick Balance</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{balances?.sick || 0} days</div>
        </CardContent>
      </Card>
    </div>
  );
}
