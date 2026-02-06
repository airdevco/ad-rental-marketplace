import Image from "next/image";
import Link from "next/link";
import { MapPin, Calendar, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { MOCK_LISTINGS } from "@/lib/mock-listings";
import {
  getListingById,
  getListingLocation,
  getMapEmbedUrl,
} from "@/lib/vehicle-listings";
import type { VehicleListing } from "@/lib/vehicle-listings";

type Props = { searchParams: Promise<{ rentalId?: string; listingId?: string }> };

export const metadata = {
  title: "Booking confirmed",
  description: "Your rental booking has been confirmed",
};

export default async function OrderConfirmationPage({ searchParams }: Props) {
  const { rentalId, listingId } = await searchParams;
  const id = listingId ?? rentalId;
  const vehicleListing = id ? getListingById(id) : null;
  const mockListing = rentalId ? MOCK_LISTINGS.find((l) => l.id === rentalId) : null;

  const listing = vehicleListing ?? (mockListing
    ? {
        id: mockListing.id,
        title: mockListing.title,
        subtitle: "",
        imageUrl: mockListing.imageUrl,
        seats: 0,
        luggage: 0,
        doors: 0,
        pricePerDay: mockListing.pricePerNight,
        category: "economy" as const,
        location: mockListing.location
          ? {
              address: mockListing.location.address,
              city: mockListing.location.city,
              lat: mockListing.location.lat,
              lon: mockListing.location.lng,
            }
          : undefined,
      }
    : null);

  const pickupAddress = listing
    ? "location" in listing && listing.location
      ? getListingLocation(listing as VehicleListing).fullAddress
      : mockListing
        ? `${mockListing.location.address}, ${mockListing.location.city}`
        : ""
    : "";

  const mapUrl = listing ? getMapEmbedUrl(listing as VehicleListing) : null;

  const datesLabel = "Apr 10, 10:00 AM – 12, 12:00 PM";
  const days = 2;
  const subtotal = listing ? days * listing.pricePerDay : 0;
  const taxes = Math.round(subtotal * 0.2);
  const total = subtotal + taxes;

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto w-full max-w-2xl px-4 py-12">
        {/* Success header */}
        <div className="mb-10 text-center">
          <div className="mx-auto mb-4 flex size-16 items-center justify-center rounded-full bg-primary/10 text-primary">
            <Check className="size-8" strokeWidth={2.5} aria-hidden />
          </div>
          <h1 className="text-2xl font-bold text-zinc-900">Booking confirmed</h1>
          <p className="mt-2 text-muted-foreground">
            Your rental has been reserved. You&apos;ll receive a confirmation
            email shortly.
          </p>
          <p className="mt-4 text-sm font-mono font-medium tabular-nums text-zinc-600">
            Order reference: ORD-00001
          </p>
        </div>

        {listing ? (
          <>
            {/* Listing info */}
            <Card>
              <CardContent className="p-0">
                <div className="flex gap-4 p-4">
                  <div className="relative h-24 w-32 shrink-0 overflow-hidden rounded-lg bg-zinc-100">
                    <Image
                      src={listing.imageUrl}
                      alt={listing.title}
                      fill
                      className="object-cover"
                      sizes="128px"
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h2 className="font-semibold text-zinc-900">{listing.title}</h2>
                    <div className="mt-2 flex items-center gap-2 text-sm text-muted-foreground">
                      <Calendar className="size-4 shrink-0" aria-hidden />
                      <span>{datesLabel}</span>
                    </div>
                    <div className="mt-1 flex items-center gap-2 text-sm text-muted-foreground">
                      <MapPin className="size-4 shrink-0" aria-hidden />
                      <span>{pickupAddress}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Map */}
            {mapUrl && (
              <div className="mt-6">
                <h3 className="mb-3 text-lg font-semibold text-zinc-900">
                  Pickup location
                </h3>
                <div className="overflow-hidden rounded-lg border bg-zinc-100">
                  <div className="relative aspect-[21/9] w-full">
                    <iframe
                      title="Pickup location map"
                      src={mapUrl}
                      className="absolute inset-0 h-full w-full border-0"
                      allowFullScreen
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                    />
                  </div>
                  <p className="flex items-center gap-2 p-3 text-sm font-medium text-zinc-700">
                    <MapPin className="size-4 shrink-0 text-zinc-500" />
                    {pickupAddress}
                  </p>
                </div>
              </div>
            )}

            {/* Booking details */}
            <div className="mt-8">
              <h3 className="mb-3 text-lg font-semibold text-zinc-900">
                Booking details
              </h3>
              <Card>
                <CardContent className="space-y-3 p-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">
                      {days} days × ${listing.pricePerDay}/day
                    </span>
                    <span className="tabular-nums font-medium">
                      ${subtotal.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Taxes</span>
                    <span className="tabular-nums font-medium">
                      ${taxes.toLocaleString()}
                    </span>
                  </div>
                  <Separator />
                  <div className="flex justify-between font-semibold">
                    <span>Total</span>
                    <span className="tabular-nums">${total.toLocaleString()}</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </>
        ) : (
          <Card>
            <CardContent className="p-6 text-center">
              <p className="text-sm text-muted-foreground">
                Booking confirmed. View your rentals to see details.
              </p>
            </CardContent>
          </Card>
        )}

        {/* Actions */}
        <div className="mt-10 flex flex-col gap-3">
          <Button asChild className="min-h-[44px]">
            <Link href="/dashboard/buyer">View my rentals</Link>
          </Button>
          {listing && (
            <Button variant="outline" asChild className="min-h-[44px]">
              <Link href={`/listing/${listing.id}`}>View listing</Link>
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
