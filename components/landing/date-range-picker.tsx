"use client";

import type { DateRange } from "react-day-picker";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function DateRangePickerContent({
  value,
  onChange,
  onClose,
  fullWidth,
  compact,
}: {
  value: DateRange | undefined;
  onChange: (range: DateRange | undefined) => void;
  onClose: () => void;
  fullWidth?: boolean;
  compact?: boolean;
}) {
  function handleReset() {
    onChange(undefined);
  }

  const compactClassNames = compact
    ? {
        root: "!w-full",
        table: "w-full table-fixed border-collapse",
        months: "w-full flex gap-4 flex-col md:flex-row relative",
        month: "w-full min-w-0 flex flex-col gap-2",
        week: "flex w-full mt-0.5",
      }
    : undefined;

  return (
    <div className={fullWidth ? "w-full px-0" : "px-4"}>
      <div className={fullWidth ? "w-full min-w-0" : "flex justify-center"}>
        <Calendar
          mode="range"
          numberOfMonths={2}
          selected={value}
          onSelect={onChange}
          defaultMonth={value?.from ?? new Date()}
          className={cn(
            "rounded-t-xl pl-0 pr-0 pt-3 pb-3",
            fullWidth && !compact && "!w-full [--cell-size:2.75rem]",
            (compact || fullWidth) && "!w-full",
            compact && "[--cell-size:1.875rem]"
          )}
          classNames={
            compact
              ? compactClassNames
              : fullWidth
                ? { root: "!w-full", table: "w-full table-fixed border-collapse", months: "w-full flex gap-4 flex-col md:flex-row relative", month: "w-full min-w-0 flex flex-col gap-4" }
                : undefined
          }
        />
      </div>
      <div className="flex items-center justify-between border-t py-3">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={handleReset}
          className="text-zinc-600"
        >
          Reset
        </Button>
        <Button
          type="button"
          size="sm"
          onClick={onClose}
          className="bg-[#156EF5] hover:bg-[#125bd4]"
        >
          Save
        </Button>
      </div>
    </div>
  );
}
