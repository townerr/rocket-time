"use client";

import { api } from "~/trpc/react";
import { LeaveBalanceCard } from "~/components/leave-balance-card";
import { LeaveHistory } from "~/components/leave-history";

const TOTAL_SICK_HOURS = 40;
const TOTAL_VACATION_HOURS = 120;

export default function BalancesPage() {
  const { data, isLoading } = api.profile.getBalances.useQuery();

  return (
    <div className="container mx-auto py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <LeaveBalanceCard
          type="sick"
          balance={data?.balances?.sickBalance}
          totalHours={TOTAL_SICK_HOURS}
          isLoading={isLoading}
        />
        <LeaveBalanceCard
          type="vacation"
          balance={data?.balances?.vacationBalance}
          totalHours={TOTAL_VACATION_HOURS}
          isLoading={isLoading}
        />
      </div>

      <LeaveHistory
        history={data?.history ?? []}
        isLoading={isLoading}
      />
    </div>
  );
}
