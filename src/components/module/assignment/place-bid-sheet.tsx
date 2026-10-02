"use client";

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
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/toast";
import { usePlaceBid } from "@/hooks/bid.hook";
import { IOpenAssignment, IPlaceBidPayload } from "@/type";
import { placeBidZodSchema } from "@/validation";
import { useForm } from "@tanstack/react-form";
import {
  endOfDay,
  format,
  formatDistanceToNow,
  isBefore,
  startOfToday,
} from "date-fns";
import { CalendarIcon, Loader2, Paperclip } from "lucide-react";
import { useState } from "react";

const currencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

export default function PlaceBidSheet({
  assignment,
}: {
  assignment: IOpenAssignment;
}) {
  const [open, setOpen] = useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger render={<Button className="mt-5 w-full" />}>
        Place a bid
      </SheetTrigger>

      <SheetContent className="w-full gap-0 data-[side=right]:sm:max-w-lg">
        <PlaceBidForm assignment={assignment} setOpen={setOpen} />
      </SheetContent>
    </Sheet>
  );
}

function PlaceBidForm({
  assignment,
  setOpen,
}: {
  assignment: IOpenAssignment;
  setOpen: (open: boolean) => void;
}) {
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const deadline = new Date(assignment.deadline);
  const { mutate: placeBid, isPending: isPlaceBidLoading } = usePlaceBid();

  const form = useForm({
    defaultValues: {
      proposedAmount: undefined as unknown as number,
      estimatedDelivery: undefined as unknown as Date,
      coverNote: "",
    },
    validators: { onSubmit: placeBidZodSchema },
    onSubmit: async ({ value }) => {
      const payload: IPlaceBidPayload = {
        assignmentId: assignment.id,
        proposedAmount: value.proposedAmount,
        estimatedDelivery: value.estimatedDelivery.toISOString(),
        coverNote: value.coverNote.trim(),
      };
      placeBid(payload, {
        onSuccess: (res) => {
          setOpen(false);
          toast.add({
            title: res.message || "Bid placed successfully",
            type: "success",
          });
        },
        onError: (err) => {
          toast.add({
            title: err.message || "Failed to place bid",
            type: "error",
          });
        },
      });
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
          {assignment.title}
        </SheetTitle>
        <SheetDescription>
          Posted{" "}
          {formatDistanceToNow(new Date(assignment.createdAt), {
            addSuffix: true,
          })}
        </SheetDescription>
      </SheetHeader>

      <div className="flex-1 space-y-6 overflow-y-auto px-4 pb-4">
        <dl className="grid grid-cols-2 gap-3">
          <div className="rounded-lg border border-border p-3">
            <dt className="text-xs text-muted-foreground">Budget</dt>
            <dd className="font-heading text-xl font-semibold tracking-tight">
              {currencyFormatter.format(Number(assignment.budget))}
            </dd>
          </div>
          <div className="rounded-lg border border-border p-3">
            <dt className="text-xs text-muted-foreground">Deadline</dt>
            <dd className="font-medium">{format(deadline, "MMM d, yyyy")}</dd>
            <dd className="text-xs text-muted-foreground">
              {format(deadline, "p")}
            </dd>
          </div>
        </dl>

        <section className="space-y-2">
          <h3 className="text-sm font-medium">Description</h3>
          <p className="text-sm whitespace-pre-line text-muted-foreground">
            {assignment.description}
          </p>
        </section>

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
          <h3 className="text-sm font-medium">Your bid</h3>

          <div className="grid gap-5 sm:grid-cols-2">
            <form.Field name="proposedAmount">
              {(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid;
                return (
                  <Field>
                    <FieldLabel htmlFor={field.name}>
                      Proposed amount
                    </FieldLabel>
                    <Input
                      id={field.name}
                      type="number"
                      inputMode="decimal"
                      min={1}
                      placeholder={String(Number(assignment.budget))}
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
                    {isInvalid && (
                      <FieldError errors={field.state.meta.errors} />
                    )}
                  </Field>
                );
              }}
            </form.Field>

            <form.Field name="estimatedDelivery">
              {(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid;
                const delivery = field.state.value;
                return (
                  <Field>
                    <FieldLabel htmlFor={field.name}>
                      Estimated delivery
                    </FieldLabel>
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
                            className={`h-10 w-full justify-start font-normal ${
                              delivery ? "" : "text-muted-foreground"
                            } ${isInvalid ? "border-destructive" : ""}`}
                          />
                        }
                      >
                        <CalendarIcon />
                        {delivery
                          ? format(delivery, "dd MMM yyyy")
                          : "Pick a date"}
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={delivery}
                          disabled={[
                            { before: startOfToday() },
                            { after: deadline },
                          ]}
                          onSelect={(date) => {
                            if (!date) return;
                            const end = endOfDay(date);
                            field.handleChange(
                              isBefore(deadline, end) ? deadline : end,
                            );
                            setIsCalendarOpen(false);
                          }}
                        />
                      </PopoverContent>
                    </Popover>
                    {isInvalid && (
                      <FieldError errors={field.state.meta.errors} />
                    )}
                  </Field>
                );
              }}
            </form.Field>
          </div>

          <form.Field name="coverNote">
            {(field) => {
              const isInvalid =
                field.state.meta.isTouched && !field.state.meta.isValid;
              return (
                <Field>
                  <FieldLabel htmlFor={field.name}>Cover note</FieldLabel>
                  <Textarea
                    id={field.name}
                    rows={5}
                    placeholder="Explain why you're a good fit, your approach and what you'll deliver..."
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
        </FieldGroup>
      </div>

      <SheetFooter className="flex-row justify-end border-t border-border">
        <SheetClose
          render={
            <Button
              type="button"
              variant="outline"
              disabled={isPlaceBidLoading}
            />
          }
        >
          Close
        </SheetClose>
        <Button type="submit" disabled={isPlaceBidLoading}>
          {isPlaceBidLoading ? (
            <>
              <Loader2 className="animate-spin" /> Placing bid...
            </>
          ) : (
            "Place bid"
          )}
        </Button>
      </SheetFooter>
    </form>
  );
}
