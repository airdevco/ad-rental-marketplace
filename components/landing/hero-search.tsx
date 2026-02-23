"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import type { DateRange } from "react-day-picker";
import { SearchIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverAnchor,
} from "@/components/ui/popover";
import { DateRangePickerContent } from "@/components/landing/date-range-picker";
import {
  GuestPicker,
  DEFAULT_GUESTS,
  guestSummary,
} from "@/components/landing/guest-picker";
import type { Guests } from "@/components/landing/guest-picker";
import { useSearchModal } from "@/lib/search-modal-context";
import { cn } from "@/lib/utils";

function formatDateShort(d: Date) {
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}
function formatDateRange(range: DateRange | undefined) {
  if (!range?.from) return "";
  if (!range.to) return formatDateShort(range.from);
  return `${formatDateShort(range.from)} – ${formatDateShort(range.to)}`;
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
  const [guests, setGuests] = useState<Guests>(DEFAULT_GUESTS);
  const [guestsOpen, setGuestsOpen] = useState(false);
  const { openSearchModal } = useSearchModal();

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

  const dateSummary = formatDateRange(dateRange);
  const guestText = guestSummary(guests);

  const mobileSummary = [whereValue || "Where?", dateSummary || "Add dates", guestText || null]
    .filter(Boolean)
    .join(" · ");

  const fieldLabel = "text-xs font-semibold text-zinc-900";
  const fieldValue =
    "w-full text-left text-sm truncate focus-visible:outline-none";

  return (
    <div className="flex w-full max-w-4xl flex-col items-center gap-6 px-4 md:px-0">
      {/* Mobile bar */}
      <div className="flex h-12 w-full flex-row items-stretch gap-0 rounded-[99px] border border-zinc-200 bg-white px-4 py-1.5 md:hidden">
        <div className="flex min-w-0 flex-1 flex-col justify-center gap-0 px-2 py-1">
          <Label
            htmlFor="hero-search-mobile-trigger"
            className="text-xs font-semibold text-zinc-900"
          >
            Where
          </Label>
          <button
            id="hero-search-mobile-trigger"
            type="button"
            onClick={() => openSearchModal({ whereValue, dateRange, guests })}
            className="min-h-6 w-full border-0 bg-transparent p-0 text-left text-sm text-zinc-400 focus-visible:outline focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-0"
            aria-label="Open search"
          >
            <span className="block truncate">{mobileSummary}</span>
          </button>
        </div>
        <div className="flex shrink-0 items-center py-1.5">
          <Button
            type="button"
            size="icon"
            onClick={() => openSearchModal({ whereValue, dateRange, guests })}
            className="h-9 w-9 shrink-0 rounded-full bg-[#156EF5] hover:bg-[#125bd4]"
            aria-label="Open search"
          >
            <SearchIcon className="size-5 text-white" aria-hidden />
          </Button>
        </div>
      </div>

      {/* Desktop form */}
      <form
        onSubmit={handleSubmit}
        className="hidden w-full min-h-14 flex-col gap-1.5 rounded-[99px] border border-zinc-200 bg-white px-2 py-2 md:flex md:min-h-14 md:flex-row md:items-stretch md:gap-0"
        aria-label="Search homes"
      >
        {/* Where */}
        <Popover open={whereOpen} onOpenChange={setWhereOpen}>
          <div className="flex min-h-10 flex-1 flex-col justify-center gap-0.5 text-left sm:min-w-0 sm:rounded-l-[99px] sm:px-5 sm:py-2.5 md:min-h-full lg:min-w-[200px] lg:max-w-[280px]">
            <Label htmlFor="hero-where" className={fieldLabel}>
              Where
            </Label>
            <PopoverAnchor asChild>
              <Input
                id="hero-where"
                name="where"
                type="text"
                autoComplete="off"
                placeholder="Search destinations"
                value={whereValue}
                onChange={(e) => setWhereValue(e.target.value)}
                onFocus={() => setWhereOpen(true)}
                className="h-auto border-0 bg-transparent py-0 pl-0 text-left text-sm text-zinc-900 shadow-none placeholder:text-zinc-400 focus-visible:border-0 focus-visible:ring-0 focus-visible:ring-offset-0"
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
            sideOffset={8}
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

        {/* Divider - same height as When/Who content only (hero desktop) */}
        <div className="flex shrink-0 items-center py-2.5" aria-hidden>
          <div className="h-9 w-px bg-zinc-300/50" />
        </div>

        {/* When - min-width so date range doesn't overflow */}
        <Popover open={datesOpen} onOpenChange={setDatesOpen}>
          <PopoverAnchor asChild>
            <div className="flex min-h-10 flex-1 flex-col justify-center gap-0.5 text-left sm:min-w-[200px] sm:px-5 sm:py-2.5 md:min-h-full">
              <span className={fieldLabel}>When</span>
              <button
                type="button"
                onClick={() => setDatesOpen(true)}
                className={cn(fieldValue, "min-w-0 overflow-hidden", dateSummary ? "text-zinc-900" : "text-zinc-400")}
                aria-label="Select dates"
              >
                <span className="block truncate">{dateSummary || "Add dates"}</span>
              </button>
            </div>
          </PopoverAnchor>
          <PopoverContent
            className="hidden w-auto p-0 lg:block"
            align="start"
            sideOffset={8}
            onOpenAutoFocus={(e) => e.preventDefault()}
          >
            <DateRangePickerContent
              value={dateRange}
              onChange={setDateRange}
              onClose={() => setDatesOpen(false)}
            />
          </PopoverContent>
        </Popover>

        {/* Divider - same height as When/Who content only (hero desktop) */}
        <div className="flex shrink-0 items-center py-2.5" aria-hidden>
          <div className="h-9 w-px bg-zinc-300/50" />
        </div>

        {/* Who */}
        <Popover open={guestsOpen} onOpenChange={setGuestsOpen}>
          <PopoverAnchor asChild>
            <div className="flex min-h-10 flex-1 flex-col justify-center gap-0.5 text-left sm:min-w-0 sm:px-5 sm:py-2.5 md:min-h-full">
              <span className={fieldLabel}>Who</span>
              <button
                type="button"
                onClick={() => setGuestsOpen(true)}
                className={cn(fieldValue, guestText ? "text-zinc-900" : "text-zinc-400")}
                aria-label="Add guests"
              >
                {guestText || "Add guests"}
              </button>
            </div>
          </PopoverAnchor>
          <PopoverContent align="end" className="w-80 p-0" sideOffset={8}>
            <GuestPicker value={guests} onChange={setGuests} />
          </PopoverContent>
        </Popover>

        {/* Search button */}
        <div className="flex shrink-0 items-center p-1.5">
          <Button
            type="submit"
            size="icon"
            className="h-10 w-10 shrink-0 rounded-full bg-[#156EF5] hover:bg-[#125bd4] focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#156EF5]"
            aria-label="Search homes"
          >
            <SearchIcon className="size-5 text-white" aria-hidden />
          </Button>
        </div>
      </form>
    </div>
  );
}
