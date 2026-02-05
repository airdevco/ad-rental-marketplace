import Link from "next/link";
import { MOCK_LISTINGS } from "@/lib/mock-listings";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { RemoveListingDialog } from "@/components/dashboard/remove-listing-dialog";

// In a real app, filter by current user's id
const myListings = MOCK_LISTINGS.filter((l) => l.listerId === "u1");

export const metadata = {
  title: "Seller dashboard",
  description: "Manage your rental listings and payouts",
};

export default function SellerDashboardPage() {
  return (
    <div className="container mx-auto w-full max-w-7xl py-8">
      <h1 className="text-2xl font-bold">Seller dashboard</h1>
      <p className="mt-1 text-muted-foreground">
        Manage your listings, profile, and payouts.
      </p>
      <Tabs defaultValue="listings" className="mt-8">
        <TabsList className="grid w-full max-w-md grid-cols-3 sm:max-w-none sm:w-auto">
          <TabsTrigger value="listings">Listings</TabsTrigger>
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="payouts">Payouts</TabsTrigger>
        </TabsList>
        <TabsContent value="listings" className="mt-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">My listings</h2>
            <Button asChild>Add listing</Button>
          </div>
          {myListings.length === 0 ? (
            <Card className="mt-4">
              <CardContent className="py-12 text-center">
                <p className="text-muted-foreground">You don&apos;t have any listings yet.</p>
                <Button className="mt-4" asChild>Add your first listing</Button>
              </CardContent>
            </Card>
          ) : (
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              {myListings.map((listing) => (
                <Card key={listing.id}>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">{listing.title}</CardTitle>
                    <CardDescription>{listing.location.city}</CardDescription>
                  </CardHeader>
                  <CardContent className="pb-2">
                    <p className="font-semibold tabular-nums">${listing.pricePerNight} per night</p>
                  </CardContent>
                  <CardFooter className="flex gap-2">
                    <Button variant="outline" size="sm" asChild>
                      <Link href={`/rental/${listing.id}`}>View</Link>
                    </Button>
                    <RemoveListingDialog listingTitle={listing.title}>
                      <Button variant="destructive" size="sm">
                        Remove
                      </Button>
                    </RemoveListingDialog>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
        <TabsContent value="profile" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Public profile</CardTitle>
              <CardDescription>
                This is what renters see when they view your profile.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Profile form and settings will appear here. Link to your user profile page.
              </p>
              <Button variant="outline" className="mt-4" asChild>
                <Link href="/user/u1">View my profile</Link>
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="payouts" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Stripe payouts</CardTitle>
              <CardDescription>
                Connect Stripe to receive payments from your rentals.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Stripe Connect onboarding and payout details will appear here.
              </p>
              <Button className="mt-4">Connect Stripe</Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
