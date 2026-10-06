"use client";

import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
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
import { toast } from "@/components/ui/toast";
import { useUpdateStudentProfile } from "@/hooks";
import { IStudentProfile } from "@/type";
import { studentProfileZodSchema } from "@/validation";
import { useForm } from "@tanstack/react-form";
import { Loader2, Pencil } from "lucide-react";
import { useState } from "react";

const fields = [
  { name: "name", label: "Name", placeholder: "", type: "text" },
  { name: "phoneNo", label: "Phone", placeholder: "+8801XXXXXXXXX", type: "tel" },
  {
    name: "institution",
    label: "Institution",
    placeholder: "e.g. University of Dhaka",
    type: "text",
  },
  {
    name: "academicLevel",
    label: "Academic level",
    placeholder: "e.g. Undergraduate, 3rd year",
    type: "text",
  },
] as const;

export default function EditStudentProfileSheet({
  profile,
}: {
  profile: IStudentProfile;
}) {
  const [open, setOpen] = useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger render={<Button size="sm" variant="outline" />}>
        <Pencil /> Edit profile
      </SheetTrigger>

      <SheetContent className="w-full gap-0 data-[side=right]:sm:max-w-lg">
        <EditStudentProfileForm profile={profile} setOpen={setOpen} />
      </SheetContent>
    </Sheet>
  );
}

function EditStudentProfileForm({
  profile,
  setOpen,
}: {
  profile: IStudentProfile;
  setOpen: (open: boolean) => void;
}) {
  const { mutate: updateProfile, isPending } = useUpdateStudentProfile();

  const form = useForm({
    defaultValues: {
      name: profile.user.name,
      phoneNo: profile.user.phoneNo ?? "",
      institution: profile.institution ?? "",
      academicLevel: profile.academicLevel ?? "",
    },
    validators: { onSubmit: studentProfileZodSchema },
    onSubmit: ({ value }) => {
      updateProfile(
        {
          name: value.name.trim(),
          // the API rejects empty strings for these, so blanks are left unchanged
          phoneNo: value.phoneNo.trim() || undefined,
          institution: value.institution.trim() || undefined,
          academicLevel: value.academicLevel.trim() || undefined,
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
        <SheetDescription>{profile.user.email}</SheetDescription>
      </SheetHeader>

      <div className="flex-1 space-y-5 overflow-y-auto px-4 pb-4">
        {fields.map(({ name, label, placeholder, type }) => (
          <form.Field key={name} name={name}>
            {(field) => {
              const isInvalid =
                field.state.meta.isTouched && !field.state.meta.isValid;
              return (
                <Field>
                  <FieldLabel htmlFor={field.name}>{label}</FieldLabel>
                  <Input
                    id={field.name}
                    type={type}
                    placeholder={placeholder}
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
        ))}
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
