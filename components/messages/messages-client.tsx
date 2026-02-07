"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Search, ImageIcon, Send, ChevronRight } from "lucide-react";
import { MapPin, Calendar, Star } from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

/* -------------------------------------------------------------------------- */
/*  Dummy data                                                                 */
/* -------------------------------------------------------------------------- */

const TESLA_IMAGE =
  "https://images.turo.com/media/vehicle/images/ewUbL3QrTLCokGPQPCpsbw.1242x745.jpg";

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
    preview: "Great, the Tesla Model Y will be ready for you at the pickup location. See you then!",
    time: "2m ago",
    unread: true,
    listingTitle: "Tesla Model Y 2024",
    dates: "May 15 – 18",
  },
  {
    id: "t2",
    userId: "u2",
    preview: "Thanks for the booking! Let me know if you need anything.",
    time: "1h ago",
    unread: true,
    listingTitle: "Toyota RAV4",
    dates: "May 20 – 22",
  },
  {
    id: "t3",
    userId: "u3",
    preview: "Check-in is after 3pm. I'll leave the key in the lockbox.",
    time: "3h ago",
    unread: false,
    listingTitle: "BMW 3 Series",
    dates: "Jun 1 – 4",
  },
  {
    id: "t4",
    userId: "u4",
    preview: "You're welcome! Enjoy the drive.",
    time: "Yesterday",
    unread: false,
    listingTitle: "Honda CR-V",
    dates: "Apr 10 – 12",
  },
  {
    id: "t5",
    userId: "u5",
    preview: "I've updated the pickup instructions. Let me know if the new location works for you.",
    time: "2d ago",
    unread: false,
    listingTitle: "Mercedes C-Class",
    dates: "May 25 – 28",
  },
  {
    id: "t6",
    userId: "u6",
    preview: "Hi! I saw your review — thank you so much!",
    time: "1w ago",
    unread: false,
    listingTitle: "Ford F-150",
    dates: "Mar 1 – 4",
  },
];

type Message = {
  from: string;
  text: string;
  time: string;
};

const MOCK_MESSAGES: Record<string, Message[]> = {
  t1: [
    { from: "u1", text: "Hi! Welcome to Rento. I'm Alex, the host for the Tesla Model Y 2024. Your reservation for May 15–18 is confirmed.", time: "10:15 AM" },
    { from: "me", text: "Thanks Alex! Really excited. Can I pick it up a bit earlier, around 9 AM?", time: "10:18 AM" },
    { from: "u1", text: "Absolutely, 9 AM works. The car will be fully charged and ready to go at 123 Market St.", time: "10:22 AM" },
    { from: "me", text: "Perfect. Is there anything I should know about the charging?", time: "10:25 AM" },
    { from: "u1", text: "The car has about 290 miles of range when full. There are Superchargers all along the 101 if you need them. I'll share the Tesla app access with you the day before so you can see the charge level and pre-condition the cabin.", time: "10:30 AM" },
    { from: "me", text: "That's great. And parking — is it street parking at the pickup location?", time: "10:33 AM" },
    { from: "u1", text: "There's a garage at 123 Market. I'll text you the access code. Spot B-14.", time: "10:36 AM" },
    { from: "me", text: "Awesome, thank you! See you on the 15th.", time: "10:38 AM" },
    { from: "u1", text: "Great, the Tesla Model Y will be ready for you at the pickup location. See you then!", time: "10:40 AM" },
  ],
  t2: [
    { from: "u2", text: "Hi! Your booking for the RAV4 is confirmed for May 20–22.", time: "9:00 AM" },
    { from: "me", text: "Thank you Sarah! Looking forward to it.", time: "9:05 AM" },
    { from: "u2", text: "Thanks for the booking! Let me know if you need anything.", time: "9:10 AM" },
  ],
  t3: [
    { from: "u3", text: "Hey, just a heads up — check-in is after 3pm.", time: "Yesterday" },
    { from: "u3", text: "Check-in is after 3pm. I'll leave the key in the lockbox.", time: "Yesterday" },
  ],
  t4: [
    { from: "me", text: "Thanks for a great rental experience!", time: "2d ago" },
    { from: "u4", text: "You're welcome! Enjoy the drive.", time: "2d ago" },
  ],
  t5: [
    { from: "u5", text: "Hi! Pickup location has changed to 200 Stuart St, Boston.", time: "3d ago" },
    { from: "u5", text: "I've updated the pickup instructions. Let me know if the new location works for you.", time: "3d ago" },
  ],
  t6: [
    { from: "u6", text: "Hi! I saw your review — thank you so much!", time: "1w ago" },
  ],
};

