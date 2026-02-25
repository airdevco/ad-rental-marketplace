"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import {
  Search,
  ImageIcon,
  Send,
  ChevronRight,
  ChevronLeft,
  Wifi,
  Home,
  MapPin as MapPinLucide,
  Clock,
  Users,
  BedDouble,
  Bath,
  ShieldCheck,
  Cigarette,
  PawPrint,
  PartyPopper,
  X,
} from "lucide-react";
import { MapPin, Calendar, Star } from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { useMediaQuery } from "@/hooks/use-media-query";

/* -------------------------------------------------------------------------- */
/*  Mock data — home rentals                                                   */
/* -------------------------------------------------------------------------- */

const LISTING_IMAGE =
  "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&h=600&fit=crop";

const DUMMY_USERS = [
  {
    id: "u1",
    name: "Alex Chen",
    photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=96&h=96&fit=crop&crop=face",
    initials: "AC",
  },
  {
    id: "u2",
    name: "Sarah Miller",
    photo: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=96&h=96&fit=crop&crop=face",
    initials: "SM",
  },
  {
    id: "u3",
    name: "Jordan Park",
    photo: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=96&h=96&fit=crop&crop=face",
    initials: "JP",
  },
  {
    id: "u4",
    name: "Taylor Wilson",
    photo: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=96&h=96&fit=crop&crop=face",
    initials: "TW",
  },
  {
    id: "u5",
    name: "Mia Patel",
    photo: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=96&h=96&fit=crop&crop=face",
    initials: "MP",
  },
  {
    id: "u6",
    name: "Chris Thompson",
    photo: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=96&h=96&fit=crop&crop=face",
    initials: "CT",
  },
  {
    id: "u7",
    name: "Jamie Lee",
    photo: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=96&h=96&fit=crop&crop=face",
    initials: "JL",
  },
  {
    id: "u8",
    name: "Priya Singh",
    photo: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=96&h=96&fit=crop&crop=face",
    initials: "PS",
  },
];

type Thread = {
  id: string;
  userId: string;
  guestIds: string[];
  previewSenderId: string;
  preview: string;
  time: string;
  unread: boolean;
  listingTitle: string;
  listingImage: string;
  dates: string;
  status: "confirmed" | "pending" | "completed" | "cancelled";
  /** Profile slug for the other user (buyer or seller) — e.g. buyer-1, seller-1 */
  otherProfileSlug: string;
};

