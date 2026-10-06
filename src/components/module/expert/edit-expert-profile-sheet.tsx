"use client";

import { Button } from "@/components/ui/button";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
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
import { useUpdateExpertProfile } from "@/hooks";
import { IExpertMe } from "@/type";
import { expertProfileZodSchema } from "@/validation";
import { useForm } from "@tanstack/react-form";
import { Loader2, Pencil } from "lucide-react";
import { useState } from "react";

export default function EditExpertProfileSheet({ me }: { me: IExpertMe }) {
  const [open, setOpen] = useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger render={<Button size="sm" variant="outline" />}>
        <Pencil /> Edit profile
      </SheetTrigger>

      <SheetContent className="w-full gap-0 data-[side=right]:sm:max-w-lg">
        <EditExpertProfileForm me={me} setOpen={setOpen} />
      </SheetContent>
    </Sheet>
  );
}

function EditExpertProfileForm({
  me,
  setOpen,
}: {
  me: IExpertMe;
  setOpen: (open: boolean) => void;
}) {
  const { mutate: updateProfile, isPending } = useUpdateExpertProfile();

  const form = useForm({
    defaultValues: {
      name: me.name,
      phoneNo: me.phoneNo ?? "",
      bio: me.expert.bio ?? "",
      ratePerAssignment: Number(me.expert.ratePerAssignment),
    },
    validators: { onSubmit: expertProfileZodSchema },
    onSubmit: ({ value }) => {
      updateProfile(
        {
          name: value.name.trim(),
          // phone is optional on the account, so skip it when left blank
          phoneNo: value.phoneNo.trim() || undefined,
          bio: value.bio.trim(),
          ratePerAssignment: value.ratePerAssignment,
        },
        {
          onSuccess: (res) => {
            setOpen(false);
            toast.add({
              title: res?.message || "Profile updated",
              type: "success",
            });
          },
          onError: (err) => {
            toast.add({
              title: err.message || "Failed to update profile",
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
        <SheetTitle className="text-lg font-semibold">Edit profile</SheetTitle>
        <SheetDescription>
          University and department were verified by an admin and can&apos;t be
          changed here.
        </SheetDescription>
      </SheetHeader>

      <div className="flex-1 space-y-5 overflow-y-auto px-4 pb-4">
        <form.Field name="name">
          {(field) => {
            const isInvalid =
              field.state.meta.isTouched && !field.state.meta.isValid;
            return (
              <Field>
                <FieldLabel htmlFor={field.name}>Name</FieldLabel>
                <Input
                  id={field.name}
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

        <form.Field name="phoneNo">
          {(field) => {
            const isInvalid =
              field.state.meta.isTouched && !field.state.meta.isValid;
            return (
              <Field>
                <FieldLabel htmlFor={field.name}>Phone</FieldLabel>
                <Input
                  id={field.name}
                  type="tel"
                  inputMode="tel"
                  placeholder="+8801XXXXXXXXX"
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

        <form.Field name="ratePerAssignment">
          {(field) => {
            const isInvalid =
              field.state.meta.isTouched && !field.state.meta.isValid;
            return (
              <Field>
                <FieldLabel htmlFor={field.name}>Rate per assignment</FieldLabel>
                <Input
                  id={field.name}
                  type="number"
                  inputMode="decimal"
                  min={1}
                  className={isInvalid ? "border-destructive" : ""}
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
                <FieldDescription>
                  Your usual starting price. You still set the amount on each
                  bid.
                </FieldDescription>
                {isInvalid && <FieldError errors={field.state.meta.errors} />}
              </Field>
            );
          }}
        </form.Field>

        <form.Field name="bio">
          {(field) => {
            const isInvalid =
              field.state.meta.isTouched && !field.state.meta.isValid;
            return (
              <Field>
                <FieldLabel htmlFor={field.name}>Bio</FieldLabel>
                <Textarea
                  id={field.name}
                  rows={6}
                  placeholder="Subjects you're strong in, past work, how you approach assignments..."
                  className={isInvalid ? "border-destructive" : ""}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                />
                <FieldDescription>Up to 1000 characters.</FieldDescription>
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
        <Button type="submit" disabled={isPending}>
          {isPending ? (
            <>
              <Loader2 className="animate-spin" /> Saving...
            </>
          ) : (
            "Save changes"
          )}
        </Button>
      </SheetFooter>
    </form>
  );
}
