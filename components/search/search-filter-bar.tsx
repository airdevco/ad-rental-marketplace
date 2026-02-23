"use client";

import { createParser, useQueryState } from "nuqs";
import { useEffect, useState, useRef } from "react";
import { LayoutGrid, Map, FilterIcon } from "lucide-react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import type { VehicleCategory } from "@/lib/vehicle-listings";
import { AllFiltersSheet } from "@/components/search/all-filters-sheet";

const PRICE_OPTIONS = [
  { value: "", label: "Price" },
  { value: "0-50", label: "Under $50" },
  { value: "50-100", label: "$50 – $100" },
  { value: "100-150", label: "$100 – $150" },
  { value: "150-250", label: "$150 – $250" },
  { value: "250+", label: "$250+" },
] as const;

const BEDROOMS_OPTIONS = [
  { value: "1", label: "1+" },
  { value: "2", label: "2+" },
  { value: "3", label: "3+" },
  { value: "4", label: "4+" },
  { value: "5", label: "5+" },
] as const;

type ListingFilterShape = {
  id: string;
  title: string;
  pricePerDay: number;
  seats: number;
  category?: VehicleCategory;
};

export function getFilteredListings<T extends ListingFilterShape>(
  listings: T[],
  opts: {
    priceRange?: string;
    minPrice?: string;
    maxPrice?: string;
    seatsMin?: string;
    categories?: VehicleCategory[];
    sort?: string;
  }
): T[] {
  let result = [...listings] as T[];
  const { priceRange, minPrice, maxPrice, seatsMin, categories, sort } = opts;

  // Category filter (multiselect)
  if (categories && categories.length > 0) {
    result = result.filter((l) => l.category && categories.includes(l.category));
  }

  // Price filter
  if (priceRange) {
    const [lo, hi] = priceRange.split("-").map(Number);
    if (priceRange === "250+") {
      result = result.filter((l) => l.pricePerDay >= 250);
    } else if (!Number.isNaN(lo) && !Number.isNaN(hi)) {
      result = result.filter(
        (l) => l.pricePerDay >= lo && l.pricePerDay < hi
      );
    }
  } else {
    const min = minPrice ? Number(minPrice) : null;
    const max = maxPrice ? Number(maxPrice) : null;
    if (min != null && !Number.isNaN(min))
      result = result.filter((l) => l.pricePerDay >= min);
    if (max != null && !Number.isNaN(max))
      result = result.filter((l) => l.pricePerDay <= max);
  }

  // Bedrooms filter (uses seats field)
  if (seatsMin) {
    const min = Number(seatsMin);
    if (!Number.isNaN(min))
      result = result.filter((l) => l.seats >= min);
  }

  // Sort
  if (sort === "price-asc") {
    result.sort((a, b) => a.pricePerDay - b.pricePerDay);
  } else if (sort === "price-desc") {
    result.sort((a, b) => b.pricePerDay - a.pricePerDay);
  } else if (sort === "newest") {
    result.reverse();
  }

  return result;
}

