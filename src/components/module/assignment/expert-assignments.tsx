"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
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
import { useGetMyAssignments, useSubmitAssignment } from "@/hooks";
import { useDebounce } from "@/hooks/debounce.hook";
import { IExpertAssignment, TStudentAssignmentStatus } from "@/type";
import { cn } from "cn";
import { differenceInCalendarDays, format } from "date-fns";
import { ExternalLink, Loader2, Paperclip, Play, Search } from "lucide-react";
import { useState } from "react";

const PAGE_LIMIT = 10;
const COLUMN_COUNT = 8;

type TabValue = TStudentAssignmentStatus | "ALL";

// Experts only see assignments they've won, so OPEN never applies here.
const expertTabs: TabValue[] = [
  "ALL",
  "AWAITING_PAYMENT",
  "ASSIGNED",
  "IN_PROGRESS",
  "SUBMITTED",
  "UNDER_REVIEW",
  "COMPLETED",
  "DISPUTED",
  "CANCELLED",
];

const statusStyles: Record<TStudentAssignmentStatus, string> = {
  OPEN: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
  ASSIGNED: "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400",
  AWAITING_PAYMENT: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
  IN_PROGRESS: "bg-sky-500/10 text-sky-600 dark:text-sky-400",
  SUBMITTED: "bg-violet-500/10 text-violet-600 dark:text-violet-400",
  UNDER_REVIEW: "bg-orange-500/10 text-orange-600 dark:text-orange-400",
  COMPLETED: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
  CANCELLED: "bg-muted text-muted-foreground",
  DISPUTED: "bg-destructive/10 text-destructive",
};

const currencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

const formatStatus = (status: string) => status.replaceAll("_", " ");

