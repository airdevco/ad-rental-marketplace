"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect, useRef } from "react";
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
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { DateRangePickerContent } from "@/components/landing/date-range-picker";
import { TimePicker } from "@/components/ui/time-picker";
import { useSearchModal } from "@/lib/search-modal-context";

function formatDate(d: Date) {
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
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

export function SearchModal() {
  const router = useRouter();
  const { open, closeSearchModal, initialValues } = useSearchModal();

  const [whereValue, setWhereValue] = useState("");
  const [whereOpen, setWhereOpen] = useState(false);
  const whereInputRef = useRef<HTMLInputElement>(null);
  const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined);
  const [datesOpen, setDatesOpen] = useState(false);
  const [fromTime, setFromTime] = useState("");
  const [untilTime, setUntilTime] = useState("");

  useEffect(() => {
    if (open && initialValues) {
      setWhereValue(initialValues.whereValue ?? "");
      setDateRange(initialValues.dateRange);
      setFromTime(initialValues.fromTime ?? "");
      setUntilTime(initialValues.untilTime ?? "");
    } else if (open) {
      setWhereValue("");
      setDateRange(undefined);
      setFromTime("");
      setUntilTime("");
    }
  }, [open, initialValues]);

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 768px)");
    const handleChange = (e: MediaQueryListEvent) => {
      if (e.matches && open) closeSearchModal();
    };
    mq.addEventListener("change", handleChange);
    if (mq.matches && open) closeSearchModal();
    return () => mq.removeEventListener("change", handleChange);
  }, [open, closeSearchModal]);

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
    closeSearchModal();
    router.push(`/search?${params.toString()}`);
  }

  function isWhereFieldOrDropdown(target: EventTarget | null) {
    const el = target as HTMLElement;
    return el?.closest?.("[data-search-where-root]") ?? el?.closest?.("[data-search-where-dropdown]") ?? false;
  }

  return (
    <Sheet open={open} onOpenChange={(o) => !o && closeSearchModal()}>
      <SheetContent
        side="bottom"
        className="flex max-h-[88vh] flex-col rounded-t-2xl border-t p-0"
        showCloseButton
        onOpenAutoFocus={(e) => e.preventDefault()}
        onInteractOutside={(e) => {
          if (isWhereFieldOrDropdown(e.target)) e.preventDefault();
        }}
      >
        <SheetHeader className="border-b px-4 py-2 text-left">
          <SheetTitle className="text-lg">Search rentals</SheetTitle>
        </SheetHeader>
        <form
          id="search-modal-form"
          onSubmit={handleSubmit}
          className="flex flex-1 flex-col overflow-auto"
          aria-label="Search rentals"
        >
          <div className="flex flex-1 flex-col gap-4 p-4 pt-3">
            <div className="space-y-1.5" data-search-where-root>
              <Label
                htmlFor="search-where"
                className="text-xs font-medium text-zinc-600"
              >
                Where
              </Label>
              <Popover
                open={whereOpen}
                onOpenChange={setWhereOpen}
                modal={false}
              >
                <PopoverAnchor asChild>
                  <Input
                    ref={whereInputRef}
                    id="search-where"
                    name="where"
                    type="text"
                    autoComplete="off"
                    placeholder="City, address, or hotel"
                    value={whereValue}
                    onChange={(e) => setWhereValue(e.target.value)}
                    onFocus={() => setWhereOpen(true)}
                    onBlur={() => {}}
                    className="min-h-10 border border-zinc-200 bg-white text-sm shadow-none focus-visible:border-primary focus-visible:ring-0"
                    aria-label="Where to rent"
                    aria-expanded={whereOpen}
                    autoFocus={false}
                  />
                </PopoverAnchor>
                <PopoverContent
                  data-search-where-dropdown
                  role="listbox"
                  align="start"
                  sideOffset={8}
                  className="z-[100] w-[var(--radix-popover-trigger-width)] min-w-[280px] max-w-[360px] p-0"
                  onOpenAutoFocus={(e) => e.preventDefault()}
                  onInteractOutside={(e) => {
                    if (whereInputRef.current?.contains(e.target as Node)) e.preventDefault();
                  }}
                >
                  <ul className="max-h-[280px] overflow-auto py-1">
                    {filteredPlaces.length === 0 ? (
                      <li className="px-3 py-2 text-sm text-zinc-500">
                        No results
                      </li>
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
                  <Label className="text-xs font-medium text-zinc-600">
                    From
                  </Label>
                  <PopoverAnchor asChild>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setDatesOpen(true)}
                        className="flex min-h-10 min-w-0 flex-1 items-center gap-2 rounded-lg border border-zinc-200 bg-white px-3 text-left text-sm text-zinc-700 focus-visible:border-primary focus-visible:outline-none focus-visible:ring-0"
                      >
                        <CalendarIcon className="size-4 shrink-0 text-zinc-500" />
                        <span className="truncate">
                          {dateRange?.from
                            ? formatDate(dateRange.from)
                            : "Add dates"}
                        </span>
                      </button>
                      <TimePicker
                        id="search-from-time"
                        name="fromTime"
                        value={fromTime}
                        onChange={setFromTime}
                        placeholder="Time"
                        triggerClassName="min-h-10 w-full min-w-0 rounded-lg border border-zinc-200 px-3 text-sm justify-start shadow-none focus-visible:border-primary focus-visible:ring-0"
                      />
                    </div>
                  </PopoverAnchor>
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs font-medium text-zinc-600">
                    To
                  </Label>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setDatesOpen(true)}
                      className="flex min-h-10 min-w-0 flex-1 items-center gap-2 rounded-lg border border-zinc-200 bg-white px-3 text-left text-sm text-zinc-700 focus-visible:border-primary focus-visible:outline-none focus-visible:ring-0"
                    >
                      <CalendarIcon className="size-4 shrink-0 text-zinc-500" />
                      <span className="truncate">
                        {dateRange?.to
                          ? formatDate(dateRange.to)
                          : "Add dates"}
                      </span>
                    </button>
                    <TimePicker
                      id="search-until-time"
                      name="untilTime"
                      value={untilTime}
                      onChange={setUntilTime}
                      placeholder="Time"
                      triggerClassName="min-h-10 w-full min-w-0 rounded-lg border border-zinc-200 px-3 text-sm justify-start shadow-none focus-visible:border-primary focus-visible:ring-0"
                    />
                  </div>
                </div>
              </div>
              <PopoverContent
                className="z-[100] min-w-[min(360px,100vw-2rem)] max-w-full p-0 sm:min-w-[400px]"
                align="start"
                sideOffset={8}
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
              className="min-h-11 w-full rounded-xl bg-[#156EF5] text-sm font-medium hover:bg-[#125bd4]"
            >
              <SearchIcon className="size-5 text-white" aria-hidden />
              Search
            </Button>
          </div>
        </form>
      </SheetContent>
    </Sheet>
  );
}
