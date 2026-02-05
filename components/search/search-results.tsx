"use client";

import { useQueryState } from "nuqs";
import { useMemo } from "react";
import { MOCK_LISTINGS } from "@/lib/mock-listings";
import { ListingCard } from "@/components/search/listing-card";

export function SearchResults() {
  const [query] = useQueryState("q", { defaultValue: "" });
  const [sort] = useQueryState("sort", { defaultValue: "relevance" });
  const [minPrice] = useQueryState("minPrice", { defaultValue: "" });
  const [maxPrice] = useQueryState("maxPrice", { defaultValue: "" });

  const listings = useMemo(() => {
    let result = [...MOCK_LISTINGS];

    const q = query.trim().toLowerCase();
    if (q) {
      result = result.filter(
        (l) =>
          l.title.toLowerCase().includes(q) ||
          l.description.toLowerCase().includes(q) ||
          l.location.city.toLowerCase().includes(q)
      );
    }

    const min = minPrice ? Number(minPrice) : null;
    const max = maxPrice ? Number(maxPrice) : null;
    if (min != null && !Number.isNaN(min)) {
      result = result.filter((l) => l.pricePerNight >= min);
    }
    if (max != null && !Number.isNaN(max)) {
      result = result.filter((l) => l.pricePerNight <= max);
    }

    switch (sort) {
      case "price-asc":
        result.sort((a, b) => a.pricePerNight - b.pricePerNight);
        break;
      case "price-desc":
        result.sort((a, b) => b.pricePerNight - a.pricePerNight);
        break;
      case "newest":
        result.reverse();
        break;
      default:
        break;
    }

    return result;
  }, [query, sort, minPrice, maxPrice]);

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
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {listings.map((listing) => (
        <ListingCard key={listing.id} listing={listing} />
      ))}
    </div>
  );
}
