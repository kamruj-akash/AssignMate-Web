"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useGetRevenueAnalytics } from "@/hooks";
import { cn } from "cn";
import { format, parse } from "date-fns";
import { formatCurrency, numberFormatter } from "./admin-format";
import BreakdownList, { BreakdownListSkeleton } from "./breakdown-list";
import DateRangeFilter, { useDateRange } from "./date-range-filter";
import MonthlyRevenueChart from "./monthly-revenue-chart";
import StatCard, { StatCardSkeleton } from "./stat-card";

export default function AdminReports() {
  const { preset, range, setPreset } = useDateRange("12M");
  const { data, isLoading, isError, error, isPlaceholderData } =
    useGetRevenueAnalytics(range);
  const analytics = data?.data;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-heading text-xl font-semibold">Revenue report</h1>
          <p className="text-sm text-muted-foreground">
            Money that moved through escrow in the selected period.
          </p>
        </div>
        <div className="overflow-x-auto">
          <DateRangeFilter preset={preset} onChange={setPreset} />
        </div>
      </div>

      {isError && (
        <p className="rounded-lg border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive">
          {error.message || "Failed to load revenue report."}
        </p>
      )}

      {isLoading || !analytics ? (
        !isError && (
          <div className="space-y-6">
            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
              {Array.from({ length: 4 }, (_, i) => (
                <StatCardSkeleton key={i} />
              ))}
            </div>
            <BreakdownListSkeleton rows={3} />
          </div>
        )
      ) : (
        <div
          className={cn(
            "space-y-6 transition-opacity",
            isPlaceholderData && "opacity-60",
          )}
        >
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            <StatCard
              label="Gross volume"
              value={formatCurrency(analytics.totals.grossVolume)}
              hint={`${numberFormatter.format(analytics.totals.escrowCount)} escrows funded`}
            />
            <StatCard
              label="Platform revenue"
              value={formatCurrency(analytics.totals.platformRevenue)}
              hint={`${formatCurrency(analytics.totals.pendingPlatformRevenue)} still pending`}
            />
            <StatCard
              label="Expert payouts"
              value={formatCurrency(analytics.totals.expertPayouts)}
              hint="Credited to expert wallets"
            />
            <StatCard
              label="Refunded"
              value={formatCurrency(analytics.totals.refundedToStudents)}
              hint="Returned to students"
            />
          </div>

          <MonthlyRevenueChart monthly={analytics.monthly} />

          <div className="grid gap-3 lg:grid-cols-3">
            <BreakdownList
              title="Escrows by status"
              items={Object.entries(analytics.byStatus).map(
                ([key, { count, amount }]) => ({
                  key,
                  value: count,
                  detail: formatCurrency(amount),
                }),
              )}
            />

            <section className="rounded-lg border border-border lg:col-span-2">
              <h3 className="p-4 pb-2 text-sm font-medium">Monthly breakdown</h3>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="pl-4">Month</TableHead>
                    <TableHead className="text-right">Escrows</TableHead>
                    <TableHead className="text-right">Gross volume</TableHead>
                    <TableHead className="text-right">Platform revenue</TableHead>
                    <TableHead className="pr-4 text-right">Expert payouts</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {analytics.monthly.length === 0 && (
                    <TableRow>
                      <TableCell
                        colSpan={5}
                        className="py-8 text-center text-muted-foreground"
                      >
                        No escrow activity in this period.
                      </TableCell>
                    </TableRow>
                  )}
                  {[...analytics.monthly].reverse().map((row) => (
                    <TableRow key={row.month}>
                      <TableCell className="pl-4">
                        {format(parse(row.month, "yyyy-MM", new Date()), "MMM yyyy")}
                      </TableCell>
                      <TableCell className="text-right tabular-nums">
                        {row.escrowCount}
                      </TableCell>
                      <TableCell className="text-right tabular-nums">
                        {formatCurrency(row.grossVolume)}
                      </TableCell>
                      <TableCell className="text-right tabular-nums">
                        {formatCurrency(row.platformRevenue)}
                      </TableCell>
                      <TableCell className="pr-4 text-right tabular-nums">
                        {formatCurrency(row.expertPayouts)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
                {analytics.monthly.length > 1 && (
                  <TableFooter>
                    <TableRow>
                      <TableCell className="pl-4 font-medium">Total</TableCell>
                      <TableCell className="text-right tabular-nums">
                        {analytics.totals.escrowCount}
                      </TableCell>
                      <TableCell className="text-right tabular-nums">
                        {formatCurrency(analytics.totals.grossVolume)}
                      </TableCell>
                      <TableCell className="text-right tabular-nums">
                        {formatCurrency(analytics.totals.platformRevenue)}
                      </TableCell>
                      <TableCell className="pr-4 text-right tabular-nums">
                        {formatCurrency(analytics.totals.expertPayouts)}
                      </TableCell>
                    </TableRow>
                  </TableFooter>
                )}
              </Table>
            </section>
          </div>
        </div>
      )}
    </div>
  );
}
