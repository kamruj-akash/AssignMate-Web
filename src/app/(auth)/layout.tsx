import Logo from "@/components/shared/logo";
import { BadgeCheck, ShieldCheck, Wallet } from "lucide-react";
import Link from "next/link";

const Highlights = [
  {
    icon: ShieldCheck,
    title: "Escrow-protected payments",
    description: "Funds are released only when you approve the work.",
  },
  {
    icon: BadgeCheck,
    title: "Verified experts",
    description: "Every expert is reviewed before they can bid.",
  },
  {
    icon: Wallet,
    title: "Compare bids",
    description: "Pick the offer that fits your budget and deadline.",
  },
];

export default function AuthLayout({ children }: LayoutProps<"/">) {
  return (
    <main className="grid flex-1 lg:grid-cols-2">
      <div className="flex flex-col px-4 py-8 sm:px-8">
        <Link href="/" className="w-fit">
          <Logo />
        </Link>
        <div className="flex flex-1 items-center justify-center py-12">
          <div className="w-full max-w-sm">{children}</div>
        </div>
      </div>

      <aside className="hidden flex-col justify-center gap-10 bg-primary px-12 py-16 text-primary-foreground lg:flex xl:px-20">
        <div className="space-y-3">
          <h2 className="font-heading text-4xl font-semibold tracking-tight text-balance">
            Every assignment needs a mate.
          </h2>
          <p className="max-w-md text-primary-foreground/80">
            Neither side has to trust the other — only the flow.
          </p>
        </div>
        <ul className="space-y-6">
          {Highlights.map((item) => (
            <li key={item.title} className="flex gap-4">
              <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary-foreground/10">
                <item.icon className="size-5" />
              </div>
              <div>
                <p className="font-medium">{item.title}</p>
                <p className="text-sm text-primary-foreground/75">
                  {item.description}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </aside>
    </main>
  );
}