export function SearchFilterBar() {
  const viewParser = createParser({
    parse: (v) => (v === "grid" ? "grid" : "map"),
    serialize: (v) => v,
  }).withDefault("map");
  const [view, setView] = useQueryState("view", viewParser);

  const stringParser = createParser({
    parse: (v) => v ?? "",
    serialize: (v) => v || "",
  }).withDefault("");
  const [priceRange, setPriceRange] = useQueryState("price", stringParser);
  const [seatsMin, setSeatsMin] = useQueryState("seats", stringParser);
  const [categories, setCategories] = useQueryState("categories", stringParser);
  const [minPrice, setMinPrice] = useQueryState("minPrice", stringParser);
  const [maxPrice, setMaxPrice] = useQueryState("maxPrice", stringParser);

  const sortParser = createParser({
    parse: (v) => v ?? "relevance",
    serialize: (v) => (v === "relevance" ? "" : v),
  }).withDefault("relevance");
  const [sort, setSort] = useQueryState("sort", sortParser);

  const boolParamParser = createParser({
    parse: (v) => v ?? "false",
    serialize: (v) => (v === "true" ? "true" : ""),
  }).withDefault("false");
  const [instantBook, setInstantBook] = useQueryState("instantBook", boolParamParser);
  const [freeCancellation, setFreeCancellation] = useQueryState("freeCancellation", boolParamParser);

  const [scrolled, setScrolled] = useState(false);
  const [filterBarVisible, setFilterBarVisible] = useState(true);
  const lastScrollY = useRef(0);
  const [allFiltersOpen, setAllFiltersOpen] = useState(false);

  const filterValues = {
    sort,
    minPrice,
    maxPrice,
    categories: categories
      ? (categories.split(",").filter(Boolean) as VehicleCategory[])
      : [],
    seats: seatsMin,
    fuel: "",
    instantBook: instantBook === "true",
    freeCancellation: freeCancellation === "true",
  };

  function handleApplyFilters(v: typeof filterValues) {
    setSort(v.sort);
    setMinPrice(v.minPrice);
    setMaxPrice(v.maxPrice);
    setCategories(v.categories.length ? v.categories.join(",") : null);
    setSeatsMin(v.seats || null);
    setInstantBook(v.instantBook ? "true" : null);
    setFreeCancellation(v.freeCancellation ? "true" : null);
    setPriceRange(null);
  }

  useEffect(() => {
    const HIDE_SCROLL_DELTA = 30;
    const TOP_THRESHOLD = 60;

    function onScroll() {
      const y = window.scrollY;
      setScrolled(y > 0);
      const prev = lastScrollY.current;
      const delta = y - prev;

      if (y <= TOP_THRESHOLD) {
        setFilterBarVisible(true);
      } else if (delta > HIDE_SCROLL_DELTA) {
        setFilterBarVisible(false);
      } else if (delta < 0) {
        setFilterBarVisible(true);
      }
      lastScrollY.current = y;
    }

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div
      className={cn(
        "fixed top-16 left-0 right-0 z-40 transition-transform duration-300 ease-out",
        !filterBarVisible && "-translate-y-full"
      )}
    >
      <div className={cn("flex w-full items-center gap-4 border-b border-zinc-100 bg-white px-4 py-2.5 sm:px-6", scrolled && "border-t border-zinc-100")}>
      <div className="flex min-w-0 flex-1 overflow-x-auto overflow-y-hidden">
        <div className="flex shrink-0 items-center gap-2">
          {/* All filters - opens sheet */}
          <AllFiltersSheet
            open={allFiltersOpen}
            onOpenChange={setAllFiltersOpen}
            values={filterValues}
            onApply={handleApplyFilters}
          >
            <Button
              variant="outline"
              className="h-9 shrink-0 rounded-[5px] gap-2 px-3 border-zinc-200"
              aria-label="All filters"
            >
              <FilterIcon className="size-4" aria-hidden />
              All filters
            </Button>
          </AllFiltersSheet>

          {/* Price dropdown */}
          <Select
            value={priceRange || "__any__"}
            onValueChange={(v) => {
              if (v === "__any__") {
                setPriceRange(null);
                setMinPrice(null);
                setMaxPrice(null);
                return;
              }
              setPriceRange(v);
              const [lo, hi] = v.split("-").map(Number);
              if (v === "250+") {
                setMinPrice("250");
                setMaxPrice(null);
              } else if (!Number.isNaN(lo) && !Number.isNaN(hi)) {
                setMinPrice(String(lo));
                setMaxPrice(String(hi));
              }
            }}
          >
            <SelectTrigger className="h-9 w-[130px] shrink-0 rounded-[5px] border-zinc-200">
              <SelectValue placeholder="Price" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="__any__">Price</SelectItem>
              {PRICE_OPTIONS.filter((o) => o.value).map((o) => (
                <SelectItem key={o.value} value={o.value}>
                  {o.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Bedrooms dropdown */}
          <Select
            value={seatsMin || "__any__"}
            onValueChange={(v) => setSeatsMin(v === "__any__" ? null : v)}
          >
            <SelectTrigger className="h-9 w-[120px] shrink-0 rounded-[5px] border-zinc-200">
              <SelectValue placeholder="Bedrooms" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="__any__">Bedrooms</SelectItem>
              {BEDROOMS_OPTIONS.map((o) => (
                <SelectItem key={o.value} value={o.value}>
                  {o.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Grid/Map toggle - far right, hidden on small viewport */}
      <Tabs
        value={view}
        onValueChange={(v) => setView(v as "grid" | "map")}
        className="hidden shrink-0 md:block"
      >
        <TabsList className="h-9" aria-label="View mode">
          <TabsTrigger value="grid" className="gap-2 px-3">
            <LayoutGrid className="size-4" aria-hidden />
            Grid
          </TabsTrigger>
          <TabsTrigger value="map" className="gap-2 px-3">
            <Map className="size-4" aria-hidden />
            Map
          </TabsTrigger>
        </TabsList>
      </Tabs>
      </div>
    </div>
  );
}
