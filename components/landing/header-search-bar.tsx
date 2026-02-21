"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import type { DateRange } from "react-day-picker";
import { SearchIcon, MapPin } from "lucide-react";
import { useSearchModal } from "@/lib/search-modal-context";
import { Button } from "@/components/ui/button";
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
  "Lake Tahoe, CA",
  "Santa Barbara, CA",
];

function formatDateShort(d: Date) {
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}
function formatDateRange(range: DateRange | undefined) {
  if (!range?.from) return "";
  if (!range.to) return formatDateShort(range.from);
  return `${formatDateShort(range.from)} – ${formatDateShort(range.to)}`;
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
  const [guests, setGuests] = useState<Guests>(DEFAULT_GUESTS);
  const [guestsOpen, setGuestsOpen] = useState(false);

  const filteredPlaces = whereValue.trim()
    ? GEO_OPTIONS.filter((p) =>
        p.toLowerCase().includes(whereValue.trim().toLowerCase())
      )
    : GEO_OPTIONS;

  const dateSummary = formatDateRange(dateRange);
  const guestText = guestSummary(guests);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const params = new URLSearchParams();
    if (whereValue) params.set("q", whereValue);
    router.push(`/search?${params.toString()}`);
  }

  const sectionCls =
    "flex min-w-0 flex-1 flex-col justify-center gap-0.5 px-4 py-2 hover:bg-black/5 transition-colors cursor-pointer";
  const labelCls = "text-xs font-semibold text-zinc-900 leading-none";
  const valueCls = "text-sm truncate leading-none mt-0.5";

  return (
    <>
      {/* Desktop: 3-section pill */}
      <form
        onSubmit={handleSubmit}
        className="hidden h-12 w-full items-center overflow-hidden rounded-[99px] border border-zinc-200 bg-white md:flex"
        aria-label="Search homes"
      >
        {/* Where */}
        <Popover open={whereOpen} onOpenChange={setWhereOpen} modal={false}>
          <PopoverAnchor asChild>
            <div
              className={cn(sectionCls, "pl-5")}
              onClick={() => setWhereOpen(true)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => e.key === "Enter" && setWhereOpen(true)}
            >
              <span className={labelCls}>Where</span>
              <span className={cn(valueCls, whereValue ? "text-zinc-900" : "text-zinc-400")}>
                {whereValue || "Search destinations"}
              </span>
            </div>
          </PopoverAnchor>
          <PopoverContent
            align="start"
            sideOffset={8}
            className="w-72 p-0"
            onOpenAutoFocus={(e) => e.preventDefault()}
          >
            <div className="border-b border-zinc-100 p-2">
              <input
                type="text"
                placeholder="Search destinations..."
                value={whereValue}
                onChange={(e) => setWhereValue(e.target.value)}
                className="w-full rounded-[5px] border border-zinc-200 bg-white px-3 py-1.5 text-sm text-zinc-900 outline-none placeholder:text-zinc-400 focus:border-zinc-400"
                autoFocus
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

        <div className="flex shrink-0 self-stretch" aria-hidden>
          <div className="h-full w-px bg-zinc-300/60" />
        </div>

        {/* When */}
        <Popover open={datesOpen} onOpenChange={setDatesOpen} modal={false}>
          <PopoverAnchor asChild>
            <div
              className={sectionCls}
              onClick={() => setDatesOpen(true)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => e.key === "Enter" && setDatesOpen(true)}
            >
              <span className={labelCls}>When</span>
              <span className={cn(valueCls, dateSummary ? "text-zinc-900" : "text-zinc-400")}>
                {dateSummary || "Add dates"}
              </span>
            </div>
          </PopoverAnchor>
          <PopoverContent
            align="start"
            sideOffset={8}
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

        <div className="flex shrink-0 self-stretch" aria-hidden>
          <div className="h-full w-px bg-zinc-300/60" />
        </div>

        {/* Who */}
        <Popover open={guestsOpen} onOpenChange={setGuestsOpen} modal={false}>
          <PopoverAnchor asChild>
            <div
              className={sectionCls}
              onClick={() => setGuestsOpen(true)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => e.key === "Enter" && setGuestsOpen(true)}
            >
              <span className={labelCls}>Who</span>
              <span className={cn(valueCls, guestText ? "text-zinc-900" : "text-zinc-400")}>
                {guestText || "Add guests"}
              </span>
            </div>
          </PopoverAnchor>
          <PopoverContent
            align="end"
            sideOffset={8}
            className="w-80 p-0"
            onOpenAutoFocus={(e) => e.preventDefault()}
          >
            <GuestPicker value={guests} onChange={setGuests} />
          </PopoverContent>
        </Popover>

        {/* Search button */}
        <div className="flex shrink-0 items-center p-1.5 pl-2 pr-2">
          <Button
            type="submit"
            size="icon"
            className="h-9 w-9 shrink-0 rounded-full bg-[#156EF5] hover:bg-[#125bd4]"
            aria-label="Search homes"
          >
            <SearchIcon className="size-4 text-white" aria-hidden />
          </Button>
        </div>
      </form>

      {/* Mobile: tappable bar that opens search modal */}
      <button
        type="button"
        onClick={() => openSearchModal({ whereValue, dateRange, guests })}
        className={cn(
          "flex h-10 w-full items-center gap-2 overflow-hidden rounded-[99px] border border-zinc-200 bg-white px-4 md:hidden",
          fullWidthOnMobile && "min-w-0"
        )}
        aria-label="Open search"
      >
        <MapPin className="size-4 shrink-0 text-zinc-500" aria-hidden />
        <span className="truncate text-left text-sm text-zinc-500">
          {whereValue || "Where"} · {dateSummary || "Add dates"} · {guestText || "Add guests"}
        </span>
        <div className="ml-auto flex size-8 shrink-0 items-center justify-center rounded-full bg-[#156EF5]">
          <SearchIcon className="size-4 text-white" aria-hidden />
        </div>
      </button>
    </>
  );
}
