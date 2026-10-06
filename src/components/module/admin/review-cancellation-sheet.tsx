"use client";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { toast } from "@/components/ui/toast";
import { useResolveCancellation } from "@/hooks";
import { ICancellationRequest, TCancellationDecision } from "@/type";
import { ExternalLink, Loader2 } from "lucide-react";
import { useState } from "react";
import { formatCurrency, formatDate } from "./admin-format";

export default function ReviewCancellationSheet({
  request,
}: {
  request: ICancellationRequest;
}) {
  const [open, setOpen] = useState(false);
  const { mutate: resolve, isPending, variables } = useResolveCancellation();

  const totalAmount = Number(request.escrow?.totalAmount ?? request.budget);
  const expertPayout =
    (totalAmount * Number(request.escrow?.expertEarnings ?? 0)) / 100;

  const handleDecision = (decision: TCancellationDecision) => {
    resolve(
      { assignmentId: request.id, decision },
      {
        onSuccess: (res) => {
          setOpen(false);
          toast.add({
            title:
              res?.message ||
              (decision === "APPROVE"
                ? "Cancellation approved"
                : "Cancellation rejected"),
            type: "success",
          });
        },
        onError: (err) => {
          toast.add({
            title: err.message || "Failed to resolve cancellation",
            type: "error",
          });
        },
      },
    );
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger render={<Button size="sm" variant="outline" />}>
        Review
      </SheetTrigger>

      <SheetContent className="w-full gap-0 data-[side=right]:sm:max-w-lg">
        <SheetHeader className="pr-12">
          <SheetTitle className="text-lg font-semibold">
            Review cancellation
          </SheetTitle>
          <SheetDescription className="line-clamp-2">
            {request.title}
          </SheetDescription>
        </SheetHeader>

        <div className="flex-1 space-y-6 overflow-y-auto px-4 pb-4">
          <dl className="grid grid-cols-2 gap-3 text-sm">
            <div>
              <dt className="text-muted-foreground">Student</dt>
              <dd className="font-medium">{request.student.user.name}</dd>
              <dd className="text-xs text-muted-foreground">
                {request.student.user.email}
              </dd>
            </div>
            <div>
              <dt className="text-muted-foreground">Expert</dt>
              <dd className="font-medium">
                {request.assignedExpert?.user.name ?? "—"}
              </dd>
              {request.assignedExpert && (
                <dd className="text-xs text-muted-foreground">
                  {request.assignedExpert.user.email}
                </dd>
              )}
            </div>
            <div>
              <dt className="text-muted-foreground">Held in escrow</dt>
              <dd className="font-medium tabular-nums">
                {formatCurrency(totalAmount)}
              </dd>
            </div>
            <div>
              <dt className="text-muted-foreground">Cancelled on</dt>
              <dd className="font-medium">{formatDate(request.updatedAt)}</dd>
            </div>
          </dl>

          <div className="space-y-1.5">
            <p className="text-sm font-medium">Student&apos;s reason</p>
            <p className="rounded-lg border border-border bg-muted/40 p-3 text-sm whitespace-pre-wrap">
              {request.disputedReason || "No reason provided."}
            </p>
          </div>

          {request.submissionUrl && (
            <a
              href={request.submissionUrl.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline"
            >
              <ExternalLink className="size-4" />
              View expert&apos;s submission
            </a>
          )}

          <div className="space-y-2 rounded-lg border border-border p-3 text-sm">
            <p>
              <span className="font-medium">Approve:</span> the assignment is
              marked <span className="font-medium text-destructive">DISPUTED</span>{" "}
              and {formatCurrency(totalAmount)} is refunded to the student.
            </p>
            <p>
              <span className="font-medium">Reject:</span> the assignment is
              marked <span className="font-medium">COMPLETED</span> and{" "}
              {formatCurrency(expertPayout)} is released to the expert&apos;s
              wallet.
            </p>
          </div>
        </div>

        <SheetFooter className="flex-row justify-end border-t border-border">
          <SheetClose
            render={
              <Button type="button" variant="outline" disabled={isPending} />
            }
          >
            Close
          </SheetClose>
          <Button
            type="button"
            variant="secondary"
            disabled={isPending}
            onClick={() => handleDecision("REJECT")}
          >
            {isPending && variables?.decision === "REJECT" ? (
              <>
                <Loader2 className="animate-spin" /> Releasing...
              </>
            ) : (
              "Reject & pay expert"
            )}
          </Button>
          <Button
            type="button"
            variant="destructive"
            disabled={isPending}
            onClick={() => handleDecision("APPROVE")}
          >
            {isPending && variables?.decision === "APPROVE" ? (
              <>
                <Loader2 className="animate-spin" /> Refunding...
              </>
            ) : (
              "Approve & refund"
            )}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
