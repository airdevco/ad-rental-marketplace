"use client";

import { useState, useRef, useEffect, useLayoutEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import {
  Star,
  CalendarDays,
  Home,
  MessageCircle,
  X,
  Users,
  Heart,
  Trash2,
  ChevronDown,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";
import { Card } from "@/components/ui/card";
import { ListingImageWithWishlist } from "@/components/listing/listing-image-with-wishlist";

/* -------------------------------------------------------------------------- */
/*  Constants                                                                  */
/* -------------------------------------------------------------------------- */

const BUYER_PHOTO =
  "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=96&h=96&fit=crop&crop=face";

/* -------------------------------------------------------------------------- */
/*  Mock data                                                                  */
/* -------------------------------------------------------------------------- */

type BuyerReservation = {
  id: string;
  propertyName: string;
  propertyImage: string;
  location: string;
  hostName: string;
  hostPhoto: string;
  hostInitials: string;
  checkIn: string;
  checkOut: string;
  nights: number;
  guests: number;
  total: number;
  status: "confirmed" | "completed" | "cancelled";
};

const BUYER_RESERVATIONS: BuyerReservation[] = [
  {
    id: "br-1",
    propertyName: "Beach House",
    propertyImage:
      "https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?w=400&h=300&fit=crop",
    location: "Malibu, CA",
    hostName: "Jordan Park",
    hostPhoto:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=96&h=96&fit=crop&crop=face",
    hostInitials: "JP",
    checkIn: "Mar 10, 2026",
    checkOut: "Mar 14, 2026",
    nights: 4,
    guests: 2,
    total: 1120,
    status: "confirmed",
  },
  {
    id: "br-2",
    propertyName: "Downtown Loft",
    propertyImage:
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=400&h=300&fit=crop",
    location: "Chicago, IL",
    hostName: "Sarah Miller",
    hostPhoto:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=96&h=96&fit=crop&crop=face",
    hostInitials: "SM",
    checkIn: "Feb 28, 2026",
    checkOut: "Mar 3, 2026",
    nights: 3,
    guests: 1,
    total: 537,
    status: "confirmed",
  },
  {
    id: "br-3",
    propertyName: "Garden Cottage",
    propertyImage:
      "https://images.unsplash.com/photo-1560185007-c5ca9d2c014d?w=400&h=300&fit=crop",
    location: "Berkeley, CA",
    hostName: "Mia Patel",
    hostPhoto:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=96&h=96&fit=crop&crop=face",
    hostInitials: "MP",
    checkIn: "Jan 12, 2026",
    checkOut: "Jan 15, 2026",
    nights: 3,
    guests: 1,
    total: 318,
    status: "completed",
  },
  {
    id: "br-4",
    propertyName: "Historic Brownstone",
    propertyImage:
      "https://images.unsplash.com/photo-1555636222-cae831e670b3?w=400&h=300&fit=crop",
    location: "Boston, MA",
    hostName: "Chris Thompson",
    hostPhoto:
      "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=96&h=96&fit=crop&crop=face",
    hostInitials: "CT",
    checkIn: "Dec 20, 2025",
    checkOut: "Dec 24, 2025",
    nights: 4,
    guests: 2,
    total: 820,
    status: "completed",
  },
  {
    id: "br-5",
    propertyName: "Mountain Cabin",
    propertyImage:
      "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=400&h=300&fit=crop",
    location: "Lake Tahoe, CA",
    hostName: "Jamie Lee",
    hostPhoto:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=96&h=96&fit=crop&crop=face",
    hostInitials: "JL",
    checkIn: "Nov 5, 2025",
    checkOut: "Nov 7, 2025",
    nights: 2,
    guests: 1,
    total: 378,
    status: "cancelled",
  },
];

type WishlistItem = {
  id: string;
  title: string;
  location: string;
  pricePerNight: number;
  imageUrl: string;
  images?: string[];
  rating: number;
  reviewCount: number;
  beds: number;
  baths: number;
};

const INITIAL_WISHLIST: WishlistItem[] = [
  {
    id: "w-1",
    title: "Sunny Studio in the Mission",
    location: "San Francisco, CA",
    pricePerNight: 120,
    imageUrl:
      "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=600&h=400&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=600&h=400&fit=crop",
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=600&h=400&fit=crop",
    ],
    rating: 4.91,
    reviewCount: 52,
    beds: 1,
    baths: 1,
  },
  {
    id: "w-2",
    title: "Beach House",
    location: "Malibu, CA",
    pricePerNight: 250,
    imageUrl:
      "https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?w=600&h=400&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?w=600&h=400&fit=crop",
      "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=600&h=400&fit=crop",
    ],
    rating: 4.95,
    reviewCount: 18,
    beds: 3,
    baths: 2,
  },
  {
    id: "w-3",
    title: "Mountain Cabin",
    location: "Lake Tahoe, CA",
    pricePerNight: 189,
    imageUrl:
      "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=600&h=400&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=600&h=400&fit=crop",
    ],
    rating: 4.82,
    reviewCount: 27,
    beds: 2,
    baths: 1,
  },
];

