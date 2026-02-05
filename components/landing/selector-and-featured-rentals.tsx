"use client";

import Link from "next/link";
import { useQueryState, parseAsStringLiteral } from "nuqs";
import { Button } from "@/components/ui/button";
import { VehicleTypeSelector, VEHICLE_TITLE_MAP } from "@/components/landing/vehicle-type-selector";
import { VehicleListingCard } from "@/components/landing/vehicle-listing-card";
import { getListingsByCategory } from "@/lib/vehicle-listings";
import type { VehicleCategory } from "@/lib/vehicle-listings";

const CATEGORY_OPTIONS = ["all", "economy", "suvs", "passenger-vans", "pickup-truck", "premium", "luxury"] as const;

export function SelectorAndFeaturedRentals() {
  const [selectedVehicle, setCategoryParam] = useQueryState(
    "category",
    parseAsStringLiteral(CATEGORY_OPTIONS).withDefault("all")
  );
  const title = VEHICLE_TITLE_MAP[selectedVehicle] ?? "All cars";
  const allListings = getListingsByCategory(selectedVehicle);
  const listings = allListings.slice(0, 20); // max 5 rows × 4 cols

  return (
    <div className="space-y-0">
      <div className="flex justify-center pt-10">
        <VehicleTypeSelector value={selectedVehicle} onChange={(id) => setCategoryParam(id as VehicleCategory)} />
      </div>
      <section className="w-full pt-1 pb-16 md:pt-1.5 md:pb-20" aria-labelledby="featured-heading">
        <div className="w-full">
          <h2 id="featured-heading" className="text-2xl font-bold md:text-3xl">
            {title}
          </h2>
          <div className="mt-4 grid gap-x-4 gap-y-6 sm:grid-cols-2 lg:grid-cols-4">
            {listings.map((listing) => (
              <VehicleListingCard key={listing.id} listing={listing} />
            ))}
          </div>
          <div className="mt-8 text-center">
            <Button variant="outline" asChild>
              <Link href="/search">View all rentals</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
