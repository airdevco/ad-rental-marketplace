"use client";

import { useEffect } from "react";
import { SearchFilterBar } from "@/components/search/search-filter-bar";
import { VehicleSearchResults } from "@/components/search/vehicle-search-results";
import { SearchMapPanel } from "@/components/search/search-map-panel";
import { useQueryState } from "nuqs";

export function SearchPageClient() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const [view] = useQueryState("view", {
    defaultValue: "map",
    parse: (v) => (v === "grid" ? "grid" : "map"),
    serialize: (v) => v,
  });

  const isGrid = view === "grid";

  return (
    <div className="flex min-h-[calc(100vh-4rem)] flex-col">
      {/* Filter bar sticky at top (z-40); content below can scroll so footer appears at end of list */}
      <SearchFilterBar />

      {/* Main content - grows with list so footer shows when user scrolls to end */}
      <div className="relative flex min-h-0 flex-1 flex-col">
        {isGrid ? (
          <div className="w-full overflow-auto bg-background">
            <div className="w-full px-4 py-6 sm:px-6">
              <VehicleSearchResults />
            </div>
          </div>
        ) : (
          <SearchMapPanel />
        )}
      </div>
    </div>
  );
}
