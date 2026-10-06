"use client";

import {
  assignmentStatusStyles,
  formatCurrency,
  formatDate,
  numberFormatter,
} from "@/components/module/admin/admin-format";
import BreakdownList, {
  BreakdownListSkeleton,
} from "@/components/module/admin/breakdown-list";
import StatCard, {
  StatCardSkeleton,
} from "@/components/module/admin/stat-card";
import StatusBadge from "@/components/module/admin/status-badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetExpertOverview, useGetMe, useGetMyAssignments } from "@/hooks";
import { IExpertAssignment, IExpertOverview, IMe } from "@/type";
import { differenceInCalendarDays } from "date-fns";
import { Briefcase, Lock, Star, Wallet } from "lucide-react";
import Link from "next/link";

export default function ExpertOverview() {
  const me = (useGetMe().data as { data?: IMe } | undefined)?.data;
  const { data, isLoading, isError, error } = useGetExpertOverview();
  const overview = data?.data;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="font-heading text-xl font-semibold">
            {me ? `Welcome back, ${me.name.split(" ")[0]}` : "Overview"}
          </h1>
          <p className="text-sm text-muted-foreground">
            Your work, bids and earnings at a glance.
          </p>
        </div>
        <Button render={<Link href="/assignments" />} size="sm">
          Find assignments
        </Button>
      </div>

      {isError && (
        <p className="rounded-lg border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive">
          {error.message || "Failed to load your overview."}
        </p>
      )}

      {overview && <VerificationNotice overview={overview} />}

      {isLoading || !overview ? (
        !isError && (
          <div className="space-y-6">
            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
              {Array.from({ length: 4 }, (_, i) => (
                <StatCardSkeleton key={i} />
              ))}
            </div>
            <div className="grid gap-3 lg:grid-cols-2">
              {Array.from({ length: 2 }, (_, i) => (
                <BreakdownListSkeleton key={i} rows={3} />
              ))}
            </div>
          </div>
        )
      ) : (
        <>
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            <StatCard
              label="Wallet balance"
              icon={Wallet}
              value={formatCurrency(overview.earnings.walletBalance)}
              hint={`${formatCurrency(overview.earnings.released)} earned in total`}
            />
            <StatCard
              label="Pending in escrow"
              icon={Lock}
              value={formatCurrency(overview.earnings.pendingInEscrow)}
              hint="Released when students approve"
            />
            <StatCard
              label="Active work"
              icon={Briefcase}
              value={numberFormatter.format(activeCount(overview))}
              hint={`${numberFormatter.format(overview.assignments.byStatus.COMPLETED)} completed`}
            />
            <StatCard
              label="Rating"
              icon={Star}
              value={
                overview.reputation.totalReviews > 0
                  ? overview.reputation.averageRating.toFixed(1)
                  : "—"
              }
              hint={`${numberFormatter.format(overview.reputation.totalReviews)} reviews · ${overview.bids.winRate}% bid win rate`}
            />
          </div>

          <ActiveWork />

          <div className="grid gap-3 lg:grid-cols-2">
            <BreakdownList
              title="Your assignments"
              description="Work you've won, by stage"
              items={[
                {
                  key: "WAITING",
                  label: "Waiting on payment",
                  value:
                    overview.assignments.byStatus.AWAITING_PAYMENT +
                    overview.assignments.byStatus.ASSIGNED,
                },
                {
                  key: "IN_PROGRESS",
                  value: overview.assignments.byStatus.IN_PROGRESS,
                },
                {
                  key: "IN_REVIEW",
                  label: "With the student",
                  value:
                    overview.assignments.byStatus.SUBMITTED +
                    overview.assignments.byStatus.UNDER_REVIEW,
                },
                {
                  key: "COMPLETED",
                  value: overview.assignments.byStatus.COMPLETED,
                },
                {
                  key: "CLOSED",
                  label: "Cancelled or disputed",
                  value:
                    overview.assignments.byStatus.CANCELLED +
                    overview.assignments.byStatus.DISPUTED,
                },
              ]}
            />
            <BreakdownList
              title="Your bids"
              description={`${overview.bids.winRate}% of your bids were accepted`}
              items={[
                { key: "PENDING", value: overview.bids.byStatus.PENDING },
                {
                  key: "ACCEPTED",
                  label: "Won",
                  value: overview.bids.byStatus.ACCEPTED,
                },
                {
                  key: "REJECTED",
                  label: "Not selected",
                  value: overview.bids.byStatus.REJECTED,
                },
              ]}
            />
          </div>
        </>
      )}
    </div>
  );
}

