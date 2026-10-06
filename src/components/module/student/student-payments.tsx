"use client";

import { formatCurrency, numberFormatter } from "@/components/module/admin/admin-format";
import PaymentsTable from "@/components/module/admin/payments-table";
import StatCard, {
  StatCardSkeleton,
} from "@/components/module/admin/stat-card";
import { useGetStudentOverview } from "@/hooks";
import { ArrowDownLeft, Clock, Lock, Wallet } from "lucide-react";

export default function StudentPayments() {
  const { data, isLoading, isError, error } = useGetStudentOverview();
  const spending = data?.data?.spending;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-xl font-semibold">Payments</h1>
        <p className="text-sm text-muted-foreground">
          Your payment is held in escrow while the expert works and only
          released to them when you approve the submission.
        </p>
      </div>

      {isError && (
        <p className="rounded-lg border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive">
          {error.message || "Failed to load payment totals."}
        </p>
      )}

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {isLoading || !spending ? (
          !isError &&
          Array.from({ length: 4 }, (_, i) => <StatCardSkeleton key={i} />)
        ) : (
          <>
            <StatCard
              label="Total paid"
              icon={Wallet}
              value={formatCurrency(spending.totalPaid)}
            />
            <StatCard
              label="Held in escrow"
              icon={Lock}
              value={formatCurrency(spending.inEscrow)}
              hint="Not yet released to an expert"
            />
            <StatCard
              label="Refunded"
              icon={ArrowDownLeft}
              value={formatCurrency(spending.refunded)}
              hint="From approved cancellations"
            />
            <StatCard
              label="Unfinished checkouts"
              icon={Clock}
              value={numberFormatter.format(spending.pendingPayments)}
              hint="Started but not completed"
            />
          </>
        )}
      </div>

      <PaymentsTable
        showStudent={false}
        emptyMessage="You haven't made any payments yet."
      />
    </div>
  );
}
