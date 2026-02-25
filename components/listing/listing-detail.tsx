"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import type { ComponentType } from "react";
import type { DateRange } from "react-day-picker";
import { format, differenceInDays } from "date-fns";
import { Star, Heart } from "@phosphor-icons/react";
import {
  MapPin,
  CalendarIcon,
  Images,
  X,
  Share2,
  CheckCircle,
  Flag,
  ChevronDown,
  Wifi,
  UtensilsCrossed,
  Droplets,
  Wind,
  AirVent,
  Flame,
  Tv,
  Coffee,
  Laptop,
  Sparkles,
  TreePalm,
  Flower2,
  Waves,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DateRangePickerContent } from "@/components/landing/date-range-picker";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Popover,
  PopoverAnchor,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  GuestPicker,
  guestSummary,
  DEFAULT_GUESTS,
} from "@/components/landing/guest-picker";
import type { Guests } from "@/components/landing/guest-picker";
import {
  getListingGalleryImages,
  getDummyRating,
  getListingReviews,
  getListingReviewCount,
  getListingLocation,
  getMapEmbedUrl,
  CAR_AMENITIES,
} from "@/lib/vehicle-listings";
import type { VehicleListing } from "@/lib/vehicle-listings";
import { useListingScroll } from "@/lib/listing-scroll-context";

const SECTION_TABS = [
  { id: "photos", label: "Photos" },
  { id: "features", label: "Amenities" },
  { id: "location", label: "Location" },
  { id: "reviews", label: "Reviews" },
] as const;

const REVIEW_TRUNCATE_LENGTH = 180;

/** Icons for "What this place offers" amenities (Lucide) */
const AMENITY_ICONS: Record<string, ComponentType<{ className?: string }>> = {
  "WiFi": Wifi,
  "Kitchen": UtensilsCrossed,
  "Washer": Droplets,
  "Dryer": Wind,
  "Air conditioning": AirVent,
  "Heating": Flame,
  "TV": Tv,
  "Coffee maker": Coffee,
  "Workspace": Laptop,
  "Iron": Sparkles,
  "Patio": TreePalm,
  "BBQ grill": Flame,
  "Garden": Flower2,
  "Pool access": Waves,
};

