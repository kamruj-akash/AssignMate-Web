"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import TablePagination from "@/components/ui/tablePagination";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useGetOpenAssignments } from "@/hooks";
import { useDebounce } from "@/hooks/debounce.hook";
import { IOpenAssignment, IOpenAssignmentQueryParams } from "@/type";
import { cn } from "cn";
import { differenceInCalendarDays, format, formatDistanceToNow } from "date-fns";
import { CalendarClock, FileSearch, Paperclip, Search } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

const PAGE_LIMIT = 9;

const sortOptions = {
  newest: { label: "Newest", sortBy: "createdAt", sortOrder: "desc" },
  deadline: { label: "Ending soon", sortBy: "deadline", sortOrder: "asc" },
  budget: { label: "Highest budget", sortBy: "budget", sortOrder: "desc" },
} satisfies Record<string, { label: string } & IOpenAssignmentQueryParams>;

type SortKey = keyof typeof sortOptions;

const currencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

export default function OpenAssignments() {
  const [sort, setSort] = useState<SortKey>("newest");
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  const { sortBy, sortOrder } = sortOptions[sort];
  const { data, isLoading, isError, isPlaceholderData, refetch } =
    useGetOpenAssignments({
      page,
      limit: PAGE_LIMIT,
      searchTerm: debouncedSearchTerm || undefined,
      sortBy,
      sortOrder,
    });

  const assignments = data?.data ?? [];
  const total = data?.meta?.total ?? 0;
  const totalPages = data?.meta?.totalPages ?? 1;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full sm:max-w-sm">
          <Search className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            className="pl-8"
            placeholder="Search by title or description..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setPage(1);
            }}
          />
        </div>
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
      </div>

      {!isLoading && !isError && (
        <p className="text-sm text-muted-foreground">
          {total} open {total === 1 ? "assignment" : "assignments"}
          {debouncedSearchTerm && <> matching “{debouncedSearchTerm}”</>}
        </p>
      )}

      {isLoading ? (
        <AssignmentGridSkeleton />
      ) : isError ? (
        <EmptyState
          title="Couldn't load assignments"
          description="Something went wrong while fetching the feed."
          action={
            <Button variant="outline" onClick={() => refetch()}>
              Try again
            </Button>
          }
        />
      ) : assignments.length === 0 ? (
        <EmptyState
          title="No assignments found"
          description={
            debouncedSearchTerm
              ? "Try a different search term."
              : "New assignments will show up here as soon as students post them."
          }
        />
      ) : (
        <div
          className={cn(
            "grid gap-4 transition-opacity sm:grid-cols-2 lg:grid-cols-3",
            isPlaceholderData && "opacity-60",
          )}
        >
          {assignments.map((assignment) => (
            <AssignmentCard key={assignment.id} assignment={assignment} />
          ))}
        </div>
      )}

      {totalPages > 1 && (
        <TablePagination
          // Remount so the pagination's own page state resets with filters.
          key={`${sort}-${debouncedSearchTerm}`}
          setPage={setPage}
          totalPages={totalPages}
        />
      )}
    </div>
  );
}

function AssignmentCard({ assignment }: { assignment: IOpenAssignment }) {
  const deadline = new Date(assignment.deadline);
  const daysLeft = differenceInCalendarDays(deadline, new Date());

  const deadlineLabel =
    daysLeft < 0
      ? "Deadline passed"
      : daysLeft === 0
        ? "Due today"
        : `${daysLeft} ${daysLeft === 1 ? "day" : "days"} left`;

  return (
    <article className="flex flex-col rounded-xl border border-border bg-card p-5 transition-colors hover:border-primary/40">
      <div className="mb-4 flex items-start justify-between gap-3">
        <div>
          <p className="text-xs text-muted-foreground">Budget</p>
          <p className="font-heading text-2xl font-semibold tracking-tight">
            {currencyFormatter.format(Number(assignment.budget))}
          </p>
        </div>
        <span
          className={cn(
            "inline-flex shrink-0 items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium",
            daysLeft < 0
              ? "bg-muted text-muted-foreground"
              : daysLeft <= 3
                ? "bg-destructive/10 text-destructive"
                : "bg-primary/10 text-primary",
          )}
        >
          <CalendarClock className="size-3.5" />
          {deadlineLabel}
        </span>
      </div>

      <h2 className="line-clamp-2 font-medium text-balance">
        {assignment.title}
      </h2>
      <p className="mt-2 line-clamp-3 flex-1 text-sm text-muted-foreground">
        {assignment.description}
      </p>

      <div className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
        <span title={format(deadline, "PPpp")}>
          Due {format(deadline, "MMM d, yyyy")}
        </span>
        <span aria-hidden>·</span>
        <span>
          Posted{" "}
          {formatDistanceToNow(new Date(assignment.createdAt), {
            addSuffix: true,
          })}
        </span>
        {assignment.attachmentUrl && (
          <>
            <span aria-hidden>·</span>
            <span className="inline-flex items-center gap-1">
              <Paperclip className="size-3" />
              Brief attached
            </span>
          </>
        )}
      </div>

      <Button
        className="mt-5 w-full"
        nativeButton={false}
        render={<Link href="/expert/assignments-management" />}
      >
        Place a bid
      </Button>
    </article>
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
    <div className="flex flex-col items-center gap-3 rounded-xl border border-dashed border-border px-4 py-16 text-center">
      <div className="flex size-11 items-center justify-center rounded-full bg-muted">
        <FileSearch className="size-5 text-muted-foreground" />
      </div>
      <div className="space-y-1">
        <p className="font-medium">{title}</p>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
      {action}
    </div>
  );
}

function AssignmentGridSkeleton() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 6 }, (_, i) => (
        <div key={i} className="rounded-xl border border-border p-5">
          <div className="mb-4 flex justify-between">
            <Skeleton className="h-10 w-24" />
            <Skeleton className="h-6 w-20 rounded-full" />
          </div>
          <Skeleton className="mb-2 h-5 w-4/5" />
          <Skeleton className="mb-1.5 h-4 w-full" />
          <Skeleton className="mb-1.5 h-4 w-full" />
          <Skeleton className="h-4 w-2/3" />
          <Skeleton className="mt-5 h-9 w-full" />
        </div>
      ))}
    </div>
  );
}
