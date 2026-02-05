"use client";

import { useQueryState } from "nuqs";
import { useMemo, useState } from "react";
import Link from "next/link";
import { MOCK_LISTINGS } from "@/lib/mock-listings";
import type { Listing } from "@/lib/mock-listings";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { SearchFilters } from "@/components/search/search-filters";

// Normalize lat/lng to 0-100% for a fixed viewport (roughly SF area)
const BOUNDS = { minLat: 36.9, maxLat: 38.2, minLng: -122.5, maxLng: -121.8 };
function toPercent(lat: number, lng: number) {
  const x = ((lng - BOUNDS.minLng) / (BOUNDS.maxLng - BOUNDS.minLng)) * 100;
  const y = ((BOUNDS.maxLat - lat) / (BOUNDS.maxLat - BOUNDS.minLat)) * 100;
  return { x: Math.max(0, Math.min(100, x)), y: Math.max(0, Math.min(100, y)) };
}

function MapPin({
  listing,
  onClick,
}: {
  listing: Listing;
  onClick: () => void;
}) {
  const { x, y } = toPercent(listing.location.lat, listing.location.lng);
  return (
    <button
      type="button"
      onClick={onClick}
      className="absolute z-10 flex size-10 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-md transition-transform hover:scale-110 focus-visible:outline focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 min-w-[44px] min-h-[44px] touch-manipulation"
      style={{ left: `${x}%`, top: `${y}%` }}
      aria-label={`View ${listing.title}`}
    >
      <span className="text-sm font-semibold">${listing.pricePerNight}</span>
    </button>
  );
}

export function MapSearchClient() {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [query] = useQueryState("q", { defaultValue: "" });
  const [minPrice] = useQueryState("minPrice", { defaultValue: "" });
  const [maxPrice] = useQueryState("maxPrice", { defaultValue: "" });

  const listings = useMemo(() => {
    let result = [...MOCK_LISTINGS];
    const q = query.trim().toLowerCase();
    if (q) {
      result = result.filter(
        (l) =>
          l.title.toLowerCase().includes(q) ||
          l.location.city.toLowerCase().includes(q)
      );
    }
    const min = minPrice ? Number(minPrice) : null;
    const max = maxPrice ? Number(maxPrice) : null;
    if (min != null && !Number.isNaN(min)) result = result.filter((l) => l.pricePerNight >= min);
    if (max != null && !Number.isNaN(max)) result = result.filter((l) => l.pricePerNight <= max);
    return result;
  }, [query, minPrice, maxPrice]);

  const selected = selectedId ? listings.find((l) => l.id === selectedId) : null;

  return (
    <div className="relative h-full flex">
      <div className="absolute left-0 top-0 z-20 w-full border-b bg-background/95 p-3 backdrop-blur sm:w-auto sm:min-w-[280px] sm:max-w-sm sm:border-b-0 sm:border-r">
        <SearchFilters />
      </div>
      <div className="relative flex-1 bg-muted">
        {/* Stylized map area */}
        <div
          className="absolute inset-0 bg-gradient-to-br from-green-100 to-blue-100 dark:from-green-950/30 dark:to-blue-950/30"
          aria-hidden
        />
        {listings.map((listing) => (
          <MapPin
            key={listing.id}
            listing={listing}
            onClick={() => setSelectedId(listing.id)}
          />
        ))}
      </div>
      <Sheet open={!!selected} onOpenChange={(open) => !open && setSelectedId(null)}>
        <SheetContent side="right" className="w-full sm:max-w-md">
          {selected && (
            <>
              <SheetHeader>
                <SheetTitle>{selected.title}</SheetTitle>
              </SheetHeader>
              <div className="mt-4 space-y-4">
                <p className="text-muted-foreground">{selected.description}</p>
                <p className="text-2xl font-semibold tabular-nums">
                  ${selected.pricePerNight}
                  <span className="text-sm font-normal text-muted-foreground"> per night</span>
                </p>
                <p className="text-sm">{selected.location.city}</p>
                <div className="flex gap-2">
                  <Button asChild className="min-h-[44px]">
                    <Link href={`/listing/${selected.id}`}>View full details</Link>
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setSelectedId(null)}
                    className="min-h-[44px]"
                  >
                    Close
                  </Button>
                </div>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}
