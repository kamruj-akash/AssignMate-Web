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
import { useGetStudentById } from "@/hooks";
import { IAdminStudent } from "@/type";
import { Eye } from "lucide-react";
import { useState } from "react";
import {
  assignmentStatusStyles,
  formatCurrency,
  formatDate,
  numberFormatter,
} from "./admin-format";
import BreakdownList from "./breakdown-list";
import StatusBadge from "./status-badge";

export default function StudentDetailsSheet({
  student,
}: {
  student: IAdminStudent;
}) {
  const [open, setOpen] = useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger render={<Button size="sm" variant="outline" />}>
        <Eye />
        View
      </SheetTrigger>

      <SheetContent className="w-full gap-0 data-[side=right]:sm:max-w-lg">
        <SheetHeader className="pr-12">
          <SheetTitle className="text-lg font-semibold">
            {student.user.name}
          </SheetTitle>
          <SheetDescription>{student.user.email}</SheetDescription>
        </SheetHeader>
        {/* Only fetch once the sheet is opened */}
        {open && <StudentDetails studentId={student.id} />}
      </SheetContent>
    </Sheet>
  );
}

function StudentDetails({ studentId }: { studentId: string }) {
  const { data, isLoading, isError, error } = useGetStudentById(studentId);
  const student = data?.data;

  if (isLoading) {
    return (
      <div className="space-y-4 px-4">
        <div className="grid grid-cols-2 gap-3">
          {Array.from({ length: 4 }, (_, i) => (
            <Skeleton key={i} className="h-16" />
          ))}
        </div>
        <Skeleton className="h-48" />
      </div>
    );
  }

  if (isError || !student) {
    return (
      <p className="px-4 text-sm text-destructive">
        {error?.message || "Failed to load student."}
      </p>
    );
  }

  const { stats } = student;

  return (
    <div className="flex-1 space-y-6 overflow-y-auto px-4 pb-6">
      <dl className="grid grid-cols-2 gap-x-4 gap-y-3 text-sm">
        <Detail label="Institution" value={student.institution} />
        <Detail label="Academic level" value={student.academicLevel} />
        <Detail label="Phone" value={student.user.phoneNo} />
        <Detail label="Joined" value={formatDate(student.createdAt)} />
        <Detail
          label="Account"
          value={student.user.status === "BLOCK" ? "Blocked" : "Active"}
        />
        <Detail
          label="Email"
          value={student.user.emailVerified ? "Verified" : "Not verified"}
        />
      </dl>

      <Separator />

      <dl className="grid grid-cols-2 gap-3">
        <Figure label="Total paid" value={formatCurrency(stats.spending.totalPaid)} />
        <Figure label="In escrow" value={formatCurrency(stats.spending.inEscrow)} />
        <Figure label="Refunded" value={formatCurrency(stats.spending.refunded)} />
        <Figure
          label="Pending payments"
          value={numberFormatter.format(stats.spending.pendingPayments)}
        />
        <Figure
          label="Pending bids received"
          value={numberFormatter.format(stats.bidsReceived.pending)}
        />
        <Figure
          label="Reviews written"
          value={numberFormatter.format(stats.reviewsWritten)}
        />
      </dl>

      <BreakdownList
        title="Assignments by status"
        items={Object.entries(stats.assignments.byStatus)
          .filter(([, value]) => value > 0)
          .map(([key, value]) => ({ key, value }))}
      />

      <section className="space-y-2">
        <h3 className="text-sm font-medium">Recent assignments</h3>
        {student.recentAssignments.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            This student hasn&apos;t posted any assignments yet.
          </p>
        ) : (
          <ul className="divide-y divide-border rounded-lg border border-border">
            {student.recentAssignments.map((assignment) => (
              <li
                key={assignment.id}
                className="flex items-center justify-between gap-3 p-3"
              >
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium" title={assignment.title}>
                    {assignment.title}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {formatCurrency(assignment.budget)} · due{" "}
                    {formatDate(assignment.deadline)}
                  </p>
                </div>
                <StatusBadge
                  status={assignment.status}
                  className={assignmentStatusStyles[assignment.status]}
                />
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}

function Detail({ label, value }: { label: string; value: string | null }) {
  return (
    <div>
      <dt className="text-xs text-muted-foreground">{label}</dt>
      <dd>{value || "—"}</dd>
    </div>
  );
}

function Figure({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-border p-3">
      <dt className="text-xs text-muted-foreground">{label}</dt>
      <dd className="font-heading text-lg font-semibold tracking-tight tabular-nums">
        {value}
      </dd>
    </div>
  );
}
