"use client";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetEscrowVault } from "@/hooks";
import { Vault } from "lucide-react";
import { useState } from "react";
import {
  assignmentStatusStyles,
  escrowStatusStyles,
  formatCurrency,
  formatDate,
} from "./admin-format";
import StatusBadge from "./status-badge";

export default function EscrowVaultSheet({
  assignmentId,
  title,
}: {
  assignmentId: string;
  title: string;
}) {
  const [open, setOpen] = useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger render={<Button size="sm" variant="outline" />}>
        <Vault />
        Escrow
      </SheetTrigger>

      <SheetContent className="w-full gap-0 data-[side=right]:sm:max-w-lg">
        <SheetHeader className="pr-12">
          <SheetTitle className="text-lg font-semibold">Escrow vault</SheetTitle>
          <SheetDescription className="line-clamp-2">{title}</SheetDescription>
        </SheetHeader>
        {open && <EscrowVaultDetails assignmentId={assignmentId} />}
      </SheetContent>
    </Sheet>
  );
}

function EscrowVaultDetails({ assignmentId }: { assignmentId: string }) {
  const { data, isLoading, isError, error } = useGetEscrowVault(assignmentId);
  const vault = data?.data;

  if (isLoading) {
    return (
      <div className="space-y-4 px-4">
        <Skeleton className="h-24" />
        <Skeleton className="h-32" />
        <Skeleton className="h-24" />
      </div>
    );
  }

  if (isError || !vault) {
    return (
      <p className="px-4 text-sm text-destructive">
        {error?.message || "Failed to load escrow."}
      </p>
    );
  }

  const { breakdown } = vault;

  return (
    <div className="flex-1 space-y-6 overflow-y-auto px-4 pb-6">
      <div className="rounded-lg border border-border p-4">
        <div className="flex items-center justify-between gap-2">
          <p className="text-sm text-muted-foreground">Escrow amount</p>
          <StatusBadge
            status={vault.status}
            className={escrowStatusStyles[vault.status]}
          />
        </div>
        <p className="mt-1 font-heading text-3xl font-semibold tracking-tight tabular-nums">
          {formatCurrency(vault.totalAmount)}
        </p>
        <p className="mt-1 text-xs text-muted-foreground">
          Funded {formatDate(vault.createdAt, "dd MMM yyyy, p")}
          {vault.disbursedAt &&
            ` · disbursed ${formatDate(vault.disbursedAt, "dd MMM yyyy, p")}`}
        </p>
      </div>

      <section className="space-y-3">
        <h3 className="text-sm font-medium">Split</h3>
        {/* Two-part stacked bar: the shares always sum to 100% */}
        <div className="flex h-2 gap-0.5 overflow-hidden rounded-full">
          <div
            className="bg-primary"
            style={{ width: `${breakdown.expertEarningsRate}%` }}
          />
          <div
            className="bg-primary/35"
            style={{ width: `${breakdown.platformCommissionRate}%` }}
          />
        </div>
        <dl className="grid grid-cols-2 gap-3 text-sm">
          <div>
            <dt className="flex items-center gap-1.5 text-muted-foreground">
              <span className="size-2 rounded-full bg-primary" />
              Expert payout ({breakdown.expertEarningsRate}%)
            </dt>
            <dd className="font-medium tabular-nums">
              {formatCurrency(breakdown.expertPayout)}
            </dd>
          </div>
          <div>
            <dt className="flex items-center gap-1.5 text-muted-foreground">
              <span className="size-2 rounded-full bg-primary/35" />
              Platform fee ({breakdown.platformCommissionRate}%)
            </dt>
            <dd className="font-medium tabular-nums">
              {formatCurrency(breakdown.platformRevenue)}
            </dd>
          </div>
        </dl>
      </section>

      <Separator />

      <section className="space-y-3 text-sm">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h3 className="font-medium">Assignment</h3>
            <p className="truncate text-muted-foreground" title={vault.assignment.title}>
              {vault.assignment.title}
            </p>
            <p className="text-xs text-muted-foreground">
              Budget {formatCurrency(vault.assignment.budget)} · due{" "}
              {formatDate(vault.assignment.deadline)}
            </p>
          </div>
          <StatusBadge
            status={vault.assignment.status}
            className={assignmentStatusStyles[vault.assignment.status]}
          />
        </div>

        <dl className="grid grid-cols-2 gap-4">
          <div>
            <dt className="text-xs text-muted-foreground">Student</dt>
            <dd className="font-medium">{vault.student.user.name}</dd>
            <dd className="text-xs text-muted-foreground">
              {vault.student.user.email}
            </dd>
          </div>
          <div>
            <dt className="text-xs text-muted-foreground">Expert</dt>
            {vault.expert ? (
              <>
                <dd className="font-medium">{vault.expert.user.name}</dd>
                <dd className="text-xs text-muted-foreground">
                  {vault.expert.user.email}
                </dd>
              </>
            ) : (
              <dd>—</dd>
            )}
          </div>
        </dl>
      </section>
    </div>
  );
}
