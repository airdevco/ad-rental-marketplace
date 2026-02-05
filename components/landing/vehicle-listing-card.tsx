"use client";

import Image from "next/image";
import Link from "next/link";
import { Star } from "@phosphor-icons/react";
import { Users, Briefcase, DoorClosed } from "lucide-react";
import type { VehicleListing } from "@/lib/vehicle-listings";
import { getDummyRating } from "@/lib/vehicle-listings";

export function VehicleListingCard({ listing }: { listing: VehicleListing }) {
  const rating = listing.rating ?? getDummyRating(listing.id);
  return (
    <Link
      href={`/listing/${listing.id}`}
      className="flex flex-col"
    >
      {/* Rounded image */}
      <div className="aspect-[400/260] w-full overflow-hidden rounded-xl bg-zinc-100">
        <Image
          src={listing.imageUrl}
          alt={listing.title}
          width={400}
          height={260}
          className="object-cover"
        />
      </div>

      {/* Content below */}
      <div className="mt-2">
        <div className="flex items-center justify-between gap-2">
          <h3 className="min-w-0 flex-1 truncate text-lg font-bold text-zinc-900">{listing.title}</h3>
          <span className="flex shrink-0 items-center gap-1" aria-label={`Rating: ${rating} out of 5`}>
            <Star size={16} weight="fill" className="text-amber-400" aria-hidden />
            <span className="text-sm font-medium tabular-nums text-zinc-700">{rating.toFixed(2)}</span>
          </span>
        </div>

        {/* Features - Users, Briefcase, Door icons */}
        <div className="mt-1 flex items-center gap-4 text-sm font-medium text-zinc-900">
          <span className="flex items-center gap-1.5" aria-label={`${listing.seats} seats`}>
            <Users className="size-4 shrink-0" aria-hidden />
            {listing.seats}
          </span>
          <span className="flex items-center gap-1.5" aria-label={`${listing.luggage} luggage`}>
            <Briefcase className="size-4 shrink-0" aria-hidden />
            {listing.luggage}
          </span>
          <span className="flex items-center gap-1.5" aria-label={`${listing.doors} doors`}>
            <DoorClosed className="size-4 shrink-0" aria-hidden />
            {listing.doors}
          </span>
        </div>

        {/* Price */}
        <div className="mt-1">
          <span className="text-xl font-bold tabular-nums text-zinc-900">
            ${listing.pricePerDay}
          </span>
          <span className="ml-0.5 text-sm text-zinc-500">/day</span>
        </div>
      </div>
    </Link>
  );
}
