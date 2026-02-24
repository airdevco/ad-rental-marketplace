"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Plus,
  Eye,
  Pencil,
  Trash2,
  ChevronRight,
  ExternalLink,
  Check,
  Building2,
  Star,
  CalendarDays,
  Users,
  DollarSign,
  TrendingUp,
  Wifi,
  Home,
  MapPin,
  ArrowUpRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { RemoveListingDialog } from "@/components/dashboard/remove-listing-dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

/* -------------------------------------------------------------------------- */
/*  Mock data                                                                  */
/* -------------------------------------------------------------------------- */

type MockListing = {
  id: string;
  title: string;
  location: string;
  pricePerNight: number;
  status: "Active" | "Draft";
  imageUrl: string;
  beds: number;
  baths: number;
  guests: number;
  rating: number;
  reviewCount: number;
};

const MY_LISTINGS: MockListing[] = [
  {
    id: "1",
    title: "Sunny Studio in the Mission",
    location: "San Francisco, CA",
    pricePerNight: 129,
    status: "Active",
    imageUrl: "https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?w=400&h=300&fit=crop",
    beds: 0,
    baths: 1,
    guests: 2,
    rating: 4.92,
    reviewCount: 48,
  },
  {
    id: "2",
    title: "Modern 2BR in SOMA",
    location: "San Francisco, CA",
    pricePerNight: 189,
    status: "Active",
    imageUrl: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=400&h=300&fit=crop",
    beds: 2,
    baths: 1,
    guests: 4,
    rating: 4.8,
    reviewCount: 22,
  },
  {
    id: "3",
    title: "Cozy Noe Valley Bungalow",
    location: "San Francisco, CA",
    pricePerNight: 215,
    status: "Draft",
    imageUrl: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=400&h=300&fit=crop",
    beds: 2,
    baths: 2,
    guests: 5,
    rating: 0,
    reviewCount: 0,
  },
];

type BookingRow = {
  id: string;
  guestName: string;
  guestInitials: string;
  listingTitle: string;
  checkIn: string;
  checkOut: string;
  nights: number;
  total: number;
  status: "Confirmed" | "Completed" | "Cancelled";
  upcoming: boolean;
};

const BOOKINGS: BookingRow[] = [
  {
    id: "b1",
    guestName: "Sarah Kim",
    guestInitials: "SK",
    listingTitle: "Sunny Studio in the Mission",
    checkIn: "Mar 14, 2026",
    checkOut: "Mar 18, 2026",
    nights: 4,
    total: 516,
    status: "Confirmed",
    upcoming: true,
  },
  {
    id: "b2",
    guestName: "Marcus Lee",
    guestInitials: "ML",
    listingTitle: "Modern 2BR in SOMA",
    checkIn: "Mar 22, 2026",
    checkOut: "Mar 25, 2026",
    nights: 3,
    total: 567,
    status: "Confirmed",
    upcoming: true,
  },
  {
    id: "b3",
    guestName: "Priya Patel",
    guestInitials: "PP",
    listingTitle: "Sunny Studio in the Mission",
    checkIn: "Feb 5, 2026",
    checkOut: "Feb 8, 2026",
    nights: 3,
    total: 387,
    status: "Completed",
    upcoming: false,
  },
  {
    id: "b4",
    guestName: "Jordan Rivera",
    guestInitials: "JR",
    listingTitle: "Sunny Studio in the Mission",
    checkIn: "Jan 10, 2026",
    checkOut: "Jan 14, 2026",
    nights: 4,
    total: 516,
    status: "Completed",
    upcoming: false,
  },
  {
    id: "b5",
    guestName: "Emily Chen",
    guestInitials: "EC",
    listingTitle: "Modern 2BR in SOMA",
    checkIn: "Dec 20, 2025",
    checkOut: "Dec 22, 2025",
    nights: 2,
    total: 378,
    status: "Cancelled",
    upcoming: false,
  },
];

const PAYOUT_HISTORY = [
  { id: "p1", date: "Feb 10, 2026", amount: 387, listing: "Sunny Studio", status: "Paid" },
  { id: "p2", date: "Jan 16, 2026", amount: 516, listing: "Sunny Studio", status: "Paid" },
  { id: "p3", date: "Dec 26, 2025", amount: 378, listing: "Modern 2BR", status: "Paid" },
  { id: "p4", date: "Nov 30, 2025", amount: 215, listing: "Sunny Studio", status: "Paid" },
];

