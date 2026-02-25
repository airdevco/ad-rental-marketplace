"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  Home,
  CalendarDays,
  Star,
  DollarSign,
  Flag,
  CheckCircle2,
  XCircle,
  Clock,
  Archive,
  ArchiveRestore,
  Trash2,
  Ban,
  ShieldCheck,
  Eye,
  MoreHorizontal,
  ArrowUpRight,
  Search,
  Menu,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { useMediaQuery } from "@/hooks/use-media-query";
import { Star as StarPhosphor } from "@phosphor-icons/react";

/* -------------------------------------------------------------------------- */
/*  Types                                                                      */
/* -------------------------------------------------------------------------- */

type Tab = "overview" | "users" | "listings" | "bookings" | "reviews" | "payouts";

type UserRole = "buyer" | "seller" | "admin";
type UserStatus = "active" | "suspended";
type ListingStatus = "active" | "pending" | "archived" | "rejected";
type BookingStatus = "confirmed" | "pending" | "completed" | "cancelled";
type PayoutStatus = "paid" | "pending" | "processing";

type AdminUser = {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  status: UserStatus;
  joined: string;
  photo?: string;
  initials: string;
  bookings?: number;
  listings?: number;
};

type AdminListing = {
  id: string;
  title: string;
  host: string;
  hostId: string;
  location: string;
  pricePerNight: number;
  status: ListingStatus;
  created: string;
  bookings: number;
  image: string;
};

type AdminBooking = {
  id: string;
  guest: string;
  guestId: string;
  guestPhoto?: string;
  host: string;
  listing: string;
  listingId: string;
  checkIn: string;
  checkOut: string;
  nights: number;
  total: number;
  status: BookingStatus;
};

type AdminReview = {
  id: string;
  author: string;
  authorId: string;
  authorPhoto?: string;
  listing: string;
  listingId: string;
  rating: number;
  date: string;
  text: string;
  flagged: boolean;
};

type AdminPayout = {
  id: string;
  host: string;
  hostId: string;
  hostPhoto?: string;
  period: string;
  bookings: number;
  gross: number;
  fee: number;
  net: number;
  status: PayoutStatus;
};

/* -------------------------------------------------------------------------- */
/*  Mock data                                                                  */
/* -------------------------------------------------------------------------- */

const HOST_PHOTO =
  "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=96&h=96&fit=crop&crop=face";
const BUYER_PHOTO =
  "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=96&h=96&fit=crop&crop=face";
const PHOTO_3 =
  "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=96&h=96&fit=crop&crop=face";
const PHOTO_4 =
  "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=96&h=96&fit=crop&crop=face";

const MOCK_USERS: AdminUser[] = [
  { id: "u1", name: "Jamie Rivera", email: "jamie@example.com", role: "seller", status: "active", joined: "Mar 2023", photo: HOST_PHOTO, initials: "JR", bookings: 52, listings: 4 },
  { id: "u2", name: "Alex Chen", email: "alex@example.com", role: "buyer", status: "active", joined: "Jan 2024", photo: BUYER_PHOTO, initials: "AC", bookings: 8 },
  { id: "u3", name: "Mia Patel", email: "mia@example.com", role: "seller", status: "active", joined: "Jun 2023", photo: PHOTO_3, initials: "MP", bookings: 31, listings: 2 },
  { id: "u4", name: "Jordan Park", email: "jordan@example.com", role: "buyer", status: "suspended", joined: "Sep 2023", photo: PHOTO_4, initials: "JP", bookings: 2 },
  { id: "u5", name: "Sam Torres", email: "sam@example.com", role: "buyer", status: "active", joined: "Nov 2023", initials: "ST", bookings: 5 },
  { id: "u6", name: "Riley Kim", email: "riley@example.com", role: "seller", status: "active", joined: "Feb 2024", initials: "RK", bookings: 14, listings: 1 },
];

