"use client";

import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { useMediaQuery } from "@/hooks/use-media-query";
import type { VehicleCategory } from "@/lib/vehicle-listings";

const SORT_OPTIONS = [
  { value: "relevance", label: "Relevance" },
  { value: "price-asc", label: "Price: low to high" },
  { value: "price-desc", label: "Price: high to low" },
  { value: "newest", label: "Newest" },
] as const;

const VEHICLE_TYPE_OPTIONS: { id: VehicleCategory; label: string }[] = [
  { id: "economy", label: "Economy" },
  { id: "suvs", label: "SUVs" },
  { id: "passenger-vans", label: "Passenger vans" },
  { id: "pickup-truck", label: "Pickup trucks" },
  { id: "premium", label: "Premium" },
  { id: "luxury", label: "Luxury" },
];

const SEATS_OPTIONS = [
  { value: "", label: "Any" },
  { value: "2", label: "2+" },
  { value: "4", label: "4+" },
  { value: "5", label: "5+" },
  { value: "7", label: "7+" },
  { value: "10", label: "10+" },
];

const FUEL_OPTIONS = [
  { value: "", label: "Any" },
  { value: "gas", label: "Gas" },
  { value: "electric", label: "Electric" },
  { value: "hybrid", label: "Hybrid" },
];

type FilterValues = {
  sort: string;
  minPrice: string;
  maxPrice: string;
  categories: VehicleCategory[];
  seats: string;
  fuel: string;
  instantBook: boolean;
  freeCancellation: boolean;
};

type AllFiltersSheetProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children?: React.ReactNode;
  values: FilterValues;
  onApply: (values: FilterValues) => void;
};

const PRICE_MIN = 0;
const PRICE_MAX = 500;

function PriceRangeSection({
  values,
  setValues,
}: {
  values: FilterValues;
  setValues: React.Dispatch<React.SetStateAction<FilterValues>>;
}) {
  const minNum = values.minPrice ? Math.min(PRICE_MAX, Math.max(PRICE_MIN, Number(values.minPrice))) : PRICE_MIN;
  const maxNum = values.maxPrice ? Math.min(PRICE_MAX, Math.max(PRICE_MIN, Number(values.maxPrice))) : PRICE_MAX;
  const a = Number.isNaN(minNum) ? PRICE_MIN : minNum;
  const b = Number.isNaN(maxNum) ? PRICE_MAX : maxNum;
  const sliderVal: [number, number] = [Math.min(a, b), Math.max(a, b)];

  function handleSliderChange(v: number[]) {
    const [lo, hi] = v;
    setValues((prev) => ({
      ...prev,
      minPrice: String(Math.round(lo)),
      maxPrice: String(Math.round(hi)),
    }));
  }

  return (
    <div>
      <Label className="mb-2 block text-sm font-medium">Price range</Label>
      <div className="mb-3 grid grid-cols-2 gap-3">
        <div>
          <Label htmlFor="price-min" className="mb-1.5 block text-sm font-medium">
            Minimum
          </Label>
          <div className="relative">
            <span className="text-muted-foreground pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm">
              $
            </span>
            <Input
              id="price-min"
              type="number"
              min={PRICE_MIN}
              max={PRICE_MAX}
              placeholder="0"
              value={values.minPrice}
              onChange={(e) =>
                setValues((prev) => ({
                  ...prev,
                  minPrice: e.target.value,
                }))
              }
              className="min-h-9 pl-7"
            />
          </div>
        </div>
        <div>
          <Label htmlFor="price-max" className="mb-1.5 block text-sm font-medium">
            Maximum
          </Label>
          <div className="relative">
            <span className="text-muted-foreground pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm">
              $
            </span>
            <Input
              id="price-max"
              type="number"
              min={PRICE_MIN}
              max={PRICE_MAX}
              placeholder={`${PRICE_MAX}+`}
              value={values.maxPrice}
              onChange={(e) =>
                setValues((prev) => ({
                  ...prev,
                  maxPrice: e.target.value,
                }))
              }
              className="min-h-9 pl-7"
            />
          </div>
        </div>
      </div>
      <Slider
        value={sliderVal}
        onValueChange={handleSliderChange}
        min={PRICE_MIN}
        max={PRICE_MAX}
        step={10}
        className="w-full"
      />
    </div>
  );
}

