import { Suspense } from "react";
import { SearchPageClient } from "@/components/search/search-page-client";
import { Skeleton } from "@/components/ui/skeleton";

export const metadata = {
  title: "Search rentals",
  description: "Search and filter rental listings",
};

function SearchPageFallback() {
  return (
    <div className="flex h-[calc(100vh-4rem)] flex-col">
      <div className="h-16 shrink-0 border-b bg-muted/50 animate-pulse" />
      <div className="flex flex-1 min-h-0">
        <div className="h-full w-full max-w-md border-r bg-muted/30 animate-pulse" />
        <div className="hidden flex-1 md:block bg-muted/50 animate-pulse" />
      </div>
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<SearchPageFallback />}>
      <SearchPageClient />
    </Suspense>
  );
}
