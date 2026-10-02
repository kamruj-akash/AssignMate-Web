import { VerifyForm } from "@/components/auth/verify-form";
import { MailCheck } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Verify email - AssignMate",
};
type ROLE = "STUDENT" | "EXPERT";

export default async function VerifyPage({
  searchParams,
}: PageProps<"/verify">) {
  const { email, role } = await searchParams;
  const verifyEmail = typeof email === "string" ? email.trim() : "";
  const verifyRole = typeof role === "string" ? role.trim() : "";

  if (!verifyEmail || !verifyRole) {
    return (
      <div className="space-y-6">
        <div className="space-y-2">
          <h1 className="font-heading text-3xl font-semibold tracking-tight">
            Verification link is incomplete
          </h1>
          <p className="text-muted-foreground">
            We couldn&apos;t tell which email or role to verify. Please sign up
            again to get a new code.
          </p>
        </div>
        <Link
          href="/register"
          className="font-medium text-primary underline-offset-4 hover:underline"
        >
          Back to sign up
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <div className="flex size-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
          <MailCheck className="size-6" />
        </div>
        <div className="space-y-2">
          <h1 className="font-heading text-3xl font-semibold tracking-tight">
            Check your email
          </h1>
          <p className="text-muted-foreground">
            We sent a 6-digit code to{" "}
            <span className="font-medium break-all text-foreground">
              {verifyEmail}
            </span>
            . Enter it below to verify your account.
          </p>
        </div>
      </div>
      <VerifyForm email={verifyEmail} role={verifyRole as ROLE} />
      <p className="text-center text-sm text-muted-foreground">
        Wrong email or code expired?{" "}
        <Link
          href="/register"
          className="font-medium text-primary underline-offset-4 hover:underline"
        >
          Sign up again
        </Link>
      </p>
    </div>
  );
}