const MOCK_THREADS: Thread[] = [
  {
    id: "t1",
    userId: "u1",
    guestIds: ["u1"],
    previewSenderId: "u1",
    preview: "The lockbox code is 4821. Check-in is any time after 3 PM — see you soon!",
    time: "2m ago",
    unread: true,
    listingTitle: "Sunny Studio · San Francisco",
    listingImage: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=200&h=150&fit=crop",
    dates: "May 15 – 18",
    status: "confirmed",
    otherProfileSlug: "buyer-1",
  },
  {
    id: "t2",
    userId: "u2",
    guestIds: ["u2"],
    previewSenderId: "u2",
    preview: "Thanks for choosing our beach house! Let me know if you need anything.",
    time: "1h ago",
    unread: true,
    listingTitle: "Beach House · Malibu",
    listingImage: "https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?w=200&h=150&fit=crop",
    dates: "May 20 – 22",
    status: "confirmed",
    otherProfileSlug: "buyer-1",
  },
  {
    id: "t3",
    userId: "u3",
    guestIds: ["u3", "u4"],
    previewSenderId: "u3",
    preview: "Self check-in instructions have been sent to your email.",
    time: "3h ago",
    unread: false,
    listingTitle: "Downtown Loft · Chicago",
    listingImage: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=200&h=150&fit=crop",
    dates: "Jun 1 – 4",
    status: "confirmed",
    otherProfileSlug: "buyer-1",
  },
  {
    id: "t4",
    userId: "u4",
    guestIds: ["u4"],
    previewSenderId: "u4",
    preview: "Hope you enjoyed your stay! Don't forget to leave a review.",
    time: "Yesterday",
    unread: false,
    listingTitle: "Garden Cottage · Berkeley",
    listingImage: "https://images.unsplash.com/photo-1560185007-c5ca9d2c014d?w=200&h=150&fit=crop",
    dates: "Apr 10 – 12",
    status: "completed",
    otherProfileSlug: "buyer-1",
  },
  {
    id: "t5",
    userId: "u5",
    guestIds: ["u5", "u6", "u3"],
    previewSenderId: "u5",
    preview: "The WiFi password is written on the card by the fridge.",
    time: "2d ago",
    unread: false,
    listingTitle: "Mountain Cabin · Lake Tahoe",
    listingImage: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=200&h=150&fit=crop",
    dates: "May 25 – 28",
    status: "confirmed",
    otherProfileSlug: "buyer-1",
  },
  {
    id: "t6",
    userId: "u6",
    guestIds: ["u6"],
    previewSenderId: "u6",
    preview: "Thank you for the kind review — you're welcome back anytime!",
    time: "1w ago",
    unread: false,
    listingTitle: "Historic Brownstone · Boston",
    listingImage: "https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=200&h=150&fit=crop",
    dates: "Mar 1 – 4",
    status: "completed",
    otherProfileSlug: "buyer-1",
  },
  {
    id: "t7",
    userId: "u7",
    guestIds: ["u7"],
    previewSenderId: "u7",
    preview: "Thanks for reaching out.",
    time: "2w ago",
    unread: false,
    listingTitle: "Sunny Studio · San Francisco",
    listingImage: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=200&h=150&fit=crop",
    dates: "Nov 5 – 7",
    status: "cancelled",
    otherProfileSlug: "buyer-1",
  },
  {
    id: "t8",
    userId: "u8",
    guestIds: ["u8"],
    previewSenderId: "u8",
    preview: "Request for Mar 5 – 8",
    time: "1d ago",
    unread: true,
    listingTitle: "Sunny Studio · San Francisco",
    listingImage: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=200&h=150&fit=crop",
    dates: "Mar 5 – 8",
    status: "pending",
    otherProfileSlug: "buyer-1",
  },
];

type Message = {
  from: string;
  text: string;
  time: string;
};

const MOCK_MESSAGES: Record<string, Message[]> = {
  t1: [
    { from: "u1", text: "Hi! Welcome to Rento. I'm Alex, your host for the Sunny Studio in San Francisco. Your reservation for May 15–18 is confirmed.", time: "10:15 AM" },
    { from: "me", text: "Thanks Alex! Super excited. What time can I check in?", time: "10:18 AM" },
    { from: "u1", text: "Check-in is any time after 3 PM. The studio is on the 4th floor — there's an elevator in the lobby.", time: "10:22 AM" },
    { from: "me", text: "Perfect. And how does entry work? Is there a keypad?", time: "10:25 AM" },
    { from: "u1", text: "Yes! There's a lockbox on the front door of the building. The code is 4821. Your unit key is inside. The apartment door uses the same key.", time: "10:30 AM" },
    { from: "me", text: "Great. Is parking available nearby?", time: "10:33 AM" },
    { from: "u1", text: "Street parking on Oak St is free after 6 PM and all day Sunday. There's also a paid garage one block east on Fell — about $18/day.", time: "10:36 AM" },
    { from: "me", text: "That works, thanks! One last thing — is there a washer/dryer?", time: "10:38 AM" },
    { from: "u1", text: "There's a shared laundry room on the ground floor. Quarters or the app — both work. The lockbox code is 4821. Check-in is any time after 3 PM — see you soon!", time: "10:40 AM" },
  ],
  t2: [
    { from: "u2", text: "Hi! Your booking for the Malibu Beach House is confirmed for May 20–22. I'm so glad you chose us!", time: "9:00 AM" },
    { from: "me", text: "We're so excited, Sarah! This is our anniversary trip.", time: "9:05 AM" },
    { from: "u2", text: "How wonderful! I'll leave a welcome bottle of champagne in the fridge. Thanks for choosing our beach house! Let me know if you need anything.", time: "9:10 AM" },
  ],
  t3: [
    { from: "u3", text: "Hey! Quick heads-up — check-in is after 3 PM. There's a smart lock on the door; I'll send your code 24 hours before arrival.", time: "Yesterday" },
    { from: "u3", text: "Self check-in instructions have been sent to your email.", time: "Yesterday" },
  ],
  t4: [
    { from: "me", text: "Jordan, the cottage was absolutely lovely. Thank you for the warm welcome basket!", time: "2d ago" },
    { from: "u4", text: "Hope you enjoyed your stay! Don't forget to leave a review.", time: "2d ago" },
  ],
  t5: [
    { from: "u5", text: "Hi! Heads up — the WiFi network is 'CabinGuest' and the password is on a card by the fridge.", time: "3d ago" },
    { from: "u5", text: "The WiFi password is written on the card by the fridge.", time: "3d ago" },
  ],
  t6: [
    { from: "u6", text: "I just saw your review — it really made my day. Thank you for being such a wonderful guest!", time: "1w ago" },
  ],
  t7: [
    { from: "u7", text: "Hi, I had to cancel my trip. Sorry for the inconvenience.", time: "2w ago" },
  ],
  t8: [
    { from: "u8", text: "Hi! I'd like to book the Sunny Studio for Mar 5–8. Is it available?", time: "1d ago" },
  ],
};

