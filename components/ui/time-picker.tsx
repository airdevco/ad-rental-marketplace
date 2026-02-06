"use client";

import { useState, useEffect, useRef } from "react";
import { ClockIcon } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

const HOURS = Array.from({ length: 12 }, (_, i) => i + 1);
const MINUTES: (0 | 30)[] = [0, 30];
const PERIODS = ["AM", "PM"] as const;

function parseTime(value: string | undefined): {
  hour: number;
  minute: 0 | 30;
  period: "AM" | "PM";
} | null {
  if (!value || !value.trim()) return null;
  const match = value.trim().match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
  if (!match) return null;
  const hour = parseInt(match[1], 10);
  const minute = parseInt(match[2], 10) as 0 | 30;
  const period = match[3].toUpperCase() as "AM" | "PM";
  if (hour < 1 || hour > 12) return null;
  if (minute !== 0 && minute !== 30) return null;
  return { hour, minute, period };
}

function formatTime(hour: number, minute: 0 | 30, period: "AM" | "PM"): string {
  return `${hour}:${minute.toString().padStart(2, "0")} ${period}`;
}

type TimePickerProps = {
  value?: string;
  onChange?: (value: string) => void;
  id?: string;
  name?: string;
  placeholder?: string;
  "aria-label"?: string;
  className?: string;
  triggerClassName?: string;
  /** When false, hides the clock icon in the trigger */
  showIcon?: boolean;
};

export function TimePicker({
  value = "",
  onChange,
  id,
  name,
  placeholder = "Add time",
  "aria-label": ariaLabel,
  className,
  triggerClassName,
  showIcon = true,
}: TimePickerProps) {
  const parsed = parseTime(value);
  const [open, setOpen] = useState(false);
  const [hour, setHour] = useState<number>(parsed?.hour ?? 9);
  const [minute, setMinute] = useState<0 | 30>(parsed?.minute ?? 0);
  const [period, setPeriod] = useState<"AM" | "PM">(parsed?.period ?? "AM");
  const hourListRef = useRef<HTMLDivElement>(null);
  const minuteListRef = useRef<HTMLDivElement>(null);
  const periodListRef = useRef<HTMLDivElement>(null);

  // Sync internal state when value prop changes
  useEffect(() => {
    const p = parseTime(value);
    if (p) {
      setHour(p.hour);
      setMinute(p.minute);
      setPeriod(p.period);
    }
  }, [value]);

  // Scroll selected item into view when popover opens
  useEffect(() => {
    if (!open) return;
    const scroll = (ref: React.RefObject<HTMLDivElement | null>, index: number) => {
      const el = ref.current;
      if (!el) return;
      const item = el.querySelector(`[data-index="${index}"]`);
      item?.scrollIntoView({ block: "nearest", behavior: "instant" });
    };
    const t = requestAnimationFrame(() => {
      scroll(hourListRef, hour - 1);
      scroll(minuteListRef, minute === 30 ? 1 : 0);
      scroll(periodListRef, period === "PM" ? 1 : 0);
    });
    return () => cancelAnimationFrame(t);
  }, [open, hour, minute, period]);

  const displayText = value && parsed ? formatTime(parsed.hour, parsed.minute, parsed.period) : "";

  function handleApply() {
    const next = formatTime(hour, minute, period);
    onChange?.(next);
    setOpen(false);
  }

  return (
    <>
      {name && (
        <input type="hidden" name={name} value={displayText} readOnly aria-hidden />
      )}
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
        <button
          type="button"
          id={id}
          aria-label={ariaLabel ?? placeholder}
          className={cn(
            "flex h-8 min-w-0 items-center gap-1.5 rounded-md py-0 pl-0 text-left text-sm focus-visible:outline focus-visible:border focus-visible:border-primary focus-visible:ring-0 [touch-action:manipulation] w-full max-w-[6rem]",
            !displayText ? "text-zinc-400" : "text-zinc-900",
            triggerClassName
          )}
        >
          {showIcon && <ClockIcon className="size-4 shrink-0 text-zinc-500" aria-hidden />}
          <span className="truncate">{displayText || placeholder}</span>
        </button>
      </PopoverTrigger>
      <PopoverContent
        className="w-auto p-0"
        align="start"
        sideOffset={6}
        onOpenAutoFocus={(e) => e.preventDefault()}
      >
        <div className={cn("flex", className)}>
          {/* Hour column */}
          <div className="flex flex-col">
            <div className="px-2 py-1.5 text-center text-xs font-medium text-zinc-500">
              Hour
            </div>
            <div
              ref={hourListRef}
              className="flex max-h-[200px] flex-col overflow-y-auto overscroll-contain py-1"
            >
              {HOURS.map((h) => (
                <button
                  key={h}
                  type="button"
                  data-index={h - 1}
                  onClick={() => setHour(h)}
                  className={cn(
                    "min-h-8 w-10 px-2 text-sm transition-colors",
                    hour === h
                      ? "bg-[#fafafa] font-medium text-[#156EF5]"
                      : "text-zinc-700 hover:bg-zinc-100"
                  )}
                >
                  {h}
                </button>
              ))}
            </div>
          </div>
          {/* Minute column */}
          <div className="flex flex-col">
            <div className="px-2 py-1.5 text-center text-xs font-medium text-zinc-500">
              Min
            </div>
            <div
              ref={minuteListRef}
              className="flex max-h-[200px] flex-col overflow-y-auto overscroll-contain py-1"
            >
              {MINUTES.map((m, i) => (
                <button
                  key={m}
                  type="button"
                  data-index={i}
                  onClick={() => setMinute(m)}
                  className={cn(
                    "min-h-8 w-12 px-2 text-sm transition-colors",
                    minute === m
                      ? "bg-[#fafafa] font-medium text-[#156EF5]"
                      : "text-zinc-700 hover:bg-zinc-100"
                  )}
                >
                  {m.toString().padStart(2, "0")}
                </button>
              ))}
            </div>
          </div>
          {/* AM/PM column */}
          <div className="flex flex-col">
            <div className="px-2 py-1.5 text-center text-xs font-medium text-zinc-500">
              Period
            </div>
            <div
              ref={periodListRef}
              className="flex max-h-[200px] flex-col overflow-y-auto overscroll-contain py-1"
            >
              {PERIODS.map((p, i) => (
                <button
                  key={p}
                  type="button"
                  data-index={i}
                  onClick={() => setPeriod(p)}
                  className={cn(
                    "min-h-8 w-12 px-2 text-sm transition-colors",
                    period === p
                      ? "bg-[#fafafa] font-medium text-[#156EF5]"
                      : "text-zinc-700 hover:bg-zinc-100"
                  )}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>
        </div>
        <div className="flex justify-end border-t border-zinc-200 px-3 py-2">
          <button
            type="button"
            onClick={handleApply}
            className="rounded-md bg-[#156EF5] px-3 py-1.5 text-sm font-medium text-white hover:bg-[#125bd4]"
          >
            Done
          </button>
        </div>
      </PopoverContent>
      </Popover>
    </>
  );
}
