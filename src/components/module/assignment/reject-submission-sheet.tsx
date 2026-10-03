"use client";

import { Button } from "@/components/ui/button";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
} from "@/components/ui/field";
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
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/toast";
import { useAssignmentAction } from "@/hooks";
import { IAssignment } from "@/type";
import { rejectSubmissionZodSchema } from "@/validation";
import { useForm } from "@tanstack/react-form";
import { ExternalLink, Loader2 } from "lucide-react";
import { useState } from "react";

export default function RejectSubmissionSheet({
  assignment,
}: {
  assignment: IAssignment;
}) {
  const [open, setOpen] = useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger render={<Button size="sm" variant="destructive" />}>
        Reject
      </SheetTrigger>

      <SheetContent className="w-full gap-0 data-[side=right]:sm:max-w-lg">
        <RejectSubmissionForm assignment={assignment} setOpen={setOpen} />
      </SheetContent>
    </Sheet>
  );
}

function RejectSubmissionForm({
  assignment,
  setOpen,
}: {
  assignment: IAssignment;
  setOpen: (open: boolean) => void;
}) {
  const { mutate: changeAction, isPending } = useAssignmentAction();

  const form = useForm({
    defaultValues: { reason: "" },
    validators: { onSubmit: rejectSubmissionZodSchema },
    onSubmit: ({ value }) => {
      changeAction(
        {
          assignmentId: assignment.id,
          status: "DISPUTED",
          reason: value.reason.trim(),
        },
        {
          onSuccess: (res) => {
            setOpen(false);
            toast.add({
              title: res?.message || "Submission rejected",
              type: "success",
            });
          },
          onError: (err) => {
            toast.add({
              title: err.message || "Failed to reject submission",
              type: "error",
            });
          },
        },
      );
    },
  });

  return (
    <form
      noValidate
      className="flex h-full min-h-0 flex-col"
      onSubmit={(e) => {
        e.preventDefault();
        form.handleSubmit();
      }}
    >
      <SheetHeader className="pr-12">
        <SheetTitle className="text-lg font-semibold text-balance">
          Reject submission
        </SheetTitle>
        <SheetDescription className="line-clamp-2">
          {assignment.title}
        </SheetDescription>
      </SheetHeader>

      <div className="flex-1 space-y-6 overflow-y-auto px-4 pb-4">
        <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-3 text-sm">
          The assignment will be marked as{" "}
          <span className="font-medium text-destructive">DISPUTED</span> and
          the expert
          {assignment.assignedExpert &&
            ` (${assignment.assignedExpert.user.name})`}{" "}
          will see your reason.
        </div>

        {assignment.submissionUrl && (
          <a
            href={assignment.submissionUrl.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline"
          >
            <ExternalLink className="size-4" />
            View submission
          </a>
        )}

        <form.Field name="reason">
          {(field) => {
            const isInvalid =
              field.state.meta.isTouched && !field.state.meta.isValid;
            return (
              <Field>
                <FieldLabel htmlFor={field.name}>Reason</FieldLabel>
                <Textarea
                  id={field.name}
                  rows={6}
                  placeholder="Explain what's wrong with the submission and what needs to change..."
                  className={isInvalid ? "border-destructive" : ""}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                />
                <FieldDescription>
                  Be specific so the dispute can be resolved quickly.
                </FieldDescription>
                {isInvalid && <FieldError errors={field.state.meta.errors} />}
              </Field>
            );
          }}
        </form.Field>
      </div>

      <SheetFooter className="flex-row justify-end border-t border-border">
        <SheetClose
          render={
            <Button type="button" variant="outline" disabled={isPending} />
          }
        >
          Cancel
        </SheetClose>
        <Button type="submit" variant="destructive" disabled={isPending}>
          {isPending ? (
            <>
              <Loader2 className="animate-spin" /> Rejecting...
            </>
          ) : (
            "Reject submission"
          )}
        </Button>
      </SheetFooter>
    </form>
  );
}
