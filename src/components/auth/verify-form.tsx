"use client";

import { Button } from "@/components/ui/button";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";

import { useVerifyExpertRegister, useVerifyRegister } from "@/hooks";
import { IVerifyExpertRegisterPayload } from "@/type";
import { expertVerifyZodSchema, studentVerifyZodSchema } from "@/validation";
import { useForm } from "@tanstack/react-form";
import { REGEXP_ONLY_DIGITS } from "input-otp";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { FileDropzone } from "../shared/file-dropzone";
import { Field, FieldError, FieldLabel } from "../ui/field";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { toast } from "../ui/toast";

export function VerifyForm({
  email,
  role,
}: {
  email: string;
  role: "STUDENT" | "EXPERT";
}) {
  const router = useRouter();
  const { mutate: verifyStudentRegister, isPending: isPendingStudent } =
    useVerifyRegister();
  const { mutate: verifyExpertRegister, isPending: isPendingExpert } =
    useVerifyExpertRegister();
  const expertFields =
    role === "EXPERT"
      ? {
          university: "",
          department: "",
          ratePerAssignment: 0,
          bio: "",
          documents: [] as File[],
        }
      : {};

  const form = useForm({
    defaultValues: {
      otp: "",
      email: email,
      ...expertFields,
    },
    validators: {
      onSubmit:
        role === "STUDENT" ? studentVerifyZodSchema : expertVerifyZodSchema,
    },
    onSubmit: ({ value }) => {
      if (role === "STUDENT") {
        verifyStudentRegister(value, {
          onSuccess: (res) => {
            toast.add({
              title: res.message ?? "Account verified successfully",
              type: "success",
            });
            router.push(`/login?email=${value.email}`);
          },
          onError: (error) => {
            toast.add({
              title: error.message ?? "Failed to verify account",
              type: "error",
            });
          },
        });
      } else if (role === "EXPERT") {
        verifyExpertRegister(value as IVerifyExpertRegisterPayload, {
          onSuccess: (res) => {
            toast.add({
              title: res.message ?? "Account verified successfully",
              type: "success",
            });
            router.push(`/login?email=${value.email}`);
          },
          onError: (error) => {
            console.log(error);
            toast.add({
              title: error.message ?? "Failed to verify account",
              type: "error",
            });
          },
        });
      }
    },
  });

  return (
    <form
      noValidate
      className="space-y-6"
      onSubmit={(e) => {
        e.preventDefault();
        form.handleSubmit();
      }}
    >
      <div className="space-y-3">
        <form.Field name="otp">
          {(field) => {
            const isInvalid =
              field.state.meta.isTouched && !field.state.meta.isValid;
            return (
              <Field>
                <InputOTP
                  autoFocus
                  maxLength={6}
                  pattern={REGEXP_ONLY_DIGITS}
                  inputMode="numeric"
                  autoComplete="one-time-code"
                  // disabled={isVerifyLoading}
                  onChange={(e) => {
                    field.handleChange(e);
                  }}
                  onComplete={
                    role === "STUDENT" ? form.handleSubmit : undefined
                  }
                  containerClassName="justify-center"
                  aria-invalid={isInvalid}
                >
                  <InputOTPGroup>
                    {[0, 1, 2].map((index) => (
                      <InputOTPSlot
                        key={index}
                        index={index}
                        aria-invalid={isInvalid}
                        className="size-12 text-lg"
                      />
                    ))}
                  </InputOTPGroup>
                  <InputOTPSeparator />
                  <InputOTPGroup>
                    {[3, 4, 5].map((index) => (
                      <InputOTPSlot
                        key={index}
                        index={index}
                        aria-invalid={isInvalid}
                        className="size-12 text-lg"
                      />
                    ))}
                  </InputOTPGroup>
                </InputOTP>
                {isInvalid && (
                  <FieldError
                    className="text-center"
                    errors={field.state.meta.errors}
                  />
                )}
              </Field>
            );
          }}
        </form.Field>
      </div>

      {/* field for Expert Verification */}
      {role === "EXPERT" && (
        <>
          <form.Field name="university">
            {(field) => {
              const isInvalid =
                field.state.meta.isTouched && !field.state.meta.isValid;
              return (
                <Field>
                  <FieldLabel htmlFor={field.name}>University</FieldLabel>
                  <Input
                    placeholder="e.g. University of Dhaka"
                    className={`h-10 ${isInvalid ? "border-destructive" : ""}`}
                    id={field.name}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                  />
                  {isInvalid && <FieldError errors={field.state.meta.errors} />}
                </Field>
              );
            }}
          </form.Field>
          <form.Field name="department">
            {(field) => {
              const isInvalid =
                field.state.meta.isTouched && !field.state.meta.isValid;
              return (
                <Field>
                  <FieldLabel htmlFor={field.name}>Department</FieldLabel>
                  <Input
                    placeholder="e.g. Computer Science"
                    className={`h-10 ${isInvalid ? "border-destructive" : ""}`}
                    id={field.name}
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
                  <FieldLabel htmlFor={field.name}>
                    Rate per Assignment
                  </FieldLabel>
                  <Input
                    placeholder="e.g. ৳50"
                    className={`h-10 ${isInvalid ? "border-destructive" : ""}`}
                    id={field.name}
                    type="number"
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(Number(e.target.value))}
                  />
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
                    placeholder="e.g. 5 years of tutoring experience in algorithms and databases."
                    className={`h-10 ${isInvalid ? "border-destructive" : ""}`}
                    id={field.name}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                  />
                  {isInvalid && <FieldError errors={field.state.meta.errors} />}
                </Field>
              );
            }}
          </form.Field>
          <form.Field name="documents">
            {(field) => {
              const isInvalid =
                field.state.meta.isTouched && !field.state.meta.isValid;
              return (
                <Field>
                  <FieldLabel htmlFor={field.name}>
                    Verification documents
                  </FieldLabel>
                  <FileDropzone
                    id={field.name}
                    value={field.state.value ?? []}
                    onChange={field.handleChange}
                    onBlur={field.handleBlur}
                    accept=".pdf,.jpg,.jpeg,.png"
                    hint="PDF, JPG or PNG · up to 5 files · 5MB each"
                    invalid={isInvalid}
                  />
                  {isInvalid && <FieldError errors={field.state.meta.errors} />}
                </Field>
              );
            }}
          </form.Field>
        </>
      )}

      <Button
        type="submit"
        size="lg"
        className="w-full"
        disabled={form.state.isSubmitting}
      >
        {isPendingStudent || isPendingExpert ? (
          <>
            <Loader2 className="animate-spin" /> Verifying...
          </>
        ) : (
          "Verify account"
        )}
      </Button>
    </form>
  );
}
