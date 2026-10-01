import AuthGuard from "@/components/auth/auth-guard";
import DashboardShell from "@/components/dashboard/dashboard-shell";

export default function layout({ children }: { children: React.ReactNode }) {
  return (
    <AuthGuard roles={["STUDENT"]}>
      <DashboardShell role="STUDENT">{children}</DashboardShell>
    </AuthGuard>
  );
}
