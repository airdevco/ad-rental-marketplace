"use client";

import Link from "next/link";
import { useQueryState, parseAsStringLiteral } from "nuqs";
import { SlidersHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { VehicleTypeSelector, VEHICLE_TITLE_MAP } from "@/components/landing/vehicle-type-selector";
import { VehicleListingCard } from "@/components/landing/vehicle-listing-card";
import { getListingsByCategory } from "@/lib/vehicle-listings";
import type { VehicleCategory } from "@/lib/vehicle-listings";

const CATEGORY_OPTIONS = ["all", "economy", "suvs", "passenger-vans", "pickup-truck", "premium", "luxury"] as const;

const FILTER_CHIPS = [
  "Under $150/night",
  "Self check-in",
  "Instant book",
  "Top rated",
  "Pet friendly",
  "Pool",
];

export function SelectorAndFeaturedRentals() {
  const [selectedVehicle, setCategoryParam] = useQueryState(
    "category",
    parseAsStringLiteral(CATEGORY_OPTIONS).withDefault("all")
  );
  const title = VEHICLE_TITLE_MAP[selectedVehicle] ?? "All homes";
  const allListings = getListingsByCategory(selectedVehicle);
  const listings = allListings.slice(0, 20);

  return (
    <div className="space-y-0">
      <div className="flex justify-center pt-10">
        <VehicleTypeSelector value={selectedVehicle} onChange={(id) => setCategoryParam(id as VehicleCategory)} />
      </div>
      <section className="w-full pt-1 pb-16 md:pt-1.5 md:pb-20" aria-labelledby="featured-heading">
        <div className="w-full">
          <div className="flex items-end justify-between gap-4">
            <h2 id="featured-heading" className="text-2xl font-bold tracking-tight md:text-3xl">
              {title}
            </h2>
            <Link href="/search" className="hidden text-sm font-semibold underline md:inline">
              Show all
            </Link>
          </div>

          <div className="mt-4 flex flex-wrap items-center gap-2.5">
            <button className="inline-flex items-center gap-1.5 rounded-full border border-zinc-900 bg-zinc-900 px-4 py-2 text-sm font-medium text-white">
              <SlidersHorizontal className="size-3.5" />
              Filters
            </button>
            {FILTER_CHIPS.map((chip) => (
              <button
                key={chip}
                className="rounded-full border border-zinc-200 bg-white px-4 py-2 text-sm font-medium text-zinc-900 transition-colors hover:border-zinc-900"
              >
                {chip}
              </button>
            ))}
          </div>

          <div className="mt-6 grid gap-x-6 gap-y-8 sm:grid-cols-2 lg:grid-cols-4">
            {listings.map((listing) => (
              <VehicleListingCard key={listing.id} listing={listing} />
            ))}
          </div>
          <div className="mt-8 text-center">
            <Button variant="outline" asChild>
              <Link href="/search">View all homes</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