/* Booking detail for the selected thread */
const BOOKING_DETAIL = {
  listingId: "1",
  title: "Sunny Studio in the Mission",
  subtitle: "Entire studio · San Francisco, CA",
  image: LISTING_IMAGE,
  hostName: "Alex Chen",
  hostPhoto: DUMMY_USERS[0].photo,
  hostJoined: "2021",
  hostReviewCount: 38,
  rating: 4.91,
  reviewCount: 52,
  checkIn: "May 15",
  checkOut: "May 18",
  checkInTime: "3:00 PM",
  checkOutTime: "11:00 AM",
  location: "Mission District, San Francisco, CA 94110",
  nights: 3,
  pricePerNight: 120,
  serviceFee: 42,
  cleaningFee: 30,
  facts: {
    bedrooms: 1,
    bathrooms: 1,
    guests: 2,
    type: "Entire studio",
  },
  gettingThere: "Walk 5 min to 16th St BART station. Direct service to SFO and downtown. Street parking on Oak St free after 6 PM.",
  wifiName: "MissionStudio_Guest",
  wifiPassword: "sunshine2024",
  houseRules: [
    { icon: Clock, text: "Check-in after 3:00 PM, checkout by 11:00 AM" },
    { icon: Cigarette, text: "No smoking anywhere on the property" },
    { icon: PawPrint, text: "No pets allowed" },
    { icon: PartyPopper, text: "No parties or events" },
  ],
  hostReview: {
    text: "Great guest — left the studio spotless and communicated clearly throughout. Would host again without hesitation.",
    reviewer: "Sarah M.",
    reviewerPhoto: DUMMY_USERS[1].photo,
    reviewerInitials: "SM",
    date: "April 2024",
  },
};

/* -------------------------------------------------------------------------- */
/*  Helpers                                                                    */
/* -------------------------------------------------------------------------- */

function getUserById(id: string) {
  return (
    DUMMY_USERS.find((u) => u.id === id) ?? {
      id,
      name: "Unknown",
      photo: "",
      initials: "?",
    }
  );
}

function formatGuestNames(guestIds: string[]): string {
  if (guestIds.length === 0) return "Unknown";
  if (guestIds.length === 1) return getUserById(guestIds[0]).name;
  const first = getUserById(guestIds[0]).name.split(" ")[0];
  const second = getUserById(guestIds[1]).name.split(" ")[0];
  const extra = guestIds.length - 2;
  if (extra === 0) return `${first} & ${second}`;
  return `${first}, ${second} and ${extra} other${extra > 1 ? "s" : ""}`;
}

function formatPreview(senderId: string, preview: string): string {
  if (senderId === "me") return `You: ${preview}`;
  return `${getUserById(senderId).name.split(" ")[0]}: ${preview}`;
}

function statusDotClass(status: Thread["status"]): string {
  if (status === "confirmed") return "bg-emerald-500";
  if (status === "pending") return "bg-amber-400";
  return "bg-zinc-300";
}

function statusLabel(status: Thread["status"]): string {
  if (status === "confirmed") return "Confirmed";
  if (status === "pending") return "Pending";
  if (status === "completed") return "Completed";
  return "Cancelled";
}

