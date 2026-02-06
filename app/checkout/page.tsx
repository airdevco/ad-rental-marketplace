import Link from "next/link";
import Image from "next/image";
import { CalendarIcon, MapPin } from "lucide-react";
import { CheckoutForm } from "@/components/checkout/checkout-form";
import { MOCK_LISTINGS } from "@/lib/mock-listings";
import { getListingById, getListingLocation } from "@/lib/vehicle-listings";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import type { VehicleListing } from "@/lib/vehicle-listings";

type Props = { searchParams: Promise<{ rentalId?: string; listingId?: string }> };

export const metadata = {
  title: "Checkout",
  description: "Confirm your booking and payment",
};

export default async function CheckoutPage({ searchParams }: Props) {
  const { rentalId, listingId } = await searchParams;
  const id = listingId ?? rentalId;
  const vehicleListing = id ? getListingById(id) : null;
  const mockListing = rentalId ? MOCK_LISTINGS.find((l) => l.id === rentalId) : null;

  const listing = vehicleListing ?? (mockListing ? {
    id: mockListing.id,
    title: mockListing.title,
    subtitle: "",
    imageUrl: mockListing.imageUrl,
    seats: 0,
    luggage: 0,
    doors: 0,
    pricePerDay: mockListing.pricePerNight,
    category: "economy" as const,
    location: mockListing.location ? { address: mockListing.location.address, city: mockListing.location.city } : undefined,
  } : null);

  const subtotal = listing ? Math.round(listing.pricePerDay * 90) : 0;
  const salesTax = Math.round(subtotal * 0.2);
  const monthlyTotal = Math.round((subtotal + salesTax) / 3);
  const tripTotal = subtotal + salesTax;

  return (
    <div className="min-h-screen bg-background">
      <div className="border-b border-zinc-200 bg-white">
        <div className="container mx-auto flex h-14 w-full max-w-[1400px] items-center justify-between px-4">
          <Link
            href="/"
            className="text-sm font-medium text-zinc-900 focus-visible:outline focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:rounded"
            aria-label="Rentals home"
          >
            RENTALS
          </Link>
          {listing && (
            <Link
              href={`/listing/${listing.id}`}
              className="text-sm font-medium text-primary hover:underline"
            >
              Back to listing
            </Link>
          )}
        </div>
      </div>

      <div className="container mx-auto w-full max-w-[1400px] px-4 py-8">
        <h1 className="text-2xl font-bold text-zinc-900">Checkout</h1>

        <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_380px] lg:gap-12">
          <div className="min-w-0">
            <CheckoutForm rentalId={id ?? null} />
          </div>

          <div className="lg:sticky lg:top-24 lg:self-start">
            <Card className="overflow-hidden">
              <CardContent className="p-0">
                {listing ? (
                  <>
                    <div className="flex gap-4 p-4">
                      <div className="relative h-20 w-28 shrink-0 overflow-hidden rounded-lg bg-zinc-100">
                        <Image
                          src={listing.imageUrl}
                          alt={listing.title}
                          fill
                          className="object-cover"
                          sizes="112px"
                        />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="font-semibold text-zinc-900">{listing.title}</p>
                        <p className="text-sm text-muted-foreground">(0 trips)</p>
                        <div className="mt-2 flex flex-col gap-1 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1.5">
                            <CalendarIcon className="size-4 shrink-0" />
                            Wed, Feb 18 at 10:00 AM – Mon, May 18 at 10:00 AM
                          </span>
                          <span className="flex items-center gap-1.5">
                            <MapPin className="size-4 shrink-0" />
                            {vehicleListing
                              ? getListingLocation(listing as VehicleListing).fullAddress
                              : mockListing?.location
                                ? [mockListing.location.address, mockListing.location.city].filter(Boolean).join(", ")
                                : "—"}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="border-t px-4 py-4 space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Subtotal</span>
                        <span className="tabular-nums font-medium">${subtotal.toLocaleString()}/mo</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <Link href="#" className="text-muted-foreground underline hover:text-foreground">
                          Sales tax
                        </Link>
                        <span className="tabular-nums font-medium">${salesTax.toLocaleString()}/mo</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <Link href="#" className="text-muted-foreground underline hover:text-foreground">
                          Distance included
                        </Link>
                        <span className="tabular-nums font-medium text-green-600">FREE</span>
                      </div>
                      <div className="flex justify-between pt-2 text-sm font-semibold">
                        <span>Monthly total</span>
                        <span className="tabular-nums">${monthlyTotal.toLocaleString()}/mo</span>
                      </div>
                      <div className="flex justify-between pt-1 text-base font-semibold">
                        <span>Trip total</span>
                        <span className="tabular-nums">${tripTotal.toLocaleString()}</span>
                      </div>
                    </div>
                    <div className="border-t px-4 pb-4">
                      <Input
                        placeholder="Promo code"
                        className="h-9 border-0 border-b border-input rounded-none px-0 shadow-none focus-visible:ring-0"
                      />
                    </div>
                  </>
                ) : (
                  <div className="p-6 text-center">
                    <p className="text-sm text-muted-foreground">
                      Select a rental from the search or a listing page to see the summary here.
                    </p>
                    <Link
                      href="/search"
                      className="mt-3 inline-block text-sm font-medium text-primary hover:underline"
                    >
                      Browse listings
                    </Link>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
