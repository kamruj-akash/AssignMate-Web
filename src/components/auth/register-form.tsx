"use client";

import { PasswordInput } from "@/components/auth/password-input";
import { Button } from "@/components/ui/button";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { GraduationCap, type LucideIcon, PenTool } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export type RegisterRole = "student" | "expert";

const Roles: {
  value: RegisterRole;
  title: string;
  description: string;
  icon: LucideIcon;
}[] = [
  {
    value: "student",
    title: "Student",
    description: "Post assignments",
    icon: GraduationCap,
  },
  {
    value: "expert",
    title: "Expert",
    description: "Bid on assignments",
    icon: PenTool,
  },
];

export function RegisterForm({
  defaultRole = "student",
}: {
  defaultRole?: RegisterRole;
}) {
  const [role, setRole] = useState<RegisterRole>(defaultRole);

  return (
    <form noValidate onSubmit={(e) => e.preventDefault()}>
      <FieldGroup className="gap-5">
        <fieldset className="space-y-3">
          <legend className="mb-3 text-sm font-medium">I want to join as</legend>
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
        <Field>
          <FieldLabel htmlFor="name">Full name</FieldLabel>
          <Input
            id="name"
            autoComplete="name"
            placeholder="Jane Doe"
            className="h-10"
          />
        </Field>
        <Field>
          <FieldLabel htmlFor="email">Email</FieldLabel>
          <Input
            id="email"
            type="email"
            autoComplete="email"
            placeholder="you@example.com"
            className="h-10"
          />
        </Field>
        <Field>
          <FieldLabel htmlFor="password">Password</FieldLabel>
          <PasswordInput id="password" autoComplete="new-password" />
        </Field>
        <Field>
          <FieldLabel htmlFor="confirmPassword">Confirm password</FieldLabel>
          <PasswordInput id="confirmPassword" autoComplete="new-password" />
        </Field>
        <Button type="submit" size="lg" className="w-full">
          Create account
        </Button>
        <p className="text-center text-xs text-muted-foreground">
          By signing up, you agree to our{" "}
          <Link href="/terms" className="underline underline-offset-4 hover:text-foreground">
            Terms
          </Link>{" "}
          and{" "}
          <Link href="/privacy" className="underline underline-offset-4 hover:text-foreground">
            Privacy Policy
          </Link>
          .
        </p>
      </FieldGroup>
    </form>
  );
}