export default function ExpertAssignments() {
  const [tab, setTab] = useState<TabValue>("ALL");
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  const { data, isLoading, isError, error, isPlaceholderData } =
    useGetMyAssignments<IExpertAssignment>({
      status: tab === "ALL" ? undefined : tab,
      page,
      limit: PAGE_LIMIT,
      searchTerm: debouncedSearchTerm || undefined,
    });

  const assignments = data?.data ?? [];
  const currentPage = data?.meta?.page ?? page;
  const totalPages = data?.meta?.totalPages ?? 1;
  const limit = data?.meta?.limit ?? PAGE_LIMIT;

  return (
    <div className="space-y-4">
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
        value={tab}
        onValueChange={(value) => {
          setTab(value as TabValue);
          setPage(1);
        }}
      >
        <div className="overflow-x-auto">
          <TabsList>
            {expertTabs.map((value) => (
              <TabsTrigger key={value} value={value} className="cursor-pointer">
                {formatStatus(value)}
              </TabsTrigger>
            ))}
          </TabsList>
        </div>
      </Tabs>

      {isLoading ? (
        <ExpertAssignmentsSkeleton />
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
              <TableHead>Title</TableHead>
              <TableHead>Student</TableHead>
              <TableHead>Deadline</TableHead>
              <TableHead>Your delivery</TableHead>
              <TableHead className="text-right">Bid amount</TableHead>
              <TableHead className="text-right">Status</TableHead>
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
                  {error.message || "Failed to load assignments."}
                </TableCell>
              </TableRow>
            )}
            {!isError && assignments.length === 0 && (
              <TableRow>
                <TableCell
                  colSpan={COLUMN_COUNT}
                  className="py-10 text-center text-muted-foreground"
                >
                  {debouncedSearchTerm || tab !== "ALL"
                    ? "No assignments match your filters."
                    : "You haven't been assigned any work yet. Win a bid to see it here."}
                </TableCell>
              </TableRow>
            )}
            {assignments.map((assignment, index) => (
              <ExpertAssignmentRow
                key={assignment.id}
                assignment={assignment}
                serial={(currentPage - 1) * limit + index + 1}
              />
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
  );
}

function ExpertAssignmentRow({
  assignment,
  serial,
}: {
  assignment: IExpertAssignment;
  serial: number;
}) {
  const deadline = new Date(assignment.deadline);
  const daysLeft = differenceInCalendarDays(deadline, new Date());
  const isActive =
    assignment.status === "ASSIGNED" || assignment.status === "IN_PROGRESS";

  return (
    <TableRow>
      <TableCell>{serial}</TableCell>
      <TableCell className="max-w-xs">
        <p className="truncate font-medium" title={assignment.title}>
          {assignment.title}
        </p>
        <p
          className="truncate text-xs text-muted-foreground"
          title={assignment.description}
        >
          {assignment.description}
        </p>
        {assignment.attachmentUrl && (
          <a
            href={assignment.attachmentUrl.secure_url}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-1 inline-flex items-center gap-1 text-xs text-primary hover:underline"
          >
            <Paperclip className="size-3" />
            Brief
          </a>
        )}
      </TableCell>
      <TableCell>
        <p>{assignment.student.user.name}</p>
        {assignment.student.institution && (
          <p className="text-xs text-muted-foreground">
            {assignment.student.institution}
          </p>
        )}
      </TableCell>
      <TableCell>
        <p>{format(deadline, "dd MMM yyyy")}</p>
        {isActive && (
          <p
            className={cn(
              "text-xs",
              daysLeft <= 3 ? "text-destructive" : "text-muted-foreground",
            )}
          >
            {daysLeft < 0
              ? "Overdue"
              : daysLeft === 0
                ? "Due today"
                : `${daysLeft} ${daysLeft === 1 ? "day" : "days"} left`}
          </p>
        )}
      </TableCell>
      <TableCell>
        {assignment.acceptedBid
          ? format(
              new Date(assignment.acceptedBid.estimatedDelivery),
              "dd MMM yyyy",
            )
          : "—"}
      </TableCell>
      <TableCell className="text-right">
        {currencyFormatter.format(
          Number(assignment.acceptedBid?.proposedAmount ?? assignment.budget),
        )}
      </TableCell>
      <TableCell className="text-right">
        <span
          className={cn(
            "inline-flex rounded-full px-2 py-0.5 text-xs font-medium whitespace-nowrap",
            statusStyles[assignment.status],
          )}
        >
          {formatStatus(assignment.status)}
        </span>
      </TableCell>
      <TableCell className="text-right">
        <ExpertAssignmentActions assignment={assignment} />
      </TableCell>
    </TableRow>
  );
}

function ExpertAssignmentActions({
  assignment,
}: {
  assignment: IExpertAssignment;
}) {
  const { mutate: submitAssignment, isPending } = useSubmitAssignment();

  const handleStart = () => {
    submitAssignment(
      { assignmentId: assignment.id, status: "IN_PROGRESS" },
      {
        onSuccess: (res) => {
          toast.add({
            title: res?.message || "Marked as in progress",
            type: "success",
          });
        },
        onError: (err) => {
          toast.add({
            title: err.message || "Something went wrong",
            type: "error",
          });
        },
      },
    );
  };

  return (
    <div className="flex items-center justify-end gap-1.5">
      {assignment.status === "ASSIGNED" && (
        <Button
          size="sm"
          variant="outline"
          disabled={isPending}
          onClick={handleStart}
        >
          {isPending ? <Loader2 className="animate-spin" /> : <Play />}
          Start work
        </Button>
      )}

      {/* {(assignment.status === "ASSIGNED" ||
        assignment.status === "IN_PROGRESS") && (
        <SubmitWorkDialog assignment={assignment} />
      )} */}

      {assignment.submissionUrl && (
        <Button
          size="sm"
          variant="outline"
          nativeButton={false}
          render={
            <a
              href={assignment.submissionUrl.url}
              target="_blank"
              rel="noopener noreferrer"
            />
          }
        >
          <ExternalLink />
          View submission
        </Button>
      )}

      {assignment.status === "AWAITING_PAYMENT" && (
        <span className="text-xs text-muted-foreground">
          Waiting for student payment
        </span>
      )}
    </div>
  );
}

function ExpertAssignmentsSkeleton() {
  return (
    <Table className="border border-border">
      <TableHeader>
        <TableRow>
          {Array.from({ length: COLUMN_COUNT }, (_, i) => (
            <TableHead key={i}>
              <Skeleton className={cn("h-4 w-16", i >= 5 && "ml-auto")} />
            </TableHead>
          ))}
        </TableRow>
      </TableHeader>
      <TableBody>
        {Array.from({ length: 6 }, (_, row) => (
          <TableRow key={row}>
            <TableCell>
              <Skeleton className="h-4 w-5" />
            </TableCell>
            <TableCell>
              <Skeleton className="mb-1.5 h-4 w-48" />
              <Skeleton className="h-3 w-64" />
            </TableCell>
            <TableCell>
              <Skeleton className="mb-1.5 h-4 w-24" />
              <Skeleton className="h-3 w-32" />
            </TableCell>
            <TableCell>
              <Skeleton className="h-4 w-24" />
            </TableCell>
            <TableCell>
              <Skeleton className="h-4 w-24" />
            </TableCell>
            <TableCell>
              <Skeleton className="ml-auto h-4 w-14" />
            </TableCell>
            <TableCell>
              <Skeleton className="ml-auto h-5 w-20 rounded-full" />
            </TableCell>
            <TableCell>
              <Skeleton className="ml-auto h-8 w-28" />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
