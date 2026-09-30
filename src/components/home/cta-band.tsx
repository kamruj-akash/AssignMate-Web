import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export function CtaBand() {
  return (
    <section className="border-t border-border bg-muted/40">
      <div className="mx-auto flex max-w-3xl flex-col items-center gap-4 px-4 py-16 text-center">
        <h2 className="font-heading text-2xl font-semibold tracking-tight sm:text-3xl">
          Ready to get started?
        </h2>
        <p className="max-w-md text-muted-foreground">
          Whether you need an assignment done or you&apos;re ready to bid on
          one — it takes a minute to sign up.
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
      </div>
    </section>
  );
}