const MOCK_LISTINGS: AdminListing[] = [
  { id: "l1", title: "Cozy Studio in the Mission", host: "Jamie Rivera", hostId: "u1", location: "San Francisco, CA", pricePerNight: 89, status: "active", created: "Mar 2023", bookings: 38, image: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=400&h=300&fit=crop" },
  { id: "l2", title: "Sunny 1BR in Hayes Valley", host: "Jamie Rivera", hostId: "u1", location: "San Francisco, CA", pricePerNight: 120, status: "active", created: "Apr 2023", bookings: 14, image: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=400&h=300&fit=crop" },
  { id: "l3", title: "Downtown Loft with Views", host: "Mia Patel", hostId: "u3", location: "Berkeley, CA", pricePerNight: 145, status: "pending", created: "Jan 2024", bookings: 0, image: "https://images.unsplash.com/photo-1556020685-ae41abfc9365?w=400&h=300&fit=crop" },
  { id: "l4", title: "Modern Room near BART", host: "Riley Kim", hostId: "u6", location: "Oakland, CA", pricePerNight: 75, status: "active", created: "Feb 2024", bookings: 9, image: "https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=400&h=300&fit=crop" },
  { id: "l5", title: "Beach House Getaway", host: "Mia Patel", hostId: "u3", location: "Malibu, CA", pricePerNight: 220, status: "archived", created: "Jun 2023", bookings: 22, image: "https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?w=400&h=300&fit=crop" },
  { id: "l6", title: "Hillside Cabin Retreat", host: "Jamie Rivera", hostId: "u1", location: "Napa, CA", pricePerNight: 195, status: "rejected", created: "Dec 2023", bookings: 0, image: "https://images.unsplash.com/photo-1510798831971-661eb04b3739?w=400&h=300&fit=crop" },
];

const MOCK_BOOKINGS: AdminBooking[] = [
  { id: "b1", guest: "Alex Chen", guestId: "u2", guestPhoto: BUYER_PHOTO, host: "Jamie Rivera", listing: "Cozy Studio in the Mission", listingId: "l1", checkIn: "Feb 10, 2026", checkOut: "Feb 13, 2026", nights: 3, total: 267, status: "confirmed" },
  { id: "b2", guest: "Sam Torres", guestId: "u5", host: "Jamie Rivera", listing: "Sunny 1BR in Hayes Valley", listingId: "l2", checkIn: "Feb 14, 2026", checkOut: "Feb 16, 2026", nights: 2, total: 240, status: "pending" },
  { id: "b3", guest: "Jordan Park", guestId: "u4", guestPhoto: PHOTO_4, host: "Mia Patel", listing: "Downtown Loft with Views", listingId: "l3", checkIn: "Jan 20, 2026", checkOut: "Jan 24, 2026", nights: 4, total: 580, status: "cancelled" },
  { id: "b4", guest: "Alex Chen", guestId: "u2", guestPhoto: BUYER_PHOTO, host: "Riley Kim", listing: "Modern Room near BART", listingId: "l4", checkIn: "Dec 5, 2025", checkOut: "Dec 7, 2025", nights: 2, total: 150, status: "completed" },
  { id: "b5", guest: "Sam Torres", guestId: "u5", host: "Mia Patel", listing: "Beach House Getaway", listingId: "l5", checkIn: "Nov 15, 2025", checkOut: "Nov 18, 2025", nights: 3, total: 660, status: "completed" },
];

const MOCK_REVIEWS: AdminReview[] = [
  { id: "r1", author: "Alex Chen", authorId: "u2", authorPhoto: BUYER_PHOTO, listing: "Cozy Studio in the Mission", listingId: "l1", rating: 5, date: "Feb 2026", text: "Absolutely wonderful stay. Jamie was incredibly welcoming and the studio was spotless.", flagged: false },
  { id: "r2", author: "Sam Torres", authorId: "u5", listing: "Sunny 1BR in Hayes Valley", listingId: "l2", rating: 4, date: "Jan 2026", text: "Great location, clean and comfortable. Minor issue with the Wi-Fi but otherwise perfect.", flagged: false },
  { id: "r3", author: "Jordan Park", authorId: "u4", authorPhoto: PHOTO_4, listing: "Downtown Loft with Views", listingId: "l3", rating: 2, date: "Jan 2026", text: "This is terrible and I want my money back. Complete scam listing. DO NOT BOOK.", flagged: true },
  { id: "r4", author: "Alex Chen", authorId: "u2", authorPhoto: BUYER_PHOTO, listing: "Modern Room near BART", listingId: "l4", rating: 5, date: "Dec 2025", text: "Riley's place was exactly as described. Super convenient for BART access.", flagged: false },
  { id: "r5", author: "Sam Torres", authorId: "u5", listing: "Beach House Getaway", listingId: "l5", rating: 5, date: "Nov 2025", text: "Breathtaking views and a perfectly equipped house. Would return in a heartbeat.", flagged: false },
];

const MOCK_PAYOUTS: AdminPayout[] = [
  { id: "p1", host: "Jamie Rivera", hostId: "u1", hostPhoto: HOST_PHOTO, period: "Jan 2026", bookings: 8, gross: 1420, fee: 142, net: 1278, status: "paid" },
  { id: "p2", host: "Mia Patel", hostId: "u3", hostPhoto: PHOTO_3, period: "Jan 2026", bookings: 4, gross: 880, fee: 88, net: 792, status: "processing" },
  { id: "p3", host: "Riley Kim", hostId: "u6", period: "Jan 2026", bookings: 3, gross: 450, fee: 45, net: 405, status: "pending" },
  { id: "p4", host: "Jamie Rivera", hostId: "u1", hostPhoto: HOST_PHOTO, period: "Dec 2025", bookings: 11, gross: 2060, fee: 206, net: 1854, status: "paid" },
  { id: "p5", host: "Mia Patel", hostId: "u3", hostPhoto: PHOTO_3, period: "Dec 2025", bookings: 6, gross: 1320, fee: 132, net: 1188, status: "paid" },
];

/* -------------------------------------------------------------------------- */
/*  Nav config                                                                 */
/* -------------------------------------------------------------------------- */

const NAV_ITEMS: { id: Tab; label: string; icon: React.ElementType }[] = [
  { id: "overview", label: "Overview", icon: LayoutDashboard },
  { id: "users", label: "Users", icon: Users },
  { id: "listings", label: "Listings", icon: Home },
  { id: "bookings", label: "Bookings", icon: CalendarDays },
  { id: "reviews", label: "Reviews", icon: Star },
  { id: "payouts", label: "Payouts", icon: DollarSign },
];

const TAB_IDS: Tab[] = ["overview", "users", "listings", "bookings", "reviews", "payouts"];

/* -------------------------------------------------------------------------- */
/*  Shared sub-components                                                      */
/* -------------------------------------------------------------------------- */

function SectionHeader({ title, description, leading }: { title: string; description?: string; leading?: React.ReactNode }) {
  const content = (
    <div className="space-y-1">
      <h2 className="text-xl font-bold text-zinc-900">{title}</h2>
      {description && <p className="text-sm text-muted-foreground">{description}</p>}
    </div>
  );
  if (leading != null) {
    return (
      <div className="flex items-center gap-3">
        {leading}
        {content}
      </div>
    );
  }
  return content;
}

function SearchInput({ placeholder }: { placeholder: string }) {
  return (
    <div className="relative w-full sm:max-w-xs">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
      <input
        type="text"
        placeholder={placeholder}
        className="h-9 w-full rounded-[5px] border border-zinc-200 bg-white pl-9 pr-3 text-sm text-zinc-900 shadow-none placeholder:text-muted-foreground focus-visible:border-zinc-900 focus-visible:ring-0 focus-visible:outline-none"
      />
    </div>
  );
}

function UserStatusBadge({ status }: { status: UserStatus }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium",
        status === "active"
          ? "bg-emerald-50 text-emerald-700"
          : "bg-red-50 text-red-600"
      )}
    >
      {status === "active" ? "Active" : "Suspended"}
    </span>
  );
}

