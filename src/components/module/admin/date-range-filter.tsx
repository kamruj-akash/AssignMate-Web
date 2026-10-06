"use client";

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { IDateRangeParams } from "@/type";
import { startOfDay, startOfYear, subDays } from "date-fns";
import { useState } from "react";

export type TDateRangePreset = "ALL" | "30D" | "90D" | "YTD" | "12M";

const presetLabels: Record<TDateRangePreset, string> = {
  ALL: "All time",
  "30D": "30 days",
  "90D": "90 days",
  YTD: "This year",
  "12M": "12 months",
};

const presetToRange = (preset: TDateRangePreset): IDateRangeParams => {
  const now = new Date();
  switch (preset) {
    case "30D":
      return { from: startOfDay(subDays(now, 29)).toISOString() };
    case "90D":
      return { from: startOfDay(subDays(now, 89)).toISOString() };
    case "YTD":
      return { from: startOfYear(now).toISOString() };
    case "12M":
      return { from: startOfDay(subDays(now, 364)).toISOString() };
    default:
      return {};
  }
};

// The range is computed once per preset change so query keys stay stable
// between renders.
export function useDateRange(initial: TDateRangePreset = "ALL") {
  const [preset, setPreset] = useState<TDateRangePreset>(initial);
  const [range, setRange] = useState<IDateRangeParams>(() =>
    presetToRange(initial),
  );

  const changePreset = (next: TDateRangePreset) => {
    setPreset(next);
    setRange(presetToRange(next));
  };

  return { preset, range, setPreset: changePreset };
}

export default function DateRangeFilter({
  preset,
  onChange,
}: {
  preset: TDateRangePreset;
  onChange: (preset: TDateRangePreset) => void;
}) {
  return (
    <Tabs
      value={preset}
      onValueChange={(value) => onChange(value as TDateRangePreset)}
    >
      <TabsList>
        {(Object.keys(presetLabels) as TDateRangePreset[]).map((value) => (
          <TabsTrigger key={value} value={value} className="cursor-pointer">
            {presetLabels[value]}
          </TabsTrigger>
        ))}
      </TabsList>
    </Tabs>
  );
}
