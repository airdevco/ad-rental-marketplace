import Link from "next/link";
import { notFound } from "next/navigation";
import { MOCK_LISTINGS } from "@/lib/mock-listings";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const MOCK_USERS: Record<string, { name: string; bio: string }> = {
  u1: { name: "Alex", bio: "Host in San Francisco. I love sharing my space with travelers." },
  u2: { name: "Jordan", bio: "Lake Tahoe local. Cabin and outdoor gear rentals." },
  u3: { name: "Sam", bio: "Beach and city rentals. Family-friendly spots." },
};

type Props = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Props) {
  const { id } = await params;
  const user = MOCK_USERS[id];
  if (!user) return { title: "User not found" };
  return { title: user.name };
}

export default async function UserProfilePage({ params }: Props) {
  const { id } = await params;
  const user = MOCK_USERS[id];
  if (!user) notFound();

  const listings = MOCK_LISTINGS.filter((l) => l.listerId === id);

  return (
    <div className="container mx-auto w-full max-w-6xl py-8">
      <div className="flex flex-col items-center gap-4 text-center sm:flex-row sm:items-start sm:text-left">
        <Avatar className="size-20">
          <AvatarFallback className="text-2xl">{user.name.slice(0, 1)}</AvatarFallback>
        </Avatar>
        <div>
          <h1 className="text-2xl font-bold">{user.name}</h1>
          {user.bio && <p className="mt-1 text-muted-foreground">{user.bio}</p>}
        </div>
      </div>
      <section className="mt-12" aria-labelledby="listings-heading">
        <h2 id="listings-heading" className="text-xl font-bold">
          Listings
        </h2>
        {listings.length === 0 ? (
          <Card className="mt-4">
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground">No listings yet.</p>
            </CardContent>
          </Card>
        ) : (
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            {listings.map((listing) => (
              <Card key={listing.id} className="transition-shadow hover:shadow-md">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">
                    <Link
                      href={`/listing/${listing.id}`}
                      className="focus-visible:outline focus-visible:ring-2 focus-visible:ring-ring focus-visible:rounded-md hover:underline"
                    >
                      {listing.title}
                    </Link>
                  </CardTitle>
                  <CardDescription>{listing.location.city}</CardDescription>
                </CardHeader>
                <CardContent className="pb-2">
                  <p className="font-semibold tabular-nums">${listing.pricePerNight} per night</p>
                </CardContent>
                <CardFooter>
                  <Button asChild size="sm" className="w-full min-h-[44px]">
                    <Link href={`/listing/${listing.id}`}>View details</Link>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </section>
      <section className="mt-12" aria-labelledby="reviews-heading">
        <h2 id="reviews-heading" className="text-xl font-bold">
          Reviews
        </h2>
        <Card className="mt-4">
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground">No reviews yet.</p>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