function ListingStatusBadge({ status }: { status: ListingStatus }) {
  const styles: Record<ListingStatus, string> = {
    active: "bg-emerald-50 text-emerald-700",
    pending: "bg-amber-50 text-amber-700",
    archived: "bg-zinc-100 text-zinc-500",
    rejected: "bg-red-50 text-red-600",
  };
  const labels: Record<ListingStatus, string> = {
    active: "Active",
    pending: "Pending review",
    archived: "Archived",
    rejected: "Rejected",
  };
  return (
    <span className={cn("inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium", styles[status])}>
      {labels[status]}
    </span>
  );
}

function BookingStatusBadge({ status }: { status: BookingStatus }) {
  const styles: Record<BookingStatus, string> = {
    confirmed: "bg-emerald-50 text-emerald-700",
    pending: "bg-amber-50 text-amber-700",
    completed: "bg-zinc-100 text-zinc-500",
    cancelled: "bg-red-50 text-red-600",
  };
  return (
    <span className={cn("inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium", styles[status])}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
}

function PayoutStatusBadge({ status }: { status: PayoutStatus }) {
  if (status === "paid") {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-medium text-emerald-700">
        <CheckCircle2 className="size-3" /> Paid
      </span>
    );
  }
  if (status === "processing") {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
        <Clock className="size-3" /> Processing
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2 py-0.5 text-xs font-medium text-amber-700">
      <Clock className="size-3" /> Pending
    </span>
  );
}

function RoleBadge({ role }: { role: UserRole }) {
  if (role === "admin") return <span className="text-sm text-zinc-700">Admin</span>;
  return <span className="text-sm text-zinc-700">{role === "seller" ? "Seller" : "Buyer"}</span>;
}

/* -------------------------------------------------------------------------- */
/*  Stat card (Overview)                                                       */
/* -------------------------------------------------------------------------- */