/* Booking detail for the selected thread (hardcoded to Tesla Model Y for t1) */
const BOOKING_DETAIL = {
  listingId: "e1",
  title: "Tesla Model Y 2024",
  subtitle: "or similar electric SUV",
  image: TESLA_IMAGE,
  hostName: "Alex Chen",
  hostPhoto: DUMMY_USERS[0].photo,
  rating: 4.87,
  trips: 42,
  dates: "May 15, 9:00 AM – May 18, 12:00 PM",
  location: "123 Market St, San Francisco, CA",
  days: 3,
  pricePerDay: 32,
  serviceFee: 12,
  insurance: 18,
};

/* -------------------------------------------------------------------------- */
/*  Components                                                                 */
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
    <aside className="flex w-full shrink-0 flex-col border-r border-zinc-200 bg-white md:w-72 lg:w-[300px]">
      {/* Header - border extends to viewport left */}
      <div className="flex h-14 shrink-0 items-center justify-between border-b border-zinc-200 -ml-4 sm:-ml-6">
        <div className="pl-4 sm:pl-6">
          <h1 className="text-lg font-bold text-zinc-900">Messages</h1>
        </div>
      </div>

      {/* Search - border extends to viewport left */}
      <div className="border-b border-zinc-200 -ml-4 sm:-ml-6">
        <div className="relative py-2 pl-4 pr-3 sm:pl-6 sm:pr-3">
          <Search className="absolute left-4 top-1/2 size-4 -translate-y-1/2 text-zinc-400 sm:left-6 ml-3 mr-3" />
          <Input
            placeholder="Search messages"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-9 pl-9 text-sm sm:pl-10 focus-visible:border focus-visible:border-primary focus-visible:ring-0"
          />
        </div>
      </div>

      {/* Thread list - scroll area extends to sides so hover/selected gray is full width */}
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
                  <Avatar className="size-12 shrink-0">
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
                      <span className="shrink-0 text-xs text-zinc-400">
                        {thread.time}
                      </span>
                    </div>
                    <p className="mt-0.5 text-xs text-zinc-500">{thread.listingTitle} &middot; {thread.dates}</p>
                    <p className={cn(
                      "mt-0.5 truncate text-sm",
                      thread.unread ? "font-medium text-zinc-800" : "text-zinc-500"
                    )}>
                      {thread.preview}
                    </p>
                  </div>
                  {thread.unread && (
                    <span className="mt-1.5 size-2.5 shrink-0 rounded-full bg-[#156EF5]" aria-label="Unread" />
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

function ConversationPanel({
  thread,
  messages,
}: {
  thread: Thread;
  messages: Message[];
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
      {/* Conversation header - border full width, padding inside */}
      <div className="flex h-14 shrink-0 items-center gap-3 border-b border-zinc-200">
        <div className="flex min-w-0 flex-1 items-center gap-3 px-4 sm:px-6">
          <Avatar className="size-9">
            <AvatarImage src={user.photo} alt={user.name} />
            <AvatarFallback>{user.initials}</AvatarFallback>
          </Avatar>
          <div className="min-w-0 flex-1">
            <h2 className="text-sm font-semibold text-zinc-900">{user.name}</h2>
            <p className="text-xs text-zinc-500">{thread.listingTitle} &middot; {thread.dates}</p>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div ref={scrollRef} className="flex-1 overflow-auto px-4 py-4 sm:px-6" tabIndex={0}>
        <div className="mx-auto max-w-2xl space-y-3">
          {messages.map((msg, i) => {
            const isMe = msg.from === "me";
            const sender = isMe ? null : getUserById(msg.from);
            if (isMe) {
              return (
                <div key={i} className="flex justify-end">
                  <div className="max-w-[75%]">
                    <div className="rounded-tl-2xl rounded-tr-2xl rounded-bl-2xl rounded-br-0 bg-[#1e3a5f] px-3.5 py-2.5 text-white">
                      <p className="text-sm leading-relaxed">{msg.text}</p>
                    </div>
                    <p className="mt-1 text-right text-[11px] text-zinc-400">{msg.time}</p>
                  </div>
                </div>
              );
            }
            return (
              <div key={i} className="flex justify-start">
                <div className="flex max-w-[75%] flex-col">
                  <div className="flex items-end gap-2">
                    <Avatar className="size-7 shrink-0">
                      <AvatarImage src={sender!.photo} alt={sender!.name} />
                      <AvatarFallback>{sender!.initials}</AvatarFallback>
                    </Avatar>
                    <div className="rounded-tl-2xl rounded-tr-2xl rounded-br-2xl rounded-bl-0 bg-zinc-100 px-3.5 py-2.5 text-zinc-900">
                      <p className="text-sm leading-relaxed">{msg.text}</p>
                    </div>
                  </div>
                  <p className="mt-1 text-left text-[11px] text-zinc-400">{msg.time}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Compose - border full width, padding inside */}
      <div className="border-t border-zinc-200">
        <div className="px-4 py-3 sm:px-6">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            setDraft("");
          }}
          className="flex items-end gap-2"
        >
          <Label htmlFor="message-input" className="sr-only">
            Write a message
          </Label>
          <button
            type="button"
            className="flex size-10 shrink-0 items-center justify-center rounded-full text-zinc-400 transition-colors hover:bg-zinc-100 hover:text-zinc-600"
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
            className="size-10 shrink-0 rounded-full bg-[#156EF5] hover:bg-[#125bd4]"
            aria-label="Send message"
          >
            <Send className="size-4 text-white" />
          </Button>
        </form>
        </div>
      </div>
    </div>
  );
}

function BookingDetailPanel({ thread }: { thread: Thread }) {
  const booking = BOOKING_DETAIL;
  const subtotal = booking.days * booking.pricePerDay;
  const total = subtotal + booking.serviceFee + booking.insurance;

  return (
    <aside className="hidden w-[400px] shrink-0 flex-col border-l border-zinc-200 bg-white xl:flex xl:w-[440px]">
      {/* Header - border extends to viewport right (no overflow on aside so margin isn't clipped) */}
      <div className="flex h-14 shrink-0 items-center justify-between border-b border-zinc-200 -mr-4 sm:-mr-6">
        <div className="pl-5 pr-4 sm:pr-6">
          <h2 className="text-sm font-semibold text-zinc-900">Booking details</h2>
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-5 overflow-auto p-5">
        {/* Listing card with image */}
        <Link href={`/listing/${booking.listingId}`} className="group block">
          <div className="relative aspect-[16/10] w-full overflow-hidden rounded-xl bg-zinc-100">
            <Image
              src={booking.image}
              alt={booking.title}
              fill
              className="object-cover transition-transform duration-200 group-hover:scale-105"
              sizes="360px"
            />
          </div>
          <div className="mt-3">
            <h3 className="font-semibold text-zinc-900">{booking.title}</h3>
            <div className="mt-1 flex items-center gap-1.5">
              <Star size={14} weight="fill" className="text-amber-400" />
              <span className="text-sm font-medium tabular-nums text-zinc-700">
                {booking.rating.toFixed(2)}
              </span>
              <span className="text-sm text-zinc-400">&middot;</span>
              <span className="text-sm text-zinc-500">{booking.trips} trips</span>
            </div>
          </div>
        </Link>

        <Separator />

        {/* Host */}
        <div>
          <p className="text-xs font-medium uppercase tracking-wider text-zinc-400">
            Hosted by
          </p>
          <div className="mt-2 flex items-center gap-3">
            <Avatar className="size-10">
              <AvatarImage src={booking.hostPhoto} alt={booking.hostName} />
              <AvatarFallback>AC</AvatarFallback>
            </Avatar>
            <div>
              <p className="text-sm font-medium text-zinc-900">{booking.hostName}</p>
              <p className="text-xs text-zinc-500">Joined 2023</p>
            </div>
          </div>
        </div>

        <Separator />

        {/* Trip details */}
        <div>
          <p className="text-xs font-medium uppercase tracking-wider text-zinc-400">
            Trip details
          </p>
          <div className="mt-3 space-y-2.5">
            <div className="flex items-start gap-2.5 text-sm">
              <Calendar size={16} weight="regular" className="mt-0.5 shrink-0 text-zinc-400" />
              <span className="text-zinc-700">{booking.dates}</span>
            </div>
            <div className="flex items-start gap-2.5 text-sm">
              <MapPin size={16} weight="regular" className="mt-0.5 shrink-0 text-zinc-400" />
              <span className="text-zinc-700">{booking.location}</span>
            </div>
          </div>
        </div>

        <Separator />

        {/* Price breakdown */}
        <div>
          <p className="text-xs font-medium uppercase tracking-wider text-zinc-400">
            Price breakdown
          </p>
          <Card className="mt-3 shadow-none">
            <CardContent className="space-y-2.5 p-3">
              <div className="flex justify-between text-sm">
                <span className="text-zinc-500">
                  {booking.days} days &times; ${booking.pricePerDay}/day
                </span>
                <span className="tabular-nums font-medium text-zinc-900">
                  ${subtotal}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-zinc-500">Service fee</span>
                <span className="tabular-nums font-medium text-zinc-900">
                  ${booking.serviceFee}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-zinc-500">Insurance</span>
                <span className="tabular-nums font-medium text-zinc-900">
                  ${booking.insurance}
                </span>
              </div>
              <Separator />
              <div className="flex justify-between text-sm font-semibold">
                <span className="text-zinc-900">Total</span>
                <span className="tabular-nums text-zinc-900">${total}</span>
              </div>
            </CardContent>
          </Card>
        </div>

        <Separator />

        {/* Actions */}
        <div className="space-y-2.5">
          <Button
            variant="outline"
            className="w-full justify-between text-sm font-medium"
            asChild
          >
            <Link href={`/listing/${booking.listingId}`}>
              View listing
              <ChevronRight className="size-4 text-zinc-400" />
            </Link>
          </Button>
          <Button
            variant="outline"
            className="w-full justify-between text-sm font-medium"
            asChild
          >
            <Link href={`/order/confirmation?listingId=${booking.listingId}`}>
              View booking
              <ChevronRight className="size-4 text-zinc-400" />
            </Link>
          </Button>
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

export function MessagesClient() {
  const [activeId, setActiveId] = useState<string | null>(
    MOCK_THREADS[0]?.id ?? null
  );

  const activeThread = MOCK_THREADS.find((t) => t.id === activeId) ?? null;
  const messages = activeId ? (MOCK_MESSAGES[activeId] ?? []) : [];

  return (
    <div className="w-full px-4 sm:px-6">
      <div className="flex h-[calc(100vh-4rem)] w-full">
        {/* Left: Thread list - aligns with header logo */}
        <ThreadList
          threads={MOCK_THREADS}
          activeId={activeId}
          onSelect={setActiveId}
        />

        {/* Middle: Conversation */}
        {activeThread ? (
          <ConversationPanel thread={activeThread} messages={messages} />
        ) : (
          <div className="flex min-w-0 flex-1 items-center justify-center">
            <p className="text-sm text-muted-foreground">
              Select a conversation to start messaging.
            </p>
          </div>
        )}

        {/* Right: Booking details - aligns with header hamburger */}
        {activeThread && <BookingDetailPanel thread={activeThread} />}
      </div>
    </div>
  );
}
