import AuthGuard from "@/components/auth/auth-guard";

export default function layout({ children }: { children: React.ReactNode }) {
  return (
    <AuthGuard roles={["ADMIN", "EXPERT", "STUDENT"]}>{children}</AuthGuard>
  );
}
