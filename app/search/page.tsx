import { Suspense } from "react";
import { SearchFilters } from "@/components/search/search-filters";
import { SearchResults } from "@/components/search/search-results";
import { Skeleton } from "@/components/ui/skeleton";

export const metadata = {
  title: "Search rentals",
  description: "Search and filter rental listings",
};

function SearchResultsFallback() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 6 }).map((_, i) => (
        <Skeleton key={i} className="h-[280px] rounded-xl" />
      ))}
    </div>
  );
}

export default function SearchPage() {
  return (
    <div className="container mx-auto w-full max-w-7xl py-8">
      <h1 className="text-2xl font-bold md:text-3xl">Search rentals</h1>
      <p className="mt-1 text-muted-foreground">
        Use filters and sort to find the right rental.
      </p>
      <div className="mt-6">
        <Suspense fallback={<div className="h-10 w-full max-w-md rounded-md bg-muted animate-pulse" />}>
          <SearchFilters />
        </Suspense>
      </div>
      <div className="mt-8">
        <Suspense fallback={<SearchResultsFallback />}>
          <SearchResults />
        </Suspense>
      </div>
    </div>
  );
}
