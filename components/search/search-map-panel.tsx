"use client";

import { useQueryState } from "nuqs";
import { useMemo, useState } from "react";
import type { VehicleListing } from "@/lib/vehicle-listings";
import { getListingsByCategory } from "@/lib/vehicle-listings";
import { Map, List } from "lucide-react";
import { getFilteredListings } from "@/components/search/search-filter-bar";
import type { VehicleCategory } from "@/lib/vehicle-listings";
import { MapViewListingCard } from "@/components/search/map-view-listing-card";
import { SearchMapLeaflet } from "@/components/search/search-map-leaflet";
import { useMediaQuery } from "@/hooks/use-media-query";
import { cn } from "@/lib/utils";

function HomesAvailableHeading({ count }: { count: number }) {
  return (
    <h2 className="text-base font-semibold text-zinc-900">
      {count >= 70 ? "Over 70 homes available" : `${count} home${count !== 1 ? "s" : ""} available`}
    </h2>
  );
}

const ListContent = ({ listings }: { listings: VehicleListing[] }) => (
  <div className="flex flex-col gap-4 px-4 pb-4 sm:px-6">
    {listings.slice(0, 32).map((listing) => (
      <MapViewListingCard key={listing.id} listing={listing} />
    ))}
  </div>
);

export function SearchMapPanel({ className }: { className?: string }) {
  const [mapOpen, setMapOpen] = useState(false);
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const [priceRange] = useQueryState("price", { defaultValue: "" });
  const [seatsMin] = useQueryState("seats", { defaultValue: "" });
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
      categories: categoryList,
      sort: sort || undefined,
    });
  }, [priceRange, minPrice, maxPrice, seatsMin, categories, sort]);

  return (
    <div
      className={cn(
        "flex flex-col md:flex-row md:h-[calc(100dvh-7.5rem)]",
        className
      )}
      aria-label="Map view"
    >
      {/* Desktop: left list column — fixed height, independently scrollable */}
      <div className="hidden w-[40%] shrink-0 flex-col border-r border-zinc-100 bg-background md:flex md:overflow-y-auto">
        <div className="shrink-0 px-4 py-4 sm:px-6">
          <HomesAvailableHeading count={listings.length} />
        </div>
        <ListContent listings={listings} />
      </div>

      {/* Map — desktop: fills remaining width + full height; mobile: fixed to fill viewport when open */}
      <div
        className={cn(
          "search-map-container relative isolate z-0 flex min-w-0 flex-1 flex-col",
          !isDesktop && !mapOpen && "hidden",
          !isDesktop &&
            mapOpen &&
            "fixed inset-x-0 bottom-0 top-[7.5rem] z-30 w-full"
        )}
      >
        <SearchMapLeaflet
          listings={listings}
          selectedId={null}
          onSelectListing={() => {}}
          className="h-full min-h-0 min-w-0"
        />
      </div>

      {/* Mobile only: list when map is closed (scrolls with the page) */}
      {!isDesktop && !mapOpen && (
        <div className="flex w-full flex-col bg-background pb-24">
          <div className="shrink-0 px-4 py-4 sm:px-6">
            <HomesAvailableHeading count={listings.length} />
          </div>
          <ListContent listings={listings} />
        </div>
      )}

      {/* Mobile floating toggle pill */}
      {!isDesktop && (
        <div className="fixed bottom-6 left-1/2 z-[45] -translate-x-1/2">
          <button
            type="button"
            onClick={() => setMapOpen((v) => !v)}
            className="flex items-center gap-2 rounded-full bg-zinc-900 px-5 py-2.5 text-sm font-semibold text-white shadow-lg transition-transform active:scale-95"
          >
            {mapOpen ? (
              <>
                <List className="size-4" aria-hidden />
                Show list
              </>
            ) : (
              <>
                <Map className="size-4" aria-hidden />
                Show map
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
}
