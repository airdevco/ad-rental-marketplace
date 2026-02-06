"use client";

import { SearchFilterBar } from "@/components/search/search-filter-bar";
import { VehicleSearchResults } from "@/components/search/vehicle-search-results";
import { SearchMapPanel } from "@/components/search/search-map-panel";
import { useQueryState } from "nuqs";

export function SearchPageClient() {
  const [view] = useQueryState("view", {
    defaultValue: "map",
    parse: (v) => (v === "grid" ? "grid" : "map"),
    serialize: (v) => v,
  });

  const isGrid = view === "grid";

  return (
    <div className="flex min-h-[calc(100vh-4rem)] flex-col">
      {/* Floating filter bar - sticky below header */}
      <SearchFilterBar />

      {/* Main content */}
      <div className="relative flex min-h-0 flex-1">
        {isGrid ? (
          /* Grid view: no map, full-width tiles (same as index page) */
          <div className="w-full overflow-auto bg-background">
            <div className="w-full px-4 py-6 sm:px-6">
              <VehicleSearchResults />
            </div>
          </div>
        ) : (
          /* Map view: full map */
          <div className="absolute inset-0 flex flex-col">
            <SearchMapPanel className="h-full" />
          </div>
        )}
      </div>
    </div>
  );
}
