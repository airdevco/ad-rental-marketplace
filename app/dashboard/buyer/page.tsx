import Link from "next/link";
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

// Mock upcoming and past rentals
const upcomingRentals = [
  { id: "1", title: "Downtown loft", checkIn: "2025-03-15", checkOut: "2025-03-18", rentalId: "1" },
];
const pastRentals = [
  { id: "2", title: "Cozy cabin", checkIn: "2025-01-10", checkOut: "2025-01-12", rentalId: "2", hasReviewed: false },
];

export const metadata = {
  title: "My rentals",
  description: "View and manage your upcoming and past rentals",
};

export default function BuyerDashboardPage() {
  return (
    <div className="container mx-auto w-full max-w-7xl py-8">
      <h1 className="text-2xl font-bold">My rentals</h1>
      <p className="mt-1 text-muted-foreground">
        Upcoming trips and past bookings.
      </p>
      <Tabs defaultValue="upcoming" className="mt-8">
        <TabsList>
          <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
          <TabsTrigger value="past">Past</TabsTrigger>
        </TabsList>
        <TabsContent value="upcoming" className="mt-6">
          {upcomingRentals.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <p className="text-muted-foreground">No upcoming rentals.</p>
                <Button className="mt-4" asChild>
                  <Link href="/search">Search rentals</Link>
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {upcomingRentals.map((r) => (
                <Card key={r.id}>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">{r.title}</CardTitle>
                    <CardDescription>
                      {r.checkIn} – {r.checkOut}
                    </CardDescription>
                  </CardHeader>
                  <CardFooter className="flex gap-2">
                    <Button size="sm" asChild>
                      <Link href={`/listing/${r.rentalId}`}>View details</Link>
                    </Button>
                    <Button variant="outline" size="sm" asChild>
                      <Link href="/messages">Message host</Link>
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
        <TabsContent value="past" className="mt-6">
          {pastRentals.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <p className="text-muted-foreground">No past rentals yet.</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {pastRentals.map((r) => (
                <Card key={r.id}>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">{r.title}</CardTitle>
                    <CardDescription>
                      {r.checkIn} – {r.checkOut}
                    </CardDescription>
                  </CardHeader>
                  <CardFooter className="flex gap-2">
                    <Button size="sm" variant="outline" asChild>
                      <Link href={`/listing/${r.rentalId}`}>View listing</Link>
                    </Button>
                    {"hasReviewed" in r && !r.hasReviewed && (
                      <Button size="sm">Leave review</Button>
                    )}
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
