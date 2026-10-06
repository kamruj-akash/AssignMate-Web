"use client";

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { IRevenueMonth } from "@/type";
import { format, parse } from "date-fns";
import { useState } from "react";
import { currencyFormatter, formatCurrency } from "./admin-format";

type TMetric = "grossVolume" | "platformRevenue" | "expertPayouts";

const metricLabels: Record<TMetric, string> = {
  grossVolume: "Gross volume",
  platformRevenue: "Platform revenue",
  expertPayouts: "Expert payouts",
};

const compactCurrency = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  notation: "compact",
  maximumFractionDigits: 1,
});

const CHART_HEIGHT = 220;
const TICK_COUNT = 4;

const monthLabel = (month: string, pattern: string) =>
  format(parse(month, "yyyy-MM", new Date()), pattern);

// Rounds the axis max up to a 1/2/5 × 10^n step so ticks land on clean values.
const niceMax = (value: number) => {
  if (value <= 0) return 1;
  const step = value / TICK_COUNT;
  const magnitude = 10 ** Math.floor(Math.log10(step));
  const nice = [1, 2, 5, 10].find((n) => n * magnitude >= step) ?? 10;
  return nice * magnitude * TICK_COUNT;
};

// One measure at a time on one axis; switching metric re-scales the same bars.
export default function MonthlyRevenueChart({
  monthly,
}: {
  monthly: IRevenueMonth[];
}) {
  const [metric, setMetric] = useState<TMetric>("grossVolume");
  const [hovered, setHovered] = useState<number | null>(null);

  const max = niceMax(Math.max(...monthly.map((row) => row[metric]), 0));
  const ticks = Array.from(
    { length: TICK_COUNT + 1 },
    (_, i) => (max / TICK_COUNT) * i,
  );
  const active = hovered === null ? null : monthly[hovered];

  return (
    <section className="rounded-lg border border-border p-4">
      <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
        <div>
          <h3 className="text-sm font-medium">{metricLabels[metric]} by month</h3>
          <p className="text-xs text-muted-foreground">
            Grouped by the month each escrow was funded.
          </p>
        </div>
        <Tabs value={metric} onValueChange={(value) => setMetric(value as TMetric)}>
          <TabsList>
            {(Object.keys(metricLabels) as TMetric[]).map((value) => (
              <TabsTrigger key={value} value={value} className="cursor-pointer">
                {metricLabels[value]}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </div>

      {monthly.length === 0 ? (
        <p
          className="flex items-center justify-center text-sm text-muted-foreground"
          style={{ height: CHART_HEIGHT }}
        >
          No escrow activity in this period.
        </p>
      ) : (
        <div className="mt-6 flex gap-2">
          {/* y-axis */}
          <div
            className="relative w-12 shrink-0 text-right text-xs text-muted-foreground tabular-nums"
            style={{ height: CHART_HEIGHT }}
          >
            {ticks.map((tick) => (
              <span
                key={tick}
                className="absolute right-0 -translate-y-1/2"
                style={{ bottom: `${(tick / max) * 100}%` }}
              >
                {compactCurrency.format(tick)}
              </span>
            ))}
          </div>

          <div className="relative min-w-0 flex-1">
            {/* gridlines */}
            <div className="absolute inset-x-0 top-0" style={{ height: CHART_HEIGHT }}>
              {ticks.map((tick) => (
                <div
                  key={tick}
                  className="absolute inset-x-0 border-t border-border"
                  style={{ bottom: `${(tick / max) * 100}%` }}
                />
              ))}
            </div>

            {active && hovered !== null && (
              <div
                className="pointer-events-none absolute z-10 -translate-x-1/2 rounded-md border border-border bg-popover px-3 py-2 text-xs shadow-md"
                style={{
                  left: `${((hovered + 0.5) / monthly.length) * 100}%`,
                  top: 0,
                }}
              >
                <p className="mb-1 font-medium">
                  {monthLabel(active.month, "MMMM yyyy")}
                </p>
                <p className="whitespace-nowrap">
                  <span className="text-muted-foreground">{metricLabels[metric]}: </span>
                  <span className="font-medium tabular-nums">
                    {formatCurrency(active[metric])}
                  </span>
                </p>
                <p className="whitespace-nowrap text-muted-foreground">
                  {active.escrowCount} escrow{active.escrowCount === 1 ? "" : "s"}
                </p>
              </div>
            )}

            <div
              className="relative flex items-end gap-0.5"
              style={{ height: CHART_HEIGHT }}
              onMouseLeave={() => setHovered(null)}
            >
              {monthly.map((row, index) => (
                // Full-height column is the hit target; the bar inside is the mark.
                <div
                  key={row.month}
                  className="flex h-full flex-1 cursor-default items-end justify-center"
                  onMouseEnter={() => setHovered(index)}
                  role="img"
                  aria-label={`${monthLabel(row.month, "MMMM yyyy")}: ${currencyFormatter.format(row[metric])}`}
                >
                  <div
                    className="w-full max-w-10 rounded-t-[4px] bg-primary transition-[height,opacity]"
                    style={{
                      height: `${(row[metric] / max) * 100}%`,
                      opacity: hovered === null || hovered === index ? 1 : 0.45,
                    }}
                  />
                </div>
              ))}
            </div>

            {/* x-axis */}
            <div className="mt-2 flex gap-0.5 text-xs text-muted-foreground">
              {monthly.map((row, index) => (
                <span
                  key={row.month}
                  className="flex-1 truncate text-center"
                  // Thin out labels when there are many months
                  style={{
                    visibility:
                      monthly.length > 12 && index % 2 === 1 ? "hidden" : "visible",
                  }}
                >
                  {monthLabel(row.month, monthly.length > 6 ? "MMM" : "MMM yy")}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
