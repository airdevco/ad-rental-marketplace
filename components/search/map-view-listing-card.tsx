"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Star } from "@phosphor-icons/react";
import { Heart } from "lucide-react";
import type { VehicleListing } from "@/lib/vehicle-listings";
import {
  getDummyRating,
  getListingGalleryImages,
} from "@/lib/vehicle-listings";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export function MapViewListingCard({ listing }: { listing: VehicleListing }) {
  const [isWishlisted, setIsWishlisted] = useState(false);
  const rating = listing.rating ?? getDummyRating(listing.id);
  const images = getListingGalleryImages(listing);
  const firstImage = images[0] ?? "";

  const bedrooms = listing.seats;
  const bathrooms = listing.luggage;
  const guests = listing.doors;

  function handleWishlistClick(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    setIsWishlisted((prev) => !prev);
  }

  return (
    <Link
      href={`/listing/${listing.id}`}
      className="block w-full text-left group/card"
    >
      <Card className="relative flex flex-row overflow-hidden border-zinc-100 bg-white p-0 shadow-none">
        {/* Left: image ~40% - zoom on card hover; heart inside image */}
        <div className="relative h-32 w-[45%] shrink-0 overflow-hidden sm:h-36">
          <Image
            src={firstImage}
            alt={listing.title}
            fill
            className="object-cover transition-transform duration-200 ease-out group-hover/card:scale-105"
            sizes="(max-width: 640px) 140px, 160px"
          />
          <button
            type="button"
            onClick={handleWishlistClick}
            aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
            className="absolute right-1.5 top-1.5 z-10 flex size-7 items-center justify-center rounded-sm transition-transform hover:scale-110 focus-visible:outline focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1"
          >
            <Heart
              className={cn(
                "size-4 transition-colors",
                isWishlisted
                  ? "fill-red-500 stroke-red-500"
                  : "fill-zinc-600 stroke-white stroke-[1]"
              )}
              aria-hidden
            />
          </button>
        </div>

        {/* Right: details */}
        <div className="flex min-w-0 flex-1 flex-col justify-between px-3 py-3 sm:px-4 sm:py-4">
          <div>
            <div className="flex items-start justify-between gap-2">
              <h3 className="min-w-0 flex-1 truncate text-sm font-semibold text-zinc-900">
                {listing.title}
              </h3>
              <span
                className="flex shrink-0 items-center gap-1 pt-px"
                aria-label={`Rating: ${rating} out of 5`}
              >
                <Star size={12} weight="fill" className="text-zinc-900 shrink-0" aria-hidden />
                <span className="text-sm tabular-nums text-zinc-900">
                  {rating.toFixed(2)}
                </span>
              </span>
            </div>
            <p className="mt-0.5 text-sm text-muted-foreground">{listing.subtitle}</p>
            <p className="mt-1 text-sm text-muted-foreground">
              {bedrooms} bed{bedrooms !== 1 ? "s" : ""} · {bathrooms} bath{bathrooms !== 1 ? "s" : ""} · {guests} guest{guests !== 1 ? "s" : ""}
            </p>
          </div>
          <p className="mt-1.5 text-sm text-zinc-900">
            <span className="font-semibold">${listing.pricePerDay}</span>
            <span className="text-muted-foreground"> / night</span>
          </p>
        </div>
      </Card>
    </Link>
  );
}
