import Link from "next/link";
import { notFound } from "next/navigation";
import { MOCK_LISTINGS } from "@/lib/mock-listings";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";

type Props = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Props) {
  const { id } = await params;
  const listing = MOCK_LISTINGS.find((l) => l.id === id);
  if (!listing) return { title: "Rental not found" };
  return {
    title: listing.title,
    description: listing.description,
  };
}

export default async function RentalPage({ params }: Props) {
  const { id } = await params;
  const listing = MOCK_LISTINGS.find((l) => l.id === id);
  if (!listing) notFound();

  const { title, description, pricePerNight, location, listerId, listerName, badge, rating, reviewCount } = listing;

  return (
    <div className="container mx-auto w-full max-w-[1400px] py-8">
      <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <div className="aspect-video w-full overflow-hidden rounded-xl bg-muted">
            <div className="flex h-full items-center justify-center text-muted-foreground">
              Image placeholder
            </div>
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-2xl font-bold md:text-3xl">{title}</h1>
              {badge && (
                <Badge variant={badge === "New" ? "secondary" : "default"}>{badge}</Badge>
              )}
            </div>
            <p className="mt-2 text-muted-foreground">{location.city} · {location.address}</p>
          </div>
          <Separator />
          <div>
            <h2 className="text-lg font-semibold">About this rental</h2>
            <p className="mt-2 text-muted-foreground">{description}</p>
          </div>
          {rating != null && (
            <div>
              <h2 className="text-lg font-semibold">Reviews</h2>
              <p className="mt-2">
                <span className="font-medium tabular-nums">{rating}</span>
                {reviewCount != null && (
                  <span className="text-muted-foreground"> ({reviewCount} reviews)</span>
                )}
              </p>
              <p className="mt-2 text-sm text-muted-foreground">
                Reviews and availability calendar will appear here.
              </p>
            </div>
          )}
        </div>
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold tabular-nums">${pricePerNight}</span>
                <span className="text-muted-foreground">per night</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Status: <span className="font-medium text-foreground">Available</span>
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button asChild className="w-full min-h-[44px]">
                <Link href={`/checkout?rentalId=${id}`}>Book now</Link>
              </Button>
              <p className="text-center text-sm text-muted-foreground">
                You won&apos;t be charged yet.
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Listed by</CardTitle>
            </CardHeader>
            <CardContent>
              <Link
                href={`/user/${listerId}`}
                className="flex items-center gap-3 focus-visible:outline focus-visible:ring-2 focus-visible:ring-ring focus-visible:rounded-md hover:opacity-90"
              >
                <Avatar className="size-12">
                  <AvatarFallback>{listerName.slice(0, 1)}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">{listerName}</p>
                  <p className="text-sm text-muted-foreground">View profile</p>
                </div>
              </Link>
              <Button variant="outline" size="sm" className="mt-4 w-full min-h-[44px]" asChild>
                <Link href={`/messages?with=${listerId}`}>Message</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
