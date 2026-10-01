"use client";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetMe } from "@/hooks";
import Link from "next/link";

export function AuthButtons({ hasSession }: { hasSession: boolean }) {
  const { data: user, isLoading } = useGetMe(!!hasSession);

  if (isLoading) return <Skeleton className="h-8 w-28" />;

  if (user) {
    return (
      <Button
        size="sm"
        nativeButton={false}
        render={<Link href={`/${user.data.role.toLowerCase()}`} />}
      >
        Dashboard
      </Button>
    );
  }

  return (
    <>
      <Button
        variant="ghost"
        size="sm"
        nativeButton={false}
        render={<Link href="/login" />}
      >
        Log in
      </Button>
      <Button size="sm" nativeButton={false} render={<Link href="/register" />}>
        Get Started
      </Button>
    </>
  );
}
