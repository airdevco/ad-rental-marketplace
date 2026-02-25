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
} from "lucide-react";
import { MapPin, Calendar, Star } from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

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
  preview: string;
  time: string;
  unread: boolean;
  listingTitle: string;
  dates: string;
};

const MOCK_THREADS: Thread[] = [
  {
    id: "t1",
    userId: "u1",
    preview: "The lockbox code is 4821. Check-in is any time after 3 PM — see you soon!",
    time: "2m ago",
    unread: true,
    listingTitle: "Sunny Studio · San Francisco",
    dates: "May 15 – 18",
  },
  {
    id: "t2",
    userId: "u2",
    preview: "Thanks for choosing our beach house! Let me know if you need anything.",
    time: "1h ago",
    unread: true,
    listingTitle: "Beach House · Malibu",
    dates: "May 20 – 22",
  },
  {
    id: "t3",
    userId: "u3",
    preview: "Self check-in instructions have been sent to your email.",
    time: "3h ago",
    unread: false,
    listingTitle: "Downtown Loft · Chicago",
    dates: "Jun 1 – 4",
  },
  {
    id: "t4",
    userId: "u4",
    preview: "Hope you enjoyed your stay! Don't forget to leave a review.",
    time: "Yesterday",
    unread: false,
    listingTitle: "Garden Cottage · Berkeley",
    dates: "Apr 10 – 12",
  },
  {
    id: "t5",
    userId: "u5",
    preview: "The WiFi password is written on the card by the fridge.",
    time: "2d ago",
    unread: false,
    listingTitle: "Mountain Cabin · Lake Tahoe",
    dates: "May 25 – 28",
  },
  {
    id: "t6",
    userId: "u6",
    preview: "Thank you for the kind review — you're welcome back anytime!",
    time: "1w ago",
    unread: false,
    listingTitle: "Historic Brownstone · Boston",
    dates: "Mar 1 – 4",
  },
  {
    id: "t7",
    userId: "u7",
    preview: "Thanks for reaching out.",
    time: "2w ago",
    unread: false,
    listingTitle: "Sunny Studio · San Francisco",
    dates: "Nov 5 – 7",
  },
  {
    id: "t8",
    userId: "u8",
    preview: "Request for Mar 5 – 8",
    time: "1d ago",
    unread: true,
    listingTitle: "Sunny Studio · San Francisco",
    dates: "Mar 5 – 8",
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
          getUserById(t.userId).name
            .toLowerCase()
            .includes(search.toLowerCase()) ||
          t.listingTitle.toLowerCase().includes(search.toLowerCase())
      )
    : threads;

  return (
    <aside className="flex w-full shrink-0 flex-col border-r border-zinc-100 bg-white md:w-72 lg:w-[300px]">
      <div className="flex h-14 shrink-0 items-center justify-between border-b border-zinc-100 -ml-4 sm:-ml-6">
        <div className="pl-4 sm:pl-6">
          <h1 className="text-lg font-bold text-zinc-900">Messages</h1>
        </div>
      </div>

      <div className="border-b border-zinc-100 -ml-4 sm:-ml-6">
        <div className="relative py-2 pl-4 pr-3 sm:pl-6 sm:pr-3">
          <Search className="absolute left-7 top-1/2 size-4 -translate-y-1/2 text-muted-foreground sm:left-9" />
          <Input
            placeholder="Search messages"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-9 pl-9 text-sm focus-visible:border focus-visible:border-primary focus-visible:ring-0"
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto overflow-x-visible">
        <div className="-mx-4 w-[calc(100%+2rem)] sm:-mx-6 sm:w-[calc(100%+3rem)]">
          <ul className="list-none p-0">
            {filtered.map((thread) => {
              const user = getUserById(thread.userId);
              const isActive = activeId === thread.id;
              return (
                <li key={thread.id}>
                  <button
                    type="button"
                    onClick={() => onSelect(thread.id)}
                    className={cn(
                      "flex w-full items-start gap-3 py-3 px-4 text-left transition-colors hover:bg-zinc-50 sm:px-6",
                      isActive && "bg-zinc-100"
                    )}
                  >
                    <Avatar className="size-10 shrink-0">
                      <AvatarImage src={user.photo} alt={user.name} />
                      <AvatarFallback>{user.initials}</AvatarFallback>
                    </Avatar>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-2">
                        <span className={cn(
                          "truncate text-sm",
                          thread.unread ? "font-semibold text-zinc-900" : "font-medium text-zinc-700"
                        )}>
                          {user.name}
                        </span>
                        <span className="shrink-0 text-xs text-muted-foreground">
                          {thread.time}
                        </span>
                      </div>
                      <p className="mt-0.5 truncate text-xs text-muted-foreground">{thread.listingTitle} · {thread.dates}</p>
                      <p className={cn(
                        "mt-0.5 truncate text-sm",
                        thread.unread ? "font-medium text-zinc-800" : "text-muted-foreground"
                      )}>
                        {thread.preview}
                      </p>
                    </div>
                    {thread.unread && (
                      <span className="mt-1.5 size-2 shrink-0 rounded-full bg-primary" aria-label="Unread" />
                    )}
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
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
}: {
  thread: Thread;
  messages: Message[];
  onSendMessage?: (threadId: string, text: string) => void;
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
    <div className="flex min-w-0 flex-1 flex-col">
      {/* Header */}
      <div className="flex h-14 shrink-0 items-center gap-3 border-b border-zinc-100 px-4 sm:px-6">
        <Avatar className="size-9 shrink-0">
          <AvatarImage src={user.photo} alt={user.name} />
          <AvatarFallback>{user.initials}</AvatarFallback>
        </Avatar>
        <div className="min-w-0 flex-1">
          <h2 className="text-sm font-semibold text-zinc-900">{user.name}</h2>
          <p className="truncate text-xs text-muted-foreground">{thread.listingTitle} · {thread.dates}</p>
        </div>
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
                    <div className="rounded-tl-2xl rounded-tr-2xl rounded-bl-2xl rounded-br-sm bg-primary px-3.5 py-2.5 text-white">
                      <p className="text-sm leading-relaxed">{msg.text}</p>
                    </div>
                    <p className="mt-1 text-right text-[11px] text-muted-foreground">{msg.time}</p>
                  </div>
                </div>
              );
            }
            return (
              <div key={i} className="flex justify-start">
                <div className="flex max-w-[72%] flex-col">
                  <div className="flex items-end gap-2">
                    <Avatar className="size-7 shrink-0">
                      <AvatarImage src={sender!.photo} alt={sender!.name} />
                      <AvatarFallback>{sender!.initials}</AvatarFallback>
                    </Avatar>
                    <div className="rounded-tl-2xl rounded-tr-2xl rounded-br-2xl rounded-bl-sm bg-zinc-100 px-3.5 py-2.5 text-zinc-900">
                      <p className="text-sm leading-relaxed">{msg.text}</p>
                    </div>
                  </div>
                  <p className="mt-1 pl-9 text-[11px] text-muted-foreground">{msg.time}</p>
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
            className="min-h-10 flex-1 rounded-full border-zinc-200 bg-zinc-50 px-4 text-sm shadow-none focus-visible:border-primary focus-visible:ring-0"
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

function BookingDetailPanel({ thread }: { thread: Thread }) {
  const b = BOOKING_DETAIL;
  const subtotal = b.nights * b.pricePerNight;
  const total = subtotal + b.serviceFee + b.cleaningFee;

  return (
    <aside className="hidden w-[360px] shrink-0 flex-col border-l border-zinc-100 bg-white xl:flex xl:w-[400px]">
      {/* Header */}
      <div className="flex h-14 shrink-0 items-center border-b border-zinc-100 px-5">
        <h2 className="text-sm font-semibold text-zinc-900">Reservation details</h2>
      </div>

      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto">
        <div className="flex flex-col gap-0">

          {/* Listing image + title + rating */}
          <div className="p-5 pb-4">
            <Link href={`/listing/${b.listingId}`} className="group block">
              <div className="relative aspect-[16/10] w-full overflow-hidden rounded-xl bg-zinc-100">
                <Image
                  src={b.image}
                  alt={b.title}
                  fill
                  className="object-cover transition-transform duration-200 group-hover:scale-105"
                  sizes="400px"
                />
              </div>
              <div className="mt-3">
                <h3 className="font-semibold text-zinc-900 group-hover:underline">{b.title}</h3>
                <p className="mt-0.5 text-xs text-muted-foreground">{b.subtitle}</p>
                <div className="mt-1.5 flex items-center gap-1">
                  <Star size={13} weight="fill" className="text-zinc-900 shrink-0" />
                  <span className="text-sm font-semibold tabular-nums text-zinc-900">{b.rating.toFixed(2)}</span>
                  <span className="text-sm text-muted-foreground">· {b.reviewCount} reviews</span>
                </div>
              </div>
            </Link>
          </div>

          <Separator className="bg-zinc-100" />

          {/* Price summary + Reserve */}
          <div className="p-5 pb-4 space-y-3">
            <div className="flex items-baseline gap-1">
              <span className="text-xl font-bold tabular-nums text-zinc-900">${b.pricePerNight}</span>
              <span className="text-sm text-muted-foreground">/ night</span>
            </div>
            {/* Check-in / Check-out */}
            <div className="grid grid-cols-2 divide-x divide-zinc-100 overflow-hidden rounded-lg border border-zinc-200">
              <div className="px-3 py-2.5">
                <p className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">Check-in</p>
                <p className="mt-0.5 text-sm font-medium text-zinc-900">{b.checkIn}</p>
              </div>
              <div className="px-3 py-2.5">
                <p className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">Checkout</p>
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
              <Separator className="bg-zinc-100" />
              <div className="flex justify-between font-semibold text-zinc-900">
                <span>Total</span>
                <span className="tabular-nums">${total}</span>
              </div>
            </div>
            <Button asChild className="h-11 w-full rounded-[5px] bg-primary font-medium hover:bg-primary/90 shadow-none">
              <Link href={`/checkout?listingId=${b.listingId}`}>Reserve</Link>
            </Button>
          </div>

          <Separator className="bg-zinc-100" />

          {/* Facts about the place */}
          <div className="p-5 pb-4">
            <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Facts about the place</p>
            <div className="mt-3 grid grid-cols-2 gap-2.5">
              <div className="flex items-center gap-2 text-sm text-zinc-700">
                <BedDouble className="size-4 shrink-0 text-muted-foreground" />
                {b.facts.bedrooms} bedroom{b.facts.bedrooms !== 1 ? "s" : ""}
              </div>
              <div className="flex items-center gap-2 text-sm text-zinc-700">
                <Bath className="size-4 shrink-0 text-muted-foreground" />
                {b.facts.bathrooms} bathroom{b.facts.bathrooms !== 1 ? "s" : ""}
              </div>
              <div className="flex items-center gap-2 text-sm text-zinc-700">
                <Users className="size-4 shrink-0 text-muted-foreground" />
                {b.facts.guests} guests max
              </div>
              <div className="flex items-center gap-2 text-sm text-zinc-700">
                <Home className="size-4 shrink-0 text-muted-foreground" />
                {b.facts.type}
              </div>
            </div>
          </div>

          <Separator className="bg-zinc-100" />

          {/* Getting there */}
          <div className="p-5 pb-4">
            <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Getting there</p>
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

          <Separator className="bg-zinc-100" />

          {/* Check-in */}
          <div className="p-5 pb-4">
            <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Check-in</p>
            <div className="mt-3 space-y-2">
              <div className="flex items-center gap-2 text-sm">
                <Clock className="size-4 shrink-0 text-muted-foreground" />
                <span className="text-zinc-700">After {b.checkInTime}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <ShieldCheck className="size-4 shrink-0 text-muted-foreground" />
                <span className="text-zinc-700">Self check-in via lockbox</span>
              </div>
            </div>
          </div>

          <Separator className="bg-zinc-100" />

          {/* WiFi */}
          <div className="p-5 pb-4">
            <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">WiFi</p>
            <div className="mt-3 space-y-2">
              <div className="flex items-center gap-2 text-sm">
                <Wifi className="size-4 shrink-0 text-muted-foreground" />
                <div>
                  <span className="text-zinc-700">Network: </span>
                  <span className="font-medium text-zinc-900">{b.wifiName}</span>
                </div>
              </div>
              <div className="flex items-center gap-2 text-sm pl-6">
                <span className="text-zinc-700">Password: </span>
                <span className="font-medium text-zinc-900">{b.wifiPassword}</span>
              </div>
            </div>
          </div>

          <Separator className="bg-zinc-100" />

          {/* House rules */}
          <div className="p-5 pb-4">
            <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">House rules</p>
            <ul className="mt-3 space-y-2.5">
              {b.houseRules.map((rule, i) => (
                <li key={i} className="flex items-start gap-2 text-sm">
                  <rule.icon className="size-4 mt-0.5 shrink-0 text-muted-foreground" />
                  <span className="text-zinc-700">{rule.text}</span>
                </li>
              ))}
            </ul>
          </div>

          <Separator className="bg-zinc-100" />

          {/* Reviews by the host */}
          <div className="p-5 pb-4">
            <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Review by the host</p>
            <div className="mt-3 space-y-3">
              <p className="text-sm text-muted-foreground leading-relaxed italic">"{b.hostReview.text}"</p>
              <div className="flex items-center gap-2.5">
                <Avatar className="size-8 shrink-0">
                  <AvatarImage src={b.hostReview.reviewerPhoto} alt={b.hostReview.reviewer} />
                  <AvatarFallback>{b.hostReview.reviewerInitials}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-medium text-zinc-900">{b.hostReview.reviewer}</p>
                  <p className="text-xs text-muted-foreground">{b.hostReview.date}</p>
                </div>
              </div>
            </div>
          </div>

          <Separator className="bg-zinc-100" />

          {/* Action buttons */}
          <div className="p-5 space-y-2.5">
            <Button
              variant="outline"
              className="h-11 w-full justify-between rounded-[5px] text-sm font-medium text-zinc-700 shadow-none hover:bg-zinc-100"
              asChild
            >
              <Link href={`/listing/${b.listingId}`}>
                View listing
                <ChevronRight className="size-4 text-muted-foreground" />
              </Link>
            </Button>
            <Button
              variant="outline"
              className="h-11 w-full justify-between rounded-[5px] text-sm font-medium text-zinc-700 shadow-none hover:bg-zinc-100"
              asChild
            >
              <Link href={`/order/confirmation?listingId=${b.listingId}`}>
                View booking
                <ChevronRight className="size-4 text-muted-foreground" />
              </Link>
            </Button>
          </div>

        </div>
      </div>
    </aside>
  );
}

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

  if (embedded) {
    return (
      <div className="flex h-full w-full">
        <ThreadList
          threads={MOCK_THREADS}
          activeId={activeId}
          onSelect={setActiveId}
        />
        {activeThread ? (
          <ConversationPanel
            thread={activeThread}
            messages={messages}
            onSendMessage={(threadId, text) => {
              setMessagesByThread((prev) => ({
                ...prev,
                [threadId]: [...(prev[threadId] ?? []), { from: "me", text, time: "Just now" }],
              }));
            }}
          />
        ) : (
          <div className="flex min-w-0 flex-1 items-center justify-center">
            <p className="text-sm text-muted-foreground">Select a conversation to start messaging.</p>
          </div>
        )}
        {activeThread && <BookingDetailPanel thread={activeThread} />}
      </div>
    );
  }

  const handleSendMessage = (threadId: string, text: string) => {
    setMessagesByThread((prev) => ({
      ...prev,
      [threadId]: [...(prev[threadId] ?? []), { from: "me", text, time: "Just now" }],
    }));
  };

  return (
    <div className="w-full px-4 sm:px-6">
      <div className="flex h-[calc(100vh-4rem)] w-full">
        <ThreadList
          threads={MOCK_THREADS}
          activeId={activeId}
          onSelect={setActiveId}
        />

        {activeThread ? (
          <ConversationPanel thread={activeThread} messages={messages} onSendMessage={handleSendMessage} />
        ) : (
          <div className="flex min-w-0 flex-1 items-center justify-center">
            <p className="text-sm text-muted-foreground">Select a conversation to start messaging.</p>
          </div>
        )}

        {activeThread && <BookingDetailPanel thread={activeThread} />}
      </div>
    </div>
  );
}
