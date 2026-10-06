"use client";

import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import TablePagination from "@/components/ui/tablePagination";
import { useGetCancellationRequests } from "@/hooks";
import { useDebounce } from "@/hooks/debounce.hook";
import { cn } from "cn";
import { Search } from "lucide-react";
import { useState } from "react";
import { formatCurrency, formatDate } from "./admin-format";
import AdminTableSkeleton from "./admin-table-skeleton";
import ReviewCancellationSheet from "./review-cancellation-sheet";

const PAGE_LIMIT = 10;
const COLUMN_COUNT = 6;

export default function CancellationRequests() {
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  const { data, isLoading, isError, error, isPlaceholderData } =
    useGetCancellationRequests({
      page,
      limit: PAGE_LIMIT,
      searchTerm: debouncedSearchTerm || undefined,
    });

  const requests = data?.data ?? [];
  const currentPage = data?.meta?.page ?? page;
  const totalPages = data?.meta?.totalPages ?? 1;
  const limit = data?.meta?.limit ?? PAGE_LIMIT;

  return (
    <section className="space-y-3">
      <div>
        <h2 className="font-medium">Cancellation requests</h2>
        <p className="text-sm text-muted-foreground">
          {data?.meta
            ? `${data.meta.total} cancelled assignments waiting on a decision. The payment stays in escrow until you approve (refund the student) or reject (pay the expert).`
            : "Cancelled assignments waiting on a decision."}
        </p>
      </div>

      <div className="relative w-full sm:max-w-sm">
        <Search className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          className="pl-8"
          placeholder="Search by title, student or expert..."
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setPage(1);
          }}
        />
      </div>

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
              <TableHead>Student</TableHead>
              <TableHead>Expert</TableHead>
              <TableHead className="text-right">Held</TableHead>
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
                  {error.message || "Failed to load cancellation requests."}
                </TableCell>
              </TableRow>
            )}
            {!isError && requests.length === 0 && (
              <TableRow>
                <TableCell
                  colSpan={COLUMN_COUNT}
                  className="py-10 text-center text-muted-foreground"
                >
                  {debouncedSearchTerm
                    ? "No cancellation requests match your search."
                    : "No cancellation requests to review."}
                </TableCell>
              </TableRow>
            )}
            {requests.map((request, index) => (
              <TableRow key={request.id}>
                <TableCell>{(currentPage - 1) * limit + index + 1}</TableCell>
                <TableCell className="max-w-64">
                  <p className="truncate font-medium">{request.title}</p>
                  <p className="text-xs text-muted-foreground">
                    Cancelled {formatDate(request.updatedAt)}
                  </p>
                </TableCell>
                <TableCell>
                  <p className="font-medium">{request.student.user.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {request.student.user.email}
                  </p>
                </TableCell>
                <TableCell>
                  <p className="font-medium">
                    {request.assignedExpert?.user.name ?? "—"}
                  </p>
                  {request.assignedExpert && (
                    <p className="text-xs text-muted-foreground">
                      {request.assignedExpert.user.email}
                    </p>
                  )}
                </TableCell>
                <TableCell className="text-right tabular-nums">
                  {formatCurrency(request.escrow?.totalAmount ?? request.budget)}
                </TableCell>
                <TableCell className="text-right">
                  <ReviewCancellationSheet request={request} />
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
  );
}
