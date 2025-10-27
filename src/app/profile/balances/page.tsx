"use client";

import { api } from "~/trpc/react";
import { LeaveBalanceCard } from "~/components/leave-balance-card";
import { LeaveHistory } from "~/components/leave-history";

const TOTAL_SICK_HOURS = 40;
const TOTAL_VACATION_HOURS = 120;

export default function BalancesPage() {
  const { data: balanceData, isLoading: balancesLoading } =
    api.profile.getBalances.useQuery();
  const { data: leaveHistory, isLoading: historyLoading } =
    api.profile.getLeaveHistory.useQuery();

  // Transform the data to match LeaveHistoryEntry type
  const formattedHistory =
    leaveHistory?.map((entry) => ({
      ...entry,
      type: entry.type.name,
    })) ?? [];

  return (
    <div className="container mx-auto py-8">
      <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2">
        <LeaveBalanceCard
          type="sick"
          balance={balanceData?.balances.sick}
          totalHours={TOTAL_SICK_HOURS}
          isLoading={balancesLoading}
        />
        <LeaveBalanceCard
          type="vacation"
          balance={balanceData?.balances.vacation}
          totalHours={TOTAL_VACATION_HOURS}
          isLoading={balancesLoading}
        />
      </div>

      <LeaveHistory history={formattedHistory} isLoading={historyLoading} />
    </div>
  );
}