export function ListingDetail({ listing, id }: { listing: VehicleListing; id: string }) {
  const [showMoreDesc, setShowMoreDesc] = useState(false);
  const [showAllAmenities, setShowAllAmenities] = useState(false);
  const [reviewsDialogOpen, setReviewsDialogOpen] = useState(false);
  const [scrollToReviewIndex, setScrollToReviewIndex] = useState<number | null>(null);
  const [dateRange, setDateRange] = useState<DateRange | undefined>();
  const [datesAnchor, setDatesAnchor] = useState<"start" | "end" | null>(null);
  const [guests, setGuests] = useState<Guests>(DEFAULT_GUESTS);
  const [guestsOpen, setGuestsOpen] = useState(false);
  const [isLargeViewport, setIsLargeViewport] = useState(false);
  const datesOpen = datesAnchor !== null;
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 768px)");
    setIsLargeViewport(mq.matches);
    const fn = () => setIsLargeViewport(mq.matches);
    mq.addEventListener("change", fn);
    return () => mq.removeEventListener("change", fn);
  }, []);
  const [activeSection, setActiveSection] = useState<string>("photos");
  const [lineStyle, setLineStyle] = useState<{ left: number; width: number }>({ left: 0, width: 0 });
  const [copied, setCopied] = useState(false);
  const [wishlisted, setWishlisted] = useState(false);
  const [galleryOpen, setGalleryOpen] = useState(false);
  const [bookingSheetOpen, setBookingSheetOpen] = useState(false);
  const galleryRef = useRef<HTMLDivElement>(null);
  const navRef = useRef<HTMLDivElement>(null);
  const tabListRef = useRef<HTMLDivElement>(null);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const ignoreObserverRef = useRef(false);
  const reviewRefs = useRef<(HTMLDivElement | null)[]>([]);
  const { pastGallery, setPastGallery } = useListingScroll();

  useEffect(() => {
    function onScroll() {
      const gallery = galleryRef.current;
      if (!gallery) return;
      const galleryBottom = gallery.offsetTop + gallery.offsetHeight;
      const threshold = galleryBottom - 80;
      setPastGallery(window.scrollY > threshold);
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [setPastGallery]);

  // Update active tab based on scroll position (scroll-spy)
  useEffect(() => {
    // Trigger offset so when a section scrolls into the upper viewport (e.g. Reviews), its tab underlines
    const TRIGGER_OFFSET = 280;

    function updateActiveSection() {
      if (ignoreObserverRef.current) return;
      type SectionTabId = (typeof SECTION_TABS)[number]["id"];
      const sections = SECTION_TABS.map((t) => ({
        id: t.id,
        el: document.getElementById(t.id),
      })).filter((s): s is { id: SectionTabId; el: HTMLElement } => !!s.el);

      let active: string = sections[0]?.id ?? "photos";
      for (const { id, el } of sections) {
        const rect = el.getBoundingClientRect();
        if (rect.top <= TRIGGER_OFFSET) {
          active = id;
        }
      }
      setActiveSection(active);
    }

    updateActiveSection();
    window.addEventListener("scroll", updateActiveSection, { passive: true });
    return () => window.removeEventListener("scroll", updateActiveSection);
  }, []);

  // Update sliding line position when active section changes (relative to tab list for scrollable nav)
  useEffect(() => {
    if (!pastGallery || !tabListRef.current) return;
    const idx = SECTION_TABS.findIndex((t) => t.id === activeSection);
    const btn = tabRefs.current[idx];
    const listEl = tabListRef.current;
    if (btn && listEl) {
      const listRect = listEl.getBoundingClientRect();
      const btnRect = btn.getBoundingClientRect();
      setLineStyle({
        left: btnRect.left - listRect.left,
        width: btnRect.width,
      });
    }
  }, [activeSection, pastGallery]);

  // Scroll to review when reviews dialog opens with scrollToReviewIndex
  useEffect(() => {
    if (!reviewsDialogOpen || scrollToReviewIndex == null) return;
    const el = reviewRefs.current[scrollToReviewIndex];
    if (el) {
      const t = setTimeout(() => el.scrollIntoView({ behavior: "smooth", block: "start" }), 100);
      return () => clearTimeout(t);
    }
  }, [reviewsDialogOpen, scrollToReviewIndex]);
  const galleryImages = getListingGalleryImages(listing);
  const mainImage = galleryImages[0];
  const thumbnails = galleryImages.slice(1, 5);
  const rating = listing.rating ?? getDummyRating(listing.id);
  const reviewCount = getListingReviewCount(id);
  const reviews = getListingReviews(id);
  const hostName = listing.hostName ?? "Rento Team";

  const fullDescription =
    listing.description ??
    "A comfortable, well-equipped home perfect for families and groups. Enjoy a fully equipped kitchen, high-speed WiFi, and easy self check-in. Professionally cleaned before every stay and thoughtfully stocked with everything you need to feel at home.";

  const paragraphs = fullDescription.split(/\n\n+/);
  const hasMultipleParagraphs = paragraphs.length > 1;
  const shortDesc = hasMultipleParagraphs ? paragraphs[0] + "…" : fullDescription;

  const amenitiesEntries = Object.entries(CAR_AMENITIES);
  const visibleAmenities = showAllAmenities
    ? amenitiesEntries
    : amenitiesEntries.slice(0, 2);
  const totalAmenityCount = Object.values(CAR_AMENITIES).flat().length;

  const scrollToSection = (sectionId: string) => {
    ignoreObserverRef.current = true;
    setActiveSection(sectionId);
    if (sectionId === "photos") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      document.getElementById(sectionId)?.scrollIntoView({ behavior: "smooth" });
    }
    setTimeout(() => {
      ignoreObserverRef.current = false;
    }, 800);
  };

  const handleShare = () => {
    const url = typeof window !== "undefined" ? window.location.href : "";
    navigator.clipboard.writeText(url).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div className="overflow-x-clip">
      {/* Image gallery - same width as header content, rounded outer corners (scroll target: Photos) */}
      <div
        id="photos"
        ref={galleryRef}
        className={`container mx-auto w-full max-w-[1400px] px-4 overflow-hidden transition-[padding] duration-200 ${pastGallery ? "pt-0" : "pt-6"}`}
      >
        {/* Small viewports: single photo + Show all photos button (right). Md+: full grid. */}
        <div className="relative grid grid-cols-4 grid-rows-2 gap-1 overflow-hidden rounded-xl">
          <div className="col-span-4 row-span-2 relative aspect-[16/9] overflow-hidden rounded-xl bg-zinc-100 md:col-span-2">
            <Image
              src={mainImage}
              alt={listing.title}
              fill
              className="object-cover"
              priority
              sizes="(max-width: 768px) 100vw, (max-width: 1400px) 50vw, 700px"
            />
            <div className="absolute inset-0 flex items-start justify-end p-3 md:hidden">
              <Button
                variant="outline"
                size="sm"
                className="bg-background/95 shadow-sm text-xs sm:text-sm"
                onClick={() => setGalleryOpen(true)}
              >
                <Images className="h-3.5 w-3.5 sm:h-4 sm:w-4 shrink-0" />
                Show all {galleryImages.length} photos
              </Button>
            </div>
          </div>
          {thumbnails.map((src, i) => (
            <div
              key={i}
              className={`relative aspect-[16/9] overflow-hidden bg-zinc-100 hidden md:block ${i === 1 ? "rounded-tr-xl" : ""} ${i === 3 ? "rounded-br-xl" : ""}`}
            >
              <Image
                src={src}
                alt={`${listing.title} ${i + 2}`}
                fill
                className="object-cover"
                sizes="(max-width: 1400px) 25vw, 350px"
              />
            </div>
          ))}
          <Button
            variant="outline"
            className="absolute bottom-3 right-3 bg-background/95 shadow-sm hidden md:inline-flex"
            onClick={() => setGalleryOpen(true)}
          >
            <Images className="h-4 w-4" />
            Show all {galleryImages.length} photos
          </Button>
          <Dialog open={galleryOpen} onOpenChange={setGalleryOpen}>
            <DialogContent
              className="max-h-[95vh] w-[95vw] sm:max-w-[1200px] flex flex-col gap-0 p-0 overflow-hidden"
              showCloseButton={false}
            >
              <DialogTitle className="sr-only">Photo gallery: {listing.title}</DialogTitle>
              <div className="flex shrink-0 items-center justify-between border-b px-6 py-4">
                <h2 className="text-xl font-semibold">{listing.title}</h2>
                <DialogClose className="rounded-md p-1.5 opacity-70 transition-opacity hover:opacity-100 focus:outline-none focus:ring-0" aria-label="Close gallery">
                  <X className="h-5 w-5" />
                </DialogClose>
              </div>
              <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain p-6">
                <div className="flex flex-col gap-4">
                  {galleryImages.map((src, i) => (
                    <div key={i} className="relative aspect-[16/9] w-full overflow-hidden rounded-lg bg-zinc-100">
                      <Image src={src} alt={`${listing.title} photo ${i + 1}`} fill className="object-cover" sizes="95vw" />
                    </div>
                  ))}
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Section tabs - only visible when scrolled past gallery, fixed at top; closer + horizontal scroll on small */}
      {pastGallery && (
        <div className="fixed top-0 left-0 right-0 z-[60] border-b border-zinc-100 bg-white">
          <nav
            ref={navRef}
            className="container relative mx-auto flex max-w-[1400px] px-4 overflow-x-auto overflow-y-hidden scrollbar-hide"
            aria-label="Page sections"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            <div ref={tabListRef} className="relative flex shrink-0 gap-4 py-4 md:gap-6">
              {SECTION_TABS.map((tab, i) => (
                <button
                  key={tab.id}
                  ref={(el) => { tabRefs.current[i] = el; }}
                  onClick={() => scrollToSection(tab.id)}
                  className={`shrink-0 px-1 py-1 text-sm font-medium transition-colors hover:text-zinc-900 ${
                    activeSection === tab.id ? "text-zinc-900" : "text-muted-foreground"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
              <span
                className="absolute bottom-0 h-0.5 bg-zinc-900 transition-all duration-300 ease-out pointer-events-none"
                style={{ left: lineStyle.left, width: lineStyle.width }}
                aria-hidden
              />
            </div>
          </nav>
        </div>
      )}

      <div className="container mx-auto w-full max-w-[1400px] px-4 py-8">
        {/* Title row: on md+ title + Wishlist/Share; on small title only, then stats, then buttons below */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h1 className="min-w-0 flex-1 text-2xl font-black md:text-3xl">{listing.title}</h1>
          <div className="hidden md:flex shrink-0 items-center gap-1.5">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setWishlisted(!wishlisted)}
              className="h-9 shrink-0 rounded-full border-zinc-200 px-2 shadow-none md:px-3 md:py-2 gap-0"
              aria-label="Add to wishlist"
            >
              <Heart
                className="size-4 md:mr-1.5"
                weight={wishlisted ? "fill" : "regular"}
                style={wishlisted ? { color: "var(--destructive)" } : undefined}
              />
              <span className="hidden md:inline">Wishlist</span>
            </Button>
            <Popover open={copied} onOpenChange={() => {}}>
              <PopoverAnchor asChild>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleShare}
                  className="h-9 shrink-0 rounded-full border-zinc-200 px-2 shadow-none md:px-3 md:py-2"
                  aria-label="Share"
                >
                  <Share2 className="size-4" />
                  <span className="hidden md:inline">Share</span>
                </Button>
              </PopoverAnchor>
              <PopoverContent
                side="bottom"
                align="center"
                sideOffset={8}
                className="flex w-auto items-center gap-2 border-0 bg-zinc-900 py-2 px-3 text-white shadow-lg"
              >
                <CheckCircle className="size-4 shrink-0 text-green-400" aria-hidden />
                <span className="text-sm font-medium">Copied</span>
              </PopoverContent>
            </Popover>
          </div>
        </div>
        <p className="mt-2 text-sm text-muted-foreground">
          {listing.doors} bed{listing.doors !== 1 ? "s" : ""} · {listing.luggage} bath{listing.luggage !== 1 ? "s" : ""} · {listing.seats} guest{listing.seats !== 1 ? "s" : ""}
        </p>
        <div className="flex md:hidden shrink-0 items-center gap-1.5 mt-3">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setWishlisted(!wishlisted)}
            className="h-9 shrink-0 rounded-full border-zinc-200 px-2 shadow-none gap-0"
            aria-label="Add to wishlist"
          >
            <Heart
              className="size-4"
              weight={wishlisted ? "fill" : "regular"}
              style={wishlisted ? { color: "var(--destructive)" } : undefined}
            />
            <span className="sr-only">Wishlist</span>
          </Button>
          <Popover open={copied} onOpenChange={() => {}}>
            <PopoverAnchor asChild>
              <Button
                variant="outline"
                size="sm"
                onClick={handleShare}
                className="h-9 shrink-0 rounded-full border-zinc-200 px-2 shadow-none"
                aria-label="Share"
              >
                <Share2 className="size-4" />
                <span className="sr-only">Share</span>
              </Button>
            </PopoverAnchor>
            <PopoverContent
              side="bottom"
              align="center"
              sideOffset={8}
              className="flex w-auto items-center gap-2 border-0 bg-zinc-900 py-2 px-3 text-white shadow-lg"
            >
              <CheckCircle className="size-4 shrink-0 text-green-400" aria-hidden />
              <span className="text-sm font-medium">Copied</span>
            </PopoverContent>
          </Popover>
        </div>

        <div className="grid gap-12 lg:grid-cols-[1fr_380px] lg:gap-16 mt-2">
          {/* Left column - main content */}
          <div className="min-w-0 max-w-3xl space-y-6">
          <Separator className="bg-zinc-100" />

          {/* Listed by - responsive: stacks on small, row on md+ */}
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
            <div className="flex min-w-0 flex-1 items-start gap-3 sm:gap-4">
              <Link
                href={listing.hostId ? `/user/${listing.hostId}` : "#"}
                className="flex size-11 shrink-0 sm:size-[45px] focus-visible:rounded-full focus-visible:outline focus-visible:ring-2 focus-visible:ring-ring"
              >
                <Avatar className="size-11 sm:size-[45px]">
                  <AvatarImage
                    src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face"
                    alt={hostName}
                  />
                  <AvatarFallback className="text-base sm:text-lg">{hostName.slice(0, 1)}</AvatarFallback>
                </Avatar>
              </Link>
              <div className="min-w-0 flex-1">
                <p className="flex flex-wrap items-center gap-x-2 gap-y-0.5 font-semibold">
                  <span className="truncate">Alexander C.</span>
                  <span className="inline-flex shrink-0 items-center gap-1 text-xs font-medium text-green-600">
                    <CheckCircle className="size-3.5 text-green-600 shrink-0" aria-hidden />
                    Verified
                  </span>
                </p>
                <p className="mt-1 flex flex-wrap items-center gap-x-1.5 gap-y-0.5 text-sm text-muted-foreground">
                  <Star size={14} weight="fill" className="text-zinc-900 shrink-0" aria-hidden />
                  <button
                    type="button"
                    onClick={() => scrollToSection("reviews")}
                    className="font-medium text-foreground hover:underline cursor-pointer text-left shrink-0"
                  >
                    {rating.toFixed(1)}
                  </button>
                  <span className="shrink-0">•</span>
                  <button
                    type="button"
                    onClick={() => scrollToSection("reviews")}
                    className="font-medium text-foreground hover:underline cursor-pointer text-left shrink-0"
                  >
                    {reviewCount} reviews
                  </button>
                  <span className="shrink-0">•</span>
                  <span className="shrink-0">Joined Mar 2024</span>
                </p>
              </div>
            </div>
            <Button
              asChild
              variant="outline"
              className="h-11 w-full shrink-0 rounded-[5px] px-4 font-medium text-zinc-700 shadow-none hover:bg-zinc-100 sm:w-fit"
            >
              <Link href={`/messages?with=${listing.hostId ?? ""}`}>Contact host</Link>
            </Button>
          </div>

          <Separator className="bg-zinc-100" />

          {/* About this home */}
          <section>
            <h2 className="text-lg font-semibold">About this home</h2>
            <p className="mt-2 text-muted-foreground whitespace-pre-line">
              {showMoreDesc ? fullDescription : shortDesc}
            </p>
            {hasMultipleParagraphs && !showMoreDesc && (
              <Button
                variant="ghost"
                className="mt-2 h-auto p-0 font-medium underline decoration-1 hover:decoration-2 hover:bg-transparent"
                onClick={() => setShowMoreDesc(true)}
              >
                Show more
              </Button>
            )}
          </section>

          <Separator className="bg-zinc-100" />

          {/* What this place offers - Features nav scroll target */}
          <section id="features" className="scroll-mt-24">
            <h2 className="text-lg font-semibold">What this place offers</h2>
            <div className="mt-3 space-y-5">
              {visibleAmenities.map(([category, items]) => (
                <div key={category}>
                  <p className="font-medium text-zinc-900">{category}</p>
                  <ul className="mt-1.5 grid gap-3 text-sm text-muted-foreground sm:grid-cols-2">
                    {items.map((item) => {
                      const Icon = AMENITY_ICONS[item];
                      return (
                        <li key={item} className="flex items-center gap-2">
                          {Icon ? <Icon className="size-4 shrink-0 text-muted-foreground" aria-hidden /> : null}
                          <span>{item}</span>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              ))}
            </div>
            {!showAllAmenities && totalAmenityCount > 8 && (
              <Button
                variant="ghost"
                className="mt-2 h-auto p-0 font-medium underline decoration-1 hover:decoration-2 hover:bg-transparent"
                onClick={() => setShowAllAmenities(true)}
              >
                Show all {totalAmenityCount} amenities
              </Button>
            )}
          </section>

          <Separator className="bg-zinc-100" />

          {/* Where you'll stay */}
          <section id="location" className="scroll-mt-24">
            <h2 className="text-lg font-semibold">Where you&apos;ll stay</h2>
            <div className="mt-3 overflow-hidden rounded-lg border bg-zinc-100">
              <div className="relative aspect-[21/9] w-full">
                <iframe
                  title="Property location map"
                  src={getMapEmbedUrl(listing)}
                  className="absolute inset-0 h-full w-full border-0"
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
              <p className="flex items-center gap-2 p-3 text-sm font-medium">
                <MapPin className="size-4 shrink-0 text-muted-foreground" />
                {getListingLocation(listing).fullAddress}
              </p>
            </div>
          </section>

          <Separator className="bg-zinc-100" />

          {/* Things to know */}
          <section>
            <h2 className="text-lg font-semibold">Things to know</h2>
            <div className="mt-3 space-y-4">
              <div>
                <p className="font-medium">Check-in time</p>
                <p className="text-sm text-muted-foreground">3:00 PM – 10:00 PM</p>
              </div>
              <div>
                <p className="font-medium">Check-out time</p>
                <p className="text-sm text-muted-foreground">By 11:00 AM</p>
              </div>
              <div>
                <p className="font-medium">Self check-in</p>
                <p className="text-sm text-muted-foreground">Check yourself in with a lockbox</p>
              </div>
              <div>
                <p className="font-medium">House rules</p>
                <p className="text-sm text-muted-foreground">No smoking · No parties · Pets allowed</p>
              </div>
            </div>
          </section>

          <Separator className="bg-zinc-100" />

          {/* Cancellation policy */}
          <section>
            <h2 className="text-lg font-semibold">Cancellation policy</h2>
            <div className="mt-3 space-y-4">
              <p className="text-sm text-muted-foreground">
                Free cancellation up to 24 hours before check-in. Cancellations within 24 hours of check-in will be charged 50% of the total. No-shows are charged the full amount.
              </p>
            </div>
          </section>

          <Separator className="bg-zinc-100" />

          {/* Reviews */}
          <section id="reviews" className="scroll-mt-24">
            <h2 className="text-lg font-semibold">Reviews</h2>
            <p className="mt-1 flex items-center gap-1.5 text-sm text-muted-foreground">
              <Star size={14} weight="fill" className="text-zinc-900 shrink-0" aria-hidden />
              <span>
                {rating.toFixed(2)} overall rating based on {reviewCount} reviews
              </span>
            </p>
            <div className="mt-4 grid gap-6 sm:grid-cols-2">
              {reviews.map((r, i) => {
                const needsTruncate = r.text.length > REVIEW_TRUNCATE_LENGTH;
                const displayText = needsTruncate
                  ? r.text.slice(0, REVIEW_TRUNCATE_LENGTH).trim() + "..."
                  : r.text;
                return (
                  <div key={i} className="space-y-3">
                    <div className="flex items-start gap-3">
                      <Avatar className="size-10 shrink-0">
                        <AvatarImage src={r.avatarUrl} alt={r.author} />
                        <AvatarFallback>{r.author.slice(0, 1)}</AvatarFallback>
                      </Avatar>
                      <div className="min-w-0">
                        <p className="font-semibold">{r.author}</p>
                        <p className="text-sm text-muted-foreground">{r.location}</p>
                      </div>
                    </div>
                    <div className="flex flex-wrap items-center gap-1 text-sm">
                      <div className="flex gap-0.5">
                        {Array.from({ length: 5 }).map((_, j) => (
                          <Star
                            key={j}
                            size={14}
                            weight={j < r.rating ? "fill" : "regular"}
                            className="text-zinc-900"
                          />
                        ))}
                      </div>
                      <span className="text-muted-foreground">·</span>
                      <span className="text-muted-foreground">{r.date}</span>
                    </div>
                    <p className="text-sm text-muted-foreground whitespace-pre-line">{displayText}</p>
                    {needsTruncate && (
                      <button
                        type="button"
                        className="font-medium underline decoration-1 hover:decoration-2 bg-transparent hover:bg-transparent p-0 h-auto cursor-pointer"
                        onClick={() => {
                          setScrollToReviewIndex(i);
                          setReviewsDialogOpen(true);
                        }}
                      >
                        Show more
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
            <Button
              variant="outline"
              className="mt-4 h-11 w-fit rounded-[5px] px-4 font-medium text-zinc-700 shadow-none hover:bg-zinc-100"
              onClick={() => {
                setScrollToReviewIndex(null);
                setReviewsDialogOpen(true);
              }}
            >
              More reviews
            </Button>
          </section>

          {/* Reviews popup */}
          <Dialog open={reviewsDialogOpen} onOpenChange={(open) => {
            setReviewsDialogOpen(open);
            if (!open) setScrollToReviewIndex(null);
          }}>
            <DialogContent
              className="max-h-[95vh] w-[95vw] sm:max-w-[700px] flex flex-col gap-0 p-0 overflow-hidden"
              showCloseButton={false}
            >
              <DialogTitle className="sr-only">Reviews for {listing.title}</DialogTitle>
              <div className="flex shrink-0 items-center justify-between border-b px-6 py-4">
                <h2 className="text-xl font-semibold">Reviews</h2>
                <DialogClose
                  className="rounded-md p-1.5 opacity-70 transition-opacity hover:opacity-100 focus:outline-none focus:ring-0"
                  aria-label="Close reviews"
                >
                  <X className="h-5 w-5" />
                </DialogClose>
              </div>
              <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain p-6">
                <p className="mb-4 flex items-center gap-1.5 text-sm text-muted-foreground">
                  <Star size={14} weight="fill" className="text-zinc-900 shrink-0" aria-hidden />
                  <span>
                    {rating.toFixed(2)} overall rating based on {reviewCount} reviews
                  </span>
                </p>
                <div className="flex flex-col gap-6">
                  {reviews.map((r, i) => (
                    <div
                      key={i}
                      ref={(el) => { reviewRefs.current[i] = el; }}
                      className="space-y-3"
                    >
                      <div className="flex items-start gap-3">
                        <Avatar className="size-10 shrink-0">
                          <AvatarImage src={r.avatarUrl} alt={r.author} />
                          <AvatarFallback>{r.author.slice(0, 1)}</AvatarFallback>
                        </Avatar>
                        <div className="min-w-0">
                          <p className="font-semibold">{r.author}</p>
                          <p className="text-sm text-muted-foreground">{r.location}</p>
                        </div>
                      </div>
                      <div className="flex flex-wrap items-center gap-1 text-sm">
                        <div className="flex gap-0.5">
                          {Array.from({ length: 5 }).map((_, j) => (
                            <Star
                              key={j}
                              size={14}
                              weight={j < r.rating ? "fill" : "regular"}
                              className="text-zinc-900"
                            />
                          ))}
                        </div>
                        <span className="text-muted-foreground">·</span>
                        <span className="text-muted-foreground">{r.date}</span>
                      </div>
                      <p className="text-sm text-muted-foreground whitespace-pre-line">{r.text}</p>
                    </div>
                  ))}
                </div>
              </div>
            </DialogContent>
          </Dialog>

        </div>

        {/* Right column - sticky sidebar (hidden on small viewports) */}
        <div className="hidden lg:block sticky top-20 self-start pt-6 lg:pt-6">
          <Card>
            <CardContent className="p-0">
              {/* Pricing - show total for x nights when dates selected (price bold/underlined, duration lighter) */}
              {(() => {
                const nights = dateRange?.from && dateRange?.to ? Math.max(1, differenceInDays(dateRange.to, dateRange.from)) : null;
                const total = nights != null ? nights * listing.pricePerDay : null;
                return (
                  <div className="px-5 py-3">
                    <div className="flex flex-wrap items-baseline gap-1">
                      <span className="text-2xl font-bold tabular-nums underline text-zinc-900">
                        {total != null ? `$${total.toLocaleString()}` : `$${listing.pricePerDay}`}
                      </span>
                      <span className="text-sm font-normal text-muted-foreground">
                        {total != null ? ` for ${nights} night${nights !== 1 ? "s" : ""}` : "/night"}
                      </span>
                    </div>
                    <p className="mt-1 text-xs text-muted-foreground">Before taxes</p>
                  </div>
                );
              })()}
              <Separator className="bg-zinc-100" />

              {/* Check-in | Check-out (date picker only) */}
              <div className="flex">
                <div className="min-w-0 flex-1 px-5 py-3">
                  <p className="text-xs font-semibold text-zinc-900">Check-in</p>
                  <div className="mt-1.5">
                    <Popover open={datesAnchor === "start"} onOpenChange={(open) => setDatesAnchor(open ? "start" : null)}>
                      <PopoverTrigger asChild>
                        <button
                          type="button"
                          className="flex h-9 w-full items-center justify-between gap-1 rounded-[5px] border border-zinc-200 bg-white px-3 py-2 text-left text-sm"
                        >
                          <span className={dateRange?.from ? "text-foreground" : "text-muted-foreground"}>
                            {dateRange?.from ? format(dateRange.from, "MMM d, yyyy") : "Select date"}
                          </span>
                          <ChevronDown className="size-4 shrink-0 text-muted-foreground" />
                        </button>
                      </PopoverTrigger>
                      <PopoverContent side="bottom" align={isLargeViewport ? "end" : "start"} className="w-auto p-0">
                        <DateRangePickerContent value={dateRange} onChange={setDateRange} onClose={() => setDatesAnchor(null)} />
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>
                <div className="w-px shrink-0 bg-zinc-100 self-stretch" aria-hidden />
                <div className="min-w-0 flex-1 px-5 py-3">
                  <p className="text-xs font-semibold text-zinc-900">Check-out</p>
                  <div className="mt-1.5">
                    <Popover open={datesAnchor === "end"} onOpenChange={(open) => setDatesAnchor(open ? "end" : null)}>
                      <PopoverTrigger asChild>
                        <button
                          type="button"
                          className="flex h-9 w-full items-center justify-between gap-1 rounded-[5px] border border-zinc-200 bg-white px-3 py-2 text-left text-sm"
                        >
                          <span className={dateRange?.to ? "text-foreground" : "text-muted-foreground"}>
                            {dateRange?.to ? format(dateRange.to, "MMM d, yyyy") : "Select date"}
                          </span>
                          <ChevronDown className="size-4 shrink-0 text-muted-foreground" />
                        </button>
                      </PopoverTrigger>
                      <PopoverContent side="bottom" align={isLargeViewport ? "end" : "start"} className="w-auto p-0">
                        <DateRangePickerContent value={dateRange} onChange={setDateRange} onClose={() => setDatesAnchor(null)} />
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>
              </div>

              <Separator className="bg-zinc-100" />

              {/* Guests */}
              <div className="px-5 py-3">
                <p className="text-xs font-semibold text-zinc-900">Guests</p>
                <div className="mt-1.5">
                  <Popover open={guestsOpen} onOpenChange={setGuestsOpen}>
                    <PopoverAnchor asChild>
                      <button
                        type="button"
                        onClick={() => setGuestsOpen(true)}
                        className="flex h-9 w-full items-center justify-between rounded-[5px] border border-zinc-200 bg-white px-3 text-left text-sm"
                        aria-label="Select guests"
                      >
                        <span className={guestSummary(guests) ? "text-foreground" : "text-muted-foreground"}>
                          {guestSummary(guests) || "Add guests"}
                        </span>
                        <ChevronDown className="size-4 shrink-0 text-muted-foreground" />
                      </button>
                    </PopoverAnchor>
                    <PopoverContent side="bottom" align="start" sideOffset={8} className="w-[var(--radix-popover-trigger-width)] p-0" onOpenAutoFocus={(e) => e.preventDefault()}>
                      <GuestPicker value={guests} onChange={setGuests} />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>

              <div className="px-5 py-3">
                <Button asChild className="h-12 w-full rounded-[5px] bg-primary hover:bg-primary/90 font-medium">
                  <Link href={`/checkout?listingId=${id}`}>Reserve</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
          <Button
            variant="ghost"
            className="mt-3 flex h-auto w-full justify-center gap-2 p-0 text-sm font-medium text-muted-foreground group hover:bg-transparent hover:text-zinc-900"
            asChild
          >
            <Link href="#" className="inline-flex items-center gap-2">
              <Flag className="size-4 shrink-0" aria-hidden />
              <span className="group-hover:underline">Report this listing</span>
            </Link>
          </Button>
        </div>
        </div>
      </div>

      {/* Sticky bottom bar on small viewports - price opens booking sheet */}
      <div className="fixed bottom-0 left-0 right-0 z-50 lg:hidden border-t bg-white shadow-[0_-1px_3px_rgba(0,0,0,0.05)]">
        <div className="mx-auto flex max-w-[1400px] items-center justify-between gap-4 px-4 py-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))]">
          <button
            type="button"
            onClick={() => setBookingSheetOpen(true)}
            className="text-left min-w-0 flex-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-md"
            aria-label="View price and booking details"
          >
            {(() => {
              const nights = dateRange?.from && dateRange?.to ? Math.max(1, differenceInDays(dateRange.to, dateRange.from)) : null;
              const total = nights != null ? nights * listing.pricePerDay : null;
              return (
                <>
                  <div className="flex flex-wrap items-baseline gap-1">
                    <span className="text-xl font-bold tabular-nums underline text-zinc-900">
                      {total != null ? `$${total.toLocaleString()}` : `$${listing.pricePerDay}`}
                    </span>
                    <span className="text-sm font-normal text-muted-foreground">
                      {total != null ? ` for ${nights} night${nights !== 1 ? "s" : ""}` : "/night"}
                    </span>
                  </div>
                  <p className="mt-0.5 text-xs text-muted-foreground">Before taxes</p>
                </>
              );
            })()}
          </button>
          <Button asChild className="h-12 shrink-0 rounded-[5px] bg-primary px-6 font-medium hover:bg-primary/90">
            <Link href={`/checkout?listingId=${id}`}>Reserve</Link>
          </Button>
        </div>
      </div>

      {/* Booking sheet (small viewports) - same content as right sidebar, bottom sheet like index search */}
      <Sheet open={bookingSheetOpen} onOpenChange={setBookingSheetOpen}>
        <SheetContent
          side="bottom"
          className="flex max-h-[92vh] flex-col rounded-t-2xl border-t border-zinc-100 p-0"
          showCloseButton
          onOpenAutoFocus={(e) => e.preventDefault()}
        >
          <SheetHeader className="border-b border-zinc-100 px-4 py-3 text-left">
            <SheetTitle className="text-base font-semibold">Booking details</SheetTitle>
          </SheetHeader>
          <div className="flex-1 overflow-y-auto">
            <div className="px-4 py-4">
              {(() => {
                const nights = dateRange?.from && dateRange?.to ? Math.max(1, differenceInDays(dateRange.to, dateRange.from)) : null;
                const total = nights != null ? nights * listing.pricePerDay : null;
                return (
                  <div className="pb-3">
                    <div className="flex flex-wrap items-baseline gap-1">
                      <span className="text-2xl font-bold tabular-nums underline text-zinc-900">
                        {total != null ? `$${total.toLocaleString()}` : `$${listing.pricePerDay}`}
                      </span>
                      <span className="text-sm font-normal text-muted-foreground">
                        {total != null ? ` for ${nights} night${nights !== 1 ? "s" : ""}` : "/night"}
                      </span>
                    </div>
                    <p className="mt-1 text-xs text-muted-foreground">Before taxes</p>
                  </div>
                );
              })()}
              <Separator className="bg-zinc-100 my-4" />
              <div className="flex gap-0">
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-semibold text-zinc-900">Check-in</p>
                  <div className="mt-1.5">
                    <Popover open={datesAnchor === "start"} onOpenChange={(open) => setDatesAnchor(open ? "start" : null)}>
                      <PopoverTrigger asChild>
                        <button
                          type="button"
                          className="flex h-9 w-full items-center justify-between gap-1 rounded-[5px] border border-zinc-200 bg-white px-3 py-2 text-left text-sm"
                        >
                          <span className={dateRange?.from ? "text-foreground" : "text-muted-foreground"}>
                            {dateRange?.from ? format(dateRange.from, "MMM d, yyyy") : "Select date"}
                          </span>
                          <ChevronDown className="size-4 shrink-0 text-muted-foreground" />
                        </button>
                      </PopoverTrigger>
                      <PopoverContent side="bottom" align="start" className="w-auto p-0">
                        <DateRangePickerContent value={dateRange} onChange={setDateRange} onClose={() => setDatesAnchor(null)} />
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>
                <div className="w-px shrink-0 bg-zinc-100 self-stretch" aria-hidden />
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-semibold text-zinc-900">Check-out</p>
                  <div className="mt-1.5">
                    <Popover open={datesAnchor === "end"} onOpenChange={(open) => setDatesAnchor(open ? "end" : null)}>
                      <PopoverTrigger asChild>
                        <button
                          type="button"
                          className="flex h-9 w-full items-center justify-between gap-1 rounded-[5px] border border-zinc-200 bg-white px-3 py-2 text-left text-sm"
                        >
                          <span className={dateRange?.to ? "text-foreground" : "text-muted-foreground"}>
                            {dateRange?.to ? format(dateRange.to, "MMM d, yyyy") : "Select date"}
                          </span>
                          <ChevronDown className="size-4 shrink-0 text-muted-foreground" />
                        </button>
                      </PopoverTrigger>
                      <PopoverContent side="bottom" align="start" className="w-auto p-0">
                        <DateRangePickerContent value={dateRange} onChange={setDateRange} onClose={() => setDatesAnchor(null)} />
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>
              </div>
              <Separator className="bg-zinc-100 my-4" />
              <div>
                <p className="text-xs font-semibold text-zinc-900">Guests</p>
                <div className="mt-1.5">
                  <Popover open={guestsOpen} onOpenChange={setGuestsOpen}>
                    <PopoverAnchor asChild>
                      <button
                        type="button"
                        onClick={() => setGuestsOpen(true)}
                        className="flex h-9 w-full items-center justify-between rounded-[5px] border border-zinc-200 bg-white px-3 text-left text-sm"
                        aria-label="Select guests"
                      >
                        <span className={guestSummary(guests) ? "text-foreground" : "text-muted-foreground"}>
                          {guestSummary(guests) || "Add guests"}
                        </span>
                        <ChevronDown className="size-4 shrink-0 text-muted-foreground" />
                      </button>
                    </PopoverAnchor>
                    <PopoverContent side="bottom" align="start" sideOffset={8} className="w-[var(--radix-popover-trigger-width)] p-0" onOpenAutoFocus={(e) => e.preventDefault()}>
                      <GuestPicker value={guests} onChange={setGuests} />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
              <div className="pt-4">
                <Button asChild className="h-12 w-full rounded-[5px] bg-primary hover:bg-primary/90 font-medium">
                  <Link href={`/checkout?listingId=${id}`} onClick={() => setBookingSheetOpen(false)}>Reserve</Link>
                </Button>
              </div>
              <Button
                variant="ghost"
                className="mt-3 flex h-auto w-full justify-center gap-2 p-0 text-sm font-medium text-muted-foreground group hover:bg-transparent hover:text-zinc-900"
                asChild
              >
                <Link href="#" className="inline-flex items-center gap-2" onClick={() => setBookingSheetOpen(false)}>
                  <Flag className="size-4 shrink-0" aria-hidden />
                  <span className="group-hover:underline">Report this listing</span>
                </Link>
              </Button>
            </div>
          </div>
        </SheetContent>
      </Sheet>

      <div className="h-20 lg:hidden" aria-hidden />
    </div>
  );
}
