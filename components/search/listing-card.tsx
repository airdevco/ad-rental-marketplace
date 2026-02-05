import Link from "next/link";
import type { Listing } from "@/lib/mock-listings";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

type ListingCardProps = {
  listing: Listing;
};

export function ListingCard({ listing }: ListingCardProps) {
  const { id, title, description, pricePerNight, location, badge, rating, reviewCount } =
    listing;

  return (
    <Card data-slot="card" className="transition-shadow hover:shadow-md">
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between gap-2">
          <CardTitle className="text-base">
            <Link
              href={`/rental/${id}`}
              className="focus-visible:outline focus-visible:ring-2 focus-visible:ring-ring focus-visible:rounded-md hover:underline"
            >
              {title}
            </Link>
          </CardTitle>
          {badge && (
            <Badge variant={badge === "New" ? "secondary" : "default"}>{badge}</Badge>
          )}
        </div>
        <CardDescription>{description}</CardDescription>
        <p className="text-sm text-muted-foreground">{location.city}</p>
      </CardHeader>
      <CardContent className="pb-2">
        <p className="text-lg font-semibold tabular-nums">${pricePerNight}</p>
        <p className="text-xs text-muted-foreground">per night</p>
        {rating != null && (
          <p className="mt-1 text-sm">
            <span className="font-medium">{rating}</span>
            {reviewCount != null && (
              <span className="text-muted-foreground"> ({reviewCount} reviews)</span>
            )}
          </p>
        )}
      </CardContent>
      <CardFooter>
        <Button asChild size="sm" className="w-full min-h-[44px]">
          <Link href={`/rental/${id}`}>View details</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
