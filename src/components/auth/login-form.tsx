"use client";

import { Button } from "@/components/ui/button";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useLogin } from "@/hooks";
import { loginZodSchema } from "@/validation";
import { useForm } from "@tanstack/react-form";
import { Loader } from "lucide-react";
import Link from "next/link";
import { toast } from "../ui/toast";
import { PasswordInput } from "./password-input";

export function LoginForm() {
  const { mutate: handleLogin, isPending } = useLogin();
  const form = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
    validators: {
      onSubmit: loginZodSchema,
    },
    onSubmit: ({ value }) => {
      handleLogin(value, {
        onSuccess: (res) => {
          toast.add({
            title: "Login successful",
            type: "success",
          });
          console.log(res);
        },
        onError: (err) => {
          toast.add({
            title: err.message || "Login failed",
            type: "error",
          });
          console.log(err);
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
                />
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
        <Button disabled={isPending} type="submit" size="lg" className="w-full">
          {isPending ? (
            <>
              <Loader className="animate-spin" /> Logging in...
            </>
          ) : (
            "Login"
          )}
        </Button>
      </FieldGroup>
    </form>
  );
}
