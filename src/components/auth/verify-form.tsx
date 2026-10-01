"use client";

import { Button } from "@/components/ui/button";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";

import { useVerifyRegister } from "@/hooks";
import { expertVerifyZodSchema, studentVerifyZodSchema } from "@/validation";
import { useForm } from "@tanstack/react-form";
import { REGEXP_ONLY_DIGITS } from "input-otp";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { Field, FieldError } from "../ui/field";
import { toast } from "../ui/toast";

export function VerifyForm({
  email,
  role,
}: {
  email: string;
  role: "STUDENT" | "EXPERT";
}) {
  const router = useRouter();
  const { mutate: verifyRegister, isPending } = useVerifyRegister();
  const form = useForm({
    defaultValues: {
      otp: "",
      email: email,
    },
    validators: {
      onSubmit:
        role === "STUDENT" ? studentVerifyZodSchema : expertVerifyZodSchema,
    },
    onSubmit: ({ value }) => {
      verifyRegister(value, {
        onSuccess: () => {
          toast.add({
            title: "Account verified successfully",
            type: "success",
          });
          router.push(`/login?email=${value.email}`);
        },
      });
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
                  onComplete={form.handleSubmit}
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

      <Button
        type="submit"
        size="lg"
        className="w-full"
        disabled={form.state.isSubmitting}
      >
        {isPending ? (
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
