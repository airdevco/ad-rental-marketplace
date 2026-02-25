import Link from "next/link";
import { CheckoutForm } from "@/components/checkout/checkout-form";
import { CheckoutSummaryCard } from "@/components/checkout/checkout-summary-card";
import { MOCK_LISTINGS } from "@/lib/mock-listings";
import { getListingById, getDummyRating, getListingReviewCount } from "@/lib/vehicle-listings";
import type { VehicleListing } from "@/lib/vehicle-listings";
import { Button } from "@/components/ui/button";

type Props = { searchParams: Promise<{ rentalId?: string; listingId?: string }> };

export const metadata = {
  title: "Checkout",
  description: "Confirm your stay and payment",
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

  const rating = listing && id ? getDummyRating(id) : 0;
  const reviewCount = listing && id ? getListingReviewCount(id) : 0;

  const days = 2;
  const subtotal = listing ? days * listing.pricePerDay : 0;
  const taxes = Math.round(subtotal * 0.2);
  const total = subtotal + taxes;

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto w-full max-w-[860px] px-4 py-8">
        <h1 className="text-2xl font-black tracking-tight text-zinc-900">Checkout</h1>
        <p className="mt-0.5 text-sm text-muted-foreground">Confirm your stay and payment</p>

        <div className="mt-8 grid gap-10 lg:grid-cols-[1fr_1fr] lg:gap-12">
          <div className="min-w-0 order-2 lg:order-1">
            <CheckoutForm rentalId={id ?? null} />
          </div>

          <div className="order-1 lg:order-2 lg:sticky lg:top-24 lg:self-start">
            <CheckoutSummaryCard
              listing={
                listing
                  ? {
                      id: listing.id,
                      title: listing.title,
                      imageUrl: listing.imageUrl,
                      pricePerDay: listing.pricePerDay,
                      rating,
                      reviewCount,
                    }
                  : null
              }
              listingId={id ?? null}
            />
          </div>
        </div>

        {/* Sticky bottom bar on small viewports (like listing page) */}
        {listing && (
          <>
            <div className="fixed bottom-0 left-0 right-0 z-50 lg:hidden border-t bg-white shadow-[0_-1px_3px_rgba(0,0,0,0.05)]">
              <div className="mx-auto flex max-w-[860px] items-center justify-between gap-4 px-4 py-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))]">
                <div>
                  <p className="text-sm text-muted-foreground">Total</p>
                  <p className="text-xl font-bold tabular-nums text-zinc-900">
                    ${total.toLocaleString()}
                  </p>
                </div>
                <Button asChild className="h-12 shrink-0 rounded-[5px] bg-primary px-6 font-medium shadow-none hover:bg-primary/90">
                  <Link href={`/order/confirmation?rentalId=${id}`}>
                    Reserve
                  </Link>
                </Button>
              </div>
            </div>
            <div className="h-20 lg:hidden" aria-hidden />
          </>
        )}
      </div>
    </div>
  );
}
