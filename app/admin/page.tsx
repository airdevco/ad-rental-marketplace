import Link from "next/link";
import { MOCK_LISTINGS } from "@/lib/mock-listings";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

// Mock rentals (bookings)
const MOCK_RENTALS = [
  { id: "b1", rentalId: "1", guestName: "Guest A", checkIn: "2025-03-15", checkOut: "2025-03-18" },
  { id: "b2", rentalId: "2", guestName: "Guest B", checkIn: "2025-02-01", checkOut: "2025-02-03" },
];

export const metadata = {
  title: "Admin",
  description: "Super admin: listings and rentals overview",
};

export default function AdminPage() {
  return (
    <div className="container mx-auto w-full max-w-[1400px] py-8">
      <h1 className="text-2xl font-bold">Admin</h1>
      <p className="mt-1 text-muted-foreground">
        Overview of all listings and rentals. Role guard is UI-only for now.
      </p>
      <div className="mt-8 grid gap-8 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Listings</CardTitle>
            <CardDescription>
              All rental listings in the marketplace.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {MOCK_LISTINGS.map((listing) => (
                <div
                  key={listing.id}
                  className="flex items-center justify-between rounded-lg border p-3"
                >
                  <div>
                    <p className="font-medium">{listing.title}</p>
                    <p className="text-sm text-muted-foreground">
                      {listing.location.city} · ${listing.pricePerNight}/night
                    </p>
                  </div>
                  <Button variant="outline" size="sm" asChild>
                    <Link href={`/listing/${listing.id}`}>View</Link>
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Rentals</CardTitle>
            <CardDescription>
              All bookings (rentals).
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {MOCK_RENTALS.map((r) => (
                <div
                  key={r.id}
                  className="flex items-center justify-between rounded-lg border p-3"
                >
                  <div>
                    <p className="font-medium">{r.guestName}</p>
                    <p className="text-sm text-muted-foreground">
                      {r.checkIn} – {r.checkOut} · Listing {r.rentalId}
                    </p>
                  </div>
                  <Button variant="outline" size="sm" asChild>
                    <Link href={`/listing/${r.rentalId}`}>View listing</Link>
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
