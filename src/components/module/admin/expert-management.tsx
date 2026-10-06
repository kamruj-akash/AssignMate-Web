"use client";

import { Button } from "@/components/ui/button";
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
import { toast } from "@/components/ui/toast";
import { useApproveExpert, useGetAllExperts } from "@/hooks";
import { useDebounce } from "@/hooks/debounce.hook";
import { IAdminExpert, TExpertVerificationStatus } from "@/type";
import { cn } from "cn";
import { Check, Loader2, Search } from "lucide-react";
import { useState } from "react";
import { expertStatusStyles, formatCurrency } from "./admin-format";
import AdminTableSkeleton from "./admin-table-skeleton";
import RejectExpertSheet from "./reject-expert-sheet";
import StatusBadge from "./status-badge";

const PAGE_LIMIT = 10;
const COLUMN_COUNT = 6;

const expertTabs: { value: TExpertVerificationStatus; label: string }[] = [
  { value: "PENDING", label: "Pending" },
  { value: "APPROVE", label: "Approved" },
  { value: "REJECT", label: "Rejected" },
];

const statusLabels: Record<TExpertVerificationStatus, string> = {
  PENDING: "Pending",
  APPROVE: "Approved",
  REJECT: "Rejected",
};

export default function ExpertManagement() {
  const [tab, setTab] = useState<TExpertVerificationStatus>("PENDING");
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  const { data, isLoading, isError, error, isPlaceholderData } =
    useGetAllExperts({
      status: tab,
      page,
      limit: PAGE_LIMIT,
      searchTerm: debouncedSearchTerm || undefined,
      sortBy: "createdAt",
      sortOrder: "desc",
    });

  const experts = data?.data.experts ?? [];
  const meta = data?.data.meta;
  const currentPage = meta?.page ?? page;
  const totalPages = meta?.totalPages ?? 1;
  const limit = meta?.limit ?? PAGE_LIMIT;

  return (
    <div className="space-y-4">
      <div>
        <h1 className="font-heading text-xl font-semibold">
          Expert management
        </h1>
        <p className="text-sm text-muted-foreground">
          Review expert applications and manage verified experts.
        </p>
      </div>

      <div className="relative w-full sm:max-w-sm">
        <Search className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          className="pl-8"
          placeholder="Search by name or email..."
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
          setTab(value as TExpertVerificationStatus);
          setPage(1);
        }}
      >
        <TabsList>
          {expertTabs.map(({ value, label }) => (
            <TabsTrigger key={value} value={value} className="cursor-pointer">
              {label}
              {value === tab && meta && (
                <span className="ml-1 text-xs text-muted-foreground tabular-nums">
                  {meta.totalExperts}
                </span>
              )}
            </TabsTrigger>
          ))}
        </TabsList>
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
              <TableHead>Expert</TableHead>
              <TableHead className="text-right">Rate / assignment</TableHead>
              <TableHead>Verified</TableHead>
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
                  {error.message || "Failed to load experts."}
                </TableCell>
              </TableRow>
            )}
            {!isError && experts.length === 0 && (
              <TableRow>
                <TableCell
                  colSpan={COLUMN_COUNT}
                  className="py-10 text-center text-muted-foreground"
                >
                  {debouncedSearchTerm
                    ? "No experts match your search."
                    : tab === "PENDING"
                      ? "No applications waiting for review."
                      : `No ${statusLabels[tab].toLowerCase()} experts yet.`}
                </TableCell>
              </TableRow>
            )}
            {experts.map((expert, index) => (
              <TableRow key={expert.id}>
                <TableCell>{(currentPage - 1) * limit + index + 1}</TableCell>
                <TableCell>
                  <p className="font-medium">{expert.user.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {expert.user.email}
                  </p>
                </TableCell>
                <TableCell className="text-right tabular-nums">
                  {formatCurrency(expert.ratePerAssignment)}
                </TableCell>
                <TableCell>{expert.isVerified ? "Yes" : "No"}</TableCell>
                <TableCell className="text-right">
                  <StatusBadge
                    status={expert.verificationStatus}
                    label={statusLabels[expert.verificationStatus]}
                    className={expertStatusStyles[expert.verificationStatus]}
                  />
                </TableCell>
                <TableCell className="text-right">
                  <ExpertActions expert={expert} />
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

function ExpertActions({ expert }: { expert: IAdminExpert }) {
  const { mutate: approveExpert, isPending } = useApproveExpert();

  if (expert.verificationStatus !== "PENDING") {
    return <span className="text-xs text-muted-foreground">—</span>;
  }

  const handleApprove = () => {
    approveExpert(
      { expertId: expert.id, status: "APPROVE" },
      {
        onSuccess: (res) => {
          toast.add({
            title: res?.message || "Expert approved",
            type: "success",
          });
        },
        onError: (err) => {
          toast.add({
            title: err.message || "Failed to approve expert",
            type: "error",
          });
        },
      },
    );
  };

  return (
    <div className="flex items-center justify-end gap-1.5">
      <Button size="sm" disabled={isPending} onClick={handleApprove}>
        {isPending ? <Loader2 className="animate-spin" /> : <Check />}
        Approve
      </Button>
      <RejectExpertSheet expert={expert} disabled={isPending} />
    </div>
  );
}