/* -------------------------------------------------------------------------- */
/*  Thread list                                                                */
/* -------------------------------------------------------------------------- */

function ThreadList({
  threads,
  activeId,
  onSelect,
}: {
  threads: Thread[];
  activeId: string | null;
  onSelect: (id: string) => void;
}) {
  const [search, setSearch] = useState("");
  const filtered = search.trim()
    ? threads.filter(
        (t) =>
          formatGuestNames(t.guestIds).toLowerCase().includes(search.toLowerCase()) ||
          t.listingTitle.toLowerCase().includes(search.toLowerCase())
      )
    : threads;

  return (
    <aside className="flex min-h-0 min-w-0 w-full shrink-0 flex-col border-r border-zinc-100 bg-white md:w-96 lg:w-[432px]">
      <div className="flex h-14 shrink-0 items-center border-b border-zinc-100 px-4 sm:px-6">
        <h1 className="text-lg font-semibold text-zinc-900">Messages</h1>
      </div>

      <div className="border-b border-zinc-100 px-4 sm:px-6">
        <div className="relative py-2">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground pointer-events-none" />
          <Input
            placeholder="Search messages"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-9 rounded-[5px] border-zinc-200 bg-white pl-9 pr-3 text-sm shadow-none focus-visible:border-zinc-900 focus-visible:ring-0"
          />
        </div>
      </div>

      <div className="min-w-0 flex-1 overflow-y-auto overflow-x-hidden">
        <ul className="list-none p-0">
          {filtered.map((thread) => {
            const primaryUser = getUserById(thread.userId);
            const guestNames = formatGuestNames(thread.guestIds);
            const previewText = formatPreview(thread.previewSenderId, thread.preview);
            const isActive = activeId === thread.id;
            return (
              <li key={thread.id}>
                <button
                  type="button"
                  onClick={() => onSelect(thread.id)}
                  className={cn(
                    "flex w-full items-start gap-3 px-4 py-3.5 text-left transition-colors hover:bg-zinc-50 sm:px-6",
                    isActive && "bg-zinc-100"
                  )}
                >
                  {/* Listing thumbnail with guest avatar overlay */}
                  <div className="relative shrink-0">
                    <div className="h-[52px] w-[70px] overflow-hidden rounded-lg bg-zinc-100">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={thread.listingImage}
                        alt={thread.listingTitle}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    {/* Guest avatar overlay — right bottom */}
                    <Link
                      href={`/profile/${thread.otherProfileSlug}`}
                      onClick={(e) => e.stopPropagation()}
                      className="absolute -bottom-1.5 -right-1.5 size-[22px] overflow-hidden rounded-full border-2 border-white bg-zinc-200 focus-visible:outline focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                      aria-label={`View ${primaryUser.name}'s profile`}
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={primaryUser.photo}
                        alt={primaryUser.name}
                        className="h-full w-full object-cover"
                      />
                    </Link>
                  </div>

                  {/* Content */}
                  <div className="min-w-0 flex-1 pt-0.5">
                    <div className="flex items-baseline justify-between gap-2">
                      <span className={cn(
                        "min-w-0 flex-1 truncate text-sm",
                        thread.unread ? "font-semibold text-zinc-900" : "font-medium text-zinc-900"
                      )}>
                        {guestNames}
                      </span>
                      <span className="shrink-0 text-xs text-muted-foreground">{thread.time}</span>
                    </div>

                    <div className="mt-0.5 flex items-center gap-1.5">
                      <span className={cn("size-1.5 shrink-0 rounded-full", statusDotClass(thread.status))} />
                      <span className="text-xs text-muted-foreground">{statusLabel(thread.status)} · {thread.dates}</span>
                    </div>

                    <p className={cn(
                      "mt-0.5 truncate text-sm",
                      thread.unread ? "font-medium text-zinc-900" : "text-muted-foreground"
                    )}>
                      {previewText}
                    </p>
                  </div>
                </button>
              </li>
            );
          })}
        </ul>
      </div>
    </aside>
  );
}

/* -------------------------------------------------------------------------- */
/*  Conversation panel                                                         */
/* -------------------------------------------------------------------------- */

