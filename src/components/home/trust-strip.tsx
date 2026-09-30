import { BadgeCheck, Gavel, ShieldCheck, Wallet } from "lucide-react";

const items = [
  { icon: Wallet, label: "bKash secured checkout" },
  { icon: BadgeCheck, label: "Verified experts only" },
  { icon: ShieldCheck, label: "Escrow protected payments" },
  { icon: Gavel, label: "Admin-arbitrated disputes" },
];

export function TrustStrip() {
  return (
    <section id="trust" className="border-y border-border bg-muted/40">
      <div className="mx-auto grid max-w-6xl grid-cols-2 gap-6 px-4 py-8 sm:grid-cols-4">
        {items.map(({ icon: Icon, label }) => (
          <div
            key={label}
            className="flex flex-col items-center gap-2 text-center sm:flex-row sm:text-left"
          >
            <Icon className="size-5 shrink-0 text-primary" />
            <span className="text-sm font-medium text-foreground">
              {label}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}
