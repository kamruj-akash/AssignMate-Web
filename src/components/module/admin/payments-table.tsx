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
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useGetPaymentHistory } from "@/hooks";
import { useDebounce } from "@/hooks/debounce.hook";
import { IPayment, TPaymentStatus } from "@/type";
import { cn } from "cn";
import { Search } from "lucide-react";
import { useState } from "react";
import {
  formatCurrency,
  formatDate,
  formatStatus,
  paymentStatusStyles,
} from "./admin-format";
import AdminTableSkeleton from "./admin-table-skeleton";
import EscrowVaultSheet from "./escrow-vault-sheet";
import StatusBadge from "./status-badge";

const PAGE_LIMIT = 10;
const COLUMN_COUNT = 8;

type TabValue = TPaymentStatus | "ALL";

const paymentTabs: TabValue[] = ["ALL", "PAID", "INITIATED", "FAILED", "REFUNDED"];

// bKash stores paidAt in its own format, which Date can't always parse; the
// row's updatedAt is stamped by the same callback, so fall back to it.
const getPaidAt = (payment: IPayment) => {
  if (payment.status !== "PAID" && payment.status !== "REFUNDED") return null;
  const parsed = payment.paidAt ? new Date(payment.paidAt) : null;
  return parsed && !Number.isNaN(parsed.getTime())
    ? parsed.toISOString()
    : payment.updatedAt;
};

// Escrow exists only once a payment has gone through.
const hasEscrow = (status: TPaymentStatus) =>
  status === "PAID" || status === "REFUNDED";

export default function PaymentsTable({
  status,
  emptyMessage = "No payments yet.",
}: {
  // Locks the table to one status and hides the status tabs
  status?: TPaymentStatus;
  emptyMessage?: string;
}) {
  const [tab, setTab] = useState<TabValue>(status ?? "ALL");
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  const { data, isLoading, isError, error, isPlaceholderData } =
    useGetPaymentHistory({
      status: tab === "ALL" ? undefined : tab,
      page,
      limit: PAGE_LIMIT,
      searchTerm: debouncedSearchTerm || undefined,
      sortBy: "createdAt",
      sortOrder: "desc",
    });

  const payments = data?.data ?? [];
  const currentPage = data?.meta?.page ?? page;
  const totalPages = data?.meta?.totalPages ?? 1;
  const limit = data?.meta?.limit ?? PAGE_LIMIT;

  return (
    <div className="space-y-4">
      <div className="relative w-full sm:max-w-sm">
        <Search className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          className="pl-8"
          placeholder="Search by assignment, student or transaction ID..."
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setPage(1);
          }}
        />
      </div>

      {!status && (
        <Tabs
          value={tab}
          onValueChange={(value) => {
            setTab(value as TabValue);
            setPage(1);
          }}
        >
          <div className="overflow-x-auto">
            <TabsList>
              {paymentTabs.map((value) => (
                <TabsTrigger key={value} value={value} className="cursor-pointer">
                  {formatStatus(value)}
                </TabsTrigger>
              ))}
            </TabsList>
          </div>
        </Tabs>
      )}

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
              <TableHead>Transaction</TableHead>
              <TableHead>Paid at</TableHead>
              <TableHead className="text-right">Amount</TableHead>
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
                  {error.message || "Failed to load payments."}
                </TableCell>
              </TableRow>
            )}
            {!isError && payments.length === 0 && (
              <TableRow>
                <TableCell
                  colSpan={COLUMN_COUNT}
                  className="py-10 text-center text-muted-foreground"
                >
                  {debouncedSearchTerm || tab !== (status ?? "ALL")
                    ? "No payments match your filters."
                    : emptyMessage}
                </TableCell>
              </TableRow>
            )}
            {payments.map((payment, index) => (
              <TableRow key={payment.id}>
                <TableCell>{(currentPage - 1) * limit + index + 1}</TableCell>
                <TableCell className="max-w-xs">
                  <p className="truncate font-medium" title={payment.assignment.title}>
                    {payment.assignment.title}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Created {formatDate(payment.createdAt)}
                  </p>
                </TableCell>
                <TableCell>
                  <p>{payment.assignment.student.user.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {payment.assignment.student.user.email}
                  </p>
                </TableCell>
                <TableCell>
                  <p className="font-mono text-xs">
                    {payment.bkashTrxId || payment.transactionId || "—"}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {payment.paymentGateway}
                  </p>
                </TableCell>
                <TableCell>
                  {formatDate(getPaidAt(payment), "dd MMM yyyy, p")}
                </TableCell>
                <TableCell className="text-right tabular-nums">
                  {formatCurrency(payment.amount)}
                </TableCell>
                <TableCell className="text-right">
                  <StatusBadge
                    status={payment.status}
                    className={paymentStatusStyles[payment.status]}
                  />
                </TableCell>
                <TableCell className="text-right">
                  {hasEscrow(payment.status) ? (
                    <EscrowVaultSheet
                      assignmentId={payment.assignmentId}
                      title={payment.assignment.title}
                    />
                  ) : (
                    <span className="text-xs text-muted-foreground">—</span>
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
  );
}