function ConversationPanel({
  thread,
  messages,
  onSendMessage,
  showDetailPanel,
  onShowDetailPanel,
  onBack,
}: {
  thread: Thread;
  messages: Message[];
  onSendMessage?: (threadId: string, text: string) => void;
  showDetailPanel: boolean;
  onShowDetailPanel: () => void;
  onBack?: () => void;
}) {
  const user = getUserById(thread.userId);
  const [draft, setDraft] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div className="flex min-h-0 min-w-0 flex-1 flex-col">
      {/* Header */}
      <div className="flex h-14 shrink-0 items-center gap-3 border-b border-zinc-100 px-4 sm:px-6">
        {onBack ? (
          <button
            type="button"
            onClick={onBack}
            className="flex size-8 shrink-0 items-center justify-center rounded-full text-zinc-700 transition-colors hover:bg-zinc-100 hover:text-zinc-900"
            aria-label="Back to conversations"
          >
            <ChevronLeft className="size-5" />
          </button>
        ) : null}
        <Link
          href={`/profile/${thread.otherProfileSlug}`}
          className="flex shrink-0 rounded-full focus-visible:outline focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          aria-label={`View ${user.name}'s profile`}
        >
          <Avatar className="size-8 shrink-0">
            <AvatarImage src={user.photo} alt={user.name} />
            <AvatarFallback className="text-xs">{user.initials}</AvatarFallback>
          </Avatar>
        </Link>
        <div className="min-w-0 flex-1">
          <h2 className="text-sm font-semibold text-zinc-900">{formatGuestNames(thread.guestIds)}</h2>
          <p className="truncate text-xs text-muted-foreground">{thread.listingTitle} · {thread.dates}</p>
        </div>
        {!showDetailPanel && (
          <Button
            variant="outline"
            size="sm"
            onClick={onShowDetailPanel}
            className="h-9 shrink-0 rounded-full border-zinc-200 px-3 text-sm font-medium shadow-none hover:bg-zinc-100"
          >
            Show reservation
          </Button>
        )}
      </div>

      {/* Messages — no mx-auto, bubbles anchor to their respective sides */}
      <div ref={scrollRef} className="flex-1 overflow-auto px-4 py-5 sm:px-6" tabIndex={0}>
        <div className="flex flex-col gap-3">
          {messages.map((msg, i) => {
            const isMe = msg.from === "me";
            const sender = isMe ? null : getUserById(msg.from);
            if (isMe) {
              return (
                <div key={i} className="flex justify-end">
                  <div className="max-w-[72%]">
                    <div className="rounded-tl-2xl rounded-tr-2xl rounded-bl-2xl rounded-br-sm bg-zinc-700 px-3.5 py-2.5 text-white">
                      <p className="text-sm leading-relaxed">{msg.text}</p>
                    </div>
                    <p className="mt-1 text-right text-xs text-muted-foreground">{msg.time}</p>
                  </div>
                </div>
              );
            }
            return (
              <div key={i} className="flex justify-start">
                <div className="flex max-w-[72%] flex-col">
                  <div className="flex items-end gap-2">
                    <Link
                      href={`/profile/${thread.otherProfileSlug}`}
                      className="flex shrink-0 rounded-full focus-visible:outline focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                      aria-label={`View ${sender!.name}'s profile`}
                    >
                      <Avatar className="size-7 shrink-0">
                        <AvatarImage src={sender!.photo} alt={sender!.name} />
                        <AvatarFallback>{sender!.initials}</AvatarFallback>
                      </Avatar>
                    </Link>
                    <div className="rounded-tl-2xl rounded-tr-2xl rounded-br-2xl rounded-bl-sm bg-zinc-100 px-3.5 py-2.5 text-zinc-900">
                      <p className="text-sm leading-relaxed">{msg.text}</p>
                    </div>
                  </div>
                  <p className="mt-1 pl-9 text-xs text-muted-foreground">{msg.time}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Compose */}
      <div className="border-t border-zinc-100 px-4 py-3 sm:px-6">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            const text = draft.trim();
            if (text && onSendMessage) onSendMessage(thread.id, text);
            setDraft("");
          }}
          className="flex items-end gap-2"
        >
          <Label htmlFor="message-input" className="sr-only">Write a message</Label>
          <button
            type="button"
            className="flex size-10 shrink-0 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-zinc-100 hover:text-zinc-600"
            aria-label="Attach photo"
          >
            <ImageIcon className="size-5" />
          </button>
          <Input
            id="message-input"
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            placeholder="Write a message..."
            className="min-h-10 flex-1 rounded-full border-zinc-200 bg-white px-4 text-sm shadow-none focus-visible:border-zinc-900 focus-visible:ring-0"
            autoComplete="off"
          />
          <Button
            type="submit"
            size="icon"
            className="size-10 shrink-0 rounded-full bg-primary hover:bg-primary/90"
            aria-label="Send message"
          >
            <Send className="size-4 text-white" />
          </Button>
        </form>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Booking detail panel (right sidebar — rich scrollable column)             */
/* -------------------------------------------------------------------------- */

function BookingDetailPanel({
  thread,
  show,
  onClose,
  fullWidth = false,
}: {
  thread: Thread;
  show: boolean;
  onClose: () => void;
  fullWidth?: boolean;
}) {
  const b = BOOKING_DETAIL;
  const subtotal = b.nights * b.pricePerNight;
  const total = subtotal + b.serviceFee + b.cleaningFee;

  return (
    <aside
      className={cn(
        "min-h-0 shrink-0 flex-col overflow-hidden bg-white transition-[width] duration-300 ease-in-out",
        fullWidth
          ? "flex w-full flex-1 min-h-0"
          : "hidden xl:flex",
        !fullWidth && show && "border-l border-zinc-100"
      )}
      style={fullWidth ? undefined : { width: show ? "432px" : "0px" }}
    >
      {/* Header */}
      <div className="flex h-14 shrink-0 items-center justify-between border-b border-zinc-100 px-4 sm:px-6">
        <h2 className="text-lg font-semibold text-zinc-900">Reservation details</h2>
        <button
          type="button"
          onClick={onClose}
          className="flex size-8 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-zinc-100 hover:text-zinc-900"
          aria-label="Close reservation details"
        >
          <X className="size-4" />
        </button>
      </div>

      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto">
        <div className="flex flex-col gap-0">

          {/* Listing image + title + rating + View listing */}
          <div className="px-4 pt-4 pb-4 sm:px-6">
            <div className="relative aspect-[16/10] w-full overflow-hidden rounded-xl bg-zinc-100">
              <Image
                src={b.image}
                alt={b.title}
                fill
                className="object-cover"
                sizes="400px"
              />
            </div>
            <h3 className="mt-3 text-base font-semibold text-zinc-900">{b.title}</h3>
            <p className="mt-0.5 text-sm text-muted-foreground">{b.subtitle}</p>
            <div className="mt-1.5 flex items-center gap-1">
              <Star size={13} weight="fill" className="text-zinc-900 shrink-0" />
              <span className="text-sm font-semibold tabular-nums text-zinc-900">{b.rating.toFixed(2)}</span>
              <span className="text-sm text-muted-foreground">· {b.reviewCount} reviews</span>
            </div>
            <Button
              asChild
              variant="outline"
              size="sm"
              className="mt-3 h-9 rounded-[5px] border-zinc-200 font-medium shadow-none hover:bg-zinc-100"
            >
              <Link href="/listing/e1">View listing</Link>
            </Button>
          </div>

          <div className="px-4 sm:px-6"><div className="border-t border-zinc-100" /></div>

          {/* Price summary — no Reserve */}
          <div className="px-4 pb-4 pt-4 space-y-3 sm:px-6">
            <div className="flex items-baseline gap-1">
              <span className="text-xl font-bold tabular-nums text-zinc-900">${b.pricePerNight}</span>
              <span className="text-sm text-muted-foreground">/ night</span>
            </div>
            {/* Check-in / Check-out */}
            <div className="grid grid-cols-2 divide-x divide-zinc-100 overflow-hidden rounded-lg border border-zinc-100">
              <div className="px-3 py-2.5">
                <p className="text-xs font-semibold text-muted-foreground">Check-in</p>
                <p className="mt-0.5 text-sm font-medium text-zinc-900">{b.checkIn}</p>
              </div>
              <div className="px-3 py-2.5">
                <p className="text-xs font-semibold text-muted-foreground">Checkout</p>
                <p className="mt-0.5 text-sm font-medium text-zinc-900">{b.checkOut}</p>
              </div>
            </div>
            {/* Price breakdown */}
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">${b.pricePerNight} × {b.nights} nights</span>
                <span className="tabular-nums font-medium text-zinc-900">${subtotal}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Cleaning fee</span>
                <span className="tabular-nums font-medium text-zinc-900">${b.cleaningFee}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Service fee</span>
                <span className="tabular-nums font-medium text-zinc-900">${b.serviceFee}</span>
              </div>
              <div className="border-t border-zinc-100 pt-2">
                <div className="flex justify-between font-semibold text-zinc-900">
                  <span>Total</span>
                  <span className="tabular-nums">${total}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="px-4 sm:px-6"><div className="border-t border-zinc-100" /></div>

          {/* Facts about the place */}
          <div className="px-4 pb-4 pt-4 sm:px-6">
            <h3 className="text-lg font-semibold text-zinc-900">Facts about the place</h3>
            <div className="mt-3 grid grid-cols-2 gap-2.5">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <BedDouble className="size-4 shrink-0 text-muted-foreground" />
                {b.facts.bedrooms} bedroom{b.facts.bedrooms !== 1 ? "s" : ""}
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Bath className="size-4 shrink-0 text-muted-foreground" />
                {b.facts.bathrooms} bathroom{b.facts.bathrooms !== 1 ? "s" : ""}
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Users className="size-4 shrink-0 text-muted-foreground" />
                {b.facts.guests} guests max
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Home className="size-4 shrink-0 text-muted-foreground" />
                {b.facts.type}
              </div>
            </div>
          </div>

          <div className="px-4 sm:px-6"><div className="border-t border-zinc-100" /></div>

          {/* Getting there */}
          <div className="px-4 pb-4 pt-4 sm:px-6">
            <h3 className="text-lg font-semibold text-zinc-900">Getting there</h3>
            <p className="mt-2.5 text-sm text-muted-foreground leading-relaxed">{b.gettingThere}</p>
            <button
              type="button"
              className="mt-2.5 flex w-full items-center justify-between rounded-md py-1 text-sm font-medium text-zinc-900 hover:text-primary transition-colors"
            >
              <span className="flex items-center gap-2">
                <MapPinLucide className="size-4 shrink-0 text-muted-foreground" />
                {b.location}
              </span>
              <ChevronRight className="size-4 shrink-0 text-muted-foreground" />
            </button>
          </div>

          <div className="px-4 sm:px-6"><div className="border-t border-zinc-100" /></div>

          {/* Check-in */}
          <div className="px-4 pb-4 pt-4 sm:px-6">
            <h3 className="text-lg font-semibold text-zinc-900">Check-in</h3>
            <div className="mt-3 space-y-2">
              <div className="flex items-center gap-2 text-sm">
                <Clock className="size-4 shrink-0 text-muted-foreground" />
                <span className="text-muted-foreground">After {b.checkInTime}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <ShieldCheck className="size-4 shrink-0 text-muted-foreground" />
                <span className="text-muted-foreground">Self check-in via lockbox</span>
              </div>
            </div>
          </div>

          <div className="px-4 sm:px-6"><div className="border-t border-zinc-100" /></div>

          {/* WiFi */}
          <div className="px-4 pb-4 pt-4 sm:px-6">
            <h3 className="text-lg font-semibold text-zinc-900">WiFi</h3>
            <div className="mt-3 space-y-2">
              <div className="flex items-center gap-2 text-sm">
                <Wifi className="size-4 shrink-0 text-muted-foreground" />
                <div>
                  <span className="text-muted-foreground">Network: </span>
                  <span className="font-medium text-zinc-900">{b.wifiName}</span>
                </div>
              </div>
              <div className="flex items-center gap-2 text-sm pl-6">
                <span className="text-muted-foreground">Password: </span>
                <span className="font-medium text-zinc-900">{b.wifiPassword}</span>
              </div>
            </div>
          </div>

          <div className="px-4 sm:px-6"><div className="border-t border-zinc-100" /></div>

          {/* House rules */}
          <div className="px-4 pb-4 pt-4 sm:px-6">
            <h3 className="text-lg font-semibold text-zinc-900">House rules</h3>
            <ul className="mt-3 space-y-2.5">
              {b.houseRules.map((rule, i) => (
                <li key={i} className="flex items-start gap-2 text-sm">
                  <rule.icon className="size-4 mt-0.5 shrink-0 text-muted-foreground" />
                  <span className="text-muted-foreground">{rule.text}</span>
                </li>
              ))}
            </ul>
          </div>

        </div>
      </div>
    </aside>
  );
}

/* -------------------------------------------------------------------------- */
/*  Main component                                                             */
/* -------------------------------------------------------------------------- */

export function MessagesClient({ embedded = false }: { embedded?: boolean }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [messagesByThread, setMessagesByThread] = useState<Record<string, Message[]>>(MOCK_MESSAGES);
  const [activeId, setActiveId] = useState<string | null>(
    MOCK_THREADS[0]?.id ?? null
  );

  // When embedded, handle ?thread= & sent= from cancel/decline dialog: append message and switch thread
  useEffect(() => {
    if (!embedded) return;
    const thread = searchParams.get("thread");
    const sent = searchParams.get("sent");
    if (!thread || !sent) return;
    const text = decodeURIComponent(sent);
    setMessagesByThread((prev) => ({
      ...prev,
      [thread]: [...(prev[thread] ?? []), { from: "me", text, time: "Just now" }],
    }));
    setActiveId(thread);
    const next = new URLSearchParams(searchParams);
    next.delete("sent");
    next.delete("thread");
    const q = next.toString();
    router.replace(pathname + (q ? `?${q}` : ""), { scroll: false });
  }, [embedded, pathname, searchParams, router]);

  const activeThread = MOCK_THREADS.find((t) => t.id === activeId) ?? null;
  const messages = activeId ? (messagesByThread[activeId] ?? []) : [];
  const [showDetailPanel, setShowDetailPanel] = useState(true);
  const isMdOrLarger = useMediaQuery("(min-width: 768px)");
  const [mobileView, setMobileView] = useState<"threads" | "chat" | "reservation">("threads");

  const handleSendMessage = (threadId: string, text: string) => {
    setMessagesByThread((prev) => ({
      ...prev,
      [threadId]: [...(prev[threadId] ?? []), { from: "me", text, time: "Just now" }],
    }));
  };

  const handleThreadSelect = (id: string) => {
    setActiveId(id);
    if (!isMdOrLarger) setMobileView("chat");
  };

  const conversationPanel = activeThread ? (
    <ConversationPanel
      thread={activeThread}
      messages={messages}
      onSendMessage={handleSendMessage}
      showDetailPanel={isMdOrLarger ? showDetailPanel : false}
      onShowDetailPanel={isMdOrLarger ? () => setShowDetailPanel(true) : () => setMobileView("reservation")}
      onBack={isMdOrLarger ? undefined : () => setMobileView("threads")}
    />
  ) : (
    <div className="flex min-w-0 flex-1 items-center justify-center">
      <p className="text-sm text-muted-foreground">Select a conversation to start messaging.</p>
    </div>
  );

  function renderContent() {
    if (!isMdOrLarger) {
      if (mobileView === "threads") {
        return (
          <ThreadList
            threads={MOCK_THREADS}
            activeId={activeId}
            onSelect={handleThreadSelect}
          />
        );
      }
      if (mobileView === "chat") {
        return conversationPanel;
      }
      return activeThread ? (
        <BookingDetailPanel
          thread={activeThread}
          show
          fullWidth
          onClose={() => setMobileView("chat")}
        />
      ) : null;
    }
    return (
      <>
        <ThreadList
          threads={MOCK_THREADS}
          activeId={activeId}
          onSelect={setActiveId}
        />
        {conversationPanel}
        {activeThread && (
          <BookingDetailPanel
            thread={activeThread}
            show={showDetailPanel}
            onClose={() => setShowDetailPanel(false)}
          />
        )}
      </>
    );
  }

  const wrapperClass = "flex h-full min-h-0 w-full overflow-hidden";
  const innerClass = embedded ? wrapperClass : "flex h-[calc(100vh-4rem)] w-full";

  if (embedded) {
    return (
      <div className={wrapperClass}>
        {renderContent()}
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className={innerClass}>
        {renderContent()}
      </div>
    </div>
  );
}
