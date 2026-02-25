"use client";

import { useState, useRef, useEffect, useLayoutEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import {
  CheckCircle2,
  XCircle,
  Clock,
  Star,
  Pencil,
  Trash2,
  ExternalLink,
  Plus,
  TrendingUp,
  Download,
  DollarSign,
  CalendarDays,
  Home,
  Archive,
  ArchiveRestore,
  MessageCircle,
  Check,
  X,
  Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { MessagesClient } from "@/components/messages/messages-client";
import { HostProfileForm, type HostProfileData } from "@/components/host/host-profile-form";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Card } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { ListingImageWithWishlist } from "@/components/listing/listing-image-with-wishlist";

/* -------------------------------------------------------------------------- */
/*  Mock data                                                                  */
/* -------------------------------------------------------------------------- */

type ReservationStatus = "pending" | "confirmed" | "completed" | "cancelled";

type Reservation = {
  id: string;
  guestName: string;
  guestPhoto: string;
  guestInitials: string;
  propertyName: string;
  propertyImage: string;
  checkIn: string;
  checkOut: string;
  nights: number;
  guests: number;
  total: number;
  status: ReservationStatus;
  listingId: string;
  /** Thread id in Messages (e.g. t1) for linking to message thread */
  threadId: string;
};

const RESERVATIONS: Reservation[] = [
  {
    id: "res-1",
    guestName: "Alex Chen",
    guestPhoto: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=96&h=96&fit=crop&crop=face",
    guestInitials: "AC",
    propertyName: "Sunny Studio in the Mission",
    propertyImage: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=300&fit=crop",
    checkIn: "Feb 23, 2026",
    checkOut: "Feb 26, 2026",
    nights: 3,
    guests: 2,
    total: 402,
    status: "confirmed",
    listingId: "1",
    threadId: "t1",
  },
  {
    id: "res-2",
    guestName: "Sarah Miller",
    guestPhoto: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=96&h=96&fit=crop&crop=face",
    guestInitials: "SM",
    propertyName: "Downtown Loft · Chicago",
    propertyImage: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=400&h=300&fit=crop",
    checkIn: "Feb 28, 2026",
    checkOut: "Mar 3, 2026",
    nights: 3,
    guests: 3,
    total: 537,
    status: "confirmed",
    listingId: "2",
    threadId: "t2",
  },
  {
    id: "res-3",
    guestName: "Jordan Park",
    guestPhoto: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=96&h=96&fit=crop&crop=face",
    guestInitials: "JP",
    propertyName: "Beach House · Malibu",
    propertyImage: "https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?w=400&h=300&fit=crop",
    checkIn: "Mar 10, 2026",
    checkOut: "Mar 14, 2026",
    nights: 4,
    guests: 4,
    total: 1120,
    status: "confirmed",
    listingId: "3",
    threadId: "t3",
  },
  {
    id: "res-4",
    guestName: "Taylor Wilson",
    guestPhoto: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=96&h=96&fit=crop&crop=face",
    guestInitials: "TW",
    propertyName: "Mountain Cabin · Lake Tahoe",
    propertyImage: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=400&h=300&fit=crop",
    checkIn: "Feb 23, 2026",
    checkOut: "Feb 24, 2026",
    nights: 1,
    guests: 2,
    total: 189,
    status: "confirmed",
    listingId: "4",
    threadId: "t4",
  },
  {
    id: "res-5",
    guestName: "Mia Patel",
    guestPhoto: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=96&h=96&fit=crop&crop=face",
    guestInitials: "MP",
    propertyName: "Garden Cottage · Berkeley",
    propertyImage: "https://images.unsplash.com/photo-1560185007-c5ca9d2c014d?w=400&h=300&fit=crop",
    checkIn: "Jan 12, 2026",
    checkOut: "Jan 15, 2026",
    nights: 3,
    guests: 1,
    total: 318,
    status: "completed",
    listingId: "5",
    threadId: "t5",
  },
  {
    id: "res-6",
    guestName: "Chris Thompson",
    guestPhoto: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=96&h=96&fit=crop&crop=face",
    guestInitials: "CT",
    propertyName: "Historic Brownstone · Boston",
    propertyImage: "https://images.unsplash.com/photo-1555636222-cae831e670b3?w=400&h=300&fit=crop",
    checkIn: "Dec 20, 2025",
    checkOut: "Dec 24, 2025",
    nights: 4,
    guests: 2,
    total: 820,
    status: "completed",
    listingId: "6",
    threadId: "t6",
  },
  {
    id: "res-7",
    guestName: "Jamie Lee",
    guestPhoto: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=96&h=96&fit=crop&crop=face",
    guestInitials: "JL",
    propertyName: "Sunny Studio in the Mission",
    propertyImage: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=300&fit=crop",
    checkIn: "Nov 5, 2025",
    checkOut: "Nov 7, 2025",
    nights: 2,
    guests: 1,
    total: 268,
    status: "cancelled",
    listingId: "1",
    threadId: "t7",
  },
  {
    id: "res-8",
    guestName: "Priya Singh",
    guestPhoto: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=96&h=96&fit=crop&crop=face",
    guestInitials: "PS",
    propertyName: "Sunny Studio in the Mission",
    propertyImage: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=300&fit=crop",
    checkIn: "Mar 5, 2026",
    checkOut: "Mar 8, 2026",
    nights: 3,
    guests: 2,
    total: 402,
    status: "pending",
    listingId: "1",
    threadId: "t8",
  },
];

type Listing = {
  id: string;
  title: string;
  description: string;
  location: string;
  pricePerNight: number;
  status: "Active" | "Draft";
  imageUrl: string;
  /** Additional images for carousel (search grid tile has arrows/dots when multiple). */
  images?: string[];
  beds: number;
  baths: number;
  rating: number;
  reviewCount: number;
  /** Set when user archives; listing moves to end and is grayed out. */
  archived?: boolean;
};

const MY_LISTINGS: Listing[] = [
  {
    id: "1",
    title: "Sunny Studio in the Mission",
    description: "Bright studio with kitchenette. Walking distance to cafes and transit.",
    location: "San Francisco, CA",
    pricePerNight: 120,
    status: "Active",
    imageUrl: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=600&h=400&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=600&h=400&fit=crop",
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=600&h=400&fit=crop",
    ],
    beds: 1,
    baths: 1,
    rating: 4.91,
    reviewCount: 52,
  },
  {
    id: "2",
    title: "Downtown Loft",
    description: "Spacious loft with city views. Walking distance to restaurants and transit.",
    location: "Chicago, IL",
    pricePerNight: 155,
    status: "Active",
    imageUrl: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=600&h=400&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=600&h=400&fit=crop",
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=600&h=400&fit=crop",
    ],
    beds: 2,
    baths: 1,
    rating: 4.78,
    reviewCount: 34,
  },
  {
    id: "3",
    title: "Beach House",
    description: "Steps from the sand. Family-friendly with a full kitchen.",
    location: "Malibu, CA",
    pricePerNight: 250,
    status: "Active",
    imageUrl: "https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?w=600&h=400&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?w=600&h=400&fit=crop",
      "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=600&h=400&fit=crop",
    ],
    beds: 3,
    baths: 2,
    rating: 4.95,
    reviewCount: 18,
  },
  {
    id: "4",
    title: "Mountain Cabin",
    description: "Private cabin with a view. Quiet neighborhood.",
    location: "Lake Tahoe, CA",
    pricePerNight: 189,
    status: "Draft",
    imageUrl: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=600&h=400&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=600&h=400&fit=crop",
    ],
    beds: 2,
    baths: 1,
    rating: 0,
    reviewCount: 0,
  },
];