const activeCount = (overview: IExpertOverview) =>
  overview.assignments.byStatus.ASSIGNED +
  overview.assignments.byStatus.AWAITING_PAYMENT +
  overview.assignments.byStatus.IN_PROGRESS +
  overview.assignments.byStatus.SUBMITTED +
  overview.assignments.byStatus.UNDER_REVIEW;

function VerificationNotice({ overview }: { overview: IExpertOverview }) {
  const { verificationStatus } = overview.profile;
  if (verificationStatus === "APPROVE") return null;

  const rejected = verificationStatus === "REJECT";
  return (
    <div
      className={
        rejected
          ? "rounded-lg border border-destructive/30 bg-destructive/5 p-4 text-sm"
          : "rounded-lg border border-amber-500/30 bg-amber-500/5 p-4 text-sm"
      }
    >
      <p className="font-medium">
        {rejected
          ? "Your expert application was rejected"
          : "Your expert application is under review"}
      </p>
      <p className="mt-1 text-muted-foreground">
        {rejected
          ? "See the reason on your profile page."
          : "An admin is checking your documents. You'll get an email once it's approved."}
      </p>
      {rejected && (
        <Button
          className="mt-3"
          size="sm"
          variant="outline"
          render={<Link href="/expert/profile" />}
        >
          View profile
        </Button>
      )}
    </div>
  );
}

// In-progress work, nearest deadline first.
function ActiveWork() {
  const { data, isLoading, isError, error } =
    useGetMyAssignments<IExpertAssignment>({
      status: "IN_PROGRESS",
      page: 1,
      limit: 5,
      sortBy: "deadline",
      sortOrder: "asc",
    });
  const assignments = data?.data ?? [];

  return (
    <section className="rounded-lg border border-border">
      <div className="flex items-center justify-between gap-2 border-b border-border p-4">
        <div>
          <h2 className="text-sm font-medium">In progress</h2>
          <p className="text-xs text-muted-foreground">
            Nearest deadline first
          </p>
        </div>
        <Button
          size="sm"
          variant="ghost"
          render={<Link href="/expert/assignments-management" />}
        >
          View all
        </Button>
      </div>

      {isLoading ? (
        <div className="space-y-3 p-4">
          {Array.from({ length: 2 }, (_, i) => (
            <Skeleton key={i} className="h-10" />
          ))}
        </div>
      ) : isError ? (
        <p className="p-4 text-sm text-destructive">
          {error.message || "Failed to load your active work."}
        </p>
      ) : assignments.length === 0 ? (
        <p className="p-4 text-sm text-muted-foreground">
          Nothing in progress right now.
        </p>
      ) : (
        <ul className="divide-y divide-border">
          {assignments.map((assignment) => {
            const daysLeft = differenceInCalendarDays(
              new Date(assignment.deadline),
              new Date(),
            );
            return (
              <li
                key={assignment.id}
                className="flex flex-wrap items-center justify-between gap-2 p-4 text-sm"
              >
                <div className="min-w-0">
                  <p className="truncate font-medium">{assignment.title}</p>
                  <p className="text-xs text-muted-foreground">
                    {assignment.student.user.name} · due{" "}
                    {formatDate(assignment.deadline)}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span
                    className={
                      daysLeft < 0
                        ? "text-xs font-medium text-destructive"
                        : daysLeft <= 2
                          ? "text-xs font-medium text-amber-600 dark:text-amber-400"
                          : "text-xs text-muted-foreground"
                    }
                  >
                    {daysLeft < 0
                      ? `${Math.abs(daysLeft)}d overdue`
                      : daysLeft === 0
                        ? "Due today"
                        : `${daysLeft}d left`}
                  </span>
                  <StatusBadge
                    status={assignment.status}
                    className={assignmentStatusStyles[assignment.status]}
                  />
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
