const steps = [
  { status: "OPEN", label: "Posted & open for bids" },
  { status: "ASSIGNED", label: "Bid accepted, escrow funded" },
  { status: "IN_PROGRESS", label: "Expert delivers the work" },
  { status: "UNDER_REVIEW", label: "You review the submission" },
  { status: "COMPLETED", label: "Escrow released to expert" },
];

export function Lifecycle() {
  return (
    <section className="mx-auto max-w-5xl px-4 py-20">
      <div className="mx-auto mb-10 max-w-xl text-center">
        <h2 className="font-heading text-2xl font-semibold tracking-tight sm:text-3xl">
          Money moves only when the work does
        </h2>
        <p className="mt-2 text-muted-foreground">
          Every assignment follows a fixed, role-driven flow — an expert
          never starts on an unfunded job, and a student never pays for
          unfinished work.
        </p>
      </div>
      <ol className="flex flex-col gap-8 sm:flex-row sm:justify-between">
        {steps.map((step, i) => (
          <li
            key={step.status}
            className="relative flex flex-1 flex-col items-center gap-2 text-center"
          >
            {i > 0 && (
              <span
                aria-hidden
                className="absolute top-4 right-1/2 hidden h-px w-full bg-border sm:block"
              />
            )}
            <span className="relative z-10 flex size-8 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-semibold text-primary-foreground">
              {i + 1}
            </span>
            <span className="font-mono text-xs text-muted-foreground">
              {step.status}
            </span>
            <span className="text-sm font-medium">{step.label}</span>
          </li>
        ))}
      </ol>
    </section>
  );
}
