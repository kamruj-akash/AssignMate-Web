import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "cn";
import { formatStatus, numberFormatter } from "./admin-format";

export interface IBreakdownItem {
  key: string;
  label?: string;
  value: number;
  // Optional secondary figure shown beside the count, e.g. an amount
  detail?: string;
}

// Horizontal single-hue bars: one measure (count) across categories, so the
// bar length carries magnitude and the label carries identity.
export default function BreakdownList({
  title,
  description,
  items,
  className,
}: {
  title: string;
  description?: string;
  items: IBreakdownItem[];
  className?: string;
}) {
  const total = items.reduce((sum, item) => sum + item.value, 0);
  const max = Math.max(...items.map((item) => item.value), 0);

  return (
    <section className={cn("rounded-lg border border-border p-4", className)}>
      <div className="mb-4 flex items-baseline justify-between gap-2">
        <div>
          <h3 className="text-sm font-medium">{title}</h3>
          {description && (
            <p className="text-xs text-muted-foreground">{description}</p>
          )}
        </div>
        <span className="text-xs text-muted-foreground tabular-nums">
          {numberFormatter.format(total)} total
        </span>
      </div>
      <ul className="space-y-3">
        {items.map((item) => {
          const share = total === 0 ? 0 : (item.value / total) * 100;
          return (
            <li
              key={item.key}
              title={`${item.label ?? formatStatus(item.key)}: ${numberFormatter.format(item.value)} (${share.toFixed(1)}%)`}
            >
              <div className="mb-1 flex items-center justify-between gap-2 text-sm">
                <span className="truncate first-letter:uppercase">
                  {(item.label ?? formatStatus(item.key)).toLowerCase()}
                </span>
                <span className="shrink-0 tabular-nums">
                  {numberFormatter.format(item.value)}
                  {item.detail && (
                    <span className="ml-2 text-xs text-muted-foreground">
                      {item.detail}
                    </span>
                  )}
                </span>
              </div>
              <div className="h-1.5 rounded-full bg-muted">
                <div
                  className="h-full rounded-full bg-primary transition-[width]"
                  style={{
                    width: `${max === 0 ? 0 : (item.value / max) * 100}%`,
                  }}
                />
              </div>
            </li>
          );
        })}
      </ul>
    </section>
  );
}

export function BreakdownListSkeleton({ rows = 4 }: { rows?: number }) {
  return (
    <div className="rounded-lg border border-border p-4">
      <Skeleton className="mb-5 h-4 w-32" />
      <div className="space-y-4">
        {Array.from({ length: rows }, (_, i) => (
          <div key={i}>
            <Skeleton className="mb-1.5 h-3.5 w-full" />
            <Skeleton className="h-1.5 w-full rounded-full" />
          </div>
        ))}
      </div>
    </div>
  );
}
