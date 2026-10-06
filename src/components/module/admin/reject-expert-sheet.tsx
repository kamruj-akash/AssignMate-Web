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
import { useApproveExpert } from "@/hooks";
import { IAdminExpert } from "@/type";
import { rejectExpertZodSchema } from "@/validation";
import { useForm } from "@tanstack/react-form";
import { Loader2 } from "lucide-react";
import { useState } from "react";

export default function RejectExpertSheet({
  expert,
  disabled,
}: {
  expert: IAdminExpert;
  disabled?: boolean;
}) {
  const [open, setOpen] = useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger
        render={<Button size="sm" variant="destructive" disabled={disabled} />}
      >
        Reject
      </SheetTrigger>

      <SheetContent className="w-full gap-0 data-[side=right]:sm:max-w-lg">
        <RejectExpertForm expert={expert} setOpen={setOpen} />
      </SheetContent>
    </Sheet>
  );
}

function RejectExpertForm({
  expert,
  setOpen,
}: {
  expert: IAdminExpert;
  setOpen: (open: boolean) => void;
}) {
  const { mutate: approveExpert, isPending } = useApproveExpert();

  const form = useForm({
    defaultValues: { reason: "" },
    validators: { onSubmit: rejectExpertZodSchema },
    onSubmit: ({ value }) => {
      approveExpert(
        { expertId: expert.id, status: "REJECT", reason: value.reason.trim() },
        {
          onSuccess: (res) => {
            setOpen(false);
            toast.add({
              title: res?.message || "Expert rejected",
              type: "success",
            });
          },
          onError: (err) => {
            toast.add({
              title: err.message || "Failed to reject expert",
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
        <SheetTitle className="text-lg font-semibold">
          Reject expert application
        </SheetTitle>
        <SheetDescription>
          {expert.user.name} · {expert.user.email}
        </SheetDescription>
      </SheetHeader>

      <div className="flex-1 space-y-6 overflow-y-auto px-4 pb-4">
        <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-3 text-sm">
          The application will be marked as{" "}
          <span className="font-medium text-destructive">REJECTED</span> and the
          applicant will receive your reason by email. They can re-apply with
          new documents.
        </div>

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
                  placeholder="e.g. Submitted documents were unreadable. Please re-upload clear copies."
                  className={isInvalid ? "border-destructive" : ""}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                />
                <FieldDescription>
                  Tell the applicant what to fix. 10–500 characters.
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
            "Reject application"
          )}
        </Button>
      </SheetFooter>
    </form>
  );
}
