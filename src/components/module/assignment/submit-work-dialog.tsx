"use client";

import { FileDropzone } from "@/components/shared/file-dropzone";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { toast } from "@/components/ui/toast";
import { useSubmitAssignment } from "@/hooks";
import { IExpertAssignment } from "@/type";
import { useForm } from "@tanstack/react-form";
import { Loader2, Upload } from "lucide-react";
import { useState } from "react";

export default function SubmitWorkDialog({
  assignment,
}: {
  assignment: IExpertAssignment;
}) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<Button size="sm" />}>
        <Upload />
        Submit work
      </DialogTrigger>

      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold">
            Submit work
          </DialogTitle>
          <DialogDescription className="line-clamp-2">
            Upload your final deliverable for “{assignment.title}”. The student
            will be notified to review it.
          </DialogDescription>
        </DialogHeader>

        <SubmitWorkForm assignmentId={assignment.id} setOpen={setOpen} />
      </DialogContent>
    </Dialog>
  );
}

function SubmitWorkForm({
  assignmentId,
  setOpen,
}: {
  assignmentId: string;
  setOpen: (open: boolean) => void;
}) {
  const { mutateAsync: submitAssignment, isPending } = useSubmitAssignment();

  const form = useForm({
    defaultValues: { attachment: null as File | null },
    // validators: { onSubmit: submitWorkZodSchema },
    onSubmit: async ({ value }) => {
      const payload = {
        assignmentId,
        status: "SUBMITTED",
        // attachment: value.attachment,
      };
      submitAssignment(payload, {
        onSuccess: (result) => {
          setOpen(false);
          toast.add({
            title: result.message || "Work submitted successfully",
            type: "success",
          });
        },
        onError: (error) => {
          console.error(error);
        },
      });
    },
  });

  return (
    <form
      noValidate
      className="space-y-5"
      onSubmit={(e) => {
        e.preventDefault();
        form.handleSubmit();
      }}
    >
      {/* <form.Field name="attachment">
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
              {isInvalid && <FieldError errors={field.state.meta.errors} />}
            </Field>
          );
        }}
      </form.Field> */}

      <DialogFooter>
        <DialogClose
          render={
            <Button type="button" variant="outline" disabled={isPending} />
          }
        >
          Cancel
        </DialogClose>
        <Button type="submit" disabled={isPending}>
          {isPending ? (
            <>
              <Loader2 className="animate-spin" /> Submitting...
            </>
          ) : (
            "Submit work"
          )}
        </Button>
      </DialogFooter>
    </form>
  );
}
