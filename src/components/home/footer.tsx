import Link from "next/link";
import Logo from "../shared/logo";

export function Footer() {
  return (
    <footer className="border-t border-border">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-4 px-4 py-10 text-sm text-muted-foreground sm:flex-row sm:justify-between">
        <div className="flex items-center gap-2 font-heading font-semibold text-foreground">
          <Logo />
        </div>
        <p>
          &copy; {new Date().getFullYear()} AssignMate. Every assignment needs a
          mate.
        </p>
        <nav className="flex items-center gap-4">
          <Link href="/login" className="hover:text-foreground">
            Log in
          </Link>
          <Link href="/register" className="hover:text-foreground">
            Sign up
          </Link>
        </nav>
      </div>
    </footer>
  );
}
