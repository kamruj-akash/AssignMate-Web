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
import CreateAssignmentDialog from "@/components/module/assignment/create-assignment-dialog";
import PayNowButton from "@/components/module/payment/pay-now-button";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetMe, useGetMyAssignments, useGetStudentOverview } from "@/hooks";
import { IAssignment, IMe, TStudentAssignmentStatus } from "@/type";
import { CheckCircle2, ClipboardList, Lock, Wallet } from "lucide-react";
import Link from "next/link";

export default function StudentOverview() {
  const me = (useGetMe().data as { data?: IMe } | undefined)?.data;
  const { data, isLoading, isError, error } = useGetStudentOverview();
  const overview = data?.data;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="font-heading text-xl font-semibold">
            {me ? `Welcome back, ${me.name.split(" ")[0]}` : "Overview"}
          </h1>
          <p className="text-sm text-muted-foreground">
            Your assignments, bids and payments at a glance.
          </p>
        </div>
        <CreateAssignmentDialog />
      </div>

      {isError && (
        <p className="rounded-lg border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive">
          {error.message || "Failed to load your overview."}
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
              label="Assignments"
              icon={ClipboardList}
              value={numberFormatter.format(overview.assignments.total)}
              hint={`${numberFormatter.format(overview.bidsReceived.byStatus.PENDING)} bids waiting on you`}
            />
            <StatCard
              label="Completed"
              icon={CheckCircle2}
              value={numberFormatter.format(overview.assignments.completed)}
              hint={`${numberFormatter.format(overview.reviewsWritten)} reviews written`}
            />
            <StatCard
              label="Total paid"
              icon={Wallet}
              value={formatCurrency(overview.spending.totalPaid)}
              hint={
                overview.spending.refunded > 0
                  ? `${formatCurrency(overview.spending.refunded)} refunded`
                  : undefined
              }
            />
            <StatCard
              label="Held in escrow"
              icon={Lock}
              value={formatCurrency(overview.spending.inEscrow)}
              hint="Released to the expert when you approve"
            />
          </div>

          <div className="grid gap-3 lg:grid-cols-2">
            <AttentionList
              title="Waiting on payment"
              description="Fund these so the expert can start"
              status="AWAITING_PAYMENT"
              emptyMessage="Nothing to pay right now."
              renderAction={(assignment) => (
                <PayNowButton
                  assignmentId={assignment.id}
                  amount={assignment.budget}
                />
              )}
            />
            <AttentionList
              title="Ready for your review"
              description="Approve the work or cancel with a reason"
              status="SUBMITTED"
              emptyMessage="No submissions waiting on you."
              renderAction={() => (
                <Button
                  size="sm"
                  variant="outline"
                  render={<Link href="/student/assignments" />}
                >
                  Review
                </Button>
              )}
            />
          </div>

          <div className="grid gap-3 lg:grid-cols-2">
            <BreakdownList
              title="Your assignments"
              description="Where each one is right now"
              items={[
                {
                  key: "OPEN",
                  label: "Collecting bids",
                  value: overview.assignments.byStatus.OPEN,
                },
                {
                  key: "AWAITING_PAYMENT",
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
                  label: "Waiting on your review",
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
              title="Bids received"
              description="Expert bids across all your assignments"
              items={[
                {
                  key: "PENDING",
                  label: "Waiting on you",
                  value: overview.bidsReceived.byStatus.PENDING,
                },
                {
                  key: "ACCEPTED",
                  value: overview.bidsReceived.byStatus.ACCEPTED,
                },
                {
                  key: "REJECTED",
                  label: "Not selected",
                  value: overview.bidsReceived.byStatus.REJECTED,
                },
              ]}
            />
          </div>
        </>
      )}
    </div>
  );
}

function AttentionList({
  title,
  description,
  status,
  emptyMessage,
  renderAction,
}: {
  title: string;
  description: string;
  status: TStudentAssignmentStatus;
  emptyMessage: string;
  renderAction: (assignment: IAssignment) => React.ReactNode;
}) {
  const { data, isLoading, isError, error } = useGetMyAssignments({
    status,
    page: 1,
    limit: 3,
    sortBy: "deadline",
    sortOrder: "asc",
  });
  const assignments = data?.data ?? [];
  const total = data?.meta?.total ?? 0;

  return (
    <section className="rounded-lg border border-border">
      <div className="flex items-center justify-between gap-2 border-b border-border p-4">
        <div>
          <h2 className="text-sm font-medium">{title}</h2>
          <p className="text-xs text-muted-foreground">{description}</p>
        </div>
        {total > assignments.length && (
          <Button
            size="sm"
            variant="ghost"
            render={<Link href="/student/assignments" />}
          >
            View all {total}
          </Button>
        )}
      </div>

      {isLoading ? (
        <div className="space-y-3 p-4">
          {Array.from({ length: 2 }, (_, i) => (
            <Skeleton key={i} className="h-10" />
          ))}
        </div>
      ) : isError ? (
        <p className="p-4 text-sm text-destructive">
          {error.message || "Failed to load assignments."}
        </p>
      ) : assignments.length === 0 ? (
        <p className="p-4 text-sm text-muted-foreground">{emptyMessage}</p>
      ) : (
        <ul className="divide-y divide-border">
          {assignments.map((assignment) => (
            <li
              key={assignment.id}
              className="flex flex-wrap items-center justify-between gap-2 p-4 text-sm"
            >
              <div className="min-w-0">
                <p className="truncate font-medium">{assignment.title}</p>
                <div className="mt-1 flex items-center gap-2">
                  <StatusBadge
                    status={assignment.status}
                    className={assignmentStatusStyles[assignment.status]}
                  />
                  <span className="text-xs text-muted-foreground">
                    {assignment.assignedExpert?.user.name ?? "—"} · due{" "}
                    {formatDate(assignment.deadline)}
                  </span>
                </div>
              </div>
              {renderAction(assignment)}
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
