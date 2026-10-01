"use client";

import Logo from "@/components/shared/logo";
import { Button, buttonVariants } from "@/components/ui/button";
import { UserRole } from "@/type";
import { ArrowLeft, LayoutDashboard, ShieldX } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

const DASHBOARD_BY_ROLE: Record<UserRole, string> = {
  ADMIN: "/admin",
  STUDENT: "/student",
  EXPERT: "/expert",
};

export default function NotAuthorized({ role }: { role?: UserRole }) {
  const router = useRouter();
  const dashboardHref = role ? DASHBOARD_BY_ROLE[role] : "/";

  return (
    <div className="relative flex min-h-svh w-full items-center justify-center overflow-hidden bg-background px-4">
      <div
        aria-hidden
        className="pointer-events-none absolute top-1/2 left-1/2 size-112 -translate-x-1/2 -translate-y-1/2 rounded-full bg-destructive/10 blur-3xl"
      />

      <div className="relative flex w-full max-w-sm animate-in flex-col items-center gap-8 text-center duration-500 fade-in zoom-in-95">
        <Logo />

        <span className="flex size-16 items-center justify-center rounded-full bg-destructive/10 text-destructive ring-8 ring-destructive/5">
          <ShieldX className="size-8" aria-hidden />
        </span>

        <div className="space-y-2">
          <p className="text-xs font-semibold tracking-widest text-destructive uppercase">
            Error 403
          </p>
          <h1 className="text-2xl font-semibold text-foreground">
            Access denied
          </h1>
          <p className="text-sm text-muted-foreground">
            You don&apos;t have permission to view this page. If you think this
            is a mistake, please contact support.
          </p>
        </div>

        <div className="flex w-full flex-col gap-2 sm:flex-row sm:justify-center">
          <Button variant="outline" size="lg" onClick={() => router.back()}>
            <ArrowLeft data-icon="inline-start" />
            Go back
          </Button>
          <Link href={dashboardHref} className={buttonVariants({ size: "lg" })}>
            <LayoutDashboard data-icon="inline-start" />
            {role ? "Go to my dashboard" : "Go home"}
          </Link>
        </div>
      </div>
    </div>
  );
}
