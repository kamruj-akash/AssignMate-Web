"use client";

import AdminTableSkeleton from "@/components/module/admin/admin-table-skeleton";
import {
  escrowStatusStyles,
  formatCurrency,
  formatDate,
  formatStatus,
} from "@/components/module/admin/admin-format";
import StatCard, {
  StatCardSkeleton,
} from "@/components/module/admin/stat-card";
import StatusBadge from "@/components/module/admin/status-badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import TablePagination from "@/components/ui/tablePagination";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useGetExpertEarnings, useGetExpertOverview } from "@/hooks";
import { TEscrowStatus } from "@/type";
import { cn } from "cn";
import { CheckCircle2, Lock, Star, Wallet } from "lucide-react";
import { useState } from "react";

const PAGE_LIMIT = 10;
const COLUMN_COUNT = 6;

type TabValue = TEscrowStatus | "ALL";
const tabs: { value: TabValue; label: string }[] = [
  { value: "ALL", label: "All" },
  { value: "HELD", label: "In escrow" },
  { value: "RELEASED_TO_EXPERT", label: "Paid out" },
  { value: "REFUNDED_TO_STUDENT", label: "Refunded" },
];

const escrowLabels: Record<TEscrowStatus, string> = {
  HELD: "In escrow",
  RELEASED_TO_EXPERT: "Paid out",
  REFUNDED_TO_STUDENT: "Refunded",
};

export default function ExpertEarnings() {
  const [tab, setTab] = useState<TabValue>("ALL");
  const [page, setPage] = useState(1);

  const overview = useGetExpertOverview();
  const stats = overview.data?.data;

  const { data, isLoading, isError, error, isPlaceholderData } =
    useGetExpertEarnings({
      status: tab === "ALL" ? undefined : tab,
      page,
      limit: PAGE_LIMIT,
    });

  const earnings = data?.data ?? [];
  const currentPage = data?.meta?.page ?? page;
  const totalPages = data?.meta?.totalPages ?? 1;
  const limit = data?.meta?.limit ?? PAGE_LIMIT;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-xl font-semibold">Earnings</h1>
        <p className="text-sm text-muted-foreground">
          The student&apos;s payment is held in escrow while you work and
          released to your wallet, minus the platform fee, once they approve.
        </p>
      </div>

      {overview.isError && (
        <p className="rounded-lg border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive">
          {overview.error.message || "Failed to load earnings totals."}
        </p>
      )}

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {overview.isLoading || !stats ? (
          !overview.isError &&
          Array.from({ length: 4 }, (_, i) => <StatCardSkeleton key={i} />)
        ) : (
          <>
            <StatCard
              label="Wallet balance"
              icon={Wallet}
              value={formatCurrency(stats.earnings.walletBalance)}
            />
            <StatCard
              label="Total earned"
              icon={CheckCircle2}
              value={formatCurrency(stats.earnings.released)}
              hint={`${stats.assignments.byStatus.COMPLETED} completed assignments`}
            />
            <StatCard
              label="Pending in escrow"
              icon={Lock}
              value={formatCurrency(stats.earnings.pendingInEscrow)}
              hint="Released when the student approves"
            />
            <StatCard
              label="Rating"
              icon={Star}
              value={
                stats.reputation.totalReviews > 0
                  ? stats.reputation.averageRating.toFixed(1)
                  : "—"
              }
              hint={`${stats.reputation.totalReviews} reviews`}
            />
          </>
        )}
      </div>

      <section className="space-y-4">
        <h2 className="font-medium">Payout history</h2>

        <Tabs
          value={tab}
          onValueChange={(value) => {
            setTab(value as TabValue);
            setPage(1);
          }}
        >
          <div className="overflow-x-auto">
            <TabsList>
              {tabs.map(({ value, label }) => (
                <TabsTrigger
                  key={value}
                  value={value}
                  className="cursor-pointer"
                >
                  {label}
                </TabsTrigger>
              ))}
            </TabsList>
          </div>
        </Tabs>

        {isLoading ? (
          <AdminTableSkeleton columns={COLUMN_COUNT} />
        ) : (
          <Table
            className={cn(
              "border border-border transition-opacity",
              isPlaceholderData && "opacity-60",
            )}
          >
            <TableHeader>
              <TableRow>
                <TableHead>SL</TableHead>
                <TableHead>Assignment</TableHead>
                <TableHead className="text-right">Paid by student</TableHead>
                <TableHead className="text-right">Your payout</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isError && (
                <TableRow>
                  <TableCell
                    colSpan={COLUMN_COUNT}
                    className="py-10 text-center text-destructive"
                  >
                    {error.message || "Failed to load payout history."}
                  </TableCell>
                </TableRow>
              )}
              {!isError && earnings.length === 0 && (
                <TableRow>
                  <TableCell
                    colSpan={COLUMN_COUNT}
                    className="py-10 text-center text-muted-foreground"
                  >
                    No payouts yet. Win a bid and get it funded to see it here.
                  </TableCell>
                </TableRow>
              )}
              {earnings.map((earning, index) => (
                <TableRow key={earning.id}>
                  <TableCell>
                    {(currentPage - 1) * limit + index + 1}
                  </TableCell>
                  <TableCell className="max-w-72">
                    <p className="truncate font-medium">
                      {earning.assignment.title}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {earning.assignment.studentName} ·{" "}
                      {formatStatus(earning.assignment.status)}
                    </p>
                  </TableCell>
                  <TableCell className="text-right tabular-nums">
                    {formatCurrency(earning.totalAmount)}
                  </TableCell>
                  <TableCell className="text-right tabular-nums">
                    <p
                      className={cn(
                        "font-medium",
                        earning.status === "REFUNDED_TO_STUDENT" &&
                          "text-muted-foreground line-through",
                      )}
                    >
                      {formatCurrency(earning.payout)}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {earning.expertEarningsRate}% share
                    </p>
                  </TableCell>
                  <TableCell>
                    <StatusBadge
                      status={earning.status}
                      label={escrowLabels[earning.status]}
                      className={escrowStatusStyles[earning.status]}
                    />
                  </TableCell>
                  <TableCell>
                    {formatDate(earning.disbursedAt ?? earning.createdAt)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}

        {totalPages > 1 && (
          <TablePagination
            currentPage={currentPage}
            setPage={setPage}
            totalPages={totalPages}
          />
        )}
      </section>
    </div>
  );
}
