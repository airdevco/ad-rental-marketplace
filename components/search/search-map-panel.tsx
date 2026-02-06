"use client";

import { useQueryState } from "nuqs";
import { useMemo, useState } from "react";
import Link from "next/link";
import type { VehicleListing } from "@/lib/vehicle-listings";
import { getListingsByCategory, getListingLocation } from "@/lib/vehicle-listings";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { getFilteredListings } from "@/components/search/search-filter-bar";
import type { VehicleCategory } from "@/lib/vehicle-listings";

// Bounds for map (US mainland-ish)
const BOUNDS = { minLat: 25, maxLat: 48, minLng: -125, maxLng: -66 };
function toPercent(lat: number, lon: number) {
  const x = ((lon - BOUNDS.minLng) / (BOUNDS.maxLng - BOUNDS.minLng)) * 100;
  const y = ((BOUNDS.maxLat - lat) / (BOUNDS.maxLat - BOUNDS.minLat)) * 100;
  return { x: Math.max(0, Math.min(100, x)), y: Math.max(0, Math.min(100, y)) };
}

function MapPin({
  listing,
  onClick,
}: {
  listing: VehicleListing;
  onClick: () => void;
}) {
  const { lat, lon } = getListingLocation(listing);
  const { x, y } = toPercent(lat, lon);
  return (
    <button
      type="button"
      onClick={onClick}
      className="absolute z-10 flex size-10 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-md transition-transform hover:scale-110 focus-visible:outline focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 min-w-[44px] min-h-[44px] touch-manipulation"
      style={{ left: `${x}%`, top: `${y}%` }}
      aria-label={`View ${listing.title}`}
    >
      <span className="text-sm font-semibold">${listing.pricePerDay}</span>
    </button>
  );
}

export function SearchMapPanel({ className }: { className?: string }) {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [priceRange] = useQueryState("price", { defaultValue: "" });
  const [seatsMin] = useQueryState("seats", { defaultValue: "" });
  const [fuelType] = useQueryState("fuel", { defaultValue: "" });
  const [minPrice] = useQueryState("minPrice", { defaultValue: "" });
  const [maxPrice] = useQueryState("maxPrice", { defaultValue: "" });
  const [categories] = useQueryState("categories", { defaultValue: "" });
  const [sort] = useQueryState("sort", { defaultValue: "relevance" });

  const listings = useMemo(() => {
    const allListings = getListingsByCategory("all");
    const categoryList =
      categories && categories.trim()
        ? (categories.split(",").filter(Boolean) as VehicleCategory[])
        : undefined;
    return getFilteredListings(allListings, {
      priceRange: priceRange || undefined,
      minPrice: minPrice || undefined,
      maxPrice: maxPrice || undefined,
      seatsMin: seatsMin || undefined,
      fuelType: fuelType || undefined,
      categories: categoryList,
      sort: sort || undefined,
    });
  }, [
    priceRange,
    minPrice,
    maxPrice,
    seatsMin,
    fuelType,
    categories,
    sort,
  ]);

  const selected = selectedId
    ? listings.find((l) => l.id === selectedId)
    : null;

  return (
    <>
      <div
        className={`relative flex-1 min-h-0 bg-muted ${className ?? ""}`}
        aria-label="Map view"
      >
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
      <Sheet
        open={!!selected}
        onOpenChange={(open) => !open && setSelectedId(null)}
      >
        <SheetContent side="right" className="w-full sm:max-w-md">
          {selected && (
            <>
              <SheetHeader>
                <SheetTitle>{selected.title}</SheetTitle>
              </SheetHeader>
              <div className="mt-4 space-y-4">
                <p className="text-muted-foreground">
                  {selected.description ??
                    "Well-maintained vehicle. Book with confidence."}
                </p>
                <p className="text-2xl font-semibold tabular-nums">
                  ${selected.pricePerDay}
                  <span className="text-sm font-normal text-muted-foreground">
                    {" "}
                    /day
                  </span>
                </p>
                <p className="text-sm">{selected.location?.city}</p>
                <div className="flex gap-2">
                  <Button asChild className="min-h-[44px]">
                    <Link href={`/listing/${selected.id}`}>
                      View full details
                    </Link>
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
    </>
  );
}
