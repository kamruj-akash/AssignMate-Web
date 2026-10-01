import AuthGuard from "@/components/auth/auth-guard";
import DashboardShell from "@/components/dashboard/dashboard-shell";

export default function layout({ children }: { children: React.ReactNode }) {
  return (
    <AuthGuard roles={["EXPERT"]}>
      <DashboardShell role="EXPERT">{children}</DashboardShell>
    </AuthGuard>
  );
}