/* -------------------------------------------------------------------------- */
/*  Helpers                                                                    */
/* -------------------------------------------------------------------------- */

function StatusBadge({ status }: { status: "Active" | "Draft" | "Confirmed" | "Completed" | "Cancelled" | "Paid" }) {
  const map: Record<string, string> = {
    Active: "bg-green-50 text-green-700",
    Draft: "bg-zinc-100 text-muted-foreground",
    Confirmed: "bg-blue-50 text-blue-700",
    Completed: "bg-green-50 text-green-700",
    Cancelled: "bg-red-50 text-red-600",
    Paid: "bg-green-50 text-green-700",
  };
  return (
    <span className={cn("inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold", map[status] ?? "bg-zinc-100 text-zinc-700")}>
      {status}
    </span>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">{children}</p>
  );
}

function StatCard({
  label,
  value,
  sub,
  icon: Icon,
}: {
  label: string;
  value: string;
  sub?: string;
  icon: React.ComponentType<{ className?: string }>;
}) {
  return (
    <div className="rounded-xl border border-zinc-100 bg-white p-5">
      <div className="flex items-start justify-between">
        <div>
          <SectionLabel>{label}</SectionLabel>
          <p className="mt-2 text-2xl font-black tracking-tight text-zinc-900">{value}</p>
          {sub && <p className="mt-0.5 text-xs text-muted-foreground">{sub}</p>}
        </div>
        <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-zinc-50">
          <Icon className="size-4 text-muted-foreground" />
        </div>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Edit listing sheet                                                         */
/* -------------------------------------------------------------------------- */

function EditListingSheet({
  listing,
  open,
  onClose,
}: {
  listing: MockListing | null;
  open: boolean;
  onClose: () => void;
}) {
  const [title, setTitle] = useState(listing?.title ?? "");
  const [price, setPrice] = useState(String(listing?.pricePerNight ?? ""));

  if (!listing) return null;

  return (
    <Sheet open={open} onOpenChange={(v) => !v && onClose()}>
      <SheetContent side="right" className="w-full max-w-md overflow-y-auto">
        <SheetHeader>
          <SheetTitle className="text-lg font-black tracking-tight">Edit listing</SheetTitle>
        </SheetHeader>
        <div className="mt-6 space-y-5">
          <div className="space-y-1.5">
            <Label htmlFor="edit-title" className="text-xs font-semibold text-zinc-900">Title</Label>
            <Input
              id="edit-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="h-11 rounded-[5px] border-zinc-200 shadow-none focus-visible:border-zinc-900 focus-visible:ring-0"
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="edit-price" className="text-xs font-semibold text-zinc-900">Nightly price (USD)</Label>
            <div className="relative">
              <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-sm text-zinc-500">$</span>
              <Input
                id="edit-price"
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="h-11 rounded-[5px] border-zinc-200 pl-7 shadow-none focus-visible:border-zinc-900 focus-visible:ring-0"
              />
            </div>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="edit-desc" className="text-xs font-semibold text-zinc-900">Description</Label>
            <Textarea
              id="edit-desc"
              rows={5}
              placeholder="Describe your property…"
              className="rounded-[5px] border-zinc-200 shadow-none focus-visible:border-zinc-900 focus-visible:ring-0"
            />
          </div>
          <Separator className="bg-zinc-100" />
          <div className="flex gap-3">
            <Button
              variant="outline"
              className="h-11 flex-1 rounded-[5px] font-semibold shadow-none"
              onClick={onClose}
            >
              Cancel
            </Button>
            <Button
              className="h-11 flex-1 rounded-[5px] bg-primary font-semibold shadow-none hover:bg-primary/90"
              onClick={onClose}
            >
              Save changes
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}

/* -------------------------------------------------------------------------- */
/*  Tab: Listings                                                              */
/* -------------------------------------------------------------------------- */

function ListingsTab() {
  const [editTarget, setEditTarget] = useState<MockListing | null>(null);

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-black tracking-tight text-zinc-900">My listings</h2>
          <p className="text-sm text-muted-foreground">{MY_LISTINGS.length} properties</p>
        </div>
        <Button
          asChild
          className="h-11 rounded-[5px] bg-primary font-semibold shadow-none hover:bg-primary/90"
        >
          <Link href="/become-a-host">
            <Plus className="size-4" />
            Add new listing
          </Link>
        </Button>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {MY_LISTINGS.map((listing) => (
          <div key={listing.id} className="group overflow-hidden rounded-xl border border-zinc-100 bg-white">
            <div className="relative aspect-[16/10] overflow-hidden bg-zinc-100">
              <Image
                src={listing.imageUrl}
                alt={listing.title}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-105"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              />
              <div className="absolute left-3 top-3">
                <StatusBadge status={listing.status} />
              </div>
            </div>
            <div className="p-4">
              <p className="font-semibold text-zinc-900 line-clamp-1">{listing.title}</p>
              <div className="mt-0.5 flex items-center gap-1">
                <MapPin className="size-3 text-muted-foreground" />
                <p className="text-xs text-muted-foreground">{listing.location}</p>
              </div>
              <div className="mt-2 flex items-center justify-between">
                <p className="text-sm font-bold text-zinc-900">
                  ${listing.pricePerNight}
                  <span className="text-xs font-normal text-muted-foreground"> / night</span>
                </p>
                {listing.reviewCount > 0 && (
                  <div className="flex items-center gap-1">
                    <Star className="size-3 fill-zinc-900 text-zinc-900" />
                    <span className="text-xs font-semibold text-zinc-900">{listing.rating}</span>
                    <span className="text-xs text-muted-foreground">({listing.reviewCount})</span>
                  </div>
                )}
              </div>
            </div>
            <Separator className="bg-zinc-100" />
            <div className="flex items-center gap-1 px-3 py-2.5">
              <Button
                variant="ghost"
                size="sm"
                asChild
                className="h-8 flex-1 rounded-[5px] text-xs font-semibold text-zinc-700 shadow-none hover:bg-zinc-50"
              >
                <Link href={`/listing/${listing.id}`}>
                  <Eye className="size-3.5" />
                  View
                </Link>
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 flex-1 rounded-[5px] text-xs font-semibold text-zinc-700 shadow-none hover:bg-zinc-50"
                onClick={() => setEditTarget(listing)}
              >
                <Pencil className="size-3.5" />
                Edit
              </Button>
              <RemoveListingDialog listingTitle={listing.title}>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 flex-1 rounded-[5px] text-xs font-semibold text-red-500 shadow-none hover:bg-red-50 hover:text-red-600"
                >
                  <Trash2 className="size-3.5" />
                  Remove
                </Button>
              </RemoveListingDialog>
            </div>
          </div>
        ))}

        {/* Empty-state add card */}
        <Link
          href="/become-a-host"
          className="flex aspect-auto min-h-52 flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed border-zinc-200 bg-white p-6 text-center transition-colors hover:border-zinc-400 hover:bg-zinc-50"
        >
          <div className="flex size-11 items-center justify-center rounded-full bg-zinc-100">
            <Plus className="size-5 text-muted-foreground" />
          </div>
          <div>
            <p className="font-semibold text-zinc-900">Add a listing</p>
            <p className="mt-0.5 text-sm text-muted-foreground">List another property to earn more</p>
          </div>
        </Link>
      </div>

      <EditListingSheet
        listing={editTarget}
        open={!!editTarget}
        onClose={() => setEditTarget(null)}
      />
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Tab: Bookings                                                              */
/* -------------------------------------------------------------------------- */

function BookingsTab() {
  const [subTab, setSubTab] = useState<"upcoming" | "past">("upcoming");
  const filtered = BOOKINGS.filter((b) => (subTab === "upcoming" ? b.upcoming : !b.upcoming));

  return (
    <div>
      <h2 className="text-lg font-black tracking-tight text-zinc-900">Bookings</h2>
      <div className="mt-4 flex gap-1 border-b border-zinc-100">
        {(["upcoming", "past"] as const).map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setSubTab(t)}
            className={cn(
              "px-4 pb-3 text-sm font-semibold capitalize transition-colors",
              subTab === t
                ? "border-b-2 border-zinc-900 text-zinc-900"
                : "text-muted-foreground hover:text-zinc-700"
            )}
          >
            {t}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="mt-10 flex flex-col items-center gap-3 text-center">
          <CalendarDays className="size-10 text-muted-foreground" />
          <p className="font-semibold text-zinc-900">No {subTab} bookings</p>
          <p className="text-sm text-muted-foreground">
            {subTab === "upcoming"
              ? "When guests book your properties, they'll appear here."
              : "Your completed bookings will show here."}
          </p>
        </div>
      ) : (
        <div className="mt-4 divide-y divide-zinc-100 rounded-xl border border-zinc-100 bg-white">
          {filtered.map((booking) => (
            <div key={booking.id} className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:gap-4">
              <Avatar className="size-10 shrink-0">
                <AvatarFallback className="bg-zinc-100 text-xs font-bold text-zinc-600">
                  {booking.guestInitials}
                </AvatarFallback>
              </Avatar>
              <div className="min-w-0 flex-1">
                <p className="font-semibold text-zinc-900">{booking.guestName}</p>
                <p className="mt-0.5 text-sm text-muted-foreground">{booking.listingTitle}</p>
                <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-0.5 text-xs text-muted-foreground">
                  <span>{booking.checkIn} → {booking.checkOut}</span>
                  <span>{booking.nights} nights</span>
                </div>
              </div>
              <div className="flex shrink-0 items-center gap-3">
                <div className="text-right">
                  <p className="text-sm font-bold text-zinc-900">${booking.total}</p>
                  <p className="text-xs text-muted-foreground">total</p>
                </div>
                <StatusBadge status={booking.status} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Tab: Availability                                                          */
/* -------------------------------------------------------------------------- */

function AvailabilityTab() {
  const [selectedListing, setSelectedListing] = useState(MY_LISTINGS[0].id);
  const [blocked, setBlocked] = useState<string[]>([]);
  const [saved, setSaved] = useState(false);

  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDay = new Date(year, month, 1).getDay();
  const monthName = today.toLocaleString("default", { month: "long", year: "numeric" });

  function toggleDate(key: string) {
    setSaved(false);
    setBlocked((prev) =>
      prev.includes(key) ? prev.filter((d) => d !== key) : [...prev, key]
    );
  }

  const listing = MY_LISTINGS.find((l) => l.id === selectedListing);

  return (
    <div>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-lg font-black tracking-tight text-zinc-900">Availability</h2>
          <p className="text-sm text-muted-foreground">Block dates to mark them as unavailable.</p>
        </div>
        <Select value={selectedListing} onValueChange={setSelectedListing}>
          <SelectTrigger className="h-10 w-56 rounded-[5px] border-zinc-200 shadow-none focus:ring-0">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="rounded-[5px]">
            {MY_LISTINGS.filter((l) => l.status === "Active").map((l) => (
              <SelectItem key={l.id} value={l.id}>{l.title}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {listing && (
        <div className="mt-5 flex items-center gap-3 rounded-xl border border-zinc-100 bg-zinc-50 p-3.5">
          <div className="relative size-10 shrink-0 overflow-hidden rounded-lg">
            <Image src={listing.imageUrl} alt={listing.title} fill className="object-cover" sizes="40px" />
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-zinc-900">{listing.title}</p>
            <p className="text-xs text-muted-foreground">{listing.location}</p>
          </div>
        </div>
      )}

      <div className="mt-5 max-w-sm rounded-xl border border-zinc-100 bg-white p-5">
        <p className="mb-4 text-center text-sm font-semibold text-zinc-900">{monthName}</p>
        <div className="grid grid-cols-7 gap-1 text-center">
          {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((d) => (
            <div key={d} className="py-1 text-xs font-medium text-muted-foreground">{d}</div>
          ))}
          {Array.from({ length: firstDay }).map((_, i) => (
            <div key={`e-${i}`} />
          ))}
          {Array.from({ length: daysInMonth }, (_, i) => {
            const day = i + 1;
            const key = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
            const isBlocked = blocked.includes(key);
            return (
              <button
                key={key}
                type="button"
                onClick={() => toggleDate(key)}
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
        <div className="mt-4 flex items-center gap-3 text-xs text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <span className="inline-block size-3 rounded-sm bg-zinc-200" /> Blocked
          </span>
          <span className="flex items-center gap-1.5">
            <span className="inline-block size-3 rounded-sm border border-zinc-200" /> Available
          </span>
        </div>
      </div>

      <div className="mt-5 flex items-center gap-3">
        <Button
          className="h-11 rounded-[5px] bg-primary font-semibold shadow-none hover:bg-primary/90"
          onClick={() => setSaved(true)}
        >
          Save availability
        </Button>
        {saved && (
          <span className="flex items-center gap-1.5 text-sm font-medium text-green-600">
            <Check className="size-4" /> Saved
          </span>
        )}
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Tab: Profile                                                               */
/* -------------------------------------------------------------------------- */

function ProfileTab() {
  const [name, setName] = useState("Alex");
  const [bio, setBio] = useState("San Francisco local who loves sharing my city with travelers. Superhost since 2022.");
  const [saved, setSaved] = useState(false);

  return (
    <div className="max-w-lg">
      <h2 className="text-lg font-black tracking-tight text-zinc-900">Host profile</h2>
      <p className="text-sm text-muted-foreground">This is what guests see on your public profile.</p>

      <div className="mt-6 space-y-6">
        <div className="flex items-center gap-4">
          <Avatar className="size-16 border-2 border-zinc-100">
            <AvatarFallback className="bg-zinc-100 text-xl font-bold text-zinc-600">
              {name.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div>
            <Button variant="outline" size="sm" className="rounded-[5px] shadow-none">
              Upload photo
            </Button>
            <p className="mt-1 text-xs text-muted-foreground">JPG, PNG or GIF. Max 5 MB.</p>
          </div>
        </div>

        <Separator className="bg-zinc-100" />

        <div className="space-y-1.5">
          <Label htmlFor="profile-name" className="text-xs font-semibold text-zinc-900">Display name</Label>
          <Input
            id="profile-name"
            value={name}
            onChange={(e) => { setName(e.target.value); setSaved(false); }}
            className="h-11 rounded-[5px] border-zinc-200 shadow-none focus-visible:border-zinc-900 focus-visible:ring-0"
          />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="profile-bio" className="text-xs font-semibold text-zinc-900">
            About you <span className="font-normal text-muted-foreground">(optional)</span>
          </Label>
          <Textarea
            id="profile-bio"
            value={bio}
            rows={4}
            onChange={(e) => { setBio(e.target.value); setSaved(false); }}
            className="rounded-[5px] border-zinc-200 shadow-none focus-visible:border-zinc-900 focus-visible:ring-0"
          />
        </div>

        <Separator className="bg-zinc-100" />

        <div className="rounded-xl border border-zinc-100 bg-zinc-50">
          {[
            { label: "Response rate", value: "98%" },
            { label: "Member since", value: "March 2022" },
            { label: "Languages", value: "English, Spanish" },
          ].map((row, i) => (
            <div key={row.label}>
              {i > 0 && <Separator className="bg-zinc-100" />}
              <div className="flex items-center justify-between px-4 py-3">
                <span className="text-sm text-muted-foreground">{row.label}</span>
                <span className="text-sm font-medium text-zinc-900">{row.value}</span>
              </div>
            </div>
          ))}
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Button
            className="h-11 rounded-[5px] bg-primary font-semibold shadow-none hover:bg-primary/90"
            onClick={() => setSaved(true)}
          >
            Save profile
          </Button>
          {saved && (
            <span className="flex items-center gap-1.5 text-sm font-medium text-green-600">
              <Check className="size-4" /> Saved
            </span>
          )}
        </div>

        <div className="flex items-center justify-between rounded-xl border border-zinc-100 p-4">
          <div className="flex items-center gap-3">
            <Home className="size-4 text-muted-foreground" />
            <span className="text-sm font-medium text-zinc-900">View public profile</span>
          </div>
          <button type="button" className="flex items-center gap-1 text-xs font-semibold text-primary hover:underline">
            Open <ArrowUpRight className="size-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Tab: Payouts                                                               */
/* -------------------------------------------------------------------------- */

function PayoutsTab() {
  const stripeConnected = true;

  const earnings = {
    thisMonth: 516,
    last30: 903,
    allTime: 1497,
  };

  return (
    <div>
      <h2 className="text-lg font-black tracking-tight text-zinc-900">Payouts</h2>

      <div className="mt-5 grid gap-3 sm:grid-cols-3">
        <StatCard label="This month" value={`$${earnings.thisMonth}`} sub="Feb 2026" icon={TrendingUp} />
        <StatCard label="Last 30 days" value={`$${earnings.last30}`} sub="Rolling 30 days" icon={CalendarDays} />
        <StatCard label="All time" value={`$${earnings.allTime}`} sub="Since March 2022" icon={DollarSign} />
      </div>

      <div className="mt-6">
        <SectionLabel>Payout method</SectionLabel>
        <div className="mt-3 flex items-center justify-between rounded-xl border border-zinc-100 bg-white p-4">
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-lg bg-[#635bff] text-[9px] font-bold text-white tracking-wider">
              stripe
            </div>
            <div>
              {stripeConnected ? (
                <>
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-semibold text-zinc-900">Stripe connected</p>
                    <StatusBadge status="Active" />
                  </div>
                  <p className="text-xs text-muted-foreground">Bank account ending ···· 4242</p>
                </>
              ) : (
                <>
                  <p className="text-sm font-semibold text-zinc-900">Stripe not connected</p>
                  <p className="text-xs text-muted-foreground">Connect to receive payouts</p>
                </>
              )}
            </div>
          </div>
          {stripeConnected ? (
            <a
              href="https://dashboard.stripe.com"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-xs font-semibold text-primary hover:underline"
            >
              Manage <ExternalLink className="size-3.5" />
            </a>
          ) : (
            <Button
              asChild
              size="sm"
              className="h-9 rounded-[5px] bg-[#635bff] font-semibold shadow-none hover:bg-[#5146e4]"
            >
              <a href="https://stripe.com/connect" target="_blank" rel="noopener noreferrer">
                Connect Stripe
              </a>
            </Button>
          )}
        </div>
      </div>

      <div className="mt-6">
        <SectionLabel>Payout history</SectionLabel>
        <div className="mt-3 overflow-hidden rounded-xl border border-zinc-100 bg-white">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-zinc-100 bg-zinc-50">
                <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground">Date</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground">Listing</th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-muted-foreground">Amount</th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-muted-foreground">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {PAYOUT_HISTORY.map((row) => (
                <tr key={row.id}>
                  <td className="px-4 py-3.5 text-muted-foreground">{row.date}</td>
                  <td className="px-4 py-3.5 font-medium text-zinc-900">{row.listing}</td>
                  <td className="px-4 py-3.5 text-right font-bold text-zinc-900">${row.amount}</td>
                  <td className="px-4 py-3.5 text-right">
                    <StatusBadge status="Paid" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Main dashboard                                                             */
/* -------------------------------------------------------------------------- */

export function SellerDashboardClient() {
  return (
    <div className="container mx-auto w-full max-w-[1100px] px-4 py-8 sm:px-6">
      {/* Header */}
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-zinc-900">Seller dashboard</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Manage your properties, bookings, and payouts.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Avatar className="size-9 border border-zinc-100">
            <AvatarFallback className="bg-zinc-100 text-sm font-bold text-zinc-600">A</AvatarFallback>
          </Avatar>
          <div>
            <p className="text-sm font-semibold text-zinc-900">Alex</p>
            <p className="text-xs text-muted-foreground">Superhost · 4.9 ★</p>
          </div>
        </div>
      </div>

      {/* Quick stats */}
      <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <StatCard label="Active listings" value={String(MY_LISTINGS.filter((l) => l.status === "Active").length)} icon={Building2} />
        <StatCard label="Upcoming bookings" value={String(BOOKINGS.filter((b) => b.upcoming).length)} icon={CalendarDays} />
        <StatCard label="Total guests" value={String(BOOKINGS.filter((b) => b.status !== "Cancelled").reduce((a, b) => a + b.nights, 0))} sub="nights hosted" icon={Users} />
        <StatCard label="Avg nightly rate" value="$178" icon={Wifi} />
      </div>

      <Separator className="my-6 bg-zinc-100" />

      {/* Tabs */}
      <Tabs defaultValue="listings" className="w-full">
        <TabsList variant="line" className="mb-6 w-full overflow-x-auto sm:w-auto">
          <TabsTrigger value="listings" className="px-4">Listings</TabsTrigger>
          <TabsTrigger value="bookings" className="px-4">Bookings</TabsTrigger>
          <TabsTrigger value="availability" className="px-4">Availability</TabsTrigger>
          <TabsTrigger value="profile" className="px-4">Profile</TabsTrigger>
          <TabsTrigger value="payouts" className="px-4">Payouts</TabsTrigger>
        </TabsList>

        <TabsContent value="listings">
          <ListingsTab />
        </TabsContent>
        <TabsContent value="bookings">
          <BookingsTab />
        </TabsContent>
        <TabsContent value="availability">
          <AvailabilityTab />
        </TabsContent>
        <TabsContent value="profile">
          <ProfileTab />
        </TabsContent>
        <TabsContent value="payouts">
          <PayoutsTab />
        </TabsContent>
      </Tabs>
    </div>
  );
}
