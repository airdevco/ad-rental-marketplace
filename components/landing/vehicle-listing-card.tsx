"use client";

import Link from "next/link";
import { Star } from "@phosphor-icons/react";
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
    <Link href={`/listing/${listing.id}`} className="flex flex-col">
      <ListingImageWithWishlist
        images={images}
        alt={listing.title}
        listingId={listing.id}
      />

      <div className="mt-3">
        <div className="flex items-start justify-between gap-2">
          <h3 className="min-w-0 flex-1 truncate text-sm font-semibold leading-snug text-zinc-900">
            {listing.title}
          </h3>
          <span
            className="flex shrink-0 items-center gap-1 pt-px"
            aria-label={`Rating: ${rating} out of 5`}
          >
            <Star size={12} weight="fill" className="text-zinc-900" aria-hidden />
            <span className="text-sm tabular-nums text-zinc-900">{rating.toFixed(2)}</span>
          </span>
        </div>

        <p className="mt-0.5 text-sm text-muted-foreground">{listing.subtitle}</p>
        <p className="text-sm text-muted-foreground">
          {bedrooms} bed{bedrooms !== 1 ? "s" : ""} · {bathrooms} bath{bathrooms !== 1 ? "s" : ""} · {guests} guest{guests !== 1 ? "s" : ""}
        </p>

        <p className="mt-1.5 text-sm text-zinc-900">
          <span className="font-semibold">${listing.pricePerDay}</span>
          <span className="text-muted-foreground"> / night</span>
        </p>
      </div>
    </Link>
  );
}
