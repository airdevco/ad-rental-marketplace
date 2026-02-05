import { Suspense } from "react";
import { MapSearchClient } from "@/components/search/map-search-client";

export const metadata = {
  title: "Map search",
  description: "Find rentals on the map",
};

export default function SearchMapPage() {
  return (
    <div className="flex h-[calc(100vh-3.5rem)] flex-col">
      <div className="border-b px-4 py-3 sm:px-6">
        <h1 className="text-xl font-bold">Map search</h1>
        <p className="text-sm text-muted-foreground">
          Click a pin to view listing details. Filters and sort are shared with list search.
        </p>
      </div>
      <div className="flex-1 min-h-0">
        <Suspense fallback={<div className="h-full bg-muted animate-pulse" />}>
          <MapSearchClient />
        </Suspense>
      </div>
    </div>
  );
}