/* -------------------------------------------------------------------------- */
/*  Tab config                                                                 */
/* -------------------------------------------------------------------------- */

type Tab = "reservations" | "profile" | "wishlists";

const TABS: { id: Tab; label: string }[] = [
  { id: "reservations", label: "Reservations" },
  { id: "profile", label: "Profile" },
  { id: "wishlists", label: "Wishlists" },
];

const TAB_IDS: Tab[] = ["reservations", "profile", "wishlists"];

function parseTabParam(value: string | null): Tab {
  if (value && TAB_IDS.includes(value as Tab)) return value as Tab;
  return "reservations";
}

/* -------------------------------------------------------------------------- */
/*  Reservation card                                                           */
/* -------------------------------------------------------------------------- */

function BuyerReservationCard({
  res,
  onCancel,
}: {
  res: BuyerReservation;
  onCancel: (id: string) => void;
}) {
  const isUpcoming = res.status === "confirmed";

  return (
    <Card className="group/card relative flex flex-col overflow-hidden border-zinc-100 bg-white p-0 shadow-none sm:flex-row">
      {/* Image */}
      <div className="relative w-full shrink-0 overflow-hidden sm:w-[45%] sm:self-stretch">
        <div className="aspect-[4/3] w-full sm:absolute sm:inset-0 sm:aspect-auto">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={res.propertyImage}
            alt={res.propertyName}
            className="h-full w-full object-cover transition-transform duration-200 ease-out group-hover/card:scale-105"
          />
        </div>
      </div>

      {/* Content */}
      <div className="flex min-w-0 flex-1 flex-col justify-between px-3 py-4 sm:px-4 sm:py-5">
        <div className="space-y-2.5">
          {/* Property name + location */}
          <div>
            <p className="truncate text-sm font-semibold !text-black">{res.propertyName}</p>
            <p className="mt-0.5 truncate text-sm text-muted-foreground">{res.location}</p>
          </div>
          {/* Host row */}
          <div className="flex items-center gap-2">
            <Avatar className="size-5 shrink-0">
              <AvatarImage src={res.hostPhoto} alt={res.hostName} />
              <AvatarFallback className="bg-zinc-100 text-[8px] font-semibold text-zinc-600">
                {res.hostInitials}
              </AvatarFallback>
            </Avatar>
            <p className="min-w-0 truncate text-sm text-muted-foreground">
              Hosted by {res.hostName}
            </p>
          </div>
          {/* Dates + details */}
          <div className="space-y-1 text-sm text-muted-foreground">
            <div className="flex items-center gap-1.5">
              <CalendarDays className="size-3.5 shrink-0" aria-hidden />
              <span className="truncate">
                {res.checkIn} – {res.checkOut}
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <Users className="size-3.5 shrink-0" aria-hidden />
              <span>
                {res.nights} night{res.nights !== 1 ? "s" : ""} ·{" "}
                {res.guests} guest{res.guests !== 1 ? "s" : ""}
              </span>
            </div>
          </div>
        </div>

        {/* Total + actions */}
        <div className="mt-3 flex flex-wrap items-center justify-between gap-x-2 gap-y-2 border-t border-zinc-100 pt-4">
          <p className="shrink-0 text-sm text-zinc-900">
            <span className="font-semibold">${res.total.toLocaleString()}</span>
            <span className="text-muted-foreground"> total</span>
          </p>
          {isUpcoming && (
            <div className="flex flex-wrap items-center gap-1">
              <Button
                variant="outline"
                size="sm"
                className="h-7 gap-1 rounded-[5px] border-zinc-100 px-2.5 text-xs font-medium text-zinc-700 shadow-none hover:border-red-200 hover:bg-red-50 hover:text-red-600"
                onClick={() => onCancel(res.id)}
              >
                <X className="size-3 shrink-0" />
                Cancel
              </Button>
              <Button
                size="sm"
                asChild
                className="h-7 gap-1 rounded-[5px] border-zinc-100 px-2.5 text-xs font-medium shadow-none"
              >
                <Link href="/messages">
                  <MessageCircle className="size-3 shrink-0" />
                  Message
                </Link>
              </Button>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}

/* -------------------------------------------------------------------------- */
/*  Reservations tab                                                           */
/* -------------------------------------------------------------------------- */

const CANCEL_TEMPLATE =
  "I need to cancel my reservation. I apologize for any inconvenience this may cause.";

function ReservationsTab() {
  const [reservations, setReservations] = useState<BuyerReservation[]>(BUYER_RESERVATIONS);
  const [subTab, setSubTab] = useState<"upcoming" | "past">("upcoming");
  const [cancelId, setCancelId] = useState<string | null>(null);
  const [cancelMessage, setCancelMessage] = useState(CANCEL_TEMPLATE);

  const today = new Date("2026-02-23");

  const grouped = {
    upcoming: reservations.filter((r) => {
      if (r.status === "cancelled") return false;
      const cin = new Date(r.checkIn);
      return cin > today && r.status === "confirmed";
    }),
    past: reservations.filter((r) => {
      const cout = new Date(r.checkOut);
      return cout < today || r.status === "cancelled";
    }),
  };

  const items = grouped[subTab];

  function confirmCancel() {
    if (!cancelId) return;
    setReservations((prev) =>
      prev.map((r) => (r.id === cancelId ? { ...r, status: "cancelled" as const } : r))
    );
    setCancelId(null);
    setCancelMessage(CANCEL_TEMPLATE);
    setSubTab("past");
  }

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-xl font-bold text-zinc-900">Reservations</h2>
        <p className="mt-0.5 text-sm text-muted-foreground">Your upcoming and past stays</p>
      </div>

      {/* Sub-tabs */}
      <div className="flex gap-1 rounded-lg bg-zinc-100 p-1 w-fit">
        {(["upcoming", "past"] as const).map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => setSubTab(tab)}
            className={cn(
              "flex items-center gap-2 rounded-md px-3 py-1.5 text-sm font-medium capitalize transition-colors",
              subTab === tab
                ? "bg-white text-zinc-900 shadow-sm"
                : "text-muted-foreground hover:text-zinc-900"
            )}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
            {grouped[tab].length > 0 && (
              <span className="rounded-full bg-zinc-200/80 px-1.5 py-0.5 text-xs font-medium tabular-nums text-zinc-600">
                {grouped[tab].length}
              </span>
            )}
          </button>
        ))}
      </div>

      {items.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-2 py-14 text-center">
          <CalendarDays className="size-8 text-zinc-400" />
          <p className="text-sm text-muted-foreground">
            {subTab === "upcoming" ? "No upcoming reservations" : "No past reservations"}
          </p>
          {subTab === "upcoming" && (
            <Button asChild size="sm" className="mt-1 h-9 rounded-[5px] shadow-none">
              <Link href="/search">Browse homes</Link>
            </Button>
          )}
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {items.map((r) => (
            <BuyerReservationCard
              key={r.id}
              res={r}
              onCancel={(id) => {
                setCancelId(id);
                setCancelMessage(CANCEL_TEMPLATE);
              }}
            />
          ))}
        </div>
      )}

      <Dialog open={!!cancelId} onOpenChange={(open) => !open && setCancelId(null)}>
        <DialogContent className="w-full max-w-md border-zinc-100 shadow-lg">
          <DialogHeader>
            <DialogTitle className="text-left text-lg font-semibold text-zinc-900">
              Cancel reservation
            </DialogTitle>
            <DialogDescription className="text-left text-zinc-500">
              A message will be sent to the host. Cancellation may be subject to the host&apos;s
              policy.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3 py-2">
            <Label htmlFor="cancel-message" className="text-xs font-semibold text-zinc-900">
              Message to host
            </Label>
            <Textarea
              id="cancel-message"
              value={cancelMessage}
              onChange={(e) => setCancelMessage(e.target.value)}
              placeholder="Write a message..."
              className="min-h-[100px] resize-y rounded-[5px] border-zinc-200 text-sm shadow-none focus-visible:border-zinc-900 focus-visible:ring-0"
              rows={3}
            />
          </div>
          <DialogFooter className="flex flex-row gap-2 sm:justify-end">
            <Button
              variant="outline"
              className="h-11 rounded-[5px] font-medium shadow-none"
              onClick={() => setCancelId(null)}
            >
              Keep reservation
            </Button>
            <Button
              variant="destructive"
              className="h-11 rounded-[5px] font-medium shadow-none"
              onClick={confirmCancel}
            >
              Cancel reservation
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Profile tab                                                                */
/* -------------------------------------------------------------------------- */

