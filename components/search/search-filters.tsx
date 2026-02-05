"use client";

import { useQueryState } from "nuqs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { FilterIcon } from "lucide-react";

const SORT_OPTIONS = [
  { value: "relevance", label: "Relevance" },
  { value: "price-asc", label: "Price: low to high" },
  { value: "price-desc", label: "Price: high to low" },
  { value: "newest", label: "Newest" },
];

export function SearchFilters() {
  const [query, setQuery] = useQueryState("q", { defaultValue: "" });
  const [sort, setSort] = useQueryState("sort", { defaultValue: "relevance" });
  const [minPrice, setMinPrice] = useQueryState("minPrice", { defaultValue: "" });
  const [maxPrice, setMaxPrice] = useQueryState("maxPrice", { defaultValue: "" });

  return (
    <div className="flex w-full flex-wrap items-center gap-4">
      <div className="flex-1 min-w-[200px] max-w-2xl">
        <Label htmlFor="search-q" className="sr-only">
          Search rentals
        </Label>
        <Input
          id="search-q"
          type="search"
          placeholder="Search by name or location…"
          value={query}
          onChange={(e) => setQuery(e.target.value || null)}
          className="min-h-[44px] text-base md:text-sm"
          autoComplete="off"
        />
      </div>
      <div className="flex items-center gap-2">
        <Label htmlFor="search-sort" className="sr-only">
          Sort by
        </Label>
        <Select value={sort} onValueChange={(v) => setSort(v)}>
          <SelectTrigger id="search-sort" className="w-[180px] min-h-[44px]">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            {SORT_OPTIONS.map((opt) => (
              <SelectItem key={opt.value} value={opt.value}>
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon" className="shrink-0 min-h-[44px] min-w-[44px]" aria-label="Open filters">
              <FilterIcon className="size-4" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-full max-w-sm">
            <h2 className="text-lg font-semibold mb-4">Filters</h2>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="filter-min">Min price (per night)</Label>
                <Input
                  id="filter-min"
                  type="number"
                  min={0}
                  placeholder="0"
                  value={minPrice}
                  onChange={(e) => setMinPrice(e.target.value || null)}
                  className="min-h-[44px] text-base"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="filter-max">Max price (per night)</Label>
                <Input
                  id="filter-max"
                  type="number"
                  min={0}
                  placeholder="Any"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value || null)}
                  className="min-h-[44px] text-base"
                />
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </div>
  );
}
