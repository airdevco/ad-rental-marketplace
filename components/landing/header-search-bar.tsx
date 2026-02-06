"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import type { DateRange } from "react-day-picker";
import { SearchIcon, MapPin, Calendar } from "lucide-react";
import { useSearchModal } from "@/lib/search-modal-context";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverAnchor,
} from "@/components/ui/popover";
import { DateRangePickerContent } from "@/components/landing/date-range-picker";
import { TimePicker } from "@/components/ui/time-picker";
import { cn } from "@/lib/utils";

const GEO_OPTIONS = [
  "California",
  "San Francisco, CA",
  "Oakland, CA",
  "Berkeley, CA",
  "San Jose, CA",
  "Los Angeles, CA",
  "New York, NY",
  "Chicago, IL",
  "Seattle, WA",
  "Austin, TX",
  "Miami, FL",
  "Boston, MA",
  "Denver, CO",
];

function formatDateOnly(date: Date | undefined): string {
  if (!date) return "";
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

export function HeaderSearchBar({
  fullWidthOnMobile = false,
}: { fullWidthOnMobile?: boolean } = {}) {
  const router = useRouter();
  const { openSearchModal } = useSearchModal();
  const [whereValue, setWhereValue] = useState("");
  const [whereOpen, setWhereOpen] = useState(false);
  const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined);
  const [datesOpen, setDatesOpen] = useState(false);
  const [fromTime, setFromTime] = useState("");
  const [untilTime, setUntilTime] = useState("");

  const filteredPlaces = whereValue.trim()
    ? GEO_OPTIONS.filter((p) =>
        p.toLowerCase().includes(whereValue.trim().toLowerCase())
      )
    : GEO_OPTIONS;

  const startDateLabel = dateRange?.from ? formatDateOnly(dateRange.from) : "";
  const endDateLabel = dateRange?.to ? formatDateOnly(dateRange.to) : "";

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const params = new URLSearchParams();
    if (whereValue) params.set("q", whereValue);
    router.push(`/search?${params.toString()}`);
  }

  return (
    <>
      {/* Desktop: 3-section pill with dividers */}
      <form
        onSubmit={handleSubmit}
        className="hidden h-10 w-full items-center overflow-hidden rounded-[99px] border border-zinc-200 bg-white shadow-sm md:flex"
        aria-label="Search rentals"
      >
        {/* Location - clickable to open popover */}
        <Popover open={whereOpen} onOpenChange={setWhereOpen} modal={false}>
          <PopoverAnchor asChild>
            <button
              type="button"
              onClick={() => setWhereOpen(true)}
              className="flex min-w-0 flex-1 items-center gap-2 px-4 py-2 text-left text-sm hover:bg-zinc-50 focus:outline-none focus:ring-0"
            >
              <MapPin className="size-4 shrink-0 text-zinc-500" aria-hidden />
              <span className={cn("truncate", !whereValue && "text-zinc-400")}>
                {whereValue || "Where"}
              </span>
            </button>
          </PopoverAnchor>
          <PopoverContent
            align="start"
            sideOffset={4}
            className="w-64 p-0"
            onOpenAutoFocus={(e) => e.preventDefault()}
          >
            <div className="border-b p-2">
              <input
                type="text"
                placeholder="Search..."
                value={whereValue}
                onChange={(e) => setWhereValue(e.target.value)}
                className="w-full rounded-md border border-zinc-200 px-2 py-1.5 text-sm outline-none focus-visible:border focus-visible:border-primary focus-visible:ring-0"
              />
            </div>
            <ul className="max-h-[200px] overflow-auto py-1">
              {filteredPlaces.map((place) => (
                <button
                  key={place}
                  type="button"
                  className="w-full px-3 py-2 text-left text-sm text-zinc-900 hover:bg-zinc-100 focus:bg-zinc-100 focus:outline-none"
                  onMouseDown={(e) => {
                    e.preventDefault();
                    setWhereValue(place);
                    setWhereOpen(false);
                  }}
                >
                  {place}
                </button>
              ))}
            </ul>
          </PopoverContent>
        </Popover>

        <div className="h-5 w-px shrink-0 bg-zinc-200" aria-hidden />

        {/* Start date + time (inline, time next to date) */}
        <Popover open={datesOpen} onOpenChange={setDatesOpen} modal={false}>
          <PopoverAnchor asChild>
            <div className="flex min-w-0 flex-1 items-center gap-2 px-4 py-2 hover:bg-zinc-50">
              <button
                type="button"
                onClick={() => setDatesOpen(true)}
                className="flex min-w-0 flex-1 items-center gap-2 text-left text-sm focus:outline-none focus:ring-0"
              >
                <Calendar className="size-4 shrink-0 text-zinc-500" aria-hidden />
                <span
                  className={cn(
                    "truncate",
                    !startDateLabel && !fromTime && "text-zinc-400"
                  )}
                >
                  {startDateLabel || "Start date"}
                </span>
              </button>
              <div
                className="shrink-0"
                onClick={(e) => e.stopPropagation()}
                onMouseDown={(e) => e.stopPropagation()}
              >
                <TimePicker
                  value={fromTime}
                  onChange={setFromTime}
                  placeholder="Time"
                  triggerClassName="h-7 min-w-0 rounded border-0 bg-transparent px-1 text-sm shadow-none focus:ring-0 hover:bg-transparent"
                />
              </div>
            </div>
          </PopoverAnchor>
          <PopoverContent
            align="start"
            sideOffset={4}
            className="w-auto p-0"
            onOpenAutoFocus={(e) => e.preventDefault()}
          >
            <DateRangePickerContent
              value={dateRange}
              onChange={setDateRange}
              onClose={() => setDatesOpen(false)}
            />
          </PopoverContent>
        </Popover>

        <div className="h-5 w-px shrink-0 bg-zinc-200" aria-hidden />

        {/* End date + time (same popover) */}
        <div className="flex min-w-0 flex-1 items-center gap-2 px-4 py-2 hover:bg-zinc-50">
          <button
            type="button"
            onClick={() => setDatesOpen(true)}
            className="flex min-w-0 flex-1 items-center gap-2 text-left text-sm focus:outline-none focus:ring-0"
          >
            <Calendar className="size-4 shrink-0 text-zinc-500" aria-hidden />
            <span
              className={cn(
                "truncate",
                !endDateLabel && !untilTime && "text-zinc-400"
              )}
            >
              {endDateLabel || "End date"}
            </span>
          </button>
          <div
            className="shrink-0"
            onClick={(e) => e.stopPropagation()}
            onMouseDown={(e) => e.stopPropagation()}
          >
            <TimePicker
              value={untilTime}
              onChange={setUntilTime}
              placeholder="Time"
              triggerClassName="h-7 min-w-0 rounded border-0 bg-transparent px-1 text-sm shadow-none focus:ring-0 hover:bg-transparent"
            />
          </div>
        </div>

        {/* Search button - primary color, no divider */}
        <div className="flex shrink-0 items-center p-1.5 pl-2 pr-2">
          <Button
            type="submit"
            size="icon"
            className="h-8 w-8 shrink-0 rounded-full bg-[#156EF5] hover:bg-[#125bd4]"
            aria-label="Search rentals"
          >
            <SearchIcon className="size-4 text-white" aria-hidden />
          </Button>
        </div>
      </form>

      {/* Mobile: tappable bar that opens search modal */}
      <button
        type="button"
        onClick={() => openSearchModal()}
        className={cn(
          "flex h-10 w-full items-center gap-2 overflow-hidden rounded-[99px] border border-zinc-200 bg-white px-4 shadow-sm md:hidden",
          fullWidthOnMobile && "min-w-0"
        )}
        aria-label="Open search"
      >
        <MapPin className="size-4 shrink-0 text-zinc-500" aria-hidden />
        <span className="truncate text-left text-sm text-zinc-500">
          {whereValue || "Where"} · {startDateLabel || "Start date"} ·{" "}
          {endDateLabel || "End date"}
        </span>
        <div className="ml-auto flex size-8 shrink-0 items-center justify-center rounded-full bg-[#156EF5]">
          <SearchIcon className="size-4 text-white" aria-hidden />
        </div>
      </button>
    </>
  );
}
