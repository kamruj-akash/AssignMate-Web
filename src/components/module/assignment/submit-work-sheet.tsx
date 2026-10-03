"use client";

import { FileDropzone } from "@/components/shared/file-dropzone";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from "@/components/ui/field";
import { Separator } from "@/components/ui/separator";
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
import { useSubmitAssignment } from "@/hooks";
import { IExpertAssignment } from "@/type";
import { submitWorkZodSchema } from "@/validation";
import { useForm } from "@tanstack/react-form";
import { cn } from "cn";
import { format } from "date-fns";
import { Loader2, Paperclip, Upload } from "lucide-react";
import { useState } from "react";

type TSubmitStatus = "SUBMITTED";

const submitStatusOptions: {
  value: TSubmitStatus;
  label: string;
  description: string;
}[] = [
  {
    value: "SUBMITTED",
    label: "Submitted",
    description:
      "Final deliverable. The student will be notified to review your work.",
  },
];

const currencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

export default function SubmitWorkSheet({
  assignment,
}: {
  assignment: IExpertAssignment;
}) {
  const [open, setOpen] = useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger render={<Button size="sm" />}>
        <Upload />
        Submit work
      </SheetTrigger>

      <SheetContent className="w-full gap-0 data-[side=right]:sm:max-w-lg">
        <SubmitWorkForm assignment={assignment} setOpen={setOpen} />
      </SheetContent>
    </Sheet>
  );
}

function SubmitWorkForm({
  assignment,
  setOpen,
}: {
  assignment: IExpertAssignment;
  setOpen: (open: boolean) => void;
}) {
  const { mutate: submitAssignment, isPending } = useSubmitAssignment();

  const form = useForm({
    defaultValues: {
      status: "SUBMITTED" as TSubmitStatus,
      attachment: [] as File[],
    },
    validators: { onSubmit: submitWorkZodSchema },
    onSubmit: ({ value }) => {
      submitAssignment(
        {
          assignmentId: assignment.id,
          status: value.status,
          attachment: value.attachment[0],
        },
        {
          onSuccess: (res) => {
            setOpen(false);
            toast.add({
              title: res?.message || "Work submitted successfully",
              type: "success",
            });
          },
          onError: (err) => {
            toast.add({
              title: err.message || "Failed to submit work",
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
          Submit work
        </SheetTitle>
        <SheetDescription className="line-clamp-2">
          {assignment.title}
        </SheetDescription>
      </SheetHeader>

      <div className="flex-1 space-y-6 overflow-y-auto px-4 pb-4">
        <dl className="grid grid-cols-2 gap-3">
          <div className="rounded-lg border border-border p-3">
            <dt className="text-xs text-muted-foreground">Bid amount</dt>
            <dd className="font-heading text-xl font-semibold tracking-tight">
              {currencyFormatter.format(
                Number(
                  assignment.acceptedBid?.proposedAmount ?? assignment.budget,
                ),
              )}
            </dd>
          </div>
          <div className="rounded-lg border border-border p-3">
            <dt className="text-xs text-muted-foreground">Deadline</dt>
            <dd className="font-medium">
              {format(new Date(assignment.deadline), "MMM d, yyyy")}
            </dd>
            <dd className="text-xs text-muted-foreground">
              {assignment.student.user.name}
            </dd>
          </div>
        </dl>

        {assignment.attachmentUrl && (
          <a
            href={assignment.attachmentUrl.secure_url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline"
          >
            <Paperclip className="size-4" />
            View attached brief
          </a>
        )}

        <Separator />

        <FieldGroup className="gap-5">
          <form.Field name="status">
            {(field) => {
              const isInvalid =
                field.state.meta.isTouched && !field.state.meta.isValid;
              return (
                <FieldSet>
                  <FieldLegend variant="label">Status</FieldLegend>
                  <div className="grid gap-2">
                    {submitStatusOptions.map((option) => (
                      <label
                        key={option.value}
                        className={cn(
                          "flex cursor-pointer items-start gap-3 rounded-lg border border-border p-3 transition-colors",
                          field.state.value === option.value &&
                            "border-primary bg-primary/5",
                        )}
                      >
                        <input
                          type="radio"
                          name={field.name}
                          value={option.value}
                          checked={field.state.value === option.value}
                          onChange={() => field.handleChange(option.value)}
                          onBlur={field.handleBlur}
                          className="mt-0.5 accent-primary"
                        />
                        <span className="space-y-0.5">
                          <span className="block text-sm font-medium">
                            {option.label}
                          </span>
                          <span className="block text-xs text-muted-foreground">
                            {option.description}
                          </span>
                        </span>
                      </label>
                    ))}
                  </div>
                  {isInvalid && <FieldError errors={field.state.meta.errors} />}
                </FieldSet>
              );
            }}
          </form.Field>

          <form.Field name="attachment">
            {(field) => {
              const isInvalid =
                field.state.meta.isTouched && !field.state.meta.isValid;
              return (
                <Field>
                  <FieldLabel htmlFor={field.name}>Deliverable</FieldLabel>
                  <FileDropzone
                    id={field.name}
                    multiple={false}
                    value={field.state.value}
                    onChange={field.handleChange}
                    onBlur={field.handleBlur}
                    accept=".pdf,.doc,.docx,.zip,.jpg,.jpeg,.png"
                    hint="PDF, DOC, DOCX, ZIP, JPG or PNG · 10MB max"
                    invalid={isInvalid}
                  />
                  <FieldDescription>
                    Bundle multiple files into a single ZIP.
                  </FieldDescription>
                  {isInvalid && <FieldError errors={field.state.meta.errors} />}
                </Field>
              );
            }}
          </form.Field>
        </FieldGroup>
      </div>

      <SheetFooter className="flex-row justify-end border-t border-border">
        <SheetClose
          render={
            <Button type="button" variant="outline" disabled={isPending} />
          }
        >
          Cancel
        </SheetClose>
        <Button type="submit" disabled={isPending}>
          {isPending ? (
            <>
              <Loader2 className="animate-spin" /> Submitting...
            </>
          ) : (
            "Submit work"
          )}
        </Button>
      </SheetFooter>
    </form>
  );
}
