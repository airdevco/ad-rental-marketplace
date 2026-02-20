"use client";

import { useRouter } from "next/navigation";
import { useState, useRef, useEffect } from "react";
import type { DateRange } from "react-day-picker";
import { SearchIcon, CalendarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverAnchor,
} from "@/components/ui/popover";
import { DateRangePickerContent } from "@/components/landing/date-range-picker";
import { TimePicker } from "@/components/ui/time-picker";
import { useSearchModal } from "@/lib/search-modal-context";
import { cn } from "@/lib/utils";

function formatDate(d: Date) {
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

function formatTimeSummary(time: string) {
  return time || "Add time";
}

const GEO_OPTIONS = [
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
  "Lake Tahoe, CA",
  "Santa Barbara, CA",
];

export function HeroSearch() {
  const router = useRouter();
  const [whereValue, setWhereValue] = useState("");
  const [whereOpen, setWhereOpen] = useState(false);
  const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined);
  const [datesOpen, setDatesOpen] = useState(false);
  const [datesSectionWidth, setDatesSectionWidth] = useState(0);
  const datesSectionRef = useRef<HTMLDivElement>(null);
  const [fromTime, setFromTime] = useState("");
  const [untilTime, setUntilTime] = useState("");
  const { openSearchModal } = useSearchModal();

  useEffect(() => {
    if (!datesOpen || !datesSectionRef.current) return;
    const el = datesSectionRef.current;
    setDatesSectionWidth(el.getBoundingClientRect().width);
    const ro = new ResizeObserver(() => {
      setDatesSectionWidth(el.getBoundingClientRect().width);
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, [datesOpen]);

  const filteredPlaces = whereValue.trim()
    ? GEO_OPTIONS.filter((p) =>
        p.toLowerCase().includes(whereValue.trim().toLowerCase())
      )
    : GEO_OPTIONS;

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const where = (form.elements.namedItem("where") as HTMLInputElement)?.value?.trim();
    const params = new URLSearchParams();
    if (where) params.set("q", where);
    router.push(`/search?${params.toString()}`);
  }

  const searchSummary =
    whereValue || dateRange?.from || dateRange?.to || fromTime || untilTime
      ? [
          whereValue || "Where?",
          dateRange?.from && dateRange?.to
            ? `${formatDate(dateRange.from)} – ${formatDate(dateRange.to)}`
            : dateRange?.from
              ? formatDate(dateRange.from)
              : "Dates",
          fromTime || untilTime ? `${formatTimeSummary(fromTime)} – ${formatTimeSummary(untilTime)}` : null,
        ]
          .filter(Boolean)
          .join(" · ")
      : "City, neighborhood, or address";

  return (
    <div className="flex w-full max-w-4xl flex-col items-center gap-6 px-4 md:px-0">
      {/* Mobile: row = (Where + input as column) | (search button), same structure as desktop */}
      <div className="flex h-12 w-full flex-row items-stretch gap-0 rounded-[99px] border border-zinc-200 bg-white px-4 py-1.5 shadow-sm md:hidden">
        <div className="flex min-w-0 flex-1 flex-col justify-center gap-0 px-2 py-1">
          <Label htmlFor="hero-search-mobile-trigger" className="text-xs font-medium text-zinc-600">
            Where
          </Label>
          <button
            id="hero-search-mobile-trigger"
            type="button"
            onClick={() =>
              openSearchModal({
                whereValue,
                dateRange,
                fromTime,
                untilTime,
              })
            }
            className="min-h-6 w-full border-0 bg-transparent p-0 text-left text-sm text-zinc-600 focus-visible:outline focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-0"
            aria-label="Open search"
          >
            <span className="block truncate">{searchSummary}</span>
          </button>

        </div>
        <div className="flex shrink-0 items-center py-1.5">
          <Button
            type="button"
            size="icon"
            onClick={() =>
              openSearchModal({
                whereValue,
                dateRange,
                fromTime,
                untilTime,
              })
            }
            className="h-9 w-9 shrink-0 rounded-full bg-[#156EF5] hover:bg-[#125bd4] focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            aria-label="Open search"
          >
            <SearchIcon className="size-5 text-white" aria-hidden />
          </Button>
        </div>
      </div>

      {/* Desktop + smaller viewports: inline form, same height and search button size */}
      <form
        onSubmit={handleSubmit}
        className="hidden w-full min-h-12 flex-col gap-1.5 rounded-[99px] border border-zinc-200 bg-white px-5 py-1.5 shadow-sm md:flex md:min-h-12 md:flex-row md:items-stretch md:gap-0"
        aria-label="Search homes"
      >
        <Popover open={whereOpen} onOpenChange={setWhereOpen}>
          <div className="flex min-h-10 flex-1 flex-col justify-center gap-0.5 text-left sm:min-w-0 sm:rounded-l-[99px] sm:px-3 sm:py-1 md:min-h-12 lg:min-w-[200px] lg:max-w-[320px]">
            <Label htmlFor="hero-where" className="text-xs font-medium text-zinc-600">
              Where
            </Label>
            <PopoverAnchor asChild>
              <Input
                id="hero-where"
                name="where"
                type="text"
                autoComplete="off"
                placeholder="City, neighborhood, or address"
                value={whereValue}
                onChange={(e) => setWhereValue(e.target.value)}
                onFocus={() => setWhereOpen(true)}
                className="h-7 border-0 bg-transparent py-0 pl-0 text-left text-sm text-zinc-900 shadow-none placeholder:text-zinc-400 focus-visible:border-0 focus-visible:ring-0 focus-visible:ring-offset-0 min-h-[40px] sm:min-h-0 [touch-action:manipulation]"
                aria-label="Where to stay"
                aria-expanded={whereOpen}
                aria-autocomplete="list"
                aria-controls="hero-where-listbox"
                role="combobox"
              />
            </PopoverAnchor>
          </div>
          <PopoverContent
            id="hero-where-listbox"
            role="listbox"
            align="start"
            sideOffset={4}
            className="hidden w-[var(--radix-popover-trigger-width)] min-w-[280px] max-w-[360px] p-0 md:block"
            onOpenAutoFocus={(e) => e.preventDefault()}
          >
            <ul className="max-h-[280px] overflow-auto py-1">
              {filteredPlaces.length === 0 ? (
                <li className="px-3 py-2 text-sm text-zinc-500">No results</li>
              ) : (
                filteredPlaces.map((place) => (
                  <li key={place}>
                    <button
                      type="button"
                      role="option"
                      className="w-full px-3 py-2.5 text-left text-sm text-zinc-900 hover:bg-zinc-100 focus:bg-zinc-100 focus:outline-none"
                      onMouseDown={(e) => {
                        e.preventDefault();
                        setWhereValue(place);
                        setWhereOpen(false);
                      }}
                    >
                      {place}
                    </button>
                  </li>
                ))
              )}
            </ul>
          </PopoverContent>
        </Popover>

        {/* From and Until - hidden on smaller desktop, full bar height maintained */}
        <Popover open={datesOpen} onOpenChange={setDatesOpen}>
          <PopoverAnchor asChild>
            <div
              ref={datesSectionRef}
              className="hidden flex-1 flex-col gap-1.5 sm:min-w-0 sm:flex-row sm:gap-0 sm:pr-3 sm:py-1 lg:flex"
              style={{ minWidth: "min(100%, 360px)" }}
            >
              <div className="flex flex-1 flex-col gap-0.5 text-left sm:min-w-0 sm:border-l sm:border-zinc-200 sm:pl-3 sm:pr-4">
                <Label className="text-xs font-medium text-zinc-600">Check in</Label>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    id="hero-from-date"
                    aria-label="Start date"
                    onClick={() => setDatesOpen(true)}
                    className={cn(
                      "flex h-7 min-w-0 flex-1 items-center gap-2 rounded-md py-0 pl-0 text-left text-sm focus-visible:outline focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-0 min-h-[40px] sm:min-h-0 [touch-action:manipulation] w-full hover:text-zinc-600",
                      dateRange?.from ? "text-zinc-900" : "text-zinc-400"
                    )}
                  >
                    <CalendarIcon className="size-4 shrink-0 text-zinc-500" aria-hidden />
                    <span className="truncate">
                      {dateRange?.from ? formatDate(dateRange.from) : "Add dates"}
                    </span>
                  </button>
                  <TimePicker
                    id="hero-from-time"
                    name="fromTime"
                    value={fromTime}
                    onChange={setFromTime}
                    placeholder="Add time"
                    aria-label="Start time"
                    triggerClassName="min-h-[40px] sm:min-h-0 h-7"
                  />
                </div>
              </div>
              <div className="flex flex-1 flex-col gap-0.5 text-left sm:min-w-0 sm:border-l sm:border-zinc-200 sm:pl-3 sm:pr-0">
                <Label className="text-xs font-medium text-zinc-600">Check out</Label>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    id="hero-until-date"
                    aria-label="End date"
                    onClick={() => setDatesOpen(true)}
                    className={cn(
                      "flex h-7 min-w-0 flex-1 items-center gap-2 rounded-md py-0 pl-0 text-left text-sm focus-visible:outline focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-0 min-h-[40px] sm:min-h-0 [touch-action:manipulation] w-full hover:text-zinc-600",
                      dateRange?.to ? "text-zinc-900" : "text-zinc-400"
                    )}
                  >
                    <CalendarIcon className="size-4 shrink-0 text-zinc-500" aria-hidden />
                    <span className="truncate">
                      {dateRange?.to ? formatDate(dateRange.to) : "Add dates"}
                    </span>
                  </button>
                  <TimePicker
                    id="hero-until-time"
                    name="untilTime"
                    value={untilTime}
                    onChange={setUntilTime}
                    placeholder="Add time"
                    aria-label="End time"
                    triggerClassName="min-h-[40px] sm:min-h-0 h-7"
                  />
                </div>
              </div>
            </div>
          </PopoverAnchor>
          <PopoverContent
            className="hidden p-0 lg:block"
            align="start"
            sideOffset={8}
            style={{ width: datesSectionWidth > 0 ? datesSectionWidth : 360 }}
          >
            <DateRangePickerContent
              value={dateRange}
              onChange={setDateRange}
              onClose={() => setDatesOpen(false)}
            />
          </PopoverContent>
        </Popover>

        {/* Search button - full height of bar with padding (h-9 = 36px), same size on all viewports */}
        <div className="flex shrink-0 items-center p-1.5 md:px-2 md:py-1.5">
          <Button
            type="submit"
            size="icon"
            className="h-9 w-9 shrink-0 rounded-full bg-[#156EF5] hover:bg-[#125bd4] focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#156EF5] [touch-action:manipulation]"
            aria-label="Search homes"
          >
            <SearchIcon className="size-5 text-white" aria-hidden />
          </Button>
        </div>
      </form>
    </div>
  );
}
