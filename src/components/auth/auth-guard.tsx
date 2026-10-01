"use client";

import { useGetMe } from "@/hooks";
import { UserRole } from "@/type";
import { useRouter } from "next/navigation";
import AuthLoading from "./auth-loading";

export default function AuthGuard({
  children,
  roles,
}: {
  children: React.ReactNode;
  roles: UserRole[];
}) {
  const { data, isLoading, isPending, isError } = useGetMe();

  const router = useRouter();
  const user = data?.data;
  const isAuthenticated = !!user && (!roles || roles.includes(user.role));
  if (isLoading || isPending) {
    return <AuthLoading />;
  }
  if (isError || !user) {
    router.push("/login");
    return;
  }
  if (isAuthenticated) {
    return <div>{children}</div>;
  }
  return <div>You are not authorized to access this page.</div>;
}
