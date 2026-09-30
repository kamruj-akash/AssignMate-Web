import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ArrowRight, ShieldCheck } from "lucide-react";

export function Hero() {
  return (
    <section className="mx-auto flex max-w-3xl flex-col items-center gap-6 px-4 pt-20 pb-16 text-center sm:pt-28">
      <div className="inline-flex items-center gap-1.5 rounded-full border border-border bg-muted px-3 py-1 text-xs font-medium text-muted-foreground">
        <ShieldCheck className="size-3.5 text-primary" />
        Your payment stays in escrow until the work is done
      </div>
      <h1 className="font-heading text-4xl font-semibold tracking-tight text-balance sm:text-5xl">
        Every assignment needs a mate.
      </h1>
      <p className="max-w-xl text-muted-foreground sm:text-lg">
        Post your assignment, compare bids from verified experts, and pay
        only when you approve the work. Neither side has to trust the other —
        only the flow.
      </p>
      <div className="flex flex-col gap-3 sm:flex-row">
        <Button
          size="lg"
          nativeButton={false}
          render={<Link href="/register?role=student" />}
        >
          Post an Assignment
          <ArrowRight data-icon="inline-end" className="size-4" />
        </Button>
        <Button
          size="lg"
          variant="outline"
          nativeButton={false}
          render={<Link href="/register?role=expert" />}
        >
          Become an Expert
        </Button>
      </div>
      <Separator className="mt-8 max-w-sm" />
    </section>
  );
}
