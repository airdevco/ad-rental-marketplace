"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import {
  ArrowLeft,
  Plus,
  Minus,
  Wifi,
  UtensilsCrossed,
  Wind,
  Droplets,
  Waves,
  Car,
  Tv,
  Flame,
  TreePine,
  Dumbbell,
  ImagePlus,
  Check,
  Trash2,
  ExternalLink,
  Home,
  Building2,
  Building,
  Crown,
  ChevronRight,
  Home as HomeIcon,
  BedDouble,
  Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { HostProfileForm } from "@/components/host/host-profile-form";

/* -------------------------------------------------------------------------- */
/*  Types & constants                                                          */
/* -------------------------------------------------------------------------- */

const TOTAL_STEPS = 14;

type PropertyType = {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
};

/* Match index page categories (vehicle-type-selector) */
const PROPERTY_TYPES: PropertyType[] = [
  { id: "economy", label: "Apartments", icon: Building2 },
  { id: "suvs", label: "Houses", icon: Home },
  { id: "passenger-vans", label: "Condos", icon: Building },
  { id: "pickup-truck", label: "Cabins", icon: TreePine },
  { id: "premium", label: "Beachfront", icon: Waves },
  { id: "luxury", label: "Luxury", icon: Crown },
];

type Amenity = { id: string; label: string; icon: React.ComponentType<{ className?: string }> };

const AMENITIES: Amenity[] = [
  { id: "wifi", label: "WiFi", icon: Wifi },
  { id: "kitchen", label: "Kitchen", icon: UtensilsCrossed },
  { id: "ac", label: "Air conditioning", icon: Wind },
  { id: "washer", label: "Washer", icon: Droplets },
  { id: "pool", label: "Pool", icon: Waves },
  { id: "parking", label: "Free parking", icon: Car },
  { id: "tv", label: "TV", icon: Tv },
  { id: "fireplace", label: "Fireplace", icon: Flame },
  { id: "bbq", label: "BBQ grill", icon: TreePine },
  { id: "gym", label: "Gym", icon: Dumbbell },
];

type FormData = {
  propertyType: string;
  placeType: string;
  address: string;
  guests: number;
  bedrooms: number;
  bathrooms: number;
  amenities: string[];
  photos: string[];
  title: string;
  description: string;
  pricePerNight: string;
  blockedDates: string[];
  hostName: string;
  hostBio: string;
  hostPhoto: string;
  stripeConnected: boolean;
};

const INITIAL_FORM: FormData = {
  propertyType: "",
  placeType: "",
  address: "",
  guests: 0,
  bedrooms: 0,
  bathrooms: 0,
  amenities: [],
  photos: [],
  title: "",
  description: "",
  pricePerNight: "",
  blockedDates: [],
  hostName: "",
  hostBio: "",
  hostPhoto: "",
  stripeConnected: false,
};

const LOCATION_SUGGESTIONS = [
  "San Francisco, CA",
  "Oakland, CA",
  "Los Angeles, CA",
  "New York, NY",
  "Chicago, IL",
  "Seattle, WA",
  "Austin, TX",
  "Miami, FL",
  "Boston, MA",
  "Denver, CO",
];

/* -------------------------------------------------------------------------- */
/*  Stepper helper                                                             */
/* -------------------------------------------------------------------------- */

