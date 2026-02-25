"use client";

import { useQueryState } from "nuqs";
import { useMemo } from "react";
import { VehicleListingCard } from "@/components/landing/vehicle-listing-card";
import { getListingsByCategory } from "@/lib/vehicle-listings";
import { getFilteredListings } from "@/components/search/search-filter-bar";
import type { VehicleCategory } from "@/lib/vehicle-listings";

export function VehicleSearchResults() {
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
    const filtered = getFilteredListings(allListings, {
      priceRange: priceRange || undefined,
      minPrice: minPrice || undefined,
      maxPrice: maxPrice || undefined,
      seatsMin: seatsMin || undefined,
      categories: categoryList,
      sort: sort || undefined,
    });
    // Max 8 rows: 8 × 4 = 32 on large, 8 × 2 = 16 on medium
    return filtered.slice(0, 32);
  }, [
    priceRange,
    minPrice,
    maxPrice,
    seatsMin,
    categories,
    sort,
  ]);

  if (listings.length === 0) {
    return (
      <div className="rounded-xl border bg-card p-12 text-center">
        <p className="text-muted-foreground">No rentals match your filters.</p>
        <p className="mt-1 text-sm text-muted-foreground">
          Try adjusting your search or filters.
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-x-6 gap-y-8 sm:grid-cols-2 lg:grid-cols-4">
      {listings.map((listing) => (
        <VehicleListingCard key={listing.id} listing={listing} />
      ))}
    </div>
  );
}