function FilterFormContent({
  values,
  setValues,
  onReset,
  onApply,
}: {
  values: FilterValues;
  setValues: React.Dispatch<React.SetStateAction<FilterValues>>;
  onReset: () => void;
  onApply: () => void;
}) {
  function toggleCategory(cat: VehicleCategory) {
    setValues((v) => ({
      ...v,
      categories: v.categories.includes(cat)
        ? v.categories.filter((c) => c !== cat)
        : [...v.categories, cat],
    }));
  }

  return (
    <>
      <div className="min-h-0 flex-1 overflow-y-auto px-4 py-4">
        <div className="space-y-5">
          {/* Sort by */}
          <div>
            <Label className="mb-2 block text-sm font-medium">Sort by</Label>
            <Select
              value={values.sort}
              onValueChange={(v) =>
                setValues((prev) => ({ ...prev, sort: v }))
              }
            >
              <SelectTrigger className="min-h-9 w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {SORT_OPTIONS.map((o) => (
                  <SelectItem key={o.value} value={o.value}>
                    {o.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Separator />

          {/* Price range */}
          <PriceRangeSection values={values} setValues={setValues} />

          <Separator />

          {/* Vehicle type - multiselect */}
          <div>
            <Label className="mb-3 block text-sm font-medium">
              Vehicle type
            </Label>
            <div className="flex flex-col gap-2">
              {VEHICLE_TYPE_OPTIONS.map(({ id, label }) => (
                <label
                  key={id}
                  className="flex cursor-pointer items-center gap-2 rounded-md px-2 py-1.5"
                >
                  <Checkbox
                    checked={values.categories.includes(id)}
                    onCheckedChange={() => toggleCategory(id)}
                  />
                  <span className="text-sm">{label}</span>
                </label>
              ))}
            </div>
          </div>

          <Separator />

          {/* Seats */}
          <div>
            <Label className="mb-2 block text-sm font-medium">
              Minimum seats
            </Label>
            <Select
              value={values.seats || "__any__"}
              onValueChange={(v) =>
                setValues((prev) => ({
                  ...prev,
                  seats: v === "__any__" ? "" : v,
                }))
              }
            >
              <SelectTrigger className="min-h-9 w-full">
                <SelectValue placeholder="Any" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="__any__">Any</SelectItem>
                {SEATS_OPTIONS.filter((o) => o.value).map((o) => (
                  <SelectItem key={o.value} value={o.value}>
                    {o.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Fuel type */}
          <div>
            <Label className="mb-2 block text-sm font-medium">
              Fuel type
            </Label>
            <Select
              value={values.fuel || "__any__"}
              onValueChange={(v) =>
                setValues((prev) => ({
                  ...prev,
                  fuel: v === "__any__" ? "" : v,
                }))
              }
            >
              <SelectTrigger className="min-h-9 w-full">
                <SelectValue placeholder="Any" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="__any__">Any</SelectItem>
                {FUEL_OPTIONS.filter((o) => o.value).map((o) => (
                  <SelectItem key={o.value} value={o.value}>
                    {o.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Separator />

          {/* Toggles */}
          <div>
            <Label className="mb-3 block text-sm font-medium">
              Other options
            </Label>
            <div className="flex flex-col gap-2">
              <label className="flex cursor-pointer items-center justify-between gap-3 rounded-md px-2 py-1.5">
                <span className="text-sm">Instant book</span>
                <Switch
                  checked={values.instantBook}
                  onCheckedChange={(checked) =>
                    setValues((prev) => ({
                      ...prev,
                      instantBook: !!checked,
                    }))
                  }
                />
              </label>
              <label className="flex cursor-pointer items-center justify-between gap-3 rounded-md px-2 py-1.5">
                <span className="text-sm">Free cancellation</span>
                <Switch
                  checked={values.freeCancellation}
                  onCheckedChange={(checked) =>
                    setValues((prev) => ({
                      ...prev,
                      freeCancellation: !!checked,
                    }))
                  }
                />
              </label>
            </div>
          </div>
        </div>
      </div>

      {/* Footer - Reset and Apply */}
      <div className="flex shrink-0 flex-row items-center justify-between gap-3 border-t p-4">
        <Button
          variant="outline"
          onClick={onReset}
          className="min-h-10 shrink-0"
        >
          Reset
        </Button>
        <Button
          onClick={onApply}
          className="min-h-10 shrink-0 px-8"
        >
          Apply filters
        </Button>
      </div>
    </>
  );
}

export function AllFiltersSheet({
  open,
  onOpenChange,
  children,
  values: initialValues,
  onApply,
}: AllFiltersSheetProps) {
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const [values, setValues] = useState(initialValues);

  useEffect(() => {
    if (open) {
      setValues(initialValues);
    }
  }, [open, initialValues]);

  function handleReset() {
    setValues({
      sort: "relevance",
      minPrice: "",
      maxPrice: "",
      categories: [],
      seats: "",
      fuel: "",
      instantBook: false,
      freeCancellation: false,
    });
  }

  function handleApply() {
    onApply(values);
    onOpenChange(false);
  }

  const sharedContent = (
    <FilterFormContent
      values={values}
      setValues={setValues}
      onReset={handleReset}
      onApply={handleApply}
    />
  );

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogTrigger asChild>{children}</DialogTrigger>
        <DialogContent
          className="flex max-h-[85vh] w-full max-w-md flex-col overflow-hidden gap-0 p-0"
          showCloseButton={false}
        >
          <DialogHeader className="flex shrink-0 flex-row items-center justify-between border-b px-4 py-3">
            <DialogTitle className="text-lg font-semibold">
              All filters
            </DialogTitle>
            <Button
              variant="ghost"
              size="icon"
              className="size-8 shrink-0"
              onClick={() => onOpenChange(false)}
              aria-label="Close"
            >
              <X className="size-4" aria-hidden />
            </Button>
          </DialogHeader>
          {sharedContent}
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetTrigger asChild>{children}</SheetTrigger>
      <SheetContent
        side="bottom"
        className="flex max-h-[85vh] w-full flex-col overflow-hidden gap-0 rounded-t-xl p-0"
        showCloseButton={false}
      >
        <SheetHeader className="flex shrink-0 flex-row items-center justify-between border-b px-4 py-3">
          <SheetTitle className="text-lg font-semibold">All filters</SheetTitle>
          <Button
            variant="ghost"
            size="icon"
            className="size-8 shrink-0"
            onClick={() => onOpenChange(false)}
            aria-label="Close"
          >
            <X className="size-4" aria-hidden />
          </Button>
        </SheetHeader>
        {sharedContent}
      </SheetContent>
    </Sheet>
  );
}
