import Link from "next/link";
import { AuthButtons } from "../shared/auth-buttons";
import Logo from "../shared/logo";
import { hasSession } from "@/lib/session";

const NavItems = [
  { tittle: "How it works", href: "/#how-it-works" },
  { tittle: "Why trust us", href: "/#trust" },
  { tittle: "Posted Assignments", href: "/assignments" },
];

export async function Navbar() {
  const isLoggedIn = await hasSession();

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/80 backdrop-blur-sm">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
        <Link
          href="/"
          className="flex items-center gap-2 font-heading text-lg font-semibold"
        >
          <Logo />
        </Link>
        <nav className="hidden items-center gap-6 text-sm text-muted-foreground sm:flex">
          {NavItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="hover:text-foreground"
            >
              {item.tittle}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <AuthButtons hasSession={isLoggedIn} />
        </div>
      </div>
    </header>
  );
}
