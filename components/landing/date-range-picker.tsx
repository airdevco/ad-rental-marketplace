"use client";

import { startOfDay } from "date-fns";
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
  const today = startOfDay(new Date());
  function handleReset() {
    onChange(undefined);
  }

  const disabledClassNames = {
    disabled: "text-zinc-400 opacity-60 cursor-not-allowed",
  };

  const compactClassNames = compact
    ? {
        root: "!w-full",
        table: "w-full table-fixed border-collapse",
        months: "w-full flex gap-4 flex-row flex-wrap justify-center sm:flex-nowrap sm:justify-start",
        month: "w-full min-w-0 flex flex-col gap-2 flex-shrink-0",
        week: "flex w-full mt-0.5",
        ...disabledClassNames,
      }
    : undefined;

  const fullWidthClassNames = fullWidth
    ? {
        root: "!w-full",
        table: "w-full table-fixed border-collapse",
        months: "w-full flex gap-4 flex-row flex-wrap justify-center sm:flex-nowrap sm:justify-start",
        month: "w-full min-w-0 flex flex-col gap-4 flex-shrink-0",
        ...disabledClassNames,
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
          disabled={{ before: today }}
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
                ? fullWidthClassNames
                : disabledClassNames
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
