"use client";

import Link from "next/link";
import { useQueryState, parseAsStringLiteral } from "nuqs";
import { Button } from "@/components/ui/button";
import { VehicleTypeSelector } from "@/components/landing/vehicle-type-selector";
import { VehicleListingCard } from "@/components/landing/vehicle-listing-card";
import { getListingsByCategory } from "@/lib/vehicle-listings";
import type { VehicleCategory } from "@/lib/vehicle-listings";

/** URL-friendly slugs for property type (homepage only); internal data still uses VehicleCategory. */
const TYPE_SLUGS = ["all", "apartments", "houses", "condos", "cabins", "beachfront", "luxury"] as const;
type TypeSlug = (typeof TYPE_SLUGS)[number];

const SLUG_TO_CATEGORY: Record<TypeSlug, VehicleCategory> = {
  all: "all",
  apartments: "economy",
  houses: "suvs",
  condos: "passenger-vans",
  cabins: "pickup-truck",
  beachfront: "premium",
  luxury: "luxury",
};

const CATEGORY_TO_SLUG: Record<VehicleCategory, TypeSlug> = {
  all: "all",
  economy: "apartments",
  suvs: "houses",
  "passenger-vans": "condos",
  "pickup-truck": "cabins",
  premium: "beachfront",
  luxury: "luxury",
};

export function SelectorAndFeaturedRentals() {
  const [typeSlug, setTypeSlug] = useQueryState(
    "type",
    parseAsStringLiteral(TYPE_SLUGS).withDefault("all")
  );
  const selectedCategory = SLUG_TO_CATEGORY[typeSlug];
  const allListings = getListingsByCategory(selectedCategory);
  const listings = allListings.slice(0, 20);

  function handleTypeChange(id: string) {
    setTypeSlug(CATEGORY_TO_SLUG[id as VehicleCategory]);
  }

  return (
    <div>
      {/* Full-bleed tab bar — border-b must be the containing border so -mb-px on tabs aligns */}
      <div className="relative left-1/2 w-screen -ml-[50vw] border-b border-zinc-100">
        <div className="container mx-auto max-w-[1400px] pt-5">
          <VehicleTypeSelector value={selectedCategory} onChange={handleTypeChange} />
        </div>
      </div>

      <section className="w-full pb-16 pt-6 md:pb-20" aria-labelledby="featured-heading">
        <h2 id="featured-heading" className="sr-only">Available homes</h2>
        <div className="grid gap-x-5 gap-y-8 sm:grid-cols-2 lg:grid-cols-4">
          {listings.map((listing) => (
            <VehicleListingCard key={listing.id} listing={listing} />
          ))}
        </div>
        <div className="mt-10 text-center">
          <Button
            variant="outline"
            className="h-11 w-fit rounded-[5px] px-4 font-semibold text-zinc-700 shadow-none hover:bg-zinc-100"
            asChild
          >
            <Link href="/search">View all homes</Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
