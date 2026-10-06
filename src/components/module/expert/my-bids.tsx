"use client";

import AdminTableSkeleton from "@/components/module/admin/admin-table-skeleton";
import {
  assignmentStatusStyles,
  formatCurrency,
  formatDate,
  formatStatus,
  numberFormatter,
} from "@/components/module/admin/admin-format";
import StatCard, {
  StatCardSkeleton,
} from "@/components/module/admin/stat-card";
import StatusBadge from "@/components/module/admin/status-badge";
import { Button } from "@/components/ui/button";
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
import { toast } from "@/components/ui/toast";
import { useDeleteBid, useGetExpertOverview, useGetMyBids } from "@/hooks";
import { IMyBid, TBidStatus } from "@/type";
import { cn } from "cn";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

const PAGE_LIMIT = 10;
const COLUMN_COUNT = 7;

type TabValue = TBidStatus | "ALL";
const tabs: TabValue[] = ["ALL", "PENDING", "ACCEPTED", "REJECTED"];

const bidStatusStyles: Record<TBidStatus, string> = {
  PENDING: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
  ACCEPTED: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
  REJECTED: "bg-destructive/10 text-destructive",
};

export default function MyBids() {
  const [tab, setTab] = useState<TabValue>("ALL");
  const [page, setPage] = useState(1);

  const overview = useGetExpertOverview();
  const bidStats = overview.data?.data?.bids;

  const { data, isLoading, isError, error, isPlaceholderData } = useGetMyBids(
    {
      status: tab === "ALL" ? undefined : tab,
      page,
      limit: PAGE_LIMIT,
      sortBy: "createdAt",
      sortOrder: "desc",
    },
  );

  const bids = data?.data ?? [];
  const currentPage = data?.meta?.page ?? page;
  const totalPages = data?.meta?.totalPages ?? 1;
  const limit = data?.meta?.limit ?? PAGE_LIMIT;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="font-heading text-xl font-semibold">
            Bids management
          </h1>
          <p className="text-sm text-muted-foreground">
            Every bid you&apos;ve placed. Pending bids can be withdrawn until
            the student picks one.
          </p>
        </div>
        <Button render={<Link href="/assignments" />} size="sm">
          Find assignments
        </Button>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {overview.isLoading || !bidStats ? (
          !overview.isError &&
          Array.from({ length: 4 }, (_, i) => <StatCardSkeleton key={i} />)
        ) : (
          <>
            <StatCard
              label="Total bids"
              value={numberFormatter.format(bidStats.total)}
            />
            <StatCard
              label="Pending"
              value={numberFormatter.format(bidStats.byStatus.PENDING)}
              hint="Waiting on the student"
            />
            <StatCard
              label="Won"
              value={numberFormatter.format(bidStats.byStatus.ACCEPTED)}
            />
            <StatCard
              label="Win rate"
              value={`${bidStats.winRate}%`}
              hint={`${numberFormatter.format(bidStats.byStatus.REJECTED)} not selected`}
            />
          </>
        )}
      </div>

      <div className="space-y-4">
        <Tabs
          value={tab}
          onValueChange={(value) => {
            setTab(value as TabValue);
            setPage(1);
          }}
        >
          <div className="overflow-x-auto">
            <TabsList>
              {tabs.map((value) => (
                <TabsTrigger
                  key={value}
                  value={value}
                  className="cursor-pointer"
                >
                  {formatStatus(value)}
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
                <TableHead className="text-right">Budget</TableHead>
                <TableHead className="text-right">Your bid</TableHead>
                <TableHead>Delivery</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isError && (
                <TableRow>
                  <TableCell
                    colSpan={COLUMN_COUNT}
                    className="py-10 text-center text-destructive"
                  >
                    {error.message || "Failed to load your bids."}
                  </TableCell>
                </TableRow>
              )}
              {!isError && bids.length === 0 && (
                <TableRow>
                  <TableCell
                    colSpan={COLUMN_COUNT}
                    className="py-10 text-center text-muted-foreground"
                  >
                    {tab === "ALL"
                      ? "You haven't placed any bids yet."
                      : `No ${formatStatus(tab).toLowerCase()} bids.`}
                  </TableCell>
                </TableRow>
              )}
              {bids.map((bid, index) => (
                <TableRow key={bid.id}>
                  <TableCell>
                    {(currentPage - 1) * limit + index + 1}
                  </TableCell>
                  <TableCell className="max-w-72">
                    <p className="truncate font-medium">
                      {bid.assignment.title}
                    </p>
                    <div className="mt-1 flex items-center gap-2">
                      <StatusBadge
                        status={bid.assignment.status}
                        className={
                          assignmentStatusStyles[bid.assignment.status]
                        }
                      />
                      <span className="text-xs text-muted-foreground">
                        Bid {formatDate(bid.createdAt)}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="text-right tabular-nums">
                    {formatCurrency(bid.assignment.budget)}
                  </TableCell>
                  <TableCell className="text-right font-medium tabular-nums">
                    {formatCurrency(bid.proposedAmount)}
                  </TableCell>
                  <TableCell>
                    <p>{formatDate(bid.estimatedDelivery)}</p>
                    <p className="text-xs text-muted-foreground">
                      Due {formatDate(bid.assignment.deadline)}
                    </p>
                  </TableCell>
                  <TableCell className="max-w-56">
                    <StatusBadge
                      status={bid.status}
                      className={bidStatusStyles[bid.status]}
                    />
                    {bid.status === "REJECTED" && bid.cancelReason && (
                      <p className="mt-1 text-xs text-muted-foreground">
                        {bid.cancelReason}
                      </p>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    {bid.status === "PENDING" ? (
                      <WithdrawBidButton bid={bid} />
                    ) : bid.status === "ACCEPTED" ? (
                      <Button
                        size="sm"
                        variant="outline"
                        render={
                          <Link href="/expert/assignments-management" />
                        }
                      >
                        Open work
                      </Button>
                    ) : (
                      <span className="text-muted-foreground">—</span>
                    )}
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
      </div>
    </div>
  );
}

function WithdrawBidButton({ bid }: { bid: IMyBid }) {
  const [confirming, setConfirming] = useState(false);
  const { mutate: deleteBid, isPending } = useDeleteBid();

  if (!confirming) {
    return (
      <Button size="sm" variant="outline" onClick={() => setConfirming(true)}>
        Withdraw
      </Button>
    );
  }

  return (
    <div className="flex justify-end gap-2">
      <Button
        size="sm"
        variant="ghost"
        disabled={isPending}
        onClick={() => setConfirming(false)}
      >
        Keep
      </Button>
      <Button
        size="sm"
        variant="destructive"
        disabled={isPending}
        onClick={() =>
          deleteBid(bid.id, {
            onSuccess: () => {
              toast.add({ title: "Bid withdrawn", type: "success" });
            },
            onError: (err) => {
              setConfirming(false);
              toast.add({
                title: err.message || "Failed to withdraw bid",
                type: "error",
              });
            },
          })
        }
      >
        {isPending ? <Loader2 className="animate-spin" /> : "Confirm"}
      </Button>
    </div>
  );
}
