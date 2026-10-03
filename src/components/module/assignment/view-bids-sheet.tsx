"use client";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Skeleton } from "@/components/ui/skeleton";
import TablePagination from "@/components/ui/tablePagination";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "@/components/ui/toast";
import { useAcceptBid, useGetBidsByAssignmentId } from "@/hooks";
import { IAssignment, IAssignmentBid, IBidQueryParams } from "@/type";
import { cn } from "cn";
import { differenceInCalendarDays, format } from "date-fns";
import { CalendarClock, Check, GraduationCap, Inbox, Loader2 } from "lucide-react";
import { useState } from "react";

const PAGE_LIMIT = 10;

const sortOptions = {
  newest: { label: "Newest", sortBy: "createdAt", sortOrder: "desc" },
  price: { label: "Lowest price", sortBy: "proposedAmount", sortOrder: "asc" },
  delivery: {
    label: "Fastest delivery",
    sortBy: "estimatedDelivery",
    sortOrder: "asc",
  },
} satisfies Record<string, { label: string } & IBidQueryParams>;

type SortKey = keyof typeof sortOptions;

const currencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

export default function ViewBidsSheet({
  assignment,
}: {
  assignment: IAssignment;
}) {
  const [open, setOpen] = useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger render={<Button size="sm" />}>
        View Bids
        {assignment._count.bids > 0 && (
          <span className="rounded-full bg-primary-foreground/20 px-1.5 text-xs tabular-nums">
            {assignment._count.bids}
          </span>
        )}
      </SheetTrigger>

      <SheetContent className="w-full gap-0 data-[side=right]:sm:max-w-xl">
        <BidList assignment={assignment} setOpen={setOpen} />
      </SheetContent>
    </Sheet>
  );
}

