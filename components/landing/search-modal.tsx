"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect, useRef } from "react";
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
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
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

const inputCls =
  "min-h-11 rounded-[5px] border border-zinc-200 bg-white text-sm shadow-none placeholder:text-zinc-400 focus-visible:border-zinc-400 focus-visible:ring-0";

const fieldButtonCls =
  "flex min-h-11 w-full items-center justify-between rounded-[5px] border border-zinc-200 bg-white px-3 text-left text-sm focus-visible:outline-none focus-visible:border-zinc-400";

export function SearchModal() {
  const router = useRouter();
  const { open, closeSearchModal, initialValues } = useSearchModal();

  const [whereValue, setWhereValue] = useState("");
  const [whereOpen, setWhereOpen] = useState(false);
  const whereInputRef = useRef<HTMLInputElement>(null);
  const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined);
  const [datesOpen, setDatesOpen] = useState(false);
  const [guests, setGuests] = useState<Guests>(DEFAULT_GUESTS);
  const [guestsOpen, setGuestsOpen] = useState(false);

  useEffect(() => {
    if (open && initialValues) {
      setWhereValue(initialValues.whereValue ?? "");
      setDateRange(initialValues.dateRange);
      setGuests(initialValues.guests ?? DEFAULT_GUESTS);
    } else if (open) {
      setWhereValue("");
      setDateRange(undefined);
      setGuests(DEFAULT_GUESTS);
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
    return (
      el?.closest?.("[data-search-where-root]") ??
      el?.closest?.("[data-search-where-dropdown]") ??
      false
    );
  }

  const dateSummary = formatDateRange(dateRange);
  const guestText = guestSummary(guests);

  return (
    <Sheet open={open} onOpenChange={(o) => !o && closeSearchModal()}>
      <SheetContent
        side="bottom"
        className="flex max-h-[92vh] flex-col rounded-t-2xl border-t border-zinc-100 p-0"
        showCloseButton
        onOpenAutoFocus={(e) => e.preventDefault()}
        onInteractOutside={(e) => {
          if (isWhereFieldOrDropdown(e.target)) e.preventDefault();
        }}
      >
        <SheetHeader className="border-b border-zinc-100 px-4 py-3 text-left">
          <SheetTitle className="text-base font-semibold">Search homes</SheetTitle>
        </SheetHeader>

        <form
          id="search-modal-form"
          onSubmit={handleSubmit}
          className="flex flex-1 flex-col overflow-auto"
          aria-label="Search homes"
        >
          <div className="flex flex-1 flex-col gap-4 p-4 pt-4">
            {/* Where */}
            <div className="space-y-1.5" data-search-where-root>
              <Label htmlFor="search-where" className="text-xs font-semibold text-zinc-900">
                Where
              </Label>
              <Popover open={whereOpen} onOpenChange={setWhereOpen} modal={false}>
                <PopoverAnchor asChild>
                  <Input
                    ref={whereInputRef}
                    id="search-where"
                    name="where"
                    type="text"
                    autoComplete="off"
                    placeholder="Search destinations"
                    value={whereValue}
                    onChange={(e) => setWhereValue(e.target.value)}
                    onFocus={() => setWhereOpen(true)}
                    className={inputCls}
                    aria-label="Where to stay"
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
                    if (whereInputRef.current?.contains(e.target as Node))
                      e.preventDefault();
                  }}
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

            {/* When */}
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-zinc-900">When</Label>
              <Popover open={datesOpen} onOpenChange={setDatesOpen} modal={false}>
                <PopoverAnchor asChild>
                  <button
                    type="button"
                    onClick={() => setDatesOpen(true)}
                    className={cn(fieldButtonCls, dateSummary ? "text-zinc-900" : "text-zinc-400")}
                    aria-label="Select dates"
                  >
                    {dateSummary || "Add dates"}
                  </button>
                </PopoverAnchor>
                <PopoverContent
                  className="z-[100] min-w-[min(360px,100vw-2rem)] max-w-full p-0 sm:min-w-[400px]"
                  align="start"
                  sideOffset={8}
                  onOpenAutoFocus={(e) => e.preventDefault()}
                  onCloseAutoFocus={(e) => e.preventDefault()}
                >
                  <DateRangePickerContent
                    value={dateRange}
                    onChange={setDateRange}
                    onClose={() => setDatesOpen(false)}
                    fullWidth
                    compact
                  />
                </PopoverContent>
              </Popover>
            </div>

            {/* Who */}
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-zinc-900">Who</Label>
              <Popover open={guestsOpen} onOpenChange={setGuestsOpen} modal={false}>
                <PopoverAnchor asChild>
                  <button
                    type="button"
                    onClick={() => setGuestsOpen(true)}
                    className={cn(fieldButtonCls, guestText ? "text-zinc-900" : "text-zinc-400")}
                    aria-label="Add guests"
                  >
                    {guestText || "Add guests"}
                  </button>
                </PopoverAnchor>
                <PopoverContent
                  className="z-[100] w-[var(--radix-popover-trigger-width)] p-0"
                  align="start"
                  sideOffset={8}
                  onOpenAutoFocus={(e) => e.preventDefault()}
                >
                  <GuestPicker value={guests} onChange={setGuests} />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          <div className="border-t border-zinc-100 p-4">
            <Button
              type="submit"
              className="min-h-11 w-full rounded-[5px] bg-[#156EF5] text-sm font-medium hover:bg-[#125bd4]"
            >
              <SearchIcon className="size-4 text-white" aria-hidden />
              Search
            </Button>
          </div>
        </form>
      </SheetContent>
    </Sheet>
  );
}