type BuyerProfile = {
  photo: string;
  firstName: string;
  lastName: string;
  location: string;
  languages: string[];
  about: string;
};

const LANGUAGE_OPTIONS = [
  "English",
  "Spanish",
  "French",
  "Mandarin",
  "German",
  "Japanese",
  "Portuguese",
  "Italian",
  "Korean",
  "Arabic",
  "Hindi",
  "Dutch",
  "Other",
];

function ProfileTab() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [profile, setProfile] = useState<BuyerProfile>({
    photo: BUYER_PHOTO,
    firstName: "Alex",
    lastName: "Chen",
    location: "San Francisco, CA",
    languages: ["English", "Mandarin"],
    about:
      "Travel enthusiast who loves discovering new places and meeting new people. Avid hiker and foodie always looking for hidden gems.",
  });
  const [saved, setSaved] = useState(false);
  const [languagesOpen, setLanguagesOpen] = useState(false);

  function update(key: keyof BuyerProfile, value: string | string[]) {
    setProfile((prev) => ({ ...prev, [key]: value }));
  }

  function toggleLanguage(lang: string) {
    setProfile((prev) => ({
      ...prev,
      languages: prev.languages.includes(lang)
        ? prev.languages.filter((l) => l !== lang)
        : [...prev.languages, lang],
    }));
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file || !file.type.startsWith("image/")) {
      e.target.value = "";
      return;
    }
    const reader = new FileReader();
    reader.onload = () => update("photo", reader.result as string);
    reader.readAsDataURL(file);
    e.target.value = "";
  }

  function clearPhoto() {
    update("photo", "");
  }

  function handleSave() {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-zinc-900">Profile</h2>
        <p className="mt-0.5 text-sm text-muted-foreground">
          Your public profile visible to hosts
        </p>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        aria-hidden
        onChange={handleFileChange}
      />

      {/* Avatar */}
      <div className="group relative flex flex-col items-center gap-3">
        {profile.photo ? (
          <>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={profile.photo}
              alt="Profile"
              className="size-20 rounded-full border border-zinc-200 object-cover"
            />
            <button
              type="button"
              onClick={clearPhoto}
              className="absolute top-0 flex size-20 items-center justify-center rounded-full bg-black/20 opacity-0 transition-opacity hover:opacity-100 group-hover:opacity-100"
              aria-label="Remove photo"
            >
              <span className="flex size-9 items-center justify-center rounded-full bg-zinc-700 text-white shadow-md">
                <Trash2 className="size-4" />
              </span>
            </button>
          </>
        ) : (
          <Avatar className="size-20 border border-zinc-200">
            <AvatarFallback className="bg-zinc-100 text-2xl font-semibold text-zinc-500">
              {profile.firstName[0]}
              {profile.lastName[0]}
            </AvatarFallback>
          </Avatar>
        )}
        <Button
          variant="outline"
          size="sm"
          className="rounded-[5px] shadow-none"
          onClick={() => fileInputRef.current?.click()}
        >
          Upload photo
        </Button>
      </div>

      {/* Fields */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor="buyer-first-name" className="text-xs font-semibold text-zinc-900">
            First name
          </Label>
          <Input
            id="buyer-first-name"
            value={profile.firstName}
            onChange={(e) => update("firstName", e.target.value)}
            className="h-11 rounded-[5px] border-zinc-200 shadow-none focus-visible:border-zinc-900 focus-visible:ring-0"
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="buyer-last-name" className="text-xs font-semibold text-zinc-900">
            Last name
          </Label>
          <Input
            id="buyer-last-name"
            value={profile.lastName}
            onChange={(e) => update("lastName", e.target.value)}
            className="h-11 rounded-[5px] border-zinc-200 shadow-none focus-visible:border-zinc-900 focus-visible:ring-0"
          />
        </div>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="buyer-location" className="text-xs font-semibold text-zinc-900">
          Where I live
        </Label>
        <Input
          id="buyer-location"
          value={profile.location}
          onChange={(e) => update("location", e.target.value)}
          placeholder="e.g. San Francisco, CA"
          className="h-11 rounded-[5px] border-zinc-200 shadow-none focus-visible:border-zinc-900 focus-visible:ring-0"
        />
      </div>

      <div className="space-y-1.5">
        <Label className="text-xs font-semibold text-zinc-900">
          Languages I speak
        </Label>
        <Popover open={languagesOpen} onOpenChange={setLanguagesOpen}>
          <PopoverTrigger asChild>
            <button
              type="button"
              className="flex h-11 w-full items-center justify-between rounded-[5px] border border-zinc-200 bg-white px-3 text-left text-sm text-zinc-900 shadow-none hover:bg-zinc-50"
            >
              <span className={profile.languages.length > 0 ? "text-foreground" : "text-muted-foreground"}>
                {profile.languages.length > 0 ? profile.languages.join(", ") : "Select languages"}
              </span>
              <ChevronDown className="size-4 shrink-0 text-muted-foreground" />
            </button>
          </PopoverTrigger>
          <PopoverContent align="start" className="w-[var(--radix-popover-trigger-width)] p-0" sideOffset={4}>
            <div className="max-h-[280px] overflow-y-auto py-2">
              {LANGUAGE_OPTIONS.map((lang) => (
                <label
                  key={lang}
                  className="flex cursor-pointer items-center gap-3 px-3 py-2 text-sm hover:bg-zinc-50"
                >
                  <Checkbox
                    checked={profile.languages.includes(lang)}
                    onCheckedChange={() => toggleLanguage(lang)}
                  />
                  <span>{lang}</span>
                </label>
              ))}
            </div>
          </PopoverContent>
        </Popover>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="buyer-about" className="text-xs font-semibold text-zinc-900">
          About me <span className="font-normal text-muted-foreground">(optional)</span>
        </Label>
        <Textarea
          id="buyer-about"
          value={profile.about}
          onChange={(e) => update("about", e.target.value)}
          placeholder="Tell hosts a bit about yourself — where you're from, your interests, or why you love to travel."
          rows={4}
          className="rounded-[5px] border-zinc-200 shadow-none focus-visible:border-zinc-900 focus-visible:ring-0"
        />
      </div>

      <div className="flex items-center justify-between">
        <div>
          {saved && (
            <p className="text-sm font-medium text-emerald-600">Profile saved!</p>
          )}
        </div>
        <Button
          className="h-11 rounded-[5px] bg-primary font-medium shadow-none hover:bg-primary/90"
          onClick={handleSave}
        >
          Save profile
        </Button>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Wishlists tab                                                              */
/* -------------------------------------------------------------------------- */

function WishlistsTab() {
  const [wishlist, setWishlist] = useState<WishlistItem[]>(INITIAL_WISHLIST);

  function handleRemove(id: string) {
    setWishlist((prev) => prev.filter((item) => item.id !== id));
  }

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-xl font-bold text-zinc-900">Wishlists</h2>
        <p className="mt-0.5 text-sm text-muted-foreground">
          Homes you&apos;ve saved. Tap the heart to remove.
        </p>
      </div>

      {wishlist.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-2 py-14 text-center">
          <Heart className="size-8 text-zinc-400" />
          <p className="text-sm text-muted-foreground">No saved homes yet</p>
          <Button asChild size="sm" className="mt-1 h-9 rounded-[5px] shadow-none">
            <Link href="/search">Browse homes</Link>
          </Button>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {wishlist.map((item) => (
            <Card
              key={item.id}
              className="flex flex-col gap-2 overflow-hidden border-zinc-100 p-0 shadow-none"
            >
              <Link href="/listing/e1" className="group block">
                <ListingImageWithWishlist
                  images={item.images?.length ? item.images : [item.imageUrl]}
                  alt={item.title}
                  showWishlist
                  defaultWishlisted
                  onWishlistChange={(wishlisted) => {
                    if (!wishlisted) handleRemove(item.id);
                  }}
                  className="rounded-t-xl rounded-b-none"
                />
                <div className="mt-3.5 px-4 pb-4">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="min-w-0 flex-1 truncate text-sm font-semibold leading-snug !text-black group-hover:underline">
                      {item.title}
                    </h3>
                    {item.reviewCount > 0 && (
                      <span className="flex shrink-0 items-center gap-1 pt-px">
                        <Star className="size-3.5 fill-zinc-900 text-zinc-900" aria-hidden />
                        <span className="text-sm tabular-nums text-zinc-900">
                          {item.rating.toFixed(2)}
                        </span>
                      </span>
                    )}
                  </div>
                  <p className="mt-0.5 text-sm text-muted-foreground">{item.location}</p>
                  <p className="text-sm text-muted-foreground">
                    {item.beds} bed{item.beds !== 1 ? "s" : ""} · {item.baths} bath
                    {item.baths !== 1 ? "s" : ""}
                  </p>
                  <p className="mt-0.5 text-sm text-zinc-900">
                    <span className="font-semibold">${item.pricePerNight}</span>
                    <span className="text-muted-foreground"> / night</span>
                  </p>
                </div>
              </Link>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Main component                                                             */
/* -------------------------------------------------------------------------- */

export function BuyerDashboardClient() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const tabParam = searchParams.get("tab");
  const activeTab = parseTabParam(tabParam);

  const [lineStyle, setLineStyle] = useState<{ left: number; width: number }>({
    left: 0,
    width: 0,
  });
  const [mobileLineStyle, setMobileLineStyle] = useState<{ left: number; width: number }>({
    left: 0,
    width: 0,
  });
  const tabListRef = useRef<HTMLDivElement>(null);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const tabTextRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const mobileTabListRef = useRef<HTMLDivElement>(null);
  const mobileTabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const mobileTabTextRefs = useRef<(HTMLSpanElement | null)[]>([]);

  function setActiveTab(tab: Tab) {
    const params = new URLSearchParams(searchParams.toString());
    params.set("tab", tab);
    router.replace(`${pathname}?${params.toString()}`);
  }

  useEffect(() => {
    if (tabParam === null) {
      router.replace(`${pathname}?tab=reservations`);
    }
  }, [pathname, router, tabParam]);

  // Desktop sliding underline
  useEffect(() => {
    const listEl = tabListRef.current;
    const idx = TABS.findIndex((t) => t.id === activeTab);
    const btn = tabRefs.current[idx];
    const textEl = tabTextRefs.current[idx];
    if (listEl && btn && textEl) {
      const listRect = listEl.getBoundingClientRect();
      const btnRect = btn.getBoundingClientRect();
      const textRect = textEl.getBoundingClientRect();
      const textWidth = textRect.width;
      setLineStyle({
        left: btnRect.left - listRect.left + (btnRect.width - textWidth) / 2,
        width: textWidth,
      });
    }
  }, [activeTab]);

  // Mobile sliding underline
  useLayoutEffect(() => {
    const listEl = mobileTabListRef.current;
    const idx = TABS.findIndex((t) => t.id === activeTab);
    const btn = mobileTabRefs.current[idx];
    const textEl = mobileTabTextRefs.current[idx];
    if (listEl && btn && textEl) {
      const listRect = listEl.getBoundingClientRect();
      const btnRect = btn.getBoundingClientRect();
      const textRect = textEl.getBoundingClientRect();
      const textWidth = textRect.width;
      setMobileLineStyle({
        left: btnRect.left - listRect.left + (btnRect.width - textWidth) / 2,
        width: textWidth,
      });
    }
  }, [activeTab]);

  useEffect(() => {
    function onResize() {
      const listEl = mobileTabListRef.current;
      const idx = TABS.findIndex((t) => t.id === activeTab);
      const btn = mobileTabRefs.current[idx];
      const textEl = mobileTabTextRefs.current[idx];
      if (listEl && btn && textEl) {
        const listRect = listEl.getBoundingClientRect();
        const btnRect = btn.getBoundingClientRect();
        const textRect = textEl.getBoundingClientRect();
        const textWidth = textRect.width;
        setMobileLineStyle({
          left: btnRect.left - listRect.left + (btnRect.width - textWidth) / 2,
          width: textWidth,
        });
      }
    }
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [activeTab]);

  return (
    <div className="flex min-h-screen flex-col bg-white -mt-16">
      {/* ── Header ── */}
      <header className="sticky top-0 z-50 w-full border-b border-zinc-100 bg-white pt-[env(safe-area-inset-top)]">
        <div className="relative flex h-16 w-full items-center justify-between px-4 sm:px-6">

          {/* Left: logo */}
          <div className="flex w-40 shrink-0 items-center">
            <Link href="/" aria-label="Rento home">
              <Image
                src="https://e47b698e59208764aee00d1d8e14313c.cdn.bubble.io/f1770319743776x921681514520088300/rento.png"
                alt="Rento"
                width={72}
                height={20}
                className="h-5 w-auto object-contain"
                priority
              />
            </Link>
          </div>

          {/* Center: tab nav */}
          <nav className="absolute left-1/2 top-0 hidden h-16 -translate-x-1/2 items-center md:flex">
            <div ref={tabListRef} className="relative flex h-full items-center">
              {TABS.map(({ id, label }, i) => (
                <button
                  key={id}
                  ref={(el) => { tabRefs.current[i] = el; }}
                  onClick={() => setActiveTab(id)}
                  className={cn(
                    "relative h-full px-4 text-sm font-medium transition-colors",
                    activeTab === id
                      ? "text-zinc-900"
                      : "text-muted-foreground hover:text-zinc-900"
                  )}
                >
                  <span ref={(el) => { tabTextRefs.current[i] = el; }}>{label}</span>
                </button>
              ))}
              <span
                className="pointer-events-none absolute bottom-0 left-0 h-0.5 rounded-full bg-zinc-900 transition-all duration-300 ease-out"
                style={{ left: lineStyle.left, width: lineStyle.width }}
                aria-hidden
              />
            </div>
          </nav>

          {/* Right: avatar */}
          <div className="flex w-40 shrink-0 items-center justify-end">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  type="button"
                  className="flex shrink-0 rounded-full focus-visible:outline focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  aria-label="Account menu"
                >
                  <Avatar className="size-9 shrink-0 border border-zinc-200">
                    <AvatarImage src={BUYER_PHOTO} alt="Alex Chen" />
                    <AvatarFallback className="bg-zinc-900 text-xs font-bold text-white">
                      AC
                    </AvatarFallback>
                  </Avatar>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                className="w-48 min-w-48 rounded-lg border-zinc-100 p-2 shadow-lg"
              >
                <DropdownMenuItem asChild>
                  <Link href="/dashboard/buyer">My dashboard</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/search">Browse homes</Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator className="-mx-1 my-1 h-px bg-zinc-100" />
                <DropdownMenuItem asChild>
                  <Link href="/">Log out</Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Mobile tab bar */}
        <div
          className="overflow-x-auto border-t border-zinc-100 md:hidden"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          <div ref={mobileTabListRef} className="relative flex flex-nowrap items-center">
            {TABS.map(({ id, label }, i) => (
              <button
                key={id}
                ref={(el) => { mobileTabRefs.current[i] = el; }}
                onClick={() => setActiveTab(id)}
                className={cn(
                  "relative shrink-0 whitespace-nowrap px-4 py-3 text-sm font-medium transition-colors",
                  activeTab === id ? "text-zinc-900" : "text-muted-foreground"
                )}
              >
                <span ref={(el) => { mobileTabTextRefs.current[i] = el; }}>{label}</span>
              </button>
            ))}
            <span
              className="pointer-events-none absolute bottom-0 left-0 h-0.5 rounded-full bg-zinc-900 transition-all duration-300 ease-out"
              style={{ left: mobileLineStyle.left, width: mobileLineStyle.width }}
              aria-hidden
            />
          </div>
        </div>
      </header>

      {/* ── Content ── */}
      <main className="flex-1 py-8">
        <div className="container max-w-[1400px] px-4 sm:px-6">
          <div
            className={cn(
              "mx-auto",
              activeTab === "profile" ? "max-w-2xl" : "max-w-4xl"
            )}
          >
            {activeTab === "reservations" && <ReservationsTab />}
            {activeTab === "profile" && <ProfileTab />}
            {activeTab === "wishlists" && <WishlistsTab />}
          </div>
        </div>
      </main>
    </div>
  );
}