function BidList({
  assignment,
  setOpen,
}: {
  assignment: IAssignment;
  setOpen: (open: boolean) => void;
}) {
  const [sort, setSort] = useState<SortKey>("newest");
  const [page, setPage] = useState(1);
  const [confirmingId, setConfirmingId] = useState<string | null>(null);

  const { sortBy, sortOrder } = sortOptions[sort];
  const { data, isLoading, isError, error, isPlaceholderData, refetch } =
    useGetBidsByAssignmentId(assignment.id, {
      page,
      limit: PAGE_LIMIT,
      sortBy,
      sortOrder,
    });
  const { mutate: acceptBid, isPending, variables: acceptingId } =
    useAcceptBid();

  const bids = data?.data ?? [];
  const currentPage = data?.meta?.page ?? page;
  const totalPages = data?.meta?.totalPages ?? 1;

  const handleAccept = (bid: IAssignmentBid) => {
    acceptBid(bid.id, {
      onSuccess: (res) => {
        toast.add({
          title: res?.message || `Accepted ${bid.expert.user.name}'s bid`,
          type: "success",
        });
        setOpen(false);
      },
      onError: (err) => {
        toast.add({
          title: err.message || "Failed to accept bid",
          type: "error",
        });
        setConfirmingId(null);
      },
    });
  };

  return (
    <div className="flex h-full min-h-0 flex-col">
      <SheetHeader className="border-b border-border pr-12">
        <SheetTitle className="text-lg font-semibold text-balance">
          Bids for “{assignment.title}”
        </SheetTitle>
        <SheetDescription>
          Your budget {currencyFormatter.format(Number(assignment.budget))} ·
          Due {format(new Date(assignment.deadline), "MMM d, yyyy")}
        </SheetDescription>
      </SheetHeader>

      <div className="flex-1 space-y-4 overflow-y-auto p-4">
        <Tabs
          value={sort}
          onValueChange={(value) => {
            setSort(value as SortKey);
            setPage(1);
          }}
        >
          <TabsList>
            {(Object.keys(sortOptions) as SortKey[]).map((key) => (
              <TabsTrigger key={key} value={key} className="cursor-pointer">
                {sortOptions[key].label}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>

        {isLoading ? (
          <BidListSkeleton />
        ) : isError ? (
          <EmptyState
            title="Couldn't load bids"
            description={error.message || "Something went wrong."}
            action={
              <Button variant="outline" size="sm" onClick={() => refetch()}>
                Try again
              </Button>
            }
          />
        ) : bids.length === 0 ? (
          <EmptyState
            title="No bids yet"
            description="Experts will start bidding soon. Check back later."
          />
        ) : (
          <ul
            className={cn(
              "space-y-3 transition-opacity",
              isPlaceholderData && "opacity-60",
            )}
          >
            {bids.map((bid) => (
              <BidCard
                key={bid.id}
                bid={bid}
                budget={Number(assignment.budget)}
                isConfirming={confirmingId === bid.id}
                isAccepting={isPending && acceptingId === bid.id}
                disabled={isPending}
                onRequestAccept={() => setConfirmingId(bid.id)}
                onCancelConfirm={() => setConfirmingId(null)}
                onAccept={() => handleAccept(bid)}
              />
            ))}
          </ul>
        )}
      </div>

      {totalPages > 1 && (
        <div className="border-t border-border p-4">
          <TablePagination
            currentPage={currentPage}
            setPage={setPage}
            totalPages={totalPages}
          />
        </div>
      )}
    </div>
  );
}

function BidCard({
  bid,
  budget,
  isConfirming,
  isAccepting,
  disabled,
  onRequestAccept,
  onCancelConfirm,
  onAccept,
}: {
  bid: IAssignmentBid;
  budget: number;
  isConfirming: boolean;
  isAccepting: boolean;
  disabled: boolean;
  onRequestAccept: () => void;
  onCancelConfirm: () => void;
  onAccept: () => void;
}) {
  const amount = Number(bid.proposedAmount);
  const delivery = new Date(bid.estimatedDelivery);
  const daysToDeliver = differenceInCalendarDays(delivery, new Date());
  const diff = amount - budget;

  return (
    <li
      className={cn(
        "rounded-xl border border-border bg-card p-4",
        bid.status === "ACCEPTED" && "border-emerald-500/50",
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="truncate font-medium">{bid.expert.user.name}</p>
          <p className="flex items-center gap-1 truncate text-xs text-muted-foreground">
            <GraduationCap className="size-3.5 shrink-0" />
            {bid.expert.department}, {bid.expert.university}
          </p>
        </div>
        <div className="shrink-0 text-right">
          <p className="font-heading text-xl font-semibold tracking-tight">
            {currencyFormatter.format(amount)}
          </p>
          {diff !== 0 && (
            <p
              className={cn(
                "text-xs",
                diff < 0
                  ? "text-emerald-600 dark:text-emerald-400"
                  : "text-muted-foreground",
              )}
            >
              {currencyFormatter.format(Math.abs(diff))}{" "}
              {diff < 0 ? "under" : "over"} budget
            </p>
          )}
        </div>
      </div>

      <p className="mt-3 inline-flex items-center gap-1.5 text-xs text-muted-foreground">
        <CalendarClock className="size-3.5" />
        Delivers by {format(delivery, "MMM d, yyyy")}
        {daysToDeliver >= 0 && (
          <span>
            ({daysToDeliver === 0 ? "today" : `in ${daysToDeliver}d`})
          </span>
        )}
      </p>

      <p className="mt-3 text-sm whitespace-pre-line">{bid.coverNote}</p>

      {bid.expert.bio && (
        <p className="mt-2 line-clamp-2 text-xs text-muted-foreground">
          {bid.expert.bio}
        </p>
      )}

      <div className="mt-4 flex items-center justify-end gap-2">
        {bid.status === "ACCEPTED" ? (
          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2.5 py-1 text-xs font-medium text-emerald-600 dark:text-emerald-400">
            <Check className="size-3.5" />
            Accepted
          </span>
        ) : isConfirming ? (
          <>
            <p className="mr-auto text-xs text-muted-foreground">
              All other bids will be declined.
            </p>
            <Button
              size="sm"
              variant="ghost"
              disabled={disabled}
              onClick={onCancelConfirm}
            >
              Not yet
            </Button>
            <Button size="sm" disabled={disabled} onClick={onAccept}>
              {isAccepting ? (
                <>
                  <Loader2 className="animate-spin" /> Accepting...
                </>
              ) : (
                <>Confirm {currencyFormatter.format(amount)}</>
              )}
            </Button>
          </>
        ) : (
          <Button size="sm" disabled={disabled} onClick={onRequestAccept}>
            Accept bid
          </Button>
        )}
      </div>
    </li>
  );
}

function EmptyState({
  title,
  description,
  action,
}: {
  title: string;
  description: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col items-center gap-3 rounded-xl border border-dashed border-border px-4 py-12 text-center">
      <div className="flex size-11 items-center justify-center rounded-full bg-muted">
        <Inbox className="size-5 text-muted-foreground" />
      </div>
      <div className="space-y-1">
        <p className="font-medium">{title}</p>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
      {action}
    </div>
  );
}

function BidListSkeleton() {
  return (
    <div className="space-y-3">
      {Array.from({ length: 3 }, (_, i) => (
        <div key={i} className="rounded-xl border border-border p-4">
          <div className="flex justify-between">
            <div>
              <Skeleton className="mb-1.5 h-4 w-32" />
              <Skeleton className="h-3 w-48" />
            </div>
            <Skeleton className="h-7 w-20" />
          </div>
          <Skeleton className="mt-3 h-3 w-36" />
          <Skeleton className="mt-3 mb-1.5 h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="mt-4 ml-auto h-8 w-24" />
        </div>
      ))}
    </div>
  );
}
