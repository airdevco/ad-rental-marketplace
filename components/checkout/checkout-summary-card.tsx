"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { format, differenceInDays, addDays, startOfDay } from "date-fns";
import type { DateRange } from "react-day-picker";
import { Star, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { DateRangePickerContent } from "@/components/landing/date-range-picker";
import { GuestPicker, guestSummary, type Guests, DEFAULT_GUESTS } from "@/components/landing/guest-picker";
import { Popover, PopoverAnchor, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

type ListingSummary = {
  id: string;
  title: string;
  imageUrl: string;
  pricePerDay: number;
  rating: number;
  reviewCount: number;
};

type CheckoutSummaryCardProps = {
  listing: ListingSummary | null;
  listingId: string | null;
};

function getDefaultDateRange(): DateRange {
  const from = startOfDay(new Date(new Date().getFullYear(), 2, 3)); // Mar 3
  const to = addDays(from, 2); // Mar 5
  return { from, to };
}

function getDefaultGuests(): Guests {
  return { ...DEFAULT_GUESTS, adults: 2 };
}

export function CheckoutSummaryCard({ listing, listingId }: CheckoutSummaryCardProps) {
  const [dateRange, setDateRange] = useState<DateRange | undefined>(getDefaultDateRange);
  const [guests, setGuests] = useState<Guests>(getDefaultGuests);
  const [datesExpanded, setDatesExpanded] = useState(false);
  const [datesAnchor, setDatesAnchor] = useState<"start" | "end" | null>(null);
  const [guestsOpen, setGuestsOpen] = useState(false);

  const from = dateRange?.from;
  const to = dateRange?.to;
  const days = from && to ? Math.max(1, differenceInDays(to, from)) : 2;
  const subtotal = listing ? days * listing.pricePerDay : 0;
  const taxes = Math.round(subtotal * 0.2);
  const total = subtotal + taxes;

  const datesAndGuestsLabel = useMemo(() => {
    if (!from) return "Select dates";
    const startStr = format(from, "MMM d");
    const endStr = to
      ? from.getMonth() === to.getMonth() && from.getFullYear() === to.getFullYear()
        ? format(to, "d")
        : format(to, "MMM d")
      : "";
    const range = to ? `${startStr}-${endStr}` : startStr;
    const guestStr = guestSummary(guests) || "0 guests";
    return `${range} · ${guestStr}`;
  }, [from, to, guests]);

  if (!listing) {
    return (
      <Card className="overflow-hidden">
        <CardContent className="p-6">
          <p className="text-sm text-muted-foreground">
            Select a listing from search or a listing page to see the summary here.
          </p>
          <Link
            href="/search"
            className="mt-3 inline-block text-sm font-medium text-primary hover:underline"
          >
            Browse listings
          </Link>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="overflow-hidden">
      <CardContent className="p-0">
        {/* Image: same width as content below, rounded corners, not edge-to-edge */}
        <div className="px-5 pt-3">
          <div className="relative aspect-[2/1] w-full overflow-hidden rounded-xl bg-zinc-100">
            <Image
              src={listing.imageUrl}
              alt={listing.title}
              fill
              className="object-cover"
              sizes="(min-width: 400px) 400px, 100vw"
            />
          </div>
        </div>
        {/* Title, rating and reviews beneath */}
        <div className="px-5 py-4">
          <p className="font-semibold text-zinc-900 leading-snug">{listing.title}</p>
          <p className="mt-1.5 flex items-center gap-1.5 text-sm text-muted-foreground">
            <Star className="size-4 shrink-0 fill-zinc-900 text-zinc-900" aria-hidden />
            <span className="font-medium tabular-nums text-zinc-900">{listing.rating.toFixed(2)}</span>
            <span>· {listing.reviewCount} reviews</span>
          </p>
        </div>

        <Separator className="bg-zinc-100" />

        {/* Free cancellation */}
        <div className="px-5 py-3">
          <p className="font-semibold text-zinc-900">Free cancellation</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Cancel before check-in for a full refund.
          </p>
        </div>

        <Separator className="bg-zinc-100" />

        {/* Dates & guests - default: Mar 12 – 16 · # guests + Change; edit: listing-style inputs */}
        <div className="relative px-5 py-3">
          <div className="flex items-center justify-between gap-2">
            <p className="font-semibold text-zinc-900">Dates &amp; guests</p>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setDatesExpanded((v) => !v)}
              className="h-9 rounded-[5px] border-zinc-200 font-medium shadow-none hover:bg-zinc-100"
            >
              {datesExpanded ? "Done" : "Change"}
            </Button>
          </div>
          {datesExpanded ? (
            <div className="mt-3 space-y-3">
              {/* Check-in | Check-out - vertical divider touches top/bottom section dividers */}
              <div className="relative flex">
                <div className="min-w-0 flex-1 pr-4">
                  <p className="text-xs font-semibold text-zinc-900">Check-in</p>
                  <div className="mt-1.5">
                    <Popover
                      open={datesAnchor === "start"}
                      onOpenChange={(open) => setDatesAnchor(open ? "start" : null)}
                    >
                      <PopoverTrigger asChild>
                        <button
                          type="button"
                          className="flex h-9 w-full items-center justify-between gap-1 rounded-[5px] border border-zinc-200 bg-white px-3 py-2 text-left text-sm"
                        >
                          <span className={from ? "text-foreground" : "text-muted-foreground"}>
                            {from ? format(from, "MMM d, yyyy") : "Select date"}
                          </span>
                          <ChevronDown className="size-4 shrink-0 text-muted-foreground" />
                        </button>
                      </PopoverTrigger>
                      <PopoverContent side="bottom" align="end" className="w-auto p-0">
                        <DateRangePickerContent
                          value={dateRange}
                          onChange={setDateRange}
                          onClose={() => setDatesAnchor(null)}
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>
                <div className="absolute left-1/2 top-0 bottom-0 w-px -translate-x-1/2 bg-zinc-100" aria-hidden />
                <div className="min-w-0 flex-1 pl-4">
                  <p className="text-xs font-semibold text-zinc-900">Check-out</p>
                  <div className="mt-1.5">
                    <Popover
                      open={datesAnchor === "end"}
                      onOpenChange={(open) => setDatesAnchor(open ? "end" : null)}
                    >
                      <PopoverTrigger asChild>
                        <button
                          type="button"
                          className="flex h-9 w-full items-center justify-between gap-1 rounded-[5px] border border-zinc-200 bg-white px-3 py-2 text-left text-sm"
                        >
                          <span className={to ? "text-foreground" : "text-muted-foreground"}>
                            {to ? format(to, "MMM d, yyyy") : "Select date"}
                          </span>
                          <ChevronDown className="size-4 shrink-0 text-muted-foreground" />
                        </button>
                      </PopoverTrigger>
                      <PopoverContent side="bottom" align="end" className="w-auto p-0">
                        <DateRangePickerContent
                          value={dateRange}
                          onChange={setDateRange}
                          onClose={() => setDatesAnchor(null)}
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>
              </div>
              {/* Guests - same as listing */}
              <div>
                <p className="text-xs font-semibold text-zinc-900">Guests</p>
                <div className="mt-1.5">
                  <Popover open={guestsOpen} onOpenChange={setGuestsOpen}>
                    <PopoverAnchor asChild>
                      <button
                        type="button"
                        onClick={() => setGuestsOpen(true)}
                        className="flex h-9 w-full items-center justify-between rounded-[5px] border border-zinc-200 bg-white px-3 text-left text-sm"
                        aria-label="Select guests"
                      >
                        <span className={guestSummary(guests) ? "text-foreground" : "text-muted-foreground"}>
                          {guestSummary(guests) || "Add guests"}
                        </span>
                        <ChevronDown className="size-4 shrink-0 text-muted-foreground" />
                      </button>
                    </PopoverAnchor>
                    <PopoverContent side="bottom" align="start" className="w-auto p-0">
                      <GuestPicker value={guests} onChange={setGuests} />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
            </div>
          ) : (
            <p className="mt-1 text-sm text-muted-foreground">{datesAndGuestsLabel}</p>
          )}
        </div>

        <Separator className="bg-zinc-100" />

        {/* Price details */}
        <div className="px-5 py-3 space-y-2">
          <p className="font-semibold text-zinc-900">Price details</p>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">
              {days} {days === 1 ? "night" : "nights"} × ${listing.pricePerDay.toFixed(2)}
            </span>
            <span className="tabular-nums font-medium text-zinc-900">${subtotal.toLocaleString()}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Taxes</span>
            <span className="tabular-nums font-medium text-zinc-900">${taxes.toLocaleString()}</span>
          </div>
        </div>

        <Separator className="bg-zinc-100" />

        {/* Total */}
        <div className="px-5 py-3">
          <div className="flex items-center justify-between gap-2">
            <p className="font-semibold text-zinc-900">
              Total <span className="text-sm font-medium text-muted-foreground">USD</span>
            </p>
            <span className="text-lg font-semibold tabular-nums text-zinc-900">
              ${total.toLocaleString()}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
