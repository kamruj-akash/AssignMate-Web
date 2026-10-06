"use client";

import { useGetAdminOverview } from "@/hooks";
import { TStudentAssignmentStatus } from "@/type";
import { cn } from "cn";
import { formatCurrency, numberFormatter } from "./admin-format";
import BreakdownList, { BreakdownListSkeleton } from "./breakdown-list";
import DateRangeFilter, { useDateRange } from "./date-range-filter";
import StatCard, { StatCardSkeleton } from "./stat-card";

// Lifecycle order, grouped into the stages an admin reasons about.
const stages: {
  title: string;
  description: string;
  statuses: TStudentAssignmentStatus[];
}[] = [
  {
    title: "Pre-work",
    description: "Posted, collecting bids or waiting on payment",
    statuses: ["OPEN", "AWAITING_PAYMENT"],
  },
  {
    title: "In delivery",
    description: "Funded and being worked on by an expert",
    statuses: ["ASSIGNED", "IN_PROGRESS"],
  },
  {
    title: "In review",
    description: "Delivered and waiting on the student",
    statuses: ["SUBMITTED", "UNDER_REVIEW"],
  },
  {
    title: "Closed",
    description: "Finished, cancelled or in dispute",
    statuses: ["COMPLETED", "CANCELLED", "DISPUTED"],
  },
];

export default function AdminAssignments() {
  const { preset, range, setPreset } = useDateRange();
  const { data, isLoading, isError, error, isPlaceholderData } =
    useGetAdminOverview(range);
  const overview = data?.data;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-heading text-xl font-semibold">Assignments</h1>
          <p className="text-sm text-muted-foreground">
            Where assignments posted in the selected period are in their
            lifecycle.
          </p>
        </div>
        <div className="overflow-x-auto">
          <DateRangeFilter preset={preset} onChange={setPreset} />
        </div>
      </div>

      {isError && (
        <p className="rounded-lg border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive">
          {error.message || "Failed to load assignment stats."}
        </p>
      )}

      {isLoading || !overview ? (
        !isError && (
          <div className="space-y-6">
            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
              {Array.from({ length: 4 }, (_, i) => (
                <StatCardSkeleton key={i} />
              ))}
            </div>
            <div className="grid gap-3 lg:grid-cols-2">
              {Array.from({ length: 4 }, (_, i) => (
                <BreakdownListSkeleton key={i} rows={2} />
              ))}
            </div>
          </div>
        )
      ) : (
        <div
          className={cn(
            "space-y-6 transition-opacity",
            isPlaceholderData && "opacity-60",
          )}
        >
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            <StatCard
              label="Total assignments"
              value={numberFormatter.format(overview.assignments.total)}
            />
            <StatCard
              label="Completion rate"
              value={`${overview.assignments.completionRate}%`}
              hint={`${numberFormatter.format(overview.assignments.byStatus.COMPLETED)} completed`}
            />
            <StatCard
              label="Dispute rate"
              value={`${overview.assignments.disputeRate}%`}
              hint={`${numberFormatter.format(overview.assignments.byStatus.DISPUTED)} disputed`}
              className={
                overview.assignments.byStatus.DISPUTED > 0
                  ? "border-destructive/30"
                  : undefined
              }
            />
            <StatCard
              label="Bid acceptance"
              value={`${overview.bids.acceptanceRate}%`}
              hint={`${numberFormatter.format(overview.bids.total)} bids · ${formatCurrency(overview.payments.paidVolume)} paid`}
            />
          </div>

          <div className="grid gap-3 lg:grid-cols-2">
            {stages.map((stage) => (
              <BreakdownList
                key={stage.title}
                title={stage.title}
                description={stage.description}
                items={stage.statuses.map((status) => ({
                  key: status,
                  value: overview.assignments.byStatus[status],
                }))}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