function StatCard({
  label,
  value,
  sub,
  icon: Icon,
  trend,
  colorClass,
}: {
  label: string;
  value: string;
  sub?: string;
  icon: React.ElementType;
  trend?: string;
  colorClass?: string;
}) {
  return (
    <div className="rounded-xl border border-zinc-100 bg-white p-5">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-zinc-700">{label}</p>
        <div className={cn("flex size-9 shrink-0 items-center justify-center rounded-full", colorClass ?? "bg-zinc-100 text-zinc-600")}>
          <Icon className="size-4" />
        </div>
      </div>
      <p className="mt-2 text-2xl font-bold text-zinc-900">{value}</p>
      {sub && <p className="mt-0.5 text-xs text-muted-foreground">{sub}</p>}
      {trend && (
        <p className="mt-2 flex items-center gap-1 text-xs font-medium text-emerald-600">
          <ArrowUpRight className="size-3.5" />
          {trend}
        </p>
      )}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Overview tab                                                               */
/* -------------------------------------------------------------------------- */

function OverviewTab({ leadingSlot }: { leadingSlot?: React.ReactNode }) {
  const recentBookings = MOCK_BOOKINGS.slice(0, 4);

  return (
    <div className="space-y-8">
      <SectionHeader title="Overview" description="Platform metrics and quick actions" leading={leadingSlot} />
      {/* KPI grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Total revenue" value="$9,167" sub="All time" icon={DollarSign} trend="+12% vs last month" colorClass="text-emerald-600 bg-emerald-50" />
        <StatCard label="Active users" value="5" sub="1 suspended" icon={Users} trend="+2 this month" colorClass="text-zinc-600 bg-zinc-100" />
        <StatCard label="Total listings" value="6" sub="3 active · 1 pending" icon={Home} colorClass="text-zinc-600 bg-zinc-100" />
        <StatCard label="Bookings" value="5" sub="2 upcoming" icon={CalendarDays} trend="+3 this month" colorClass="text-amber-600 bg-amber-50" />
      </div>

      {/* Two-column lower */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Recent bookings */}
        <div className="flex flex-col overflow-hidden rounded-xl border border-zinc-100 bg-white">
          <div className="flex items-center justify-between border-b border-zinc-100 px-5 py-4">
            <h3 className="text-base font-semibold text-zinc-900">Recent bookings</h3>
            <Button variant="ghost" size="sm" className="h-8 rounded-[5px] px-2 text-xs font-medium text-muted-foreground shadow-none hover:bg-zinc-100 hover:text-zinc-900">
              View all
            </Button>
          </div>
          <div className="divide-y divide-zinc-100">
            {recentBookings.map((b) => (
              <div key={b.id} className="flex items-center justify-between gap-3 px-5 py-3">
                <div className="flex items-center gap-3 min-w-0">
                  <Avatar className="size-7 shrink-0">
                    {b.guestPhoto && <img src={b.guestPhoto} alt={b.guest} className="size-7 rounded-full object-cover" />}
                    <AvatarFallback className="bg-zinc-100 text-[10px] font-semibold text-zinc-600">{b.guest.slice(0, 2).toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-zinc-900">{b.guest}</p>
                    <p className="truncate text-xs text-muted-foreground">{b.listing}</p>
                  </div>
                </div>
                <div className="flex shrink-0 items-center gap-3">
                  <span className="text-sm font-semibold text-zinc-900">${b.total}</span>
                  <BookingStatusBadge status={b.status} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Flagged reviews */}
        <div className="flex flex-col overflow-hidden rounded-xl border border-zinc-100 bg-white">
          <div className="flex items-center justify-between border-b border-zinc-100 px-5 py-4">
            <h3 className="text-base font-semibold text-zinc-900">Flagged reviews</h3>
            {MOCK_REVIEWS.filter((r) => r.flagged).length > 0 && (
              <span className="inline-flex items-center rounded-full bg-red-50 px-2 py-0.5 text-xs font-medium text-red-600">
                {MOCK_REVIEWS.filter((r) => r.flagged).length} flagged
              </span>
            )}
          </div>
          <div className="divide-y divide-zinc-100">
            {MOCK_REVIEWS.filter((r) => r.flagged).map((r) => (
              <div key={r.id} className="flex flex-col gap-1.5 px-5 py-4">
                <div className="flex items-center justify-between gap-2">
                  <p className="text-sm font-medium text-zinc-900">{r.author}</p>
                  <div className="flex items-center gap-1">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <StarPhosphor key={i} size={12} weight={i < r.rating ? "fill" : "regular"} className="text-zinc-900" />
                    ))}
                  </div>
                </div>
                <p className="text-xs text-muted-foreground line-clamp-2">{r.text}</p>
                <div className="flex gap-2 pt-1">
                  <Button size="sm" variant="outline" className="h-7 rounded-[5px] border-zinc-100 px-2.5 text-xs font-medium text-zinc-700 shadow-none hover:border-red-200 hover:bg-red-50 hover:text-red-600">Remove</Button>
                  <Button size="sm" variant="ghost" className="h-7 rounded-[5px] px-2.5 text-xs font-medium text-muted-foreground shadow-none hover:bg-zinc-100">Dismiss</Button>
                </div>
              </div>
            ))}
            {MOCK_REVIEWS.filter((r) => r.flagged).length === 0 && (
              <p className="px-5 py-6 text-sm text-muted-foreground">No flagged reviews.</p>
            )}
          </div>
        </div>
      </div>

      {/* Pending listings */}
      {MOCK_LISTINGS.filter((l) => l.status === "pending").length > 0 && (
        <div className="flex flex-col overflow-hidden rounded-xl border border-zinc-100 bg-white">
          <div className="flex items-center justify-between border-b border-zinc-100 px-5 py-4">
            <h3 className="text-base font-semibold text-zinc-900">Listings pending review</h3>
            <span className="inline-flex items-center rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
              {MOCK_LISTINGS.filter((l) => l.status === "pending").length} pending
            </span>
          </div>
          <div className="divide-y divide-zinc-100">
            {MOCK_LISTINGS.filter((l) => l.status === "pending").map((l) => (
              <div key={l.id} className="flex items-center justify-between gap-4 px-5 py-3">
                <div className="flex items-center gap-3 min-w-0">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={l.image} alt={l.title} className="size-10 rounded-md object-cover shrink-0" />
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-zinc-900">{l.title}</p>
                    <p className="text-xs text-muted-foreground">{l.host} · {l.location}</p>
                  </div>
                </div>
                <div className="flex shrink-0 gap-2">
                  <Button size="sm" variant="outline" className="h-7 rounded-[5px] border-zinc-100 px-3 text-xs font-medium text-zinc-700 shadow-none hover:border-red-200 hover:bg-red-50 hover:text-red-600">Reject</Button>
                  <Button size="sm" className="h-7 rounded-[5px] bg-emerald-600 px-3 text-xs font-medium text-white shadow-none hover:bg-emerald-700">Approve</Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Users tab                                                                  */
/* -------------------------------------------------------------------------- */

function UsersTab({ leadingSlot }: { leadingSlot?: React.ReactNode }) {
  const [users, setUsers] = useState<AdminUser[]>(MOCK_USERS);
  const [confirmDialog, setConfirmDialog] = useState<{ open: boolean; userId: string; action: "suspend" | "activate" | "delete" } | null>(null);

  function handleAction(userId: string, action: "suspend" | "activate" | "delete") {
    if (action === "delete") {
      setUsers((prev) => prev.filter((u) => u.id !== userId));
    } else {
      setUsers((prev) =>
        prev.map((u) =>
          u.id === userId ? { ...u, status: action === "suspend" ? "suspended" : "active" } : u
        )
      );
    }
    setConfirmDialog(null);
  }

  const actionUser = confirmDialog ? users.find((u) => u.id === confirmDialog.userId) : null;

  return (
    <div className="space-y-5">
      <SectionHeader title="Users" description="Manage platform users and roles" leading={leadingSlot} />
      <div className="flex items-center gap-3">
        <SearchInput placeholder="Search users" />
      </div>
      <div className="overflow-x-auto rounded-xl border border-zinc-100">
        <table className="w-full min-w-[640px] text-sm">
          <thead>
            <tr className="border-b border-zinc-100 bg-zinc-50 text-left text-xs text-muted-foreground">
              <th className="px-4 py-3 font-medium">User</th>
                <th className="px-4 py-3 font-medium">Role</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium">Joined</th>
                <th className="px-4 py-3 font-medium">Bookings</th>
                <th className="px-4 py-3 font-medium">Listings</th>
                <th className="px-4 py-3 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 bg-white">
              {users.map((u) => (
                <tr key={u.id} className="hover:bg-zinc-50/50 transition-colors">
                  <td className="px-4 py-3.5">
                    <div className="flex items-center gap-3">
                      <Avatar className="size-8 shrink-0">
                        {u.photo && <img src={u.photo} alt={u.name} className="size-8 rounded-full object-cover" />}
                        <AvatarFallback className="bg-zinc-100 text-xs font-semibold text-zinc-600">{u.initials}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium text-zinc-900">{u.name}</p>
                        <p className="text-xs text-muted-foreground">{u.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3.5"><RoleBadge role={u.role} /></td>
                  <td className="px-4 py-3.5"><UserStatusBadge status={u.status} /></td>
                  <td className="px-4 py-3.5 text-muted-foreground">{u.joined}</td>
                  <td className="px-4 py-3.5 tabular-nums text-zinc-900">{u.bookings ?? 0}</td>
                  <td className="px-4 py-3.5 tabular-nums text-zinc-900">{u.listings ?? "—"}</td>
                  <td className="px-4 py-3.5 text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-7 w-7 p-0 rounded-[5px] shadow-none hover:bg-zinc-100">
                          <MoreHorizontal className="size-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-44 rounded-lg border-zinc-100 p-1.5 shadow-lg">
                        <DropdownMenuItem asChild className="rounded-md text-sm cursor-pointer">
                          <Link href={`/profile/${u.role === "seller" ? "seller-1" : "buyer-1"}`} className="flex items-center gap-2" target="_blank" rel="noopener noreferrer">
                            <Eye className="size-3.5 shrink-0" /> View profile
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator className="-mx-1.5 my-1 h-px bg-zinc-100" />
                        {u.status === "active" ? (
                          <DropdownMenuItem
                            className="rounded-md text-sm cursor-pointer gap-1.5"
                            onClick={() => setConfirmDialog({ open: true, userId: u.id, action: "suspend" })}
                          >
                            <Ban className="size-3.5 shrink-0" /> Suspend
                          </DropdownMenuItem>
                        ) : (
                          <DropdownMenuItem
                            className="rounded-md text-sm cursor-pointer gap-1.5"
                            onClick={() => setConfirmDialog({ open: true, userId: u.id, action: "activate" })}
                          >
                            <ShieldCheck className="size-3.5 shrink-0" /> Activate
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuItem
                          className="rounded-md text-sm cursor-pointer gap-1.5"
                          onClick={() => setConfirmDialog({ open: true, userId: u.id, action: "delete" })}
                        >
                          <Trash2 className="size-3.5 shrink-0" /> Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
      </div>

      {/* Confirm dialog */}
      <Dialog open={!!confirmDialog?.open} onOpenChange={(open) => !open && setConfirmDialog(null)}>
        <DialogContent className="sm:max-w-sm border-zinc-100">
          <DialogHeader>
            <DialogTitle>
              {confirmDialog?.action === "delete" ? "Delete user" :
               confirmDialog?.action === "suspend" ? "Suspend user" : "Activate user"}
            </DialogTitle>
            <DialogDescription>
              {confirmDialog?.action === "delete"
                ? `This will permanently delete ${actionUser?.name}'s account. This cannot be undone.`
                : confirmDialog?.action === "suspend"
                ? `${actionUser?.name} will lose access to the platform.`
                : `${actionUser?.name} will regain full access to the platform.`}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2">
            <Button variant="outline" className="rounded-[5px] border-zinc-200 shadow-none" onClick={() => setConfirmDialog(null)}>
              Cancel
            </Button>
            <Button
              className={cn(
                "rounded-[5px] shadow-none",
                confirmDialog?.action === "delete" ? "bg-red-600 hover:bg-red-700" :
                confirmDialog?.action === "suspend" ? "bg-amber-600 hover:bg-amber-700" :
                "bg-emerald-600 hover:bg-emerald-700"
              )}
              onClick={() => confirmDialog && handleAction(confirmDialog.userId, confirmDialog.action)}
            >
              {confirmDialog?.action === "delete" ? "Delete" :
               confirmDialog?.action === "suspend" ? "Suspend" : "Activate"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Listings tab                                                               */
/* -------------------------------------------------------------------------- */

function ListingsTab({ leadingSlot }: { leadingSlot?: React.ReactNode }) {
  const [listings, setListings] = useState<AdminListing[]>(MOCK_LISTINGS);

  function updateStatus(id: string, status: ListingStatus) {
    setListings((prev) => prev.map((l) => l.id === id ? { ...l, status } : l));
  }

  return (
    <div className="space-y-5">
      <SectionHeader title="Listings" description="Approve, archive, or remove listings" leading={leadingSlot} />
      <div className="flex flex-wrap items-center gap-3">
        <SearchInput placeholder="Search listings" />
      </div>
      <div className="overflow-x-auto rounded-xl border border-zinc-100">
        <table className="w-full min-w-[700px] text-sm">
          <thead>
            <tr className="border-b border-zinc-100 bg-zinc-50 text-left text-xs text-muted-foreground">
              <th className="px-4 py-3 font-medium">Listing</th>
              <th className="px-4 py-3 font-medium">Host</th>
              <th className="px-4 py-3 font-medium">Price</th>
              <th className="px-4 py-3 font-medium">Bookings</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium">Created</th>
              <th className="px-4 py-3 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-100 bg-white">
            {listings.map((l) => (
              <tr key={l.id} className="hover:bg-zinc-50/50 transition-colors">
                <td className="px-4 py-3.5">
                    <div className="flex items-center gap-3">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={l.image} alt={l.title} className="size-10 rounded-md object-cover shrink-0" />
                      <div>
                        <p className="font-medium text-zinc-900">{l.title}</p>
                        <p className="text-xs text-muted-foreground">{l.location}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3.5 text-zinc-700">{l.host}</td>
                  <td className="px-4 py-3.5 tabular-nums text-zinc-900">${l.pricePerNight}<span className="text-muted-foreground">/night</span></td>
                  <td className="px-4 py-3.5 tabular-nums text-zinc-900">{l.bookings}</td>
                  <td className="px-4 py-3.5"><ListingStatusBadge status={l.status} /></td>
                  <td className="px-4 py-3.5 text-muted-foreground">{l.created}</td>
                  <td className="px-4 py-3.5 text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-7 w-7 p-0 rounded-[5px] shadow-none hover:bg-zinc-100">
                          <MoreHorizontal className="size-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-44 rounded-lg border-zinc-100 p-1.5 shadow-lg">
                        <DropdownMenuItem asChild className="rounded-md text-sm cursor-pointer">
                          <Link href={`/listing/${l.id}`} className="flex items-center gap-2" target="_blank" rel="noopener noreferrer">
                            <Eye className="size-3.5 shrink-0" /> View listing
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator className="-mx-1.5 my-1 h-px bg-zinc-100" />
                        {l.status === "pending" && (
                          <>
                            <DropdownMenuItem className="rounded-md text-sm cursor-pointer gap-1.5" onClick={() => updateStatus(l.id, "active")}>
                              <CheckCircle2 className="size-3.5 shrink-0" /> Approve
                            </DropdownMenuItem>
                            <DropdownMenuItem className="rounded-md text-sm cursor-pointer gap-1.5" onClick={() => updateStatus(l.id, "rejected")}>
                              <XCircle className="size-3.5 shrink-0" /> Reject
                            </DropdownMenuItem>
                          </>
                        )}
                        {l.status === "active" && (
                          <DropdownMenuItem className="rounded-md text-sm cursor-pointer gap-1.5" onClick={() => updateStatus(l.id, "archived")}>
                            <Archive className="size-3.5 shrink-0" /> Archive
                          </DropdownMenuItem>
                        )}
                        {l.status === "archived" && (
                          <DropdownMenuItem className="rounded-md text-sm cursor-pointer gap-1.5" onClick={() => updateStatus(l.id, "active")}>
                            <ArchiveRestore className="size-3.5 shrink-0" /> Restore
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuItem className="rounded-md text-sm cursor-pointer gap-1.5" onClick={() => setListings((prev) => prev.filter((x) => x.id !== l.id))}>
                          <Trash2 className="size-3.5 shrink-0" /> Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Bookings tab                                                               */
/* -------------------------------------------------------------------------- */

function BookingsTab({ leadingSlot }: { leadingSlot?: React.ReactNode }) {
  const [bookings, setBookings] = useState<AdminBooking[]>(MOCK_BOOKINGS);

  function cancelBooking(id: string) {
    setBookings((prev) => prev.map((b) => b.id === id ? { ...b, status: "cancelled" } : b));
  }

  return (
    <div className="space-y-5">
      <SectionHeader title="Bookings" description="View and manage all platform bookings" leading={leadingSlot} />
      <div className="flex items-center gap-3">
        <SearchInput placeholder="Search bookings" />
      </div>
      <div className="overflow-x-auto rounded-xl border border-zinc-100">
        <table className="w-full min-w-[700px] text-sm">
          <thead>
            <tr className="border-b border-zinc-100 bg-zinc-50 text-left text-xs text-muted-foreground">
              <th className="px-4 py-3 font-medium">Guest</th>
              <th className="px-4 py-3 font-medium">Listing</th>
              <th className="px-4 py-3 font-medium">Host</th>
              <th className="px-4 py-3 font-medium">Dates</th>
              <th className="px-4 py-3 font-medium">Nights</th>
              <th className="px-4 py-3 font-medium">Total</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-100 bg-white">
            {bookings.map((b) => (
              <tr key={b.id} className="hover:bg-zinc-50/50 transition-colors">
                <td className="px-4 py-3.5">
                    <div className="flex items-center gap-2.5">
                      <Avatar className="size-7 shrink-0">
                        {b.guestPhoto && <img src={b.guestPhoto} alt={b.guest} className="size-7 rounded-full object-cover" />}
                        <AvatarFallback className="bg-zinc-100 text-[10px] font-semibold text-zinc-600">{b.guest.slice(0,2).toUpperCase()}</AvatarFallback>
                      </Avatar>
                      <span className="font-medium text-zinc-900">{b.guest}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3.5">
                    <p className="max-w-[140px] truncate text-zinc-900">{b.listing}</p>
                  </td>
                  <td className="px-4 py-3.5 text-zinc-700">{b.host}</td>
                  <td className="px-4 py-3.5 whitespace-nowrap text-muted-foreground">{b.checkIn} – {b.checkOut}</td>
                  <td className="px-4 py-3.5 tabular-nums text-zinc-900">{b.nights}</td>
                  <td className="px-4 py-3.5 tabular-nums font-semibold text-zinc-900">${b.total}</td>
                  <td className="px-4 py-3.5"><BookingStatusBadge status={b.status} /></td>
                  <td className="px-4 py-3.5 text-right">
                    {(b.status === "confirmed" || b.status === "pending") && (
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-7 rounded-[5px] border-zinc-100 px-2.5 text-xs font-medium text-zinc-700 shadow-none hover:border-red-200 hover:bg-red-50 hover:text-red-600"
                        onClick={() => cancelBooking(b.id)}
                      >
                        Cancel
                      </Button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Reviews tab                                                                */
/* -------------------------------------------------------------------------- */

function ReviewsTab({ leadingSlot }: { leadingSlot?: React.ReactNode }) {
  const [reviews, setReviews] = useState<AdminReview[]>(MOCK_REVIEWS);

  function removeReview(id: string) {
    setReviews((prev) => prev.filter((r) => r.id !== id));
  }

  function toggleFlag(id: string) {
    setReviews((prev) => prev.map((r) => r.id === id ? { ...r, flagged: !r.flagged } : r));
  }

  return (
    <div className="space-y-5">
      <SectionHeader title="Reviews" description="Moderate and remove reviews" leading={leadingSlot} />
      <div className="flex items-center gap-3">
        <SearchInput placeholder="Search reviews" />
      </div>
      <div className="space-y-3">
        {[...reviews]
          .sort((a, b) => Number(b.flagged) - Number(a.flagged))
          .map((r) => (
          <div key={r.id} className="flex flex-col gap-3 rounded-xl border border-zinc-100 bg-white p-5">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-3">
                <Avatar className="size-8 shrink-0">
                  {r.authorPhoto && <img src={r.authorPhoto} alt={r.author} className="size-8 rounded-full object-cover" />}
                  <AvatarFallback className="bg-zinc-100 text-xs font-semibold text-zinc-600">{r.author.slice(0,2).toUpperCase()}</AvatarFallback>
                </Avatar>
                <div>
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-semibold text-zinc-900">{r.author}</p>
                    {r.flagged && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-red-50 px-2 py-0.5 text-[11px] font-medium text-red-600">
                        <Flag className="size-3" /> Flagged
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground">{r.listing} · {r.date}</p>
                </div>
              </div>
              <div className="flex shrink-0 items-center gap-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <StarPhosphor key={i} size={13} weight={i < r.rating ? "fill" : "regular"} className="text-zinc-900" />
                ))}
              </div>
            </div>
            <p className="text-sm text-muted-foreground">{r.text}</p>
            <div className="flex gap-2 border-t border-zinc-100 pt-3">
              <Button
                size="sm"
                variant="outline"
                className="h-7 gap-1 rounded-[5px] border-zinc-100 px-2 text-xs font-medium text-zinc-700 shadow-none hover:border-red-200 hover:bg-red-50 hover:text-red-600"
                onClick={() => removeReview(r.id)}
              >
                <Trash2 className="size-3 shrink-0" /> Remove
              </Button>
              <Button
                size="sm"
                variant="ghost"
                className="h-7 gap-1 rounded-[5px] px-2 text-xs font-medium text-muted-foreground shadow-none hover:bg-zinc-100"
                onClick={() => toggleFlag(r.id)}
              >
                <Flag className="size-3 shrink-0" />
                {r.flagged ? "Unflag" : "Flag"}
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Payouts tab                                                                */
/* -------------------------------------------------------------------------- */

function PayoutsTab({ leadingSlot }: { leadingSlot?: React.ReactNode }) {
  const [payouts, setPayouts] = useState<AdminPayout[]>(MOCK_PAYOUTS);

  function markPaid(id: string) {
    setPayouts((prev) => prev.map((p) => p.id === id ? { ...p, status: "paid" } : p));
  }

  const totalPending = payouts
    .filter((p) => p.status === "pending" || p.status === "processing")
    .reduce((sum, p) => sum + p.net, 0);

  return (
    <div className="space-y-5">
      <SectionHeader title="Payouts" description="View and mark host payouts" leading={leadingSlot} />

      {/* Pending payout banner — one line, same style as seller dashboard */}
      {totalPending > 0 && (
        <div className="flex items-center gap-3 rounded-xl border border-amber-100 bg-amber-50 px-4 py-3">
          <DollarSign className="size-4 shrink-0 text-amber-600" />
          <p className="text-sm text-amber-800">
            ${totalPending.toLocaleString()} pending
            <span className="text-amber-700"> ({payouts.filter((p) => p.status !== "paid").length} payout{payouts.filter((p) => p.status !== "paid").length !== 1 ? "s" : ""} need processing)</span>
          </p>
        </div>
      )}

      <div className="overflow-x-auto rounded-xl border border-zinc-100">
        <table className="w-full min-w-[640px] text-sm">
          <thead>
            <tr className="border-b border-zinc-100 bg-zinc-50 text-left text-xs text-muted-foreground">
              <th className="px-4 py-3 font-medium">Host</th>
              <th className="px-4 py-3 font-medium">Period</th>
              <th className="px-4 py-3 font-medium">Bookings</th>
              <th className="px-4 py-3 font-medium">Gross</th>
              <th className="px-4 py-3 font-medium">Platform fee (10%)</th>
              <th className="px-4 py-3 font-medium">Net payout</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-100 bg-white">
            {payouts.map((p) => (
              <tr key={p.id} className="hover:bg-zinc-50/50 transition-colors">
                <td className="px-4 py-3.5">
                    <div className="flex items-center gap-2.5">
                      <Avatar className="size-7 shrink-0">
                        {p.hostPhoto && <img src={p.hostPhoto} alt={p.host} className="size-7 rounded-full object-cover" />}
                        <AvatarFallback className="bg-zinc-100 text-[10px] font-semibold text-zinc-600">{p.host.slice(0,2).toUpperCase()}</AvatarFallback>
                      </Avatar>
                      <span className="font-medium text-zinc-900">{p.host}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3.5 text-muted-foreground">{p.period}</td>
                  <td className="px-4 py-3.5 tabular-nums text-zinc-900">{p.bookings}</td>
                  <td className="px-4 py-3.5 tabular-nums text-zinc-900">${p.gross.toLocaleString()}</td>
                  <td className="px-4 py-3.5 tabular-nums text-red-600">−${p.fee.toLocaleString()}</td>
                  <td className="px-4 py-3.5 tabular-nums font-semibold text-zinc-900">${p.net.toLocaleString()}</td>
                  <td className="px-4 py-3.5"><PayoutStatusBadge status={p.status} /></td>
                  <td className="px-4 py-3.5 text-right">
                    {p.status !== "paid" && (
                      <Button
                        size="sm"
                        className="h-7 rounded-[5px] bg-emerald-600 px-3 text-xs font-medium text-white shadow-none hover:bg-emerald-700"
                        onClick={() => markPaid(p.id)}
                      >
                        Mark paid
                      </Button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Main admin dashboard                                                       */
/* -------------------------------------------------------------------------- */

export function AdminDashboardClient() {
  const searchParams = useSearchParams();
  const tabParam = searchParams.get("tab");
  const activeTab: Tab = useMemo(() => {
    if (tabParam && TAB_IDS.includes(tabParam as Tab)) return tabParam as Tab;
    return "overview";
  }, [tabParam]);

  const isDesktop = useMediaQuery("(min-width: 768px)");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const pendingListings = MOCK_LISTINGS.filter((l) => l.status === "pending").length;
  const flaggedReviews = MOCK_REVIEWS.filter((r) => r.flagged).length;

  const navLinks = (
    onNavigate?: () => void
  ) =>
    NAV_ITEMS.map(({ id, label, icon: Icon }) => {
      const badge =
        id === "listings" && pendingListings > 0 ? pendingListings :
        id === "reviews" && flaggedReviews > 0 ? flaggedReviews : null;
      return (
        <Link
          key={id}
          href={`/admin?tab=${id}`}
          onClick={onNavigate}
          className={cn(
            "flex w-full items-center justify-between gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-colors",
            activeTab === id
              ? "bg-zinc-100 text-zinc-900"
              : "text-muted-foreground hover:bg-zinc-50 hover:text-zinc-900"
          )}
        >
          <span className="flex items-center gap-3">
            <Icon className="size-4 shrink-0" />
            {label}
          </span>
          {badge != null && (
            <span className="flex size-5 min-w-[20px] items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
              {badge}
            </span>
          )}
        </Link>
      );
    });

  const mobileMenuButton = !isDesktop ? (
    <button
      type="button"
      onClick={() => setSidebarOpen(true)}
      className="flex size-9 shrink-0 items-center justify-center rounded-md text-zinc-600 hover:bg-zinc-100 md:hidden"
      aria-label="Open menu"
    >
      <Menu className="size-5" />
    </button>
  ) : undefined;

  return (
    <div className="flex h-[calc(100vh-4rem)] flex-col bg-white">
      {/* Mobile sidebar overlay — covers full viewport including header */}
      {!isDesktop && sidebarOpen && (
        <>
          <button
            type="button"
            aria-label="Close menu"
            className="fixed inset-0 z-[60] bg-black/20 md:hidden"
            onClick={() => setSidebarOpen(false)}
          />
          <aside className="fixed left-0 top-0 z-[70] flex h-screen w-56 flex-col bg-white md:hidden">
            {/* Logo in same position as header */}
            <div className="flex h-16 shrink-0 items-center border-b border-zinc-100 pl-4">
              <Link
                href="/"
                onClick={() => setSidebarOpen(false)}
                className="flex shrink-0 items-center focus-visible:outline focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:rounded-md"
                aria-label="Rentals home"
              >
                <Image
                  src="https://e47b698e59208764aee00d1d8e14313c.cdn.bubble.io/f1770319743776x921681514520088300/rento.png"
                  alt="Rentals"
                  width={72}
                  height={20}
                  className="h-5 w-auto object-contain"
                />
              </Link>
            </div>
            <nav className="flex-1 space-y-0.5 overflow-auto px-3 py-5">
              {navLinks(() => setSidebarOpen(false))}
            </nav>
          </aside>
        </>
      )}

      <div className="flex min-h-0 flex-1">
        {/* Desktop sidebar */}
        <aside className="hidden h-full w-56 shrink-0 flex-col border-r border-zinc-100 bg-white md:flex">
          <nav className="flex-1 space-y-0.5 px-3 py-5">
            {navLinks()}
          </nav>
        </aside>

        {/* Main content — only this area scrolls */}
        <main className="min-w-0 flex-1 overflow-auto px-4 py-4 sm:px-6 md:px-14 md:py-6 lg:px-24">
          {activeTab === "overview" && <OverviewTab leadingSlot={mobileMenuButton} />}
          {activeTab === "users" && <UsersTab leadingSlot={mobileMenuButton} />}
          {activeTab === "listings" && <ListingsTab leadingSlot={mobileMenuButton} />}
          {activeTab === "bookings" && <BookingsTab leadingSlot={mobileMenuButton} />}
          {activeTab === "reviews" && <ReviewsTab leadingSlot={mobileMenuButton} />}
          {activeTab === "payouts" && <PayoutsTab leadingSlot={mobileMenuButton} />}
        </main>
      </div>
    </div>
  );
}
