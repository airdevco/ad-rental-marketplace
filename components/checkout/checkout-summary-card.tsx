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
import { TimePicker } from "@/components/ui/time-picker";
import { Popover, PopoverAnchor, PopoverContent } from "@/components/ui/popover";

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
  const from = addDays(startOfDay(new Date()), 7);
  const to = addDays(from, 2);
  return { from, to };
}

const DEFAULT_START_TIME = "10:00 AM";
const DEFAULT_END_TIME = "12:00 PM";

export function CheckoutSummaryCard({ listing, listingId }: CheckoutSummaryCardProps) {
  const [dateRange, setDateRange] = useState<DateRange | undefined>(getDefaultDateRange);
  const [tripStartTime, setTripStartTime] = useState(DEFAULT_START_TIME);
  const [tripEndTime, setTripEndTime] = useState(DEFAULT_END_TIME);
  const [datesExpanded, setDatesExpanded] = useState(false);
  const [datesAnchor, setDatesAnchor] = useState<"start" | "end" | null>(null);

  const from = dateRange?.from;
  const to = dateRange?.to;
  const days = from && to ? Math.max(1, differenceInDays(to, from)) : 2;
  const subtotal = listing ? days * listing.pricePerDay : 0;
  const taxes = Math.round(subtotal * 0.2);
  const total = subtotal + taxes;

  const datesLabel = useMemo(() => {
    if (!from) return "Select dates";
    const startStr = `${format(from, "MMM d")}, ${tripStartTime}`;
    if (!to) return startStr;
    const endDateStr =
      from.getMonth() === to.getMonth() && from.getFullYear() === to.getFullYear()
        ? format(to, "d")
        : format(to, "MMM d");
    return `${startStr} – ${endDateStr}, ${tripEndTime}`;
  }, [from, to, tripStartTime, tripEndTime]);

  if (!listing) {
    return (
      <Card className="overflow-hidden">
        <CardContent className="p-6">
          <p className="text-sm text-muted-foreground">
            Select a rental from the search or a listing page to see the summary here.
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
        {/* Property info - match reference: image + title, then star rating (count) */}
        <div className="flex gap-4 p-5">
          <div className="relative h-20 w-28 shrink-0 overflow-hidden rounded-lg bg-zinc-100">
            <Image
              src={listing.imageUrl}
              alt={listing.title}
              fill
              className="object-cover"
              sizes="112px"
            />
          </div>
          <div className="min-w-0 flex-1">
            <p className="font-semibold text-zinc-900 leading-snug">{listing.title}</p>
            <p className="mt-1.5 flex items-center gap-1.5 text-sm text-zinc-700">
              <Star className="size-4 shrink-0 fill-amber-400 text-amber-400" aria-hidden />
              <span className="font-medium tabular-nums">{listing.rating.toFixed(2)}</span>
              <span className="text-muted-foreground">({listing.reviewCount})</span>
            </p>
          </div>
        </div>

        <Separator />

        {/* Free cancellation */}
        <div className="px-5 py-3">
          <p className="font-semibold text-zinc-900">Free cancellation</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Cancel before pickup for a full refund.
          </p>
        </div>

        <Separator />

        {/* Dates - header row with Change on right, expandable Trip start/end UI */}
        <div className="px-5 py-3">
          <div className="flex items-center justify-between gap-2">
            <p className="font-semibold text-zinc-900">Dates</p>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setDatesExpanded((v) => !v)}
            >
              {datesExpanded ? "Done" : "Change"}
            </Button>
          </div>
          {datesExpanded ? (
            <div className="mt-3 space-y-3">
              <div>
                <p className="text-sm font-medium">Trip start</p>
                <div className="mt-1.5 flex gap-2">
                  <Popover
                    open={datesAnchor === "start"}
                    onOpenChange={(open) => setDatesAnchor(open ? "start" : null)}
                  >
                    <PopoverAnchor asChild>
                      <button
                        type="button"
                        onClick={() => setDatesAnchor("start")}
                        className="flex h-9 min-w-0 flex-1 items-center justify-between gap-1 rounded-md border border-input bg-transparent px-3 py-2 text-left text-sm shadow-xs"
                      >
                        <span className={from ? "text-foreground" : "text-muted-foreground"}>
                          {from ? format(from, "MMM d, yyyy") : "Select date"}
                        </span>
                        <ChevronDown className="size-4 shrink-0 text-muted-foreground" />
                      </button>
                    </PopoverAnchor>
                    <PopoverContent side="bottom" align="end" className="w-auto p-0">
                      <DateRangePickerContent
                        value={dateRange}
                        onChange={setDateRange}
                        onClose={() => setDatesAnchor(null)}
                      />
                    </PopoverContent>
                  </Popover>
                  <TimePicker
                    value={tripStartTime}
                    onChange={setTripStartTime}
                    placeholder="10:00 AM"
                    showIcon={false}
                    triggerClassName="h-9 w-24 rounded-md border border-input bg-transparent px-3"
                  />
                </div>
              </div>
              <div>
                <p className="text-sm font-medium">Trip end</p>
                <div className="mt-1.5 flex gap-2">
                  <Popover
                    open={datesAnchor === "end"}
                    onOpenChange={(open) => setDatesAnchor(open ? "end" : null)}
                  >
                    <PopoverAnchor asChild>
                      <button
                        type="button"
                        onClick={() => setDatesAnchor("end")}
                        className="flex h-9 min-w-0 flex-1 items-center justify-between gap-1 rounded-md border border-input bg-transparent px-3 py-2 text-left text-sm shadow-xs"
                      >
                        <span className={to ? "text-foreground" : "text-muted-foreground"}>
                          {to ? format(to, "MMM d, yyyy") : "Select date"}
                        </span>
                        <ChevronDown className="size-4 shrink-0 text-muted-foreground" />
                      </button>
                    </PopoverAnchor>
                    <PopoverContent side="bottom" align="end" className="w-auto p-0">
                      <DateRangePickerContent
                        value={dateRange}
                        onChange={setDateRange}
                        onClose={() => setDatesAnchor(null)}
                      />
                    </PopoverContent>
                  </Popover>
                  <TimePicker
                    value={tripEndTime}
                    onChange={setTripEndTime}
                    placeholder="10:00 AM"
                    showIcon={false}
                    triggerClassName="h-9 w-24 rounded-md border border-input bg-transparent px-3"
                  />
                </div>
              </div>
            </div>
          ) : (
            <p className="mt-1 text-sm text-muted-foreground">{datesLabel}</p>
          )}
        </div>

        <Separator />

        {/* Price details */}
        <div className="px-5 py-3 space-y-2">
          <p className="font-semibold text-zinc-900">Price details</p>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">
              {days} {days === 1 ? "day" : "days"} × ${listing.pricePerDay.toFixed(2)}
            </span>
            <span className="tabular-nums font-medium">${subtotal.toLocaleString()}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Taxes</span>
            <span className="tabular-nums font-medium">${taxes.toLocaleString()}</span>
          </div>
        </div>

        <Separator />

        {/* Total USD + Price breakdown link */}
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
