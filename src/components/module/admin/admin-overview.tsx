"use client";

import { useGetAdminOverview } from "@/hooks";
import { cn } from "cn";
import {
  BadgeCheck,
  Banknote,
  ClipboardList,
  Landmark,
  Star,
  Users,
} from "lucide-react";
import Link from "next/link";
import { formatCurrency, numberFormatter } from "./admin-format";
import BreakdownList, { BreakdownListSkeleton } from "./breakdown-list";
import DateRangeFilter, { useDateRange } from "./date-range-filter";
import StatCard, { StatCardSkeleton } from "./stat-card";

export default function AdminOverview() {
  const { preset, range, setPreset } = useDateRange();
  const { data, isLoading, isError, error, isPlaceholderData } =
    useGetAdminOverview(range);
  const overview = data?.data;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-heading text-xl font-semibold">Overview</h1>
          <p className="text-sm text-muted-foreground">
            Platform activity for the selected period.
          </p>
        </div>
        <div className="overflow-x-auto">
          <DateRangeFilter preset={preset} onChange={setPreset} />
        </div>
      </div>

      {isError && (
        <p className="rounded-lg border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive">
          {error.message || "Failed to load overview."}
        </p>
      )}

      {isLoading || !overview ? (
        !isError && <AdminOverviewSkeleton />
      ) : (
        <div
          className={cn(
            "space-y-6 transition-opacity",
            isPlaceholderData && "opacity-60",
          )}
        >
          {overview.experts.byVerificationStatus.PENDING > 0 && (
            <Link
              href="/admin/expert-management"
              className="flex items-center justify-between gap-3 rounded-lg border border-amber-500/30 bg-amber-500/5 p-4 text-sm hover:bg-amber-500/10"
            >
              <span>
                <span className="font-medium">
                  {overview.experts.byVerificationStatus.PENDING} expert
                  {overview.experts.byVerificationStatus.PENDING === 1
                    ? ""
                    : "s"}
                </span>{" "}
                waiting for verification.
              </span>
              <span className="font-medium text-primary">Review →</span>
            </Link>
          )}

          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
            <StatCard
              label="Platform revenue"
              icon={Landmark}
              value={formatCurrency(overview.escrow.platformRevenue)}
              hint={`${formatCurrency(overview.escrow.pendingPlatformRevenue)} pending in escrow`}
            />
            <StatCard
              label="Paid volume"
              icon={Banknote}
              value={formatCurrency(overview.payments.paidVolume)}
              hint={`${numberFormatter.format(overview.payments.byStatus.PAID)} successful payments`}
            />
            <StatCard
              label="Assignments"
              icon={ClipboardList}
              value={numberFormatter.format(overview.assignments.total)}
              hint={`${overview.assignments.completionRate}% completed · ${overview.assignments.disputeRate}% disputed`}
            />
            <StatCard
              label="Users"
              icon={Users}
              value={numberFormatter.format(overview.users.total)}
              hint={`${numberFormatter.format(overview.users.byRole.STUDENT)} students · ${numberFormatter.format(overview.users.byRole.EXPERT)} experts · ${numberFormatter.format(overview.users.blocked)} blocked`}
            />
            <StatCard
              label="Bids"
              icon={BadgeCheck}
              value={numberFormatter.format(overview.bids.total)}
              hint={`${overview.bids.acceptanceRate}% acceptance rate`}
            />
            <StatCard
              label="Average rating"
              icon={Star}
              value={
                overview.reviews.total === 0
                  ? "—"
                  : `${overview.reviews.averageRating.toFixed(2)} / 5`
              }
              hint={`${numberFormatter.format(overview.reviews.total)} reviews`}
            />
          </div>

          <div className="grid gap-3 lg:grid-cols-2">
            <BreakdownList
              title="Assignments by status"
              items={Object.entries(overview.assignments.byStatus).map(
                ([key, value]) => ({ key, value }),
              )}
            />
            <div className="grid gap-3">
              <BreakdownList
                title="Expert verification"
                items={[
                  {
                    key: "PENDING",
                    value: overview.experts.byVerificationStatus.PENDING,
                  },
                  {
                    key: "APPROVE",
                    label: "Approved",
                    value: overview.experts.byVerificationStatus.APPROVE,
                  },
                  {
                    key: "REJECT",
                    label: "Rejected",
                    value: overview.experts.byVerificationStatus.REJECT,
                  },
                ]}
              />
              <BreakdownList
                title="Escrow"
                items={Object.entries(overview.escrow.byStatus).map(
                  ([key, { count, amount }]) => ({
                    key,
                    value: count,
                    detail: formatCurrency(amount),
                  }),
                )}
              />
            </div>
            <BreakdownList
              title="Payments by status"
              items={Object.entries(overview.payments.byStatus).map(
                ([key, value]) => ({ key, value }),
              )}
            />
            <BreakdownList
              title="Bids by status"
              items={Object.entries(overview.bids.byStatus).map(
                ([key, value]) => ({ key, value }),
              )}
            />
          </div>
        </div>
      )}
    </div>
  );
}

function AdminOverviewSkeleton() {
  return (
    <div className="space-y-6">
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: 6 }, (_, i) => (
          <StatCardSkeleton key={i} />
        ))}
      </div>
      <div className="grid gap-3 lg:grid-cols-2">
        <BreakdownListSkeleton rows={9} />
        <BreakdownListSkeleton rows={6} />
      </div>
    </div>
  );
}
