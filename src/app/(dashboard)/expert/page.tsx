import AuthGuard from "@/components/auth/auth-guard";

export default function page() {
  return <AuthGuard roles={["EXPERT"]}>Admin</AuthGuard>;
}
