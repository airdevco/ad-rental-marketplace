import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Users, Briefcase, DoorClosed } from "lucide-react";
import { getListingById } from "@/lib/vehicle-listings";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";

type Props = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Props) {
  const { id } = await params;
  const listing = getListingById(id);
  if (!listing) return { title: "Listing not found" };
  return {
    title: listing.title,
    description: listing.description ?? `Rent ${listing.title} - $${listing.pricePerDay}/day`,
  };
}

export default async function ListingPage({ params }: Props) {
  const { id } = await params;
  const listing = getListingById(id);
  if (!listing) notFound();

  const {
    title,
    description,
    imageUrl,
    seats,
    luggage,
    doors,
    pricePerDay,
    location,
    hostId,
    hostName,
    year,
    transmission,
  } = listing;

  return (
    <div className="container mx-auto w-full max-w-6xl py-8">
      <div className="grid gap-8 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <div className="aspect-[16/10] w-full overflow-hidden rounded-xl bg-zinc-100">
            <Image
              src={imageUrl}
              alt={title}
              width={800}
              height={500}
              className="size-full object-cover"
            />
          </div>
          <div>
            <h1 className="text-2xl font-bold md:text-3xl">{title}</h1>
            {location && (
              <p className="mt-1 text-muted-foreground">
                {location.city} · {location.address}
              </p>
            )}
          </div>
          <Separator />
          <div className="flex flex-wrap gap-6 text-sm">
            <span className="flex items-center gap-2">
              <Users className="size-5 text-zinc-500" />
              <span className="font-medium">{seats} seats</span>
            </span>
            <span className="flex items-center gap-2">
              <Briefcase className="size-5 text-zinc-500" />
              <span className="font-medium">{luggage} bags</span>
            </span>
            <span className="flex items-center gap-2">
              <DoorClosed className="size-5 text-zinc-500" />
              <span className="font-medium">{doors} doors</span>
            </span>
            {year && (
              <span className="font-medium">{year}</span>
            )}
            {transmission && (
              <span className="font-medium">{transmission}</span>
            )}
          </div>
          <Separator />
          <div>
            <h2 className="text-lg font-semibold">About this vehicle</h2>
            <p className="mt-2 text-muted-foreground">{description ?? "No description available."}</p>
          </div>
        </div>
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold tabular-nums">${pricePerDay}</span>
                <span className="text-muted-foreground">per day</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Status: <span className="font-medium text-foreground">Available</span>
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button asChild className="min-h-11 w-full">
                <Link href={`/checkout?listingId=${id}`}>Book now</Link>
              </Button>
              <p className="text-center text-sm text-muted-foreground">
                You won&apos;t be charged yet.
              </p>
            </CardContent>
          </Card>
          {hostName && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Listed by</CardTitle>
              </CardHeader>
              <CardContent>
                <Link
                  href={hostId ? `/user/${hostId}` : "#"}
                  className="flex items-center gap-3 focus-visible:rounded-md focus-visible:outline focus-visible:ring-2 focus-visible:ring-ring hover:opacity-90"
                >
                  <Avatar className="size-12">
                    <AvatarFallback>{hostName.slice(0, 1)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{hostName}</p>
                    <p className="text-sm text-muted-foreground">View profile</p>
                  </div>
                </Link>
                <Button asChild className="mt-4 min-h-11 w-full" variant="outline" size="sm">
                  <Link href={`/messages?with=${hostId ?? ""}`}>Message</Link>
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
