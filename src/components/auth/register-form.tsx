"use client";

import { Button } from "@/components/ui/button";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useUserRegister } from "@/hooks";
import { cn } from "@/lib/utils";
import { registerZodSchema } from "@/validation";
import { useForm } from "@tanstack/react-form";
import { GraduationCap, type LucideIcon, PenTool } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "../ui/toast";
import { PasswordInput } from "./password-input";

export type RegisterRole = "STUDENT" | "EXPERT";

const Roles: {
  value: RegisterRole;
  title: string;
  description: string;
  icon: LucideIcon;
}[] = [
  {
    value: "STUDENT",
    title: "STUDENT",
    description: "Post assignments",
    icon: GraduationCap,
  },
  {
    value: "EXPERT",
    title: "EXPERT",
    description: "Bid on assignments",
    icon: PenTool,
  },
];

export function RegisterForm({
  defaultRole = "STUDENT",
}: {
  defaultRole?: RegisterRole;
}) {
  const [role, setRole] = useState<RegisterRole>(defaultRole);
  const { mutate: registerUser, isPending: isRegisterLoading } =
    useUserRegister();
  const router = useRouter();

  const form = useForm({
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
    validators: { onSubmit: registerZodSchema },
    onSubmit: ({ value }) => {
      const payload = {
        name: value.name,
        email: value.email,
        password: value.password,
        role: role,
      };

      registerUser(payload, {
        onSuccess: (data) => {
          toast.add({
            description:
              data.message ||
              "Success, Please Provide OTP to verify your account",
            type: "success",
          });
          router.push(`/verify?email=${value.email}&role=${role}`);
        },
      });
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
        <fieldset className="space-y-3">
          <legend className="mb-3 text-sm font-medium">
            I want to join as
          </legend>
          <div className="grid grid-cols-2 gap-3">
            {Roles.map((item) => (
              <label
                key={item.value}
                className={cn(
                  "flex cursor-pointer flex-col gap-2 rounded-lg border border-border p-3 transition-colors hover:bg-muted/50 has-focus-visible:ring-3 has-focus-visible:ring-ring/50",
                  role === item.value &&
                    "border-primary bg-primary/5 hover:bg-primary/5",
                )}
              >
                <input
                  type="radio"
                  name="role"
                  value={item.value}
                  checked={role === item.value}
                  onChange={() => setRole(item.value)}
                  className="sr-only"
                />
                <item.icon
                  className={cn(
                    "size-5 text-muted-foreground",
                    role === item.value && "text-primary",
                  )}
                />
                <div>
                  <p className="text-sm font-medium">{item.title}</p>
                  <p className="text-xs text-muted-foreground">
                    {item.description}
                  </p>
                </div>
              </label>
            ))}
          </div>
        </fieldset>

        <form.Field name="name">
          {(field) => {
            const isInvalid =
              field.state.meta.isTouched && !field.state.meta.isValid;
            return (
              <Field>
                <FieldLabel htmlFor={field.name}>Full name</FieldLabel>
                <Input
                  id={field.name}
                  autoComplete={field.name}
                  placeholder="Jane Doe"
                  className={`h-10 ${isInvalid ? "border-destructive" : ""}`}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                />{" "}
                {isInvalid && <FieldError errors={field.state.meta.errors} />}
              </Field>
            );
          }}
        </form.Field>

        <form.Field name="email">
          {(field) => {
            const isInvalid =
              field.state.meta.isTouched && !field.state.meta.isValid;
            return (
              <Field>
                <FieldLabel htmlFor={field.name}>Email</FieldLabel>
                <Input
                  className={`h-10 ${isInvalid ? "border-destructive" : ""}`}
                  id={field.name}
                  type={field.name}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  placeholder="you@example.com"
                />{" "}
                {isInvalid && <FieldError errors={field.state.meta.errors} />}
              </Field>
            );
          }}
        </form.Field>

        <form.Field name="password">
          {(field) => {
            const isInvalid =
              field.state.meta.isTouched && !field.state.meta.isValid;
            return (
              <Field>
                <div className="flex items-center justify-between">
                  <FieldLabel htmlFor={field.name}>Password</FieldLabel>
                  <Link
                    href="/forgot-password"
                    className="text-sm text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
                  >
                    Forgot password?
                  </Link>
                </div>
                <PasswordInput
                  className={`h-10 ${isInvalid ? "border-destructive" : ""}`}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  id={field.name}
                />
                {isInvalid && <FieldError errors={field.state.meta.errors} />}
              </Field>
            );
          }}
        </form.Field>

        <form.Field name="confirmPassword">
          {(field) => {
            const isInvalid =
              field.state.meta.isTouched && !field.state.meta.isValid;
            return (
              <Field>
                <div className="flex items-center justify-between">
                  <FieldLabel htmlFor={field.name}>Password</FieldLabel>
                  <Link
                    href="/forgot-password"
                    className="text-sm text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
                  >
                    Forgot password?
                  </Link>
                </div>
                <PasswordInput
                  className={`h-10 ${isInvalid ? "border-destructive" : ""}`}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  id={field.name}
                />
                {isInvalid && <FieldError errors={field.state.meta.errors} />}
              </Field>
            );
          }}
        </form.Field>

        <Button
          disabled={isRegisterLoading}
          type="submit"
          size="lg"
          className="w-full"
        >
          {isRegisterLoading ? "Registering..." : "Register"}
        </Button>
        <p className="text-center text-xs text-muted-foreground">
          By signing up, you agree to our{" "}
          <Link
            href="/terms"
            className="underline underline-offset-4 hover:text-foreground"
          >
            Terms
          </Link>{" "}
          and{" "}
          <Link
            href="/privacy"
            className="underline underline-offset-4 hover:text-foreground"
          >
            Privacy Policy
          </Link>
          .
        </p>
      </FieldGroup>
    </form>
  );
}
