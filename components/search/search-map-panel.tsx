"use client";

import { useQueryState } from "nuqs";
import { useMemo, useState } from "react";
import type { VehicleListing } from "@/lib/vehicle-listings";
import { getListingsByCategory } from "@/lib/vehicle-listings";
import { Button } from "@/components/ui/button";
import { Map, X } from "lucide-react";
import { getFilteredListings } from "@/components/search/search-filter-bar";
import type { VehicleCategory } from "@/lib/vehicle-listings";
import { MapViewListingCard } from "@/components/search/map-view-listing-card";
import { SearchMapLeaflet } from "@/components/search/search-map-leaflet";
import { useMediaQuery } from "@/hooks/use-media-query";
import { cn } from "@/lib/utils";

function CarsAvailableHeading({ count }: { count: number }) {
  return (
    <h2 className="text-lg font-bold text-zinc-900">
      {count >= 70 ? "Over 70 cars available" : `${count} cars available`}
    </h2>
  );
}

const ListContent = ({ listings }: { listings: VehicleListing[] }) => (
  <>
    <div className="flex flex-col gap-4 px-4 pb-4 sm:px-6">
      {listings.slice(0, 32).map((listing) => (
        <MapViewListingCard key={listing.id} listing={listing} />
      ))}
    </div>
  </>
);

export function SearchMapPanel({ className }: { className?: string }) {
  const [mapOpen, setMapOpen] = useState(false);
  const isDesktop = useMediaQuery("(min-width: 768px)");
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

  return (
    <div
      className={cn("flex min-h-0 flex-1 flex-col md:flex-row", className)}
      aria-label="Map view"
    >
      {/* Desktop: left column 40% - flows with content so page scrolls, footer appears at end */}
      <div className="hidden w-[40%] min-w-0 shrink-0 flex-col border-r border-zinc-200 bg-background md:flex">
        <div className="shrink-0 px-4 py-4 sm:px-6">
          <CarsAvailableHeading count={listings.length} />
        </div>
        <ListContent listings={listings} />
      </div>

      {/* Map: z-0 + isolate so always behind header/filter; desktop: sticky so it never moves up */}
      <div
        className={cn(
          "search-map-container relative flex min-h-0 min-w-0 flex-1 flex-col isolate z-0 md:sticky md:top-[7rem] md:self-start md:h-[calc(100vh-7rem)]",
          !isDesktop && !mapOpen && "hidden"
        )}
      >
        <SearchMapLeaflet
          listings={listings}
          selectedId={null}
          onSelectListing={() => {}}
          className="min-h-[400px] h-full"
        />
        {!isDesktop && mapOpen && (
          <Button
            variant="outline"
            size="sm"
            className="absolute right-4 top-4 z-[10] gap-2 shadow-sm"
            onClick={() => setMapOpen(false)}
          >
            <X className="size-4" aria-hidden />
            Close map
          </Button>
        )}
      </div>

      {/* Mobile only: list with title + View map when map is closed */}
      {!isDesktop && !mapOpen && (
        <div className="flex min-h-0 w-full flex-1 flex-col border-r-0 bg-background">
          <div className="flex shrink-0 flex-wrap items-center gap-3 px-4 py-4 sm:px-6">
            <CarsAvailableHeading count={listings.length} />
            <Button
              variant="outline"
              size="sm"
              className="gap-2"
              onClick={() => setMapOpen(true)}
            >
              <Map className="size-4" aria-hidden />
              View map
            </Button>
          </div>
          <ListContent listings={listings} />
        </div>
      )}
    </div>
  );
}
