"use client";

import { useGetRevenueAnalytics } from "@/hooks";
import { ArrowDownLeft, CheckCircle2, Landmark, Lock } from "lucide-react";
import { formatCurrency, numberFormatter } from "./admin-format";
import PaymentsTable from "./payments-table";
import StatCard, { StatCardSkeleton } from "./stat-card";

export default function EscrowManagement() {
  const { data, isLoading, isError, error } = useGetRevenueAnalytics();
  const analytics = data?.data;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-xl font-semibold">
          Escrow management
        </h1>
        <p className="text-sm text-muted-foreground">
          Funds are held when a student pays and released to the expert when
          the student approves the work.
        </p>
      </div>

      {isError && (
        <p className="rounded-lg border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive">
          {error.message || "Failed to load escrow totals."}
        </p>
      )}

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {isLoading || !analytics ? (
          !isError &&
          Array.from({ length: 4 }, (_, i) => <StatCardSkeleton key={i} />)
        ) : (
          <>
            <StatCard
              label="Currently held"
              icon={Lock}
              value={formatCurrency(analytics.byStatus.HELD.amount)}
              hint={`${numberFormatter.format(analytics.byStatus.HELD.count)} escrows · ${formatCurrency(analytics.totals.pendingPlatformRevenue)} fees pending`}
            />
            <StatCard
              label="Released to experts"
              icon={CheckCircle2}
              value={formatCurrency(analytics.totals.expertPayouts)}
              hint={`${numberFormatter.format(analytics.byStatus.RELEASED_TO_EXPERT.count)} escrows released`}
            />
            <StatCard
              label="Platform revenue"
              icon={Landmark}
              value={formatCurrency(analytics.totals.platformRevenue)}
              hint="Commission on released escrows"
            />
            <StatCard
              label="Refunded to students"
              icon={ArrowDownLeft}
              value={formatCurrency(analytics.totals.refundedToStudents)}
              hint={`${numberFormatter.format(analytics.byStatus.REFUNDED_TO_STUDENT.count)} escrows refunded`}
            />
          </>
        )}
      </div>

      <section className="space-y-3">
        <div>
          <h2 className="font-medium">Funded assignments</h2>
          <p className="text-sm text-muted-foreground">
            Every paid assignment has an escrow vault. Open one to see its
            split and parties.
          </p>
        </div>
        <PaymentsTable
          status="PAID"
          emptyMessage="No assignments have been funded yet."
        />
      </section>
    </div>
  );
}