type PayoutRow = {
  id: string;
  date: string;
  property: string;
  guest: string;
  nights: number;
  amount: number;
  status: "paid" | "pending" | "processing";
};

const PAYOUT_HISTORY: PayoutRow[] = [
  { id: "p1", date: "Feb 3, 2026", property: "Sunny Studio", guest: "Alex Chen", nights: 3, amount: 322, status: "paid" },
  { id: "p2", date: "Jan 28, 2026", property: "Downtown Loft", guest: "Sarah Miller", nights: 4, amount: 558, status: "paid" },
  { id: "p3", date: "Jan 15, 2026", property: "Beach House", guest: "Jordan Park", nights: 2, amount: 448, status: "paid" },
  { id: "p4", date: "Feb 26, 2026", property: "Sunny Studio", guest: "Alex Chen (upcoming)", nights: 3, amount: 322, status: "pending" },
  { id: "p5", date: "Feb 10, 2026", property: "Mountain Cabin", guest: "Jamie Lee", nights: 5, amount: 848, status: "processing" },
];

const HOST_PHOTO = "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=96&h=96&fit=crop&crop=face";

/* -------------------------------------------------------------------------- */
/*  Tab config                                                                 */
/* -------------------------------------------------------------------------- */

type Tab = "reservations" | "listings" | "messages" | "profile" | "payouts";

const TABS: { id: Tab; label: string }[] = [
  { id: "reservations", label: "Reservations" },
  { id: "listings", label: "Listings" },
  { id: "messages", label: "Messages" },
  { id: "profile", label: "Profile" },
  { id: "payouts", label: "Payouts" },
];

/* -------------------------------------------------------------------------- */
/*  Status badge                                                              */
/* -------------------------------------------------------------------------- */

function StatusBadge({ status }: { status: ReservationStatus }) {
  if (status === "pending") {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-0.5 text-xs font-medium text-amber-700">
        <Clock className="size-3" />
        Pending
      </span>
    );
  }
  if (status === "confirmed") {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-medium text-emerald-700">
        <CheckCircle2 className="size-3" />
        Confirmed
      </span>
    );
  }
  if (status === "completed") {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-zinc-100 px-2.5 py-0.5 text-xs font-medium text-zinc-600">
        <CheckCircle2 className="size-3" />
        Completed
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-red-50 px-2.5 py-0.5 text-xs font-medium text-red-500">
      <XCircle className="size-3" />
      Cancelled
    </span>
  );
}

/* -------------------------------------------------------------------------- */
/*  Reservation card                                                          */
/* -------------------------------------------------------------------------- */