function StepperRow({
  label,
  sublabel,
  value,
  onDecrement,
  onIncrement,
  min = 0,
}: {
  label: string;
  sublabel?: string;
  value: number;
  onDecrement: () => void;
  onIncrement: () => void;
  min?: number;
}) {
  return (
    <div className="flex items-center justify-between py-4">
      <div>
        <p className="font-medium text-zinc-900">{label}</p>
        {sublabel && <p className="text-sm text-muted-foreground">{sublabel}</p>}
      </div>
      <div className="flex items-center gap-4">
        <button
          type="button"
          onClick={onDecrement}
          disabled={value <= min}
          className="flex size-9 items-center justify-center rounded-full border border-zinc-200 text-zinc-700 transition-colors hover:border-zinc-900 disabled:cursor-not-allowed disabled:opacity-40"
          aria-label={`Decrease ${label}`}
        >
          <Minus className="size-4" />
        </button>
        <span className="w-4 text-center text-base font-medium tabular-nums">{value}</span>
        <button
          type="button"
          onClick={onIncrement}
          className="flex size-9 items-center justify-center rounded-full border border-zinc-200 text-zinc-700 transition-colors hover:border-zinc-900"
          aria-label={`Increase ${label}`}
        >
          <Plus className="size-4" />
        </button>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Individual step renders                                                    */
/* -------------------------------------------------------------------------- */

function StepIntro({ onContinue }: { onContinue: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center gap-8 py-12 text-center">
      <div className="relative mx-auto h-40 w-64 overflow-hidden rounded-2xl bg-zinc-100">
        <Image
          src="https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=600&h=400&fit=crop"
          alt="Beautiful home"
          fill
          className="object-cover"
          sizes="256px"
        />
      </div>
      <div className="max-w-md">
        <h1 className="text-3xl font-black tracking-tight text-zinc-900 sm:text-4xl">
          Ready to become a host?
        </h1>
        <p className="mt-4 text-[15px] leading-relaxed text-muted-foreground">
          Share your home and start earning. Hosts on Rento earn an average of{" "}
          <span className="font-semibold text-zinc-900">$1,200 / month</span>.
          It takes about 10 minutes to set up.
        </p>
      </div>
      <Button
        onClick={onContinue}
        className="h-12 w-full max-w-xs rounded-[5px] bg-primary px-8 font-medium shadow-none hover:bg-primary/90 sm:w-auto"
      >
        Get started
        <ChevronRight className="size-4" />
      </Button>
    </div>
  );
}

function StepPropertyType({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div>
      <div className="mb-2">
        <h2 className="text-2xl font-black tracking-tight text-zinc-900">What kind of place are you listing?</h2>
        <p className="mt-2 text-muted-foreground">Pick the type that best describes your property.</p>
      </div>
      <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3">
        {PROPERTY_TYPES.map((pt) => {
          const Icon = pt.icon;
          const selected = value === pt.id;
          return (
            <button
              key={pt.id}
              type="button"
              onClick={() => onChange(pt.id)}
              className={cn(
                "flex flex-col items-start gap-3 rounded-xl border-[1px] border-zinc-200 p-4 text-left transition-all",
                selected
                  ? "border-zinc-900 bg-zinc-50"
                  : "hover:border-zinc-400"
              )}
            >
              <Icon className={cn("size-7", selected ? "text-zinc-900" : "text-muted-foreground")} />
              <span className={cn("text-sm font-semibold", selected ? "text-zinc-900" : "text-zinc-700")}>
                {pt.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

type PlaceTypeOption = {
  id: string;
  name: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
};

const PLACE_TYPE_OPTIONS: PlaceTypeOption[] = [
  {
    id: "entire",
    name: "An entire place",
    description: "Guests have the whole place to themselves. This usually includes a bedroom, bathroom, and kitchen.",
    icon: HomeIcon,
  },
  {
    id: "room",
    name: "A room",
    description: "Guests have their own private room for sleeping. Other spaces could be shared.",
    icon: BedDouble,
  },
  {
    id: "shared",
    name: "A shared room in a hostel",
    description: "Guests sleep in a room or common area that may be shared with others.",
    icon: Users,
  },
];

function StepPlaceType({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div>
      <h2 className="text-2xl font-black tracking-tight text-zinc-900">What type of place will guests have?</h2>
      <p className="mt-2 text-muted-foreground">Help guests understand what they can expect.</p>
      <div className="mt-6 space-y-3">
        {PLACE_TYPE_OPTIONS.map((option) => {
          const Icon = option.icon;
          const selected = value === option.id;
          return (
            <button
              key={option.id}
              type="button"
              onClick={() => onChange(option.id)}
              className={cn(
                "flex w-full items-start gap-4 rounded-xl border-[1px] border-zinc-200 p-4 text-left transition-all",
                selected
                  ? "border-zinc-900 bg-zinc-50"
                  : "hover:border-zinc-400"
              )}
            >
              <Icon className={cn("mt-0.5 size-7 shrink-0", selected ? "text-zinc-900" : "text-muted-foreground")} />
              <div className="min-w-0 flex-1">
                <p className={cn("font-semibold", selected ? "text-zinc-900" : "text-zinc-700")}>
                  {option.name}
                </p>
                <p className="mt-1 text-sm text-muted-foreground">
                  {option.description}
                </p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function StepLocation({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: string) => void;
}) {
  const [showSuggestions, setShowSuggestions] = useState(false);
  const filtered = value.trim()
    ? LOCATION_SUGGESTIONS.filter((s) =>
        s.toLowerCase().includes(value.toLowerCase())
      )
    : LOCATION_SUGGESTIONS;

  return (
    <div>
      <h2 className="text-2xl font-black tracking-tight text-zinc-900">Where is your property located?</h2>
      <p className="mt-2 text-muted-foreground">Guests will only see the approximate location until they book.</p>
      <div className="relative mt-6">
        <Label htmlFor="location-input" className="text-xs font-semibold text-zinc-900">
          Address or city
        </Label>
        <Input
          id="location-input"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setShowSuggestions(true)}
          onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
          placeholder="e.g. San Francisco, CA"
          className="mt-1.5 h-11 rounded-[5px] border-zinc-200 shadow-none focus-visible:border-zinc-900 focus-visible:ring-0"
          autoComplete="off"
        />
        {showSuggestions && filtered.length > 0 && (
          <ul className="absolute left-0 right-0 top-full z-20 mt-1 max-h-52 overflow-y-auto rounded-[5px] border border-zinc-200 bg-white shadow-md">
            {filtered.map((s) => (
              <li key={s}>
                <button
                  type="button"
                  onMouseDown={() => onChange(s)}
                  className="w-full px-3 py-2.5 text-left text-sm text-zinc-900 hover:bg-zinc-50"
                >
                  {s}
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

function StepBasics({
  guests,
  bedrooms,
  bathrooms,
  onChange,
}: {
  guests: number;
  bedrooms: number;
  bathrooms: number;
  onChange: (field: "guests" | "bedrooms" | "bathrooms", v: number) => void;
}) {
  return (
    <div>
      <h2 className="text-2xl font-black tracking-tight text-zinc-900">Share some basics about your place</h2>
      <p className="mt-2 text-muted-foreground">You can always change these later.</p>
      <div className="mt-6 divide-y divide-zinc-100">
        <StepperRow
          label="Guests"
          sublabel="How many guests can stay?"
          value={guests}
          min={0}
          onDecrement={() => onChange("guests", Math.max(0, guests - 1))}
          onIncrement={() => onChange("guests", guests + 1)}
        />
        <StepperRow
          label="Bedrooms"
          value={bedrooms}
          min={0}
          onDecrement={() => onChange("bedrooms", Math.max(0, bedrooms - 1))}
          onIncrement={() => onChange("bedrooms", bedrooms + 1)}
        />
        <StepperRow
          label="Bathrooms"
          value={bathrooms}
          min={0}
          onDecrement={() => onChange("bathrooms", Math.max(0, bathrooms - 1))}
          onIncrement={() => onChange("bathrooms", bathrooms + 1)}
        />
      </div>
    </div>
  );
}

function StepAmenities({
  selected,
  onChange,
}: {
  selected: string[];
  onChange: (v: string[]) => void;
}) {
  function toggle(id: string) {
    onChange(
      selected.includes(id)
        ? selected.filter((a) => a !== id)
        : [...selected, id]
    );
  }

  return (
    <div>
      <h2 className="text-2xl font-black tracking-tight text-zinc-900">Tell guests what your place offers</h2>
      <p className="mt-2 text-muted-foreground">You can add more amenities after you publish.</p>
      <div className="mt-6 flex flex-wrap gap-3">
        {AMENITIES.map((amenity) => {
          const Icon = amenity.icon;
          const isSelected = selected.includes(amenity.id);
          return (
            <button
              key={amenity.id}
              type="button"
              onClick={() => toggle(amenity.id)}
              className={cn(
                "flex w-fit items-center gap-2.5 rounded-xl border-[1px] px-4 py-3 text-left transition-all",
                isSelected
                  ? "border-zinc-900 bg-zinc-50"
                  : "border-zinc-200 hover:border-zinc-400"
              )}
            >
              <Icon className={cn("size-5 shrink-0", isSelected ? "text-zinc-900" : "text-muted-foreground")} />
              <span className={cn("whitespace-nowrap text-sm font-medium", isSelected ? "text-zinc-900" : "text-zinc-700")}>
                {amenity.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

const PHOTO_SLOTS_MIN = 5;

function StepPhotos({
  photos,
  onPhotoAdd,
  onPhotoRemove,
  onAddSlot,
}: {
  photos: string[];
  onPhotoAdd: (index: number, dataUrl: string) => void;
  onPhotoRemove: (index: number) => void;
  onAddSlot: () => void;
}) {
  const [pendingIndex, setPendingIndex] = useState<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const filledCount = photos.filter(Boolean).length;
  const slotCount = Math.max(PHOTO_SLOTS_MIN, filledCount + 1);
  const slots = Array.from({ length: slotCount }, (_, i) => photos[i] ?? null);

  function handleSlotClick(index: number) {
    if (slots[index]) return;
    setPendingIndex(index);
    fileInputRef.current?.click();
  }

  function handleAddPhotoClick() {
    onAddSlot();
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file || !file.type.startsWith("image/") || pendingIndex === null) {
      setPendingIndex(null);
      e.target.value = "";
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result as string;
      onPhotoAdd(pendingIndex, dataUrl);
      setPendingIndex(null);
    };
    reader.readAsDataURL(file);
    e.target.value = "";
  }

  return (
    <div>
      <h2 className="text-2xl font-black tracking-tight text-zinc-900">Add some photos of your place</h2>
      <p className="mt-2 text-muted-foreground">
        Listings with great photos get up to 40% more bookings. Add at least 5 photos.
      </p>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        aria-hidden
        onChange={handleFileChange}
      />
      <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3">
        {slots.map((url, i) => (
          <div
            key={i}
            className={cn(
              "group relative flex aspect-[4/3] w-full items-center justify-center overflow-hidden rounded-xl border-[1px] border-dashed border-zinc-200 transition-colors",
              url ? "border-solid" : "hover:border-zinc-400 hover:bg-zinc-50"
            )}
          >
            {url ? (
              <>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={url}
                  alt=""
                  className="absolute inset-0 size-full object-cover"
                />
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onPhotoRemove(i);
                  }}
                  className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 transition-opacity hover:opacity-100 group-hover:opacity-100"
                  aria-label="Remove photo"
                >
                  <span className="flex size-10 items-center justify-center rounded-full bg-zinc-700 text-white shadow-md">
                    <Trash2 className="size-5" />
                  </span>
                </button>
              </>
            ) : (
              <button
                type="button"
                onClick={() => handleSlotClick(i)}
                className="absolute inset-0 flex items-center justify-center"
              >
                <ImagePlus className="size-6 text-muted-foreground" />
              </button>
            )}
          </div>
        ))}
      </div>
      <Button
        variant="outline"
        className="mt-4 h-11 w-full rounded-[5px] shadow-none"
        onClick={handleAddPhotoClick}
      >
        <ImagePlus className="size-4" />
        Add photo
      </Button>
    </div>
  );
}

function StepTitle({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: string) => void;
}) {
  const MAX = 50;
  return (
    <div>
      <h2 className="text-2xl font-black tracking-tight text-zinc-900">Give your listing a title</h2>
      <p className="mt-2 text-muted-foreground">
        Short, catchy titles get more clicks. Highlight what makes your place special.
      </p>
      <div className="mt-6 space-y-1.5">
        <Label htmlFor="listing-title" className="text-xs font-semibold text-zinc-900">
          Listing title
        </Label>
        <Input
          id="listing-title"
          value={value}
          maxLength={MAX}
          onChange={(e) => onChange(e.target.value)}
          placeholder="e.g. Sunny studio in the heart of the Mission"
          className="h-11 rounded-[5px] border-zinc-200 shadow-none focus-visible:border-zinc-900 focus-visible:ring-0"
        />
        <p className="text-right text-xs text-muted-foreground">
          {value.length}/{MAX}
        </p>
      </div>
    </div>
  );
}

function StepDescription({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: string) => void;
}) {
  const MAX = 500;
  return (
    <div>
      <h2 className="text-2xl font-black tracking-tight text-zinc-900">Describe your place to guests</h2>
      <p className="mt-2 text-muted-foreground">
        Tell guests what makes staying at your place special. Mention the vibe, neighbourhood, and anything guests love about it.
      </p>
      <div className="mt-6 space-y-1.5">
        <Label htmlFor="listing-desc" className="text-xs font-semibold text-zinc-900">
          Description
        </Label>
        <Textarea
          id="listing-desc"
          value={value}
          maxLength={MAX}
          rows={6}
          onChange={(e) => onChange(e.target.value)}
          placeholder="A cozy, light-filled studio steps from BART and the best taquerias in the city…"
          className="min-h-36 rounded-[5px] border-zinc-200 shadow-none focus-visible:border-zinc-900 focus-visible:ring-0"
        />
        <p className="text-right text-xs text-muted-foreground">
          {value.length}/{MAX}
        </p>
      </div>
    </div>
  );
}

function StepPricing({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div>
      <h2 className="text-2xl font-black tracking-tight text-zinc-900">Set your nightly price</h2>
      <p className="mt-2 text-muted-foreground">
        You can change your price at any time. Start competitive and adjust as you get reviews.
      </p>
      <div className="mt-6 space-y-4">
        <div className="space-y-1.5">
          <Label htmlFor="nightly-price" className="text-xs font-semibold text-zinc-900">
            Price per night (USD)
          </Label>
          <div className="relative">
            <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
              $
            </span>
            <Input
              id="nightly-price"
              type="number"
              min={0}
              value={value}
              onChange={(e) => onChange(e.target.value)}
              placeholder="0"
              className="h-11 rounded-[5px] border-zinc-200 pl-7 shadow-none tabular-nums focus-visible:border-zinc-900 focus-visible:ring-0 [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
            />
          </div>
        </div>
        <div className="rounded-xl border border-zinc-100 bg-zinc-50 p-4">
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Hosts nearby earn</p>
          <p className="mt-1 text-lg font-bold text-zinc-900">$120 – $200 <span className="text-sm font-normal text-muted-foreground">per night</span></p>
          <p className="mt-0.5 text-xs text-muted-foreground">Based on similar properties in this area.</p>
        </div>
      </div>
    </div>
  );
}

function StepAvailability({
  blocked,
  onToggle,
}: {
  blocked: string[];
  onToggle: (date: string) => void;
}) {
  const [monthOffset, setMonthOffset] = useState(0);
  const today = new Date();
  const viewDate = new Date(today.getFullYear(), today.getMonth() + monthOffset, 1);
  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDay = new Date(year, month, 1).getDay();
  const monthName = viewDate.toLocaleString("default", { month: "long", year: "numeric" });

  const days = Array.from({ length: daysInMonth }, (_, i) => {
    const d = i + 1;
    const key = `${year}-${String(month + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
    return { day: d, key };
  });

  return (
    <div>
      <h2 className="text-2xl font-black tracking-tight text-zinc-900">Set your availability</h2>
      <p className="mt-2 text-muted-foreground">
        Tap dates to mark them as unavailable. All other dates will be open by default.
      </p>
      <div className="mt-6 rounded-xl border border-zinc-100 p-4">
        <div className="mb-3 flex items-center justify-between">
          <button
            type="button"
            onClick={() => setMonthOffset((o) => o - 1)}
            className="flex size-9 items-center justify-center rounded-full text-zinc-600 transition-colors hover:bg-zinc-100 hover:text-zinc-900"
            aria-label="Previous month"
          >
            <ChevronRight className="size-5 rotate-180" />
          </button>
          <p className="text-center text-sm font-semibold text-zinc-900">{monthName}</p>
          <button
            type="button"
            onClick={() => setMonthOffset((o) => o + 1)}
            className="flex size-9 items-center justify-center rounded-full text-zinc-600 transition-colors hover:bg-zinc-100 hover:text-zinc-900"
            aria-label="Next month"
          >
            <ChevronRight className="size-5" />
          </button>
        </div>
        <div className="grid grid-cols-7 gap-1 text-center">
          {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((d) => (
            <div key={d} className="py-1 text-xs font-medium text-muted-foreground">{d}</div>
          ))}
          {Array.from({ length: firstDay }).map((_, i) => (
            <div key={`empty-${i}`} />
          ))}
          {days.map(({ day, key }) => {
            const isBlocked = blocked.includes(key);
            return (
              <button
                key={key}
                type="button"
                onClick={() => onToggle(key)}
                className={cn(
                  "flex aspect-square w-full items-center justify-center rounded-lg text-sm transition-colors",
                  isBlocked
                    ? "bg-zinc-200 text-muted-foreground line-through"
                    : "hover:bg-zinc-100 text-zinc-900"
                )}
              >
                {day}
              </button>
            );
          })}
        </div>
      </div>
      <div className="mt-3 flex items-center gap-3 text-xs text-muted-foreground">
        <span className="flex items-center gap-1.5">
          <span className="inline-block size-3 rounded-sm bg-zinc-200" /> Blocked
        </span>
        <span className="flex items-center gap-1.5">
          <span className="inline-block size-3 rounded-sm border border-zinc-200" /> Available
        </span>
      </div>
    </div>
  );
}

function StepHostProfile({
  name,
  bio,
  hostPhoto,
  onNameChange,
  onBioChange,
  onPhotoChange,
  onPhotoClear,
}: {
  name: string;
  bio: string;
  hostPhoto: string;
  onNameChange: (v: string) => void;
  onBioChange: (v: string) => void;
  onPhotoChange: (dataUrl: string) => void;
  onPhotoClear: () => void;
}) {
  return (
    <HostProfileForm
      showHeading
      data={{ name, bio, photo: hostPhoto }}
      onChange={(updated) => {
        if (updated.name !== undefined) onNameChange(updated.name);
        if (updated.bio !== undefined) onBioChange(updated.bio);
        if (updated.photo !== undefined) {
          if (updated.photo === "") onPhotoClear();
          else onPhotoChange(updated.photo);
        }
      }}
    />
  );
}

function StepStripe({ onSkip }: { onSkip: () => void }) {
  return (
    <div>
      <h2 className="text-2xl font-black tracking-tight text-zinc-900">Set up payouts</h2>
      <p className="mt-2 text-muted-foreground">
        Connect your Stripe account to receive payments from your guests directly to your bank.
      </p>
      <div className="mt-6 space-y-4">
        <div className="rounded-xl border border-zinc-100 bg-zinc-50 p-5">
          <div className="flex items-start gap-4">
            <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-[#635bff] text-white text-xs font-bold tracking-wider">
              stripe
            </div>
            <div className="min-w-0 flex-1">
              <p className="font-semibold text-zinc-900">Stripe Connect</p>
              <p className="mt-0.5 text-sm text-muted-foreground">
                Industry-standard payment processing. Payouts land in your bank within 2–5 business days.
              </p>
            </div>
          </div>
          <div className="mt-4 space-y-2 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Check className="size-4 shrink-0 text-green-600" />
              <span>Bank-level encryption and fraud protection</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="size-4 shrink-0 text-green-600" />
              <span>Supports 135+ currencies</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="size-4 shrink-0 text-green-600" />
              <span>Instant access to your earnings dashboard</span>
            </div>
          </div>
        </div>
        <Button
          asChild
          className="h-11 w-full rounded-[5px] bg-[#635bff] font-medium shadow-none hover:bg-[#5146e4]"
        >
          <a href="https://stripe.com/connect" target="_blank" rel="noopener noreferrer">
            Connect Stripe
            <ExternalLink className="size-4" />
          </a>
        </Button>
        <button
          type="button"
          onClick={onSkip}
          className="w-full py-2 text-sm text-muted-foreground underline-offset-2 hover:text-zinc-900 hover:underline"
        >
          I&apos;ll set this up later
        </button>
      </div>
    </div>
  );
}

function StepReview({
  form,
  onPublish,
}: {
  form: FormData;
  onPublish: () => void;
}) {
  const propertyLabel = PROPERTY_TYPES.find((p) => p.id === form.propertyType)?.label ?? "—";
  const placeTypeLabel = PLACE_TYPE_OPTIONS.find((p) => p.id === form.placeType)?.name ?? "—";

  const rows = [
    { label: "Property type", value: propertyLabel },
    { label: "Place type", value: placeTypeLabel },
    { label: "Location", value: form.address || "—" },
    { label: "Guests", value: `${form.guests} guests · ${form.bedrooms} bed · ${form.bathrooms} bath` },
    { label: "Amenities", value: form.amenities.length ? `${form.amenities.length} selected` : "None" },
    { label: "Photos", value: form.photos.filter(Boolean).length ? `${form.photos.filter(Boolean).length} added` : "None added" },
    { label: "Title", value: form.title || "—" },
    { label: "Price", value: form.pricePerNight ? `$${form.pricePerNight}/night` : "—" },
  ];

  return (
    <div>
      <h2 className="text-2xl font-black tracking-tight text-zinc-900">Review your listing</h2>
      <p className="mt-2 text-muted-foreground">
        You can always edit these details after publishing. Once published, guests can find and book your home.
      </p>
      <div className="mt-6 rounded-xl border border-zinc-100">
        {rows.map((row, i) => (
          <div key={row.label}>
            {i > 0 && <Separator className="bg-zinc-100" />}
            <div className="flex items-center justify-between gap-4 px-4 py-3">
              <span className="text-sm text-muted-foreground">{row.label}</span>
              <span className="text-right text-sm font-medium text-zinc-900">{row.value}</span>
            </div>
          </div>
        ))}
      </div>
      <Button
        onClick={onPublish}
        className="mt-6 h-12 w-full rounded-[5px] bg-primary font-medium shadow-none hover:bg-primary/90"
      >
        Publish listing
      </Button>
    </div>
  );
}

function StepSuccess() {
  return (
    <div className="flex flex-col items-center justify-center gap-5 py-6 text-center">
      <div className="flex size-20 items-center justify-center rounded-full bg-green-50">
        <Check className="size-10 text-green-600" />
      </div>
      <div className="max-w-[440px]">
        <h2 className="text-2xl font-black tracking-tight text-zinc-900">Your listing is live!</h2>
        <p className="mt-3 max-w-[440px] text-muted-foreground">
          Congratulations! Your home is now visible to guests on Rento. You can manage it from your seller dashboard.
        </p>
      </div>
      <div className="flex flex-col gap-3 w-full max-w-xs">
        <Button
          asChild
          className="h-11 rounded-[5px] bg-primary font-medium shadow-none hover:bg-primary/90"
        >
          <Link href="/dashboard/seller">Go to seller dashboard</Link>
        </Button>
        <Button
          asChild
          variant="outline"
          className="h-11 rounded-[5px] font-medium shadow-none"
        >
          <Link href="/">Back to home</Link>
        </Button>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Main wizard                                                                */
/* -------------------------------------------------------------------------- */

export function OnboardingWizard() {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const stepParam = searchParams.get("step");
  const stepFromUrl = stepParam ? Math.min(TOTAL_STEPS, Math.max(1, parseInt(stepParam, 10) || 1)) : 1;
  const step = stepFromUrl;

  const [published, setPublished] = useState(false);
  const [form, setForm] = useState<FormData>(INITIAL_FORM);

  function goToStep(s: number) {
    const nextStep = Math.min(TOTAL_STEPS, Math.max(1, s));
    router.replace(`${pathname}?step=${nextStep}`);
  }

  function next() {
    goToStep(step + 1);
  }
  function back() {
    goToStep(step - 1);
  }

  function updateForm<K extends keyof FormData>(key: K, value: FormData[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function toggleDate(date: string) {
    setForm((prev) => ({
      ...prev,
      blockedDates: prev.blockedDates.includes(date)
        ? prev.blockedDates.filter((d) => d !== date)
        : [...prev.blockedDates, date],
    }));
  }

  function addPhotoAt(index: number, dataUrl: string) {
    setForm((prev) => {
      const next = [...prev.photos];
      while (next.length <= index) next.push("");
      next[index] = dataUrl;
      return { ...prev, photos: next };
    });
  }

  function removePhotoAt(index: number) {
    setForm((prev) => {
      const next = [...prev.photos];
      if (index < next.length) next[index] = "";
      return { ...prev, photos: next };
    });
  }

  function addPhotoSlot() {
    setForm((prev) => ({ ...prev, photos: [...prev.photos, ""] }));
  }

  function handlePublish() {
    setPublished(true);
  }

  const progress = ((step - 1) / (TOTAL_STEPS - 1)) * 100;

  if (published) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center px-4">
        <div className="w-full max-w-lg">
          <StepSuccess />
        </div>
      </div>
    );
  }

  /* Demo: allow Continue on every step without validation */
  const isIntro = step === 1;

  return (
    <div className="flex h-screen flex-col overflow-hidden">
      {/* Progress bar — sits above fixed bar as its top border */}
      {!isIntro && step < 14 && (
        <div className="fixed bottom-0 left-0 right-0 z-40 flex flex-col border-t border-zinc-100 bg-white pb-[env(safe-area-inset-bottom)]">
          <div className="h-1 w-full bg-zinc-100">
            <div
              className="h-full bg-primary transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="mx-auto flex max-w-lg w-full items-center justify-between gap-4 px-4 py-4">
            <Button
              variant="outline"
              onClick={back}
              className="h-11 w-28 rounded-[5px] font-medium shadow-none"
            >
              Back
            </Button>
            {step !== 13 && (
              <Button
                onClick={next}
                className="h-11 min-w-28 rounded-[5px] bg-primary font-medium shadow-none hover:bg-primary/90"
              >
                Continue
              </Button>
            )}
          </div>
        </div>
      )}
      {!isIntro && (
        <div className="fixed left-0 right-0 top-0 z-40 flex h-16 items-center border-b border-zinc-100 bg-white px-4 sm:px-6">
          <div className="container mx-auto flex max-w-[700px] items-center justify-between px-0">
            <button
              type="button"
              onClick={back}
              className="flex size-9 items-center justify-center rounded-full transition-colors hover:bg-zinc-100"
              aria-label="Go back"
            >
              <ArrowLeft className="size-5 text-zinc-700" />
            </button>
            <span className="text-sm font-medium text-muted-foreground">
              Step {step} of {TOTAL_STEPS}
            </span>
            <Link
              href="/"
              className="text-sm font-medium text-muted-foreground hover:text-zinc-900"
            >
              Exit
            </Link>
          </div>
        </div>
      )}
      {/* Content — flex-1 min-h-0 so it fills viewport without causing page scroll; scrolls only when content overflows */}
      <main
        className={cn(
          "flex min-h-0 flex-1 flex-col overflow-y-auto px-4 pb-24",
          isIntro ? "items-center justify-center pt-16 sm:pt-24" : "pt-24"
        )}
      >
        <div className={cn("mx-auto w-full max-w-lg", isIntro && "flex flex-1 flex-col items-center justify-center")}>
          {step === 1 && <StepIntro onContinue={next} />}
          {step === 2 && (
            <StepPropertyType value={form.propertyType} onChange={(v) => updateForm("propertyType", v)} />
          )}
          {step === 3 && (
            <StepPlaceType value={form.placeType} onChange={(v) => updateForm("placeType", v)} />
          )}
          {step === 4 && (
            <StepLocation value={form.address} onChange={(v) => updateForm("address", v)} />
          )}
          {step === 5 && (
            <StepBasics
              guests={form.guests}
              bedrooms={form.bedrooms}
              bathrooms={form.bathrooms}
              onChange={(field, v) => updateForm(field, v)}
            />
          )}
          {step === 6 && (
            <StepAmenities selected={form.amenities} onChange={(v) => updateForm("amenities", v)} />
          )}
          {step === 7 && <StepPhotos photos={form.photos} onPhotoAdd={addPhotoAt} onPhotoRemove={removePhotoAt} onAddSlot={addPhotoSlot} />}
          {step === 8 && (
            <StepTitle value={form.title} onChange={(v) => updateForm("title", v)} />
          )}
          {step === 9 && (
            <StepDescription value={form.description} onChange={(v) => updateForm("description", v)} />
          )}
          {step === 10 && (
            <StepPricing value={form.pricePerNight} onChange={(v) => updateForm("pricePerNight", v)} />
          )}
          {step === 11 && (
            <StepAvailability blocked={form.blockedDates} onToggle={toggleDate} />
          )}
          {step === 12 && (
            <StepHostProfile
              name={form.hostName}
              bio={form.hostBio}
              hostPhoto={form.hostPhoto}
              onNameChange={(v) => updateForm("hostName", v)}
              onBioChange={(v) => updateForm("hostBio", v)}
              onPhotoChange={(v) => updateForm("hostPhoto", v)}
              onPhotoClear={() => updateForm("hostPhoto", "")}
            />
          )}
          {step === 13 && <StepStripe onSkip={next} />}
          {step === 14 && <StepReview form={form} onPublish={handlePublish} />}
        </div>
      </main>
    </div>
  );
}
