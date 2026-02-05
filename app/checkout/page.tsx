import Link from "next/link";
import { Button } from "@/components/ui/button";
import { CheckoutForm } from "@/components/checkout/checkout-form";
import { MOCK_LISTINGS } from "@/lib/mock-listings";
import { getListingById } from "@/lib/vehicle-listings";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

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
  const listing = vehicleListing
    ? { id: vehicleListing.id, title: vehicleListing.title, location: vehicleListing.location ?? { city: "—" }, pricePerNight: vehicleListing.pricePerDay }
    : mockListing;

  return (
    <div className="container mx-auto w-full max-w-6xl py-8">
      <h1 className="text-2xl font-bold">Checkout</h1>
      <p className="mt-1 text-muted-foreground">
        Confirm your booking details and payment.
      </p>
      <div className="mt-8 grid gap-8 lg:grid-cols-5">
        <div className="lg:col-span-3">
          <CheckoutForm rentalId={id ?? null} />
        </div>
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Booking summary</CardTitle>
              <CardDescription>Your rental details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {listing ? (
                <>
                  <div>
                    <p className="font-medium">{listing.title}</p>
                    <p className="text-sm text-muted-foreground">{listing.location?.city ?? "—"}</p>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Price per day</span>
                    <span className="tabular-nums">${listing.pricePerNight}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Nights</span>
                    <span className="tabular-nums">—</span>
                  </div>
                  <div className="border-t pt-4 flex justify-between font-medium">
                    <span>Total</span>
                    <span className="tabular-nums">—</span>
                  </div>
                </>
              ) : (
                <p className="text-muted-foreground">
                  Select a rental from the search or a listing page to see the summary here.
                </p>
              )}
              {listing && (
                <Button variant="outline" size="sm" asChild className="w-full">
                  <Link href={`/listing/${listing.id}`}>Change rental</Link>
                </Button>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
