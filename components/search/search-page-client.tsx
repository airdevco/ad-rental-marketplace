"use client";

import { useEffect } from "react";
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

  // Scroll to top whenever the view switches
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [view]);

  return (
    <>
      <SearchFilterBar />
      {/* Spacer so content starts below the fixed filter bar (~56px) */}
      <div className="h-14 shrink-0" aria-hidden />
      {isGrid ? (
        <div className="w-full px-4 py-6 sm:px-6">
          <VehicleSearchResults />
        </div>
      ) : (
        <SearchMapPanel />
      )}
    </>
  );
}
