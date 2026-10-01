import Logo from "@/components/shared/logo";

const DOT_DELAYS = [0, 150, 300];

export default function AuthLoading() {
  return (
    <div
      role="status"
      aria-live="polite"
      className="relative flex min-h-svh w-full items-center justify-center overflow-hidden bg-background px-4"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute top-1/2 left-1/2 size-112 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/10 blur-3xl"
      />

      <div className="relative flex animate-in flex-col items-center gap-8 duration-500 fade-in zoom-in-95">
        <Logo />

        <div aria-hidden className="relative size-16">
          <span className="absolute inset-0 rounded-full border-4 border-primary/15" />
          <span className="absolute inset-0 animate-spin rounded-full border-4 border-transparent border-t-primary motion-reduce:animate-none" />
          <span className="absolute inset-4 animate-ping rounded-full bg-primary/25 motion-reduce:animate-none" />
        </div>

        <div className="flex flex-col items-center gap-1.5 text-center">
          <p className="flex items-end gap-1 text-base font-medium text-foreground">
            Authenticating
            <span aria-hidden className="mb-1.5 flex gap-0.5">
              {DOT_DELAYS.map((delay) => (
                <span
                  key={delay}
                  className="size-1 animate-bounce rounded-full bg-primary motion-reduce:animate-none"
                  style={{ animationDelay: `${delay}ms` }}
                />
              ))}
            </span>
          </p>
          <p className="text-sm text-muted-foreground">
            Verifying your session, please wait
          </p>
        </div>
      </div>
    </div>
  );
}
