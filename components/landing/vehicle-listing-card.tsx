"use client";

import Link from "next/link";
import { Star } from "@phosphor-icons/react";
import { BedDouble, Bath, Users } from "lucide-react";
import type { VehicleListing } from "@/lib/vehicle-listings";
import { getDummyRating, getListingGalleryImages } from "@/lib/vehicle-listings";
import { ListingImageWithWishlist } from "@/components/listing/listing-image-with-wishlist";

const CARD_GALLERY_LIMIT = 5;

export function VehicleListingCard({ listing }: { listing: VehicleListing }) {
  const rating = listing.rating ?? getDummyRating(listing.id);
  const images = getListingGalleryImages(listing).slice(0, CARD_GALLERY_LIMIT);
  const bedrooms = listing.seats;
  const bathrooms = listing.luggage;
  const guests = listing.doors;

  return (
    <Link
      href={`/listing/${listing.id}`}
      className="flex flex-col"
    >
      <ListingImageWithWishlist
        images={images}
        alt={listing.title}
        listingId={listing.id}
      />

      <div className="mt-2">
        <div className="flex items-center justify-between gap-2">
          <h3 className="min-w-0 flex-1 truncate text-lg font-bold text-zinc-900">{listing.title}</h3>
          <span className="flex shrink-0 items-center gap-1" aria-label={`Rating: ${rating} out of 5`}>
            <Star size={16} weight="fill" className="text-amber-400" aria-hidden />
            <span className="text-sm font-medium tabular-nums text-zinc-700">{rating.toFixed(2)}</span>
          </span>
        </div>

        <p className="mt-0.5 text-sm text-zinc-500">{listing.subtitle}</p>

        <div className="mt-1 flex items-center gap-4 text-sm font-medium text-zinc-900">
          <span className="flex items-center gap-1.5" aria-label={`${bedrooms} bedroom${bedrooms !== 1 ? "s" : ""}`}>
            <BedDouble className="size-4 shrink-0" aria-hidden />
            {bedrooms}
          </span>
          <span className="flex items-center gap-1.5" aria-label={`${bathrooms} bathroom${bathrooms !== 1 ? "s" : ""}`}>
            <Bath className="size-4 shrink-0" aria-hidden />
            {bathrooms}
          </span>
          <span className="flex items-center gap-1.5" aria-label={`${guests} guest${guests !== 1 ? "s" : ""}`}>
            <Users className="size-4 shrink-0" aria-hidden />
            {guests}
          </span>
        </div>

        <div className="mt-1">
          <span className="text-xl font-bold tabular-nums text-zinc-900">
            ${listing.pricePerDay}
          </span>
          <span className="ml-0.5 text-sm text-zinc-500">/night</span>
        </div>
      </div>
    </Link>
  );
}