const DECLINE_TEMPLATE = "Thank you for your interest. I'm unable to accept this request for the dates you selected. I hope you find a great place to stay.";
const CANCEL_TEMPLATE = "Unfortunately I would have to cancel this reservation. I'm sorry for any inconvenience.";

function ReservationCard({
  res,
  onStatusChange,
  onOpenMessageDialog,
}: {
  res: Reservation;
  onStatusChange: (id: string, status: ReservationStatus) => void;
  onOpenMessageDialog: (res: Reservation, type: "decline" | "cancel") => void;
}) {
  const isPending = res.status === "pending";
  const isConfirmed = res.status === "confirmed";
  const isPast = res.status === "completed" || res.status === "cancelled";

  return (
    <Card className="group/card relative flex flex-col overflow-hidden border-zinc-100 bg-white p-0 shadow-none sm:flex-row">
      {/* Image: full width on mobile (aspect ratio), 45% side on sm+ */}
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

      {/* Content — match map view padding and typography */}
      <div className="flex min-w-0 flex-1 flex-col justify-between px-3 py-4 sm:px-4 sm:py-5">
        <div className="space-y-2.5">
          {/* Row 1: guest + status */}
          <div className="flex items-start justify-between gap-2">
            <div className="flex items-center gap-2 min-w-0">
              <Avatar className="size-6 shrink-0">
                <AvatarImage src={res.guestPhoto} alt={res.guestName} />
                <AvatarFallback className="bg-zinc-100 text-[9px] font-semibold text-zinc-600">
                  {res.guestInitials}
                </AvatarFallback>
              </Avatar>
              <p className="min-w-0 flex-1 truncate text-sm font-semibold text-zinc-900">{res.guestName}</p>
            </div>
            <StatusBadge status={res.status} />
          </div>
          {/* Row 2: property name — text-sm like map view */}
          <p className="truncate text-sm text-muted-foreground">{res.propertyName}</p>
          {/* Row 3: dates + details — text-sm text-muted-foreground */}
          <div className="space-y-1 text-sm text-muted-foreground">
            <div className="flex items-center gap-1.5">
              <CalendarDays className="size-3.5 shrink-0" aria-hidden />
              <span className="truncate">{res.checkIn} – {res.checkOut}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Users className="size-3.5 shrink-0" aria-hidden />
              <span>{res.nights} night{res.nights !== 1 ? "s" : ""} · {res.guests} guest{res.guests !== 1 ? "s" : ""}</span>
            </div>
          </div>
        </div>
        {/* Row 4: total + actions — match map view price line (text-sm) and border */}
        <div className="mt-3 flex flex-wrap items-center justify-between gap-x-2 gap-y-2 border-t border-zinc-100 pt-4">
          <p className="shrink-0 text-sm text-zinc-900">
            <span className="font-semibold">${res.total.toLocaleString()}</span>
            <span className="text-muted-foreground"> total</span>
          </p>
          <div className="flex flex-wrap items-center gap-1">
            {isPending && (
              <>
                <Button
                  variant="ghost"
                  size="sm"
                  asChild
                  className="h-7 w-7 rounded-[5px] p-0 text-zinc-600 shadow-none hover:bg-zinc-100 hover:text-zinc-900"
                  aria-label="Message guest"
                >
                  <Link href="/dashboard/seller?tab=messages">
                    <MessageCircle className="size-3.5" />
                  </Link>
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-7 gap-1 rounded-[5px] border-zinc-100 px-2.5 text-xs font-medium text-zinc-700 shadow-none hover:border-red-200 hover:bg-red-50 hover:text-red-600"
                  onClick={() => onOpenMessageDialog(res, "decline")}
                >
                  <X className="size-3 shrink-0" />
                  Decline
                </Button>
                <Button
                  size="sm"
                  className="h-7 gap-1 rounded-[5px] bg-emerald-600 px-2.5 text-xs font-medium text-white shadow-none hover:bg-emerald-700"
                  onClick={() => onStatusChange(res.id, "confirmed")}
                >
                  <Check className="size-3 shrink-0" />
                  Accept
                </Button>
              </>
            )}
            {isConfirmed && (
              <>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-7 rounded-[5px] border-zinc-100 px-2.5 text-xs font-medium text-zinc-700 shadow-none hover:border-red-200 hover:bg-red-50 hover:text-red-600"
                  onClick={() => onOpenMessageDialog(res, "cancel")}
                >
                  Cancel
                </Button>
                <Button
                  size="sm"
                  asChild
                  className="h-7 gap-1 rounded-[5px] border-zinc-100 px-2.5 text-xs font-medium shadow-none"
                >
                  <Link href="/dashboard/seller?tab=messages">
                    <MessageCircle className="size-3 shrink-0" />
                    Message
                  </Link>
                </Button>
              </>
            )}
            {isPast && (
              <Button
                variant="outline"
                size="sm"
                asChild
                className="h-7 gap-1 rounded-[5px] border-zinc-100 px-2.5 text-xs font-medium text-zinc-700 shadow-none"
              >
                <Link href="/dashboard/seller?tab=messages">
                  <MessageCircle className="size-3 shrink-0" />
                  Message
                </Link>
              </Button>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
}

/* -------------------------------------------------------------------------- */
/*  Reservations tab                                                          */
/* -------------------------------------------------------------------------- */

function ReservationsTab() {
  const router = useRouter();
  const [reservations, setReservations] = useState<Reservation[]>(RESERVATIONS);
  const [subTab, setSubTab] = useState<"today" | "upcoming" | "past">("today");
  const [messageDialog, setMessageDialog] = useState<{
    res: Reservation;
    type: "decline" | "cancel";
  } | null>(null);
  const [dialogMessage, setDialogMessage] = useState("");

  const today = new Date("2026-02-23");

  function handleStatusChange(id: string, status: ReservationStatus) {
    setReservations((prev) => prev.map((r) => (r.id === id ? { ...r, status } : r)));
  }

  function openMessageDialog(res: Reservation, type: "decline" | "cancel") {
    setMessageDialog({ res, type });
    setDialogMessage(type === "decline" ? DECLINE_TEMPLATE : CANCEL_TEMPLATE);
  }

  function sendMessageAndClose() {
    if (!messageDialog) return;
    const { res, type } = messageDialog;
    const text = dialogMessage.trim();
    if (!text) return;
    setReservations((prev) => prev.map((r) => (r.id === res.id ? { ...r, status: "cancelled" as const } : r)));
    setMessageDialog(null);
    setDialogMessage("");
    const params = new URLSearchParams({ tab: "messages", thread: res.threadId, sent: encodeURIComponent(text) });
    router.push(`/dashboard/seller?${params.toString()}`);
  }

  const grouped = {
    today: reservations.filter((r) => {
      if (r.status === "cancelled") return false;
      const cin = new Date(r.checkIn);
      const cout = new Date(r.checkOut);
      return cin <= today && cout >= today;
    }),
    upcoming: reservations.filter((r) => {
      if (r.status === "cancelled") return false;
      const cin = new Date(r.checkIn);
      return cin > today && (r.status === "confirmed" || r.status === "pending");
    }),
    past: reservations.filter((r) => {
      const cout = new Date(r.checkOut);
      return cout < today || r.status === "cancelled";
    }),
  };

  // Non-confirmed (pending) first in upcoming, then confirmed
  const items =
    subTab === "upcoming"
      ? [...grouped.upcoming].sort((a, b) => (a.status === "pending" ? 0 : 1) - (b.status === "pending" ? 0 : 1))
      : grouped[subTab];

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-xl font-bold text-zinc-900">Reservations</h2>
        <p className="mt-0.5 text-sm text-muted-foreground">Manage your guest bookings</p>
      </div>

      <Tabs
        value={subTab}
        onValueChange={(v) => setSubTab(v as "today" | "upcoming" | "past")}
        className="w-fit"
      >
        <TabsList className="h-9" aria-label="Reservation period">
          <TabsTrigger value="today" className="gap-2 px-3 capitalize">
            Today
            {grouped.today.length > 0 && (
              <span className="rounded-full bg-zinc-200/80 px-1.5 py-0.5 text-xs font-medium tabular-nums text-zinc-600">
                {grouped.today.length}
              </span>
            )}
          </TabsTrigger>
          <TabsTrigger value="upcoming" className="gap-2 px-3 capitalize">
            Upcoming
            {grouped.upcoming.length > 0 && (
              <span className="rounded-full bg-zinc-200/80 px-1.5 py-0.5 text-xs font-medium tabular-nums text-zinc-600">
                {grouped.upcoming.length}
              </span>
            )}
          </TabsTrigger>
          <TabsTrigger value="past" className="gap-2 px-3 capitalize">
            Past
            {grouped.past.length > 0 && (
              <span className="rounded-full bg-zinc-200/80 px-1.5 py-0.5 text-xs font-medium tabular-nums text-zinc-600">
                {grouped.past.length}
              </span>
            )}
          </TabsTrigger>
        </TabsList>
      </Tabs>

      {items.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-2 py-14 text-center">
          <CalendarDays className="size-8 text-zinc-400" />
          <p className="text-sm text-muted-foreground">No {subTab} reservations</p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {items.map((r) => (
            <ReservationCard
              key={r.id}
              res={r}
              onStatusChange={handleStatusChange}
              onOpenMessageDialog={openMessageDialog}
            />
          ))}
        </div>
      )}

      <Dialog open={!!messageDialog} onOpenChange={(open) => !open && setMessageDialog(null)}>
        <DialogContent className="w-full max-w-md border-zinc-100 shadow-lg">
          <DialogHeader>
            <DialogTitle className="text-left text-lg font-semibold text-zinc-900">
              {messageDialog?.type === "decline" ? "Decline request" : "Cancel booking"}
            </DialogTitle>
            <DialogDescription className="text-left text-zinc-900">
              {messageDialog?.type === "decline"
                ? "Your message will be sent to the guest. The request will be declined."
                : "Your message will be sent to the guest. The reservation will be cancelled."}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3 py-2">
            <Label htmlFor="cancel-decline-message" className="text-xs font-semibold text-zinc-900">
              Message
            </Label>
            <Textarea
              id="cancel-decline-message"
              value={dialogMessage}
              onChange={(e) => setDialogMessage(e.target.value)}
              placeholder="Write a message..."
              className="min-h-[120px] resize-y rounded-[5px] border-zinc-200 text-sm shadow-none focus-visible:border-zinc-900 focus-visible:ring-0"
              rows={4}
            />
          </div>
          <DialogFooter className="flex flex-row gap-2 sm:justify-end">
            <Button
              variant="outline"
              className="h-11 rounded-[5px] font-medium shadow-none"
              onClick={() => setMessageDialog(null)}
            >
              Cancel
            </Button>
            <Button
              className="h-11 rounded-[5px] font-medium shadow-none hover:bg-primary/90"
              onClick={sendMessageAndClose}
            >
              Send message
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Listings tab                                                              */
/* -------------------------------------------------------------------------- */

function hasUpcomingReservations(listingId: string): boolean {
  const today = new Date("2026-02-23");
  return RESERVATIONS.some(
    (r) =>
      r.listingId === listingId &&
      r.status === "confirmed" &&
      new Date(r.checkIn) > today
  );
}

/** Only the 3rd listing (id "3") shows "has upcoming bookings" in the delete dialog. */
function isListingWithUpcomingForDemo(listingId: string) {
  return listingId === "3";
}

function ListingsTab() {
  const [listings, setListings] = useState<Listing[]>(MY_LISTINGS);
  const [archiveId, setArchiveId] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deletedMessage, setDeletedMessage] = useState<string | null>(null);

  const listingToArchive = listings.find((l) => l.id === archiveId) ?? null;
  const listingToDelete = listings.find((l) => l.id === deleteId) ?? null;

  // Non-archived first, then archived at the end
  const sortedListings = [...listings].sort((a, b) => (a.archived ? 1 : 0) - (b.archived ? 1 : 0));

  function handleArchiveConfirm() {
    setListings((prev) =>
      prev.map((l) => (l.id === archiveId ? { ...l, archived: true } : l))
    );
    setArchiveId(null);
  }

  function handleUnarchive(listingId: string) {
    setListings((prev) =>
      prev.map((l) => (l.id === listingId ? { ...l, archived: false } : l))
    );
  }

  function handleDeleteConfirm() {
    const title = listingToDelete?.title ?? "Listing";
    setListings((prev) => prev.filter((l) => l.id !== deleteId));
    setDeleteId(null);
    setDeletedMessage(`${title} has been removed`);
    setTimeout(() => setDeletedMessage(null), 3000);
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-zinc-900">Listings</h2>
          <p className="mt-0.5 text-sm text-muted-foreground">Manage your properties</p>
        </div>
        <Button asChild size="sm" className="h-9 gap-1 rounded-[5px] font-medium shadow-none">
          <Link href="/become-a-host?step=2" className="flex items-center gap-1">
            <Plus className="size-4" />
            New listing
          </Link>
        </Button>
      </div>

      {deletedMessage && (
        <p className="rounded-lg bg-emerald-50 px-4 py-2 text-sm font-medium text-emerald-800">
          {deletedMessage}
        </p>
      )}
      {listings.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-3 py-14 text-center">
          <Home className="size-8 text-zinc-400" />
          <p className="text-sm text-muted-foreground">No listings yet.</p>
          <Button asChild size="sm" className="h-9 rounded-[5px] shadow-none">
            <Link href="/become-a-host?step=2">Create your first listing</Link>
          </Button>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {sortedListings.map((listing) => (
            <Card
              key={listing.id}
              className="flex flex-col gap-2 overflow-hidden border-zinc-100 p-0 shadow-none"
            >
              <Link
                href="/listing/e1"
                target="_blank"
                rel="noopener noreferrer"
                className="group block"
              >
                <ListingImageWithWishlist
                  images={listing.images?.length ? listing.images : [listing.imageUrl]}
                  alt={listing.title}
                  showWishlist={false}
                  className={cn("rounded-t-xl rounded-b-none", listing.archived && "grayscale")}
                  topOverlay={
                    <span
                      className={cn(
                        "flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium",
                        listing.archived
                          ? "bg-white/95 text-zinc-500 shadow-sm"
                          : listing.status === "Active"
                            ? "bg-white/95 text-emerald-700 shadow-sm"
                            : "bg-white/95 text-zinc-600 shadow-sm"
                      )}
                    >
                      {listing.archived ? (
                        "Archived"
                      ) : listing.status === "Active" ? (
                        <>
                          <span className="relative flex h-1.5 w-1.5 shrink-0" aria-hidden>
                            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-current opacity-75" />
                            <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-current" />
                          </span>
                          Active
                        </>
                      ) : (
                        listing.status
                      )}
                    </span>
                  }
                />
                <div className="mt-3.5 px-4 pb-1">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="min-w-0 flex-1 truncate text-sm font-semibold leading-snug text-zinc-900 group-hover:underline">
                      {listing.title}
                    </h3>
                    {listing.reviewCount > 0 && (
                      <span
                        className="flex shrink-0 items-center gap-1 pt-px"
                        aria-label={`Rating: ${listing.rating} out of 5`}
                      >
                        <Star className="size-3.5 fill-zinc-900 text-zinc-900" aria-hidden />
                        <span className="text-sm tabular-nums text-zinc-900">
                          {listing.rating.toFixed(2)}
                        </span>
                      </span>
                    )}
                  </div>
                  <p className="mt-0.5 text-sm text-muted-foreground">{listing.location}</p>
                  <p className="text-sm text-muted-foreground">
                    {listing.beds} bed{listing.beds !== 1 ? "s" : ""} · {listing.baths} bath
                    {listing.baths !== 1 ? "s" : ""}
                  </p>
                  <p className="mt-0.5 text-sm text-zinc-900">
                    <span className="font-semibold">${listing.pricePerNight}</span>
                    <span className="text-muted-foreground"> / night</span>
                  </p>
                </div>
              </Link>
              {listing.archived ? (
                <div className="border-t border-zinc-100">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleUnarchive(listing.id)}
                    className="h-11 w-full gap-1.5 rounded-none text-sm font-medium hover:bg-zinc-50"
                  >
                    <ArchiveRestore className="size-3.5 shrink-0" />
                    Unarchive
                  </Button>
                </div>
              ) : (
                <div className="grid grid-cols-3 border-t border-zinc-100">
                  <Button
                    variant="ghost"
                    size="sm"
                    asChild
                    className="h-11 gap-1.5 rounded-none border-r border-zinc-100 text-sm font-medium hover:bg-zinc-50"
                  >
                    <Link href={`/become-a-host?edit=${listing.id}&step=2`} className="flex w-full items-center justify-center">
                      <Pencil className="size-3.5 shrink-0" />
                      Edit
                    </Link>
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setArchiveId(listing.id)}
                    className="h-11 w-full gap-1.5 rounded-none border-r border-zinc-100 text-sm font-medium hover:bg-zinc-50"
                  >
                    <Archive className="size-3.5 shrink-0" />
                    Archive
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setDeleteId(listing.id)}
                    className="h-11 w-full gap-1.5 rounded-none text-sm font-medium hover:bg-zinc-50"
                  >
                    <Trash2 className="size-3.5 shrink-0" />
                    Delete
                  </Button>
                </div>
              )}
            </Card>
          ))}
        </div>
      )}

      <Dialog open={!!archiveId} onOpenChange={(open) => !open && setArchiveId(null)}>
        <DialogContent className="w-full max-w-[320px] border-zinc-100 shadow-lg sm:max-w-[320px]">
          <DialogHeader>
            <DialogTitle className="text-left text-lg font-semibold text-zinc-900">
              Archive listing?
            </DialogTitle>
            <DialogDescription className="text-left text-zinc-900">
              {listingToArchive?.title} will be hidden from the marketplace. You can
              restore it from your dashboard later.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex flex-row gap-2 sm:justify-end">
            <Button
              variant="outline"
              className="h-11 rounded-[5px] font-medium shadow-none"
              onClick={() => setArchiveId(null)}
            >
              Cancel
            </Button>
            <Button
              className="h-11 rounded-[5px] font-medium shadow-none hover:bg-primary/90"
              onClick={() => {
                handleArchiveConfirm();
              }}
            >
              Archive
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
        <DialogContent className="w-full max-w-[320px] border-zinc-100 shadow-lg sm:max-w-[320px]">
          <DialogHeader>
            <DialogTitle className="text-left text-lg font-semibold text-zinc-900">
              Delete listing?
            </DialogTitle>
            <DialogDescription className="text-left text-muted-foreground">
              {listingToDelete && isListingWithUpcomingForDemo(listingToDelete.id) ? (
                <>
                  <span className="font-medium text-zinc-900">{listingToDelete.title}</span>
                  {" "}
                  has upcoming bookings. You cannot delete this listing until those reservations are
                  completed or cancelled.
                </>
              ) : (
                <>
                  <span className="font-medium text-zinc-900">{listingToDelete?.title}</span>
                  {" "}
                  will be permanently removed from the marketplace. This cannot be undone.
                </>
              )}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex flex-row gap-2 sm:justify-end">
            <Button
              variant="outline"
              className="h-11 rounded-[5px] font-medium shadow-none"
              onClick={() => setDeleteId(null)}
            >
              Cancel
            </Button>
            {listingToDelete && !isListingWithUpcomingForDemo(listingToDelete.id) && (
              <Button
                variant="destructive"
                className="h-11 rounded-[5px] font-medium shadow-none"
                onClick={handleDeleteConfirm}
              >
                Delete
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Profile tab                                                               */
/* -------------------------------------------------------------------------- */

function ProfileTab() {
  const [profile, setProfile] = useState<HostProfileData>({
    name: "Jamie Rivera",
    bio: "San Francisco local who loves sharing my home with travelers from around the world. I'm a designer by day and a home chef on weekends.",
    photo: HOST_PHOTO,
  });
  const [saved, setSaved] = useState(false);

  function handleSave() {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-zinc-900">Host profile</h2>
        <p className="mt-0.5 text-sm text-muted-foreground">This is what guests see when they view your listings</p>
      </div>
      <HostProfileForm
        data={profile}
        onChange={(updated) => setProfile((prev) => ({ ...prev, ...updated }))}
        showSave
        onSave={handleSave}
      />
      {saved && (
        <p className="text-sm font-medium text-emerald-600">Profile saved!</p>
      )}

      <Separator className="bg-zinc-200" />

      <div className="space-y-3">
        <div>
          <h3 className="text-base font-semibold text-zinc-900">Payout account</h3>
          <p className="mt-0.5 text-sm text-muted-foreground">Connect Stripe to receive payments directly to your bank</p>
        </div>
        <div className="flex items-center gap-3 rounded-xl border border-zinc-100 bg-white p-4">
          <div className="flex size-10 items-center justify-center rounded-full bg-[#635BFF]/10">
            <svg viewBox="0 0 24 24" className="size-5 fill-[#635BFF]" aria-hidden>
              <path d="M13.976 9.15c-2.172-.806-3.356-1.426-3.356-2.409 0-.831.683-1.305 1.901-1.305 2.227 0 4.515.858 6.09 1.631l.89-5.494C18.252.975 15.697 0 12.165 0 9.667 0 7.589.654 6.104 1.872 4.56 3.147 3.757 4.992 3.757 7.218c0 4.039 2.467 5.76 6.476 7.219 2.585.92 3.445 1.574 3.445 2.583 0 .98-.84 1.545-2.354 1.545-1.875 0-4.965-.921-6.99-2.109l-.9 5.555C5.175 22.99 8.385 24 11.714 24c2.641 0 4.843-.624 6.328-1.813 1.664-1.305 2.525-3.236 2.525-5.732 0-4.128-2.524-5.851-6.591-7.305z" />
            </svg>
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium text-zinc-900">Stripe Connect</p>
            <p className="text-xs text-muted-foreground">Not connected</p>
          </div>
          <Button
            variant="outline"
            size="sm"
            className="h-8 rounded-[5px] border-zinc-200 shadow-none"
            asChild
          >
            <a href="https://connect.stripe.com" target="_blank" rel="noopener noreferrer">
              Connect
              <ExternalLink className="ml-1.5 size-3" />
            </a>
          </Button>
        </div>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Payouts tab                                                               */
/* -------------------------------------------------------------------------- */

function PayoutsTab() {
  const totalPaid = PAYOUT_HISTORY.filter((p) => p.status === "paid").reduce((s, p) => s + p.amount, 0);
  const totalPending = PAYOUT_HISTORY.filter((p) => p.status !== "paid").reduce((s, p) => s + p.amount, 0);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-zinc-900">Payouts</h2>
        <p className="mt-0.5 text-sm text-muted-foreground">Track your earnings and payout history</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        {[
          { label: "Total earned", value: `$${(totalPaid + totalPending).toLocaleString()}`, sub: "All time", icon: TrendingUp, color: "text-emerald-600 bg-emerald-50" },
          { label: "Paid out", value: `$${totalPaid.toLocaleString()}`, sub: "Transferred to bank", icon: CheckCircle2, color: "text-zinc-600 bg-zinc-100" },
          { label: "Pending", value: `$${totalPending.toLocaleString()}`, sub: "Processing or upcoming", icon: Clock, color: "text-amber-600 bg-amber-50" },
        ].map(({ label, value, sub, icon: Icon, color }) => (
          <div key={label} className="rounded-xl border border-zinc-100 bg-white p-5">
            <div className={cn("mb-3 flex size-9 items-center justify-center rounded-full", color)}>
              <Icon className="size-4" />
            </div>
            <p className="text-2xl font-bold text-zinc-900">{value}</p>
            <p className="mt-0.5 text-sm font-medium text-zinc-700">{label}</p>
            <p className="text-xs text-muted-foreground">{sub}</p>
          </div>
        ))}
      </div>

      <div className="flex items-center gap-3 rounded-xl border border-amber-100 bg-amber-50 px-4 py-3">
        <DollarSign className="size-4 shrink-0 text-amber-600" />
        <p className="text-sm text-amber-800">
          Connect a Stripe account to receive payouts.{" "}
          <a href="https://connect.stripe.com" target="_blank" rel="noopener noreferrer" className="font-medium underline underline-offset-2">
            Set up payouts
          </a>
        </p>
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-semibold text-zinc-900">Payout history</h3>
            <p className="mt-0.5 text-sm text-muted-foreground">View past transfers and payment status</p>
          </div>
          <Button variant="ghost" size="sm" className="h-8 shrink-0 rounded-[5px] text-xs text-muted-foreground shadow-none hover:text-zinc-900">
            <Download className="mr-1.5 size-3.5" />
            Export CSV
          </Button>
        </div>
        <div className="overflow-x-auto rounded-xl border border-zinc-100">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-zinc-100 bg-zinc-50 text-left text-xs text-muted-foreground">
                <th className="px-4 py-3 font-medium">Date</th>
                <th className="px-4 py-3 font-medium">Property</th>
                <th className="px-4 py-3 font-medium hidden sm:table-cell">Guest</th>
                <th className="px-4 py-3 font-medium hidden md:table-cell">Nights</th>
                <th className="px-4 py-3 font-medium">Amount</th>
                <th className="px-4 py-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 bg-white">
              {PAYOUT_HISTORY.map((row) => (
                <tr key={row.id}>
                  <td className="px-4 py-3 text-muted-foreground">{row.date}</td>
                  <td className="px-4 py-3 font-medium text-zinc-900">{row.property}</td>
                  <td className="px-4 py-3 text-muted-foreground hidden sm:table-cell">{row.guest}</td>
                  <td className="px-4 py-3 text-muted-foreground hidden md:table-cell">{row.nights}</td>
                  <td className="px-4 py-3 font-semibold text-zinc-900">${row.amount}</td>
                  <td className="px-4 py-3">
                    {row.status === "paid" && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-medium text-emerald-700">
                        <CheckCircle2 className="size-3" /> Paid
                      </span>
                    )}
                    {row.status === "processing" && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-2 py-0.5 text-xs font-medium text-blue-700">
                        <Clock className="size-3" /> Processing
                      </span>
                    )}
                    {row.status === "pending" && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2 py-0.5 text-xs font-medium text-amber-700">
                        <Clock className="size-3" /> Pending
                      </span>
                    )}
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
/*  Main component                                                            */
/* -------------------------------------------------------------------------- */

const TAB_IDS: Tab[] = ["reservations", "listings", "messages", "profile", "payouts"];

function parseTabParam(value: string | null): Tab {
  if (value && TAB_IDS.includes(value as Tab)) return value as Tab;
  return "reservations";
}

export function SellerDashboardClient() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const tabParam = searchParams.get("tab");
  const activeTab = parseTabParam(tabParam);

  const [lineStyle, setLineStyle] = useState<{ left: number; width: number }>({ left: 0, width: 0 });
  const [mobileLineStyle, setMobileLineStyle] = useState<{ left: number; width: number }>({ left: 0, width: 0 });
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

  // Ensure URL has tab param on load (e.g. /dashboard/seller -> /dashboard/seller?tab=reservations)
  useEffect(() => {
    if (tabParam === null) {
      router.replace(`${pathname}?tab=reservations`);
    }
  }, [pathname, router, tabParam]);

  // Sliding underline: width = text width only, centered under tab — desktop
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

  // Mobile sliding underline (text width only) — useLayoutEffect so measurement runs after paint when mobile tab bar is visible
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

  // Re-measure mobile underline on resize (e.g. rotate to mobile)
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
    <div className="flex min-h-screen flex-col bg-white">

      {/* ── Header ── */}
      <header className="sticky top-0 z-50 w-full border-b border-zinc-100 bg-white">
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

          {/* Center: tab nav with sliding underline at header bottom */}
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
                className="absolute bottom-0 left-0 h-0.5 rounded-full bg-zinc-900 transition-all duration-300 ease-out pointer-events-none"
                style={{ left: lineStyle.left, width: lineStyle.width }}
                aria-hidden
              />
            </div>
          </nav>

          {/* Right: Switch to traveling + avatar */}
          <div className="flex w-40 shrink-0 items-center justify-end gap-3">
            <Link
              href="/"
              className="hidden shrink-0 whitespace-nowrap text-sm font-medium text-muted-foreground transition-colors hover:text-zinc-900 sm:block"
            >
              Switch to traveling
            </Link>
            <Avatar className="size-9 shrink-0 cursor-pointer border border-zinc-200">
              <AvatarImage
                src={HOST_PHOTO}
                alt="Jamie Rivera"
              />
              <AvatarFallback className="bg-zinc-900 text-xs font-bold text-white">JR</AvatarFallback>
            </Avatar>
          </div>
        </div>

        {/* Mobile tab bar: scrollable, underline inside so it scrolls with tabs */}
        <div
          className="overflow-x-auto border-t border-zinc-100 md:hidden"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          <div
            ref={mobileTabListRef}
            className="relative flex flex-nowrap items-center"
          >
            {TABS.map(({ id, label }, i) => (
              <button
                key={id}
                ref={(el) => { mobileTabRefs.current[i] = el; }}
                onClick={() => setActiveTab(id)}
                className={cn(
                  "relative shrink-0 px-4 py-3 text-sm font-medium whitespace-nowrap transition-colors",
                  activeTab === id
                    ? "text-zinc-900"
                    : "text-muted-foreground"
                )}
              >
                <span ref={(el) => { mobileTabTextRefs.current[i] = el; }}>{label}</span>
              </button>
            ))}
            <span
              className="absolute bottom-0 left-0 h-0.5 rounded-full bg-zinc-900 transition-all duration-300 ease-out pointer-events-none"
              style={{ left: mobileLineStyle.left, width: mobileLineStyle.width }}
              aria-hidden
            />
          </div>
        </div>
      </header>

      {/* ── Content ── */}
      {activeTab === "messages" ? (
        <div className="flex flex-1 overflow-hidden" style={{ height: "calc(100vh - 64px)" }}>
          <div className="flex w-full px-4 sm:px-6">
            <MessagesClient embedded />
          </div>
        </div>
      ) : (
        <main className="flex-1 py-8">
          <div className="container max-w-[1400px] px-4 sm:px-6">
            <div
              className={cn(
                "mx-auto",
                activeTab === "profile" ? "max-w-2xl" : "max-w-4xl"
              )}
            >
              {activeTab === "reservations" && <ReservationsTab />}
              {activeTab === "listings" && <ListingsTab />}
              {activeTab === "profile" && <ProfileTab />}
              {activeTab === "payouts" && <PayoutsTab />}
            </div>
          </div>
        </main>
      )}
    </div>
  );
}
