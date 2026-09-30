import { RegisterForm } from "@/components/auth/register-form";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Sign up - AssignMate",
};

export default async function RegisterPage({
  searchParams,
}: PageProps<"/register">) {
  const { role } = await searchParams;

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h1 className="font-heading text-3xl font-semibold tracking-tight">
          Create your account
        </h1>
        <p className="text-muted-foreground">
          It takes a minute — no card required.
        </p>
      </div>
      <RegisterForm defaultRole={role === "expert" ? "expert" : "student"} />
      <p className="text-center text-sm text-muted-foreground">
        Already have an account?{" "}
        <Link
          href="/login"
          className="font-medium text-primary underline-offset-4 hover:underline"
        >
          Log in
        </Link>
      </p>
    </div>
  );
}
