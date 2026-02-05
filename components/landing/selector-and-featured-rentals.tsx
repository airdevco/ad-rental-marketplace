"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { VehicleTypeSelector, VEHICLE_TITLE_MAP } from "@/components/landing/vehicle-type-selector";

const featuredListings = [
  { id: "1", title: "Downtown loft", description: "Spacious loft, 2 guests", price: "$120", badge: "Popular" },
  { id: "2", title: "Cozy cabin", description: "Lake view, 4 guests", price: "$95", badge: "New" },
  { id: "3", title: "City studio", description: "Central location, 2 guests", price: "$85", badge: null },
];

export function SelectorAndFeaturedRentals() {
  const [selectedVehicle, setSelectedVehicle] = useState("all");
  const title = VEHICLE_TITLE_MAP[selectedVehicle] ?? "All cars";

  return (
    <div className="space-y-4">
      <div className="flex justify-center pt-6">
        <VehicleTypeSelector value={selectedVehicle} onChange={setSelectedVehicle} />
      </div>
      <section className="w-full py-16 md:py-20" aria-labelledby="featured-heading">
        <div className="w-full">
          <h2 id="featured-heading" className="text-2xl font-bold md:text-3xl">
            {title}
          </h2>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {featuredListings.map(({ id, title: listingTitle, description, price, badge }) => (
              <Card key={id} className="transition-shadow hover:shadow-md">
                <CardHeader className="pb-2">
                  <div className="flex items-start justify-between gap-2">
                    <CardTitle className="text-base">
                      <Link
                        href={`/rental/${id}`}
                        className="focus-visible:outline focus-visible:ring-2 focus-visible:ring-ring focus-visible:rounded-md hover:underline"
                      >
                        {listingTitle}
                      </Link>
                    </CardTitle>
                    {badge && (
                      <Badge variant={badge === "New" ? "secondary" : "default"}>{badge}</Badge>
                    )}
                  </div>
                  <CardDescription>{description}</CardDescription>
                </CardHeader>
                <CardContent className="pb-2">
                  <p className="text-lg font-semibold tabular-nums">{price}</p>
                  <p className="text-xs text-muted-foreground">per night</p>
                </CardContent>
                <CardFooter>
                  <Button asChild size="sm" className="w-full min-h-[44px]">
                    <Link href={`/rental/${id}`}>View details</Link>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
          <div className="mt-8 text-center">
            <Button variant="outline" asChild>
              <Link href="/search">View all rentals</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
