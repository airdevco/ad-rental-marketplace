"use client";

import { useRouter } from "next/navigation";
import { useState, useRef, useEffect } from "react";
import type { DateRange } from "react-day-picker";
import { SearchIcon, CalendarIcon, ChevronRightIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverAnchor,
} from "@/components/ui/popover";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { DateRangePickerContent } from "@/components/landing/date-range-picker";
import { TimePicker } from "@/components/ui/time-picker";
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
  const [mobileSheetOpen, setMobileSheetOpen] = useState(false);

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

  // Close mobile modal when viewport is md or larger (desktop view visible)
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 768px)");
    const handleChange = (e: MediaQueryListEvent) => {
      if (e.matches && mobileSheetOpen) setMobileSheetOpen(false);
    };
    mq.addEventListener("change", handleChange);
    if (mq.matches && mobileSheetOpen) setMobileSheetOpen(false);
    return () => mq.removeEventListener("change", handleChange);
  }, [mobileSheetOpen]);

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
    setMobileSheetOpen(false);
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
      : "City, address, or hotel";

  return (
    <div className="flex w-full max-w-4xl flex-col items-center gap-6 px-4 md:px-0">
      {/* Mobile: same look as desktop (white bar, Where + search) but no From/Until; same height, no divider */}
      <div className="h-[72px] w-full rounded-[99px] border border-zinc-200 bg-white px-5 py-1.5 shadow-sm md:hidden">
        <div className="flex flex-col justify-center gap-0">
          <Label htmlFor="hero-search-mobile-trigger" className="text-xs font-medium text-zinc-600">
            Where
          </Label>
          <div className="flex items-stretch">
            <div className="flex min-w-0 flex-1 flex-col justify-center">
              <button
                id="hero-search-mobile-trigger"
                type="button"
                onClick={() => setMobileSheetOpen(true)}
                className="min-h-7 w-full border-0 bg-transparent py-0 pl-0 text-left text-sm text-zinc-600 focus-visible:outline focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-0"
                aria-label="Open search"
              >
                <span className="block truncate">
                  {searchSummary}
                </span>
              </button>
            </div>
            <div className="flex shrink-0 items-center py-1.5">
              <Button
                type="button"
                size="icon"
                onClick={() => setMobileSheetOpen(true)}
                className="h-9 w-9 shrink-0 rounded-full bg-[#156EF5] hover:bg-[#125bd4] focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                aria-label="Open search"
              >
                <SearchIcon className="size-5 text-white" aria-hidden />
              </Button>
            </div>
          </div>
        </div>
      </div>

      <Sheet open={mobileSheetOpen} onOpenChange={setMobileSheetOpen}>
        <SheetContent
          side="bottom"
          className="rounded-t-2xl border-t p-0 max-h-[88vh] flex flex-col"
          showCloseButton={true}
          onOpenAutoFocus={(e) => e.preventDefault()}
        >
          <SheetHeader className="border-b px-4 py-2 text-left">
            <SheetTitle className="text-lg">Search rentals</SheetTitle>
          </SheetHeader>
          <form
            id="hero-search-mobile-form"
            onSubmit={handleSubmit}
            className="flex flex-1 flex-col overflow-auto"
            aria-label="Search rentals"
          >
            <div className="flex flex-1 flex-col gap-4 p-4 pt-3">
              <div className="space-y-1.5">
                <Label htmlFor="hero-where-mobile" className="text-xs font-medium text-zinc-600">
                  Where
                </Label>
                <Popover open={whereOpen} onOpenChange={setWhereOpen} modal={false}>
                  <PopoverAnchor asChild>
                    <Input
                      id="hero-where-mobile"
                      name="where"
                      type="text"
                      autoComplete="off"
                      placeholder="City, address, or hotel"
                      value={whereValue}
                      onChange={(e) => setWhereValue(e.target.value)}
                      onFocus={() => setWhereOpen(true)}
                      onBlur={() => {}}
                      className="min-h-10 border border-zinc-200 bg-white text-sm shadow-none focus-visible:border-[#156EF5] focus-visible:ring-0"
                      aria-label="Where to rent"
                      aria-expanded={whereOpen}
                      autoFocus={false}
                    />
                  </PopoverAnchor>
                  <PopoverContent
                    id="hero-where-listbox-mobile"
                    role="listbox"
                    align="start"
                    sideOffset={8}
                    className="z-[100] w-[var(--radix-popover-trigger-width)] min-w-[280px] max-w-[360px] p-0 md:hidden"
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
              </div>

              <Popover open={datesOpen} onOpenChange={setDatesOpen} modal={false}>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label className="text-xs font-medium text-zinc-600">From</Label>
                    <PopoverAnchor asChild>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => setDatesOpen(true)}
                          className="flex min-h-10 min-w-0 flex-1 items-center gap-2 rounded-lg border border-zinc-200 bg-white px-3 text-left text-sm text-zinc-700 focus-visible:border-[#156EF5] focus-visible:outline-none focus-visible:ring-0"
                        >
                          <CalendarIcon className="size-4 shrink-0 text-zinc-500" />
                          <span className="truncate">
                            {dateRange?.from ? formatDate(dateRange.from) : "Add dates"}
                          </span>
                        </button>
                        <TimePicker
                          id="hero-from-time-mobile"
                          name="fromTime"
                          value={fromTime}
                          onChange={setFromTime}
                          placeholder="Time"
                          triggerClassName="min-h-10 w-full min-w-0 border border-zinc-200 rounded-lg px-3 text-sm justify-start shadow-none focus-visible:border-[#156EF5] focus-visible:ring-0"
                        />
                      </div>
                    </PopoverAnchor>
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs font-medium text-zinc-600">To</Label>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setDatesOpen(true)}
                        className="flex min-h-10 min-w-0 flex-1 items-center gap-2 rounded-lg border border-zinc-200 bg-white px-3 text-left text-sm text-zinc-700 focus-visible:border-[#156EF5] focus-visible:outline-none focus-visible:ring-0"
                      >
                        <CalendarIcon className="size-4 shrink-0 text-zinc-500" />
                        <span className="truncate">
                          {dateRange?.to ? formatDate(dateRange.to) : "Add dates"}
                        </span>
                      </button>
                      <TimePicker
                        id="hero-until-time-mobile"
                        name="untilTime"
                        value={untilTime}
                        onChange={setUntilTime}
                        placeholder="Time"
                        triggerClassName="min-h-10 w-full min-w-0 border border-zinc-200 rounded-lg px-3 text-sm justify-start shadow-none focus-visible:border-[#156EF5] focus-visible:ring-0"
                      />
                    </div>
                  </div>
                </div>
                <PopoverContent
                  className="z-[100] max-w-full p-0 md:hidden"
                  align="start"
                  sideOffset={8}
                  style={{ width: "var(--radix-popover-trigger-width)" }}
                  onOpenAutoFocus={(e) => e.preventDefault()}
                  onCloseAutoFocus={(e) => e.preventDefault()}
                >
                  <DateRangePickerContent
                    value={dateRange}
                    onChange={(range) => setDateRange(range)}
                    onClose={() => setDatesOpen(false)}
                    fullWidth
                    compact
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="border-t p-4">
              <Button
                type="submit"
                className="w-full min-h-11 rounded-xl bg-[#156EF5] text-sm font-medium hover:bg-[#125bd4]"
              >
                <SearchIcon className="size-5 text-white" aria-hidden />
                Search
              </Button>
            </div>
          </form>
        </SheetContent>
      </Sheet>

      {/* Desktop + smaller viewports: inline form, same height and search button size */}
      <form
        onSubmit={handleSubmit}
        className="hidden w-full min-h-12 flex-col gap-1.5 rounded-[99px] border border-zinc-200 bg-white px-5 py-1.5 shadow-sm md:flex md:min-h-12 md:flex-row md:items-stretch md:gap-0"
        aria-label="Search rentals"
      >
        {/* Where - geographic autocomplete */}
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
                placeholder="City, address, or hotel"
                value={whereValue}
                onChange={(e) => setWhereValue(e.target.value)}
                onFocus={() => setWhereOpen(true)}
                className="h-7 border-0 bg-transparent py-0 pl-0 text-left text-sm text-zinc-900 shadow-none placeholder:text-zinc-400 focus-visible:ring-0 focus-visible:ring-offset-0 min-h-[40px] sm:min-h-0 [touch-action:manipulation]"
                aria-label="Where to rent"
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
              {/* From - divider on left is only this block's height */}
              <div className="flex flex-1 flex-col gap-0.5 text-left sm:min-w-0 sm:border-l sm:border-zinc-200 sm:pl-3 sm:pr-4">
                <Label className="text-xs font-medium text-zinc-600">From</Label>
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
              {/* Until - divider on left is only this block's height */}
              <div className="flex flex-1 flex-col gap-0.5 text-left sm:min-w-0 sm:border-l sm:border-zinc-200 sm:pl-3 sm:pr-0">
                <Label className="text-xs font-medium text-zinc-600">To</Label>
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
            aria-label="Search rentals"
          >
            <SearchIcon className="size-5 text-white" aria-hidden />
          </Button>
        </div>
      </form>
    </div>
  );
}
