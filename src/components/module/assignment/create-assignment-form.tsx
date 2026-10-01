"use client";

import { FileDropzone } from "@/components/shared/file-dropzone";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/toast";
import { useCreateAssignment } from "@/hooks";
import { createAssignmentZodSchema } from "@/validation";
import { useForm } from "@tanstack/react-form";
import { format, startOfToday } from "date-fns";
import { CalendarIcon, Loader2 } from "lucide-react";
import { useState } from "react";

const DEFAULT_DEADLINE_TIME = "23:59";

const withTime = (date: Date, time: string) => {
  const [hours, minutes] = time.split(":").map(Number);
  const next = new Date(date);
  next.setHours(hours || 0, minutes || 0, 0, 0);
  return next;
};

export default function CreateAssignmentForm({
  setOpen,
}: {
  setOpen: (open: boolean) => void;
}) {
  const { mutate: createAssignment, isPending } = useCreateAssignment();
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);

  const form = useForm({
    defaultValues: {
      title: "",
      description: "",
      budget: undefined as unknown as number,
      deadline: undefined as unknown as Date,
      attachment: [] as File[],
    },
    validators: { onSubmit: createAssignmentZodSchema },
    onSubmit: ({ value }) => {
      createAssignment(
        {
          title: value.title.trim(),
          description: value.description.trim(),
          budget: value.budget,
          deadline: value.deadline,
          attachment: value.attachment[0],
        },
        {
          onSuccess: (res) => {
            toast.add({
              title: res?.message || "Assignment created successfully",
              type: "success",
            });
            form.reset();
            setOpen(false);
          },
          onError: (err) => {
            toast.add({
              title: err.message || "Failed to create assignment",
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
      onSubmit={(e) => {
        e.preventDefault();
        form.handleSubmit();
      }}
    >
      <FieldGroup className="gap-5">
        <form.Field name="title">
          {(field) => {
            const isInvalid =
              field.state.meta.isTouched && !field.state.meta.isValid;
            return (
              <Field>
                <FieldLabel htmlFor={field.name}>Title</FieldLabel>
                <Input
                  id={field.name}
                  placeholder="Data Structures assignment - AVL trees"
                  className={`h-10 ${isInvalid ? "border-destructive" : ""}`}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                />
                {isInvalid && <FieldError errors={field.state.meta.errors} />}
              </Field>
            );
          }}
        </form.Field>

        <form.Field name="description">
          {(field) => {
            const isInvalid =
              field.state.meta.isTouched && !field.state.meta.isValid;
            return (
              <Field>
                <FieldLabel htmlFor={field.name}>Description</FieldLabel>
                <Textarea
                  id={field.name}
                  rows={4}
                  placeholder="Describe the requirements, format and any marking criteria..."
                  className={isInvalid ? "border-destructive" : ""}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                />
                {isInvalid && <FieldError errors={field.state.meta.errors} />}
              </Field>
            );
          }}
        </form.Field>

        <div className="grid gap-5 sm:grid-cols-2">
          <form.Field name="budget">
            {(field) => {
              const isInvalid =
                field.state.meta.isTouched && !field.state.meta.isValid;
              return (
                <Field>
                  <FieldLabel htmlFor={field.name}>Budget</FieldLabel>
                  <Input
                    id={field.name}
                    type="number"
                    inputMode="decimal"
                    min={1}
                    placeholder="2000"
                    className={`h-10 ${isInvalid ? "border-destructive" : ""}`}
                    value={field.state.value ?? ""}
                    onBlur={field.handleBlur}
                    onChange={(e) =>
                      field.handleChange(
                        e.target.value === ""
                          ? (undefined as unknown as number)
                          : e.target.valueAsNumber,
                      )
                    }
                  />
                  {isInvalid && <FieldError errors={field.state.meta.errors} />}
                </Field>
              );
            }}
          </form.Field>

          <form.Field name="deadline">
            {(field) => {
              const isInvalid =
                field.state.meta.isTouched && !field.state.meta.isValid;
              const deadline = field.state.value;
              return (
                <Field>
                  <FieldLabel htmlFor={field.name}>Deadline</FieldLabel>
                  <div className="flex gap-2">
                    <Popover
                      open={isCalendarOpen}
                      onOpenChange={(open) => {
                        setIsCalendarOpen(open);
                        if (!open) field.handleBlur();
                      }}
                    >
                      <PopoverTrigger
                        render={
                          <Button
                            id={field.name}
                            variant="outline"
                            className={`h-10 flex-1 justify-start font-normal ${
                              deadline ? "" : "text-muted-foreground"
                            } ${isInvalid ? "border-destructive" : ""}`}
                          />
                        }
                      >
                        <CalendarIcon />
                        {deadline
                          ? format(deadline, "dd MMM yyyy")
                          : "Pick a date"}
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={deadline}
                          disabled={{ before: startOfToday() }}
                          onSelect={(date) => {
                            if (!date) return;
                            field.handleChange(
                              withTime(
                                date,
                                deadline
                                  ? format(deadline, "HH:mm")
                                  : DEFAULT_DEADLINE_TIME,
                              ),
                            );
                            setIsCalendarOpen(false);
                          }}
                        />
                      </PopoverContent>
                    </Popover>
                    <Input
                      type="time"
                      aria-label="Deadline time"
                      className="h-10 w-28"
                      disabled={!deadline}
                      value={deadline ? format(deadline, "HH:mm") : ""}
                      onBlur={field.handleBlur}
                      onChange={(e) => {
                        if (!deadline || !e.target.value) return;
                        field.handleChange(withTime(deadline, e.target.value));
                      }}
                    />
                  </div>
                  {isInvalid && <FieldError errors={field.state.meta.errors} />}
                </Field>
              );
            }}
          </form.Field>
        </div>

        <form.Field name="attachment">
          {(field) => {
            const isInvalid =
              field.state.meta.isTouched && !field.state.meta.isValid;
            return (
              <Field>
                <FieldLabel htmlFor={field.name}>
                  Attachment{" "}
                  <span className="font-normal text-muted-foreground">
                    (optional)
                  </span>
                </FieldLabel>
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
        </form.Field>

        <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <Button
            type="button"
            variant="outline"
            disabled={isPending}
            onClick={() => setOpen(false)}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={isPending}>
            {isPending ? (
              <>
                <Loader2 className="animate-spin" /> Creating...
              </>
            ) : (
              "Create Assignment"
            )}
          </Button>
        </div>
      </FieldGroup>
    </form>
  );
}
