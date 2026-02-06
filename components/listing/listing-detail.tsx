"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import type { DateRange } from "react-day-picker";
import { format } from "date-fns";
import { Star, Heart } from "@phosphor-icons/react";
import {
  Users,
  Briefcase,
  DoorClosed,
  Bluetooth,
  Cable,
  Wind,
  Camera,
  Gauge,
  MapPin,
  CalendarIcon,
  Images,
  X,
  Share2,
  CheckCircle,
  Flag,
  ChevronDown,
  Pencil,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { TimePicker } from "@/components/ui/time-picker";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
  getListingGalleryImages,
  getDummyRating,
  getListingReviews,
  getListingReviewCount,
  getListingLocation,
  getMapEmbedUrl,
  PICKUP_LOCATION_OPTIONS,
  CAR_FEATURES,
  CAR_AMENITIES,
} from "@/lib/vehicle-listings";
import type { VehicleListing } from "@/lib/vehicle-listings";
import { useListingScroll } from "@/lib/listing-scroll-context";

const FEATURE_ICONS = {
  bluetooth: Bluetooth,
  usb: Cable,
  ac: Wind,
  backup: Camera,
  cruise: Gauge,
};

const SECTION_TABS = [
  { id: "overview", label: "Overview" },
  { id: "features", label: "Features" },
  { id: "location", label: "Location" },
  { id: "reviews", label: "Reviews" },
] as const;

const REVIEW_TRUNCATE_LENGTH = 180;

export function ListingDetail({ listing, id }: { listing: VehicleListing; id: string }) {
  const [showMoreDesc, setShowMoreDesc] = useState(false);
  const [showAllAmenities, setShowAllAmenities] = useState(false);
  const [reviewsDialogOpen, setReviewsDialogOpen] = useState(false);
  const [scrollToReviewIndex, setScrollToReviewIndex] = useState<number | null>(null);
  const [dateRange, setDateRange] = useState<DateRange | undefined>();
  const [tripStartTime, setTripStartTime] = useState("10:00 AM");
  const [tripEndTime, setTripEndTime] = useState("10:00 AM");
  const [datesAnchor, setDatesAnchor] = useState<"start" | "end" | null>(null);
  const [pickupLocationOverride, setPickupLocationOverride] = useState<string | null>(null);
  const [locationEditOpen, setLocationEditOpen] = useState(false);
  const [locationPopoverOpen, setLocationPopoverOpen] = useState(false);
  const [locationSearchValue, setLocationSearchValue] = useState("");
  const [isLargeViewport, setIsLargeViewport] = useState(false);
  const datesOpen = datesAnchor !== null;
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 768px)");
    setIsLargeViewport(mq.matches);
    const fn = () => setIsLargeViewport(mq.matches);
    mq.addEventListener("change", fn);
    return () => mq.removeEventListener("change", fn);
  }, []);
  const [activeSection, setActiveSection] = useState<string>("overview");
  const [lineStyle, setLineStyle] = useState<{ left: number; width: number }>({ left: 0, width: 0 });
  const [copied, setCopied] = useState(false);
  const [wishlisted, setWishlisted] = useState(false);
  const galleryRef = useRef<HTMLDivElement>(null);
  const navRef = useRef<HTMLDivElement>(null);
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
    const TRIGGER_OFFSET = 120;

    function updateActiveSection() {
      if (ignoreObserverRef.current) return;
      const sections = SECTION_TABS.map((t) => ({
        id: t.id,
        el: document.getElementById(t.id),
      })).filter((s): s is { id: string; el: HTMLElement } => !!s.el);

      let active: string = sections[0]?.id ?? "overview";
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

  // Update sliding line position when active section changes
  useEffect(() => {
    if (!pastGallery || !navRef.current) return;
    const idx = SECTION_TABS.findIndex((t) => t.id === activeSection);
    const btn = tabRefs.current[idx];
    const nav = navRef.current;
    if (btn) {
      const navRect = nav.getBoundingClientRect();
      const btnRect = btn.getBoundingClientRect();
      setLineStyle({
        left: btnRect.left - navRect.left + nav.scrollLeft,
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
    "Well-maintained vehicle with clean interior. Perfect for city driving and weekend getaways. Equipped with modern safety features, climate control, and entertainment options. All rentals include insurance and 24/7 roadside assistance. Regular servicing and detailed cleaning before each rental.";

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
    document.getElementById(sectionId)?.scrollIntoView({ behavior: "smooth" });
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
      {/* Image gallery - same width as header content, rounded outer corners */}
      <div
        ref={galleryRef}
        className={`container mx-auto w-full max-w-[1400px] px-4 overflow-hidden transition-[padding] duration-200 ${pastGallery ? "pt-0" : "pt-6"}`}
      >
        <div className="relative grid grid-cols-4 grid-rows-2 gap-1 overflow-hidden rounded-xl">
          <div className="col-span-2 row-span-2 relative aspect-[16/9] overflow-hidden rounded-tl-xl rounded-bl-xl bg-zinc-100">
            <Image
              src={mainImage}
              alt={listing.title}
              fill
              className="object-cover"
              priority
              sizes="(max-width: 1400px) 100vw, 1400px"
            />
          </div>
          {thumbnails.map((src, i) => (
            <div
              key={i}
              className={`relative aspect-[16/9] overflow-hidden bg-zinc-100 ${i === 1 ? "rounded-tr-xl" : ""} ${i === 3 ? "rounded-br-xl" : ""}`}
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
          <Dialog>
            <DialogTrigger asChild>
              <Button
                variant="outline"
                className="absolute bottom-3 right-3 bg-background/95 shadow-sm"
              >
                <Images className="h-4 w-4" />
                Show all {galleryImages.length} photos
              </Button>
            </DialogTrigger>
            <DialogContent
              className="max-h-[95vh] w-[95vw] sm:max-w-[1200px] flex flex-col gap-0 p-0 overflow-hidden"
              showCloseButton={false}
            >
              <DialogTitle className="sr-only">
                Photo gallery: {listing.title}
              </DialogTitle>
              <div className="flex shrink-0 items-center justify-between border-b px-6 py-4">
                <h2 className="text-xl font-semibold">{listing.title}</h2>
                <DialogClose
                  className="rounded-md p-1.5 opacity-70 transition-opacity hover:opacity-100 focus:outline-none focus:ring-0"
                  aria-label="Close gallery"
                >
                  <X className="h-5 w-5" />
                </DialogClose>
              </div>
              <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain p-6">
                <div className="flex flex-col gap-4">
                  {galleryImages.map((src, i) => (
                    <div
                      key={i}
                      className="relative aspect-[16/9] w-full overflow-hidden rounded-lg bg-zinc-100"
                    >
                      <Image
                        src={src}
                        alt={`${listing.title} photo ${i + 1}`}
                        fill
                        className="object-cover"
                        sizes="95vw"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Section tabs - only visible when scrolled past gallery, fixed at top */}
      {pastGallery && (
        <div className="fixed top-0 left-0 right-0 z-[60] border-b border-zinc-200 bg-white">
          <nav
            ref={navRef}
            className="container relative mx-auto flex max-w-[1400px] gap-8 px-4"
            aria-label="Page sections"
          >
            {SECTION_TABS.map((tab, i) => (
              <button
                key={tab.id}
                ref={(el) => { tabRefs.current[i] = el; }}
                onClick={() => scrollToSection(tab.id)}
                className={`px-1 py-4 text-sm font-medium transition-colors hover:text-zinc-900 ${
                  activeSection === tab.id ? "text-zinc-900" : "text-zinc-600"
                }`}
              >
                {tab.label}
              </button>
            ))}
            <span
              className="absolute bottom-0 h-0.5 bg-zinc-900 transition-all duration-300 ease-out"
              style={{ left: lineStyle.left, width: lineStyle.width }}
              aria-hidden
            />
          </nav>
        </div>
      )}

      <div className="container mx-auto w-full max-w-[1400px] px-4 py-8">
        {/* Overview anchor - scroll target, right above title */}
        <div id="overview" className="scroll-mt-24" />
        {/* Title row: car name + Wishlist/Share buttons aligned with booking card */}
        <div className="grid gap-4 lg:grid-cols-[1fr_380px] lg:gap-8 items-start">
          <h1 className="text-2xl font-black md:text-3xl">{listing.title}</h1>
          <div className="flex gap-2 justify-end lg:justify-end">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setWishlisted(!wishlisted)}
              className="rounded-full border border-zinc-200 md:px-4 md:py-2 h-9 w-9 md:w-auto md:h-auto p-0 shadow-none border-0 md:border md:shadow-sm"
              aria-label="Add to wishlist"
            >
              <Heart
                className="size-4 md:mr-2"
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
                  className="rounded-full border border-zinc-200 md:px-4 md:py-2 h-9 w-9 md:w-auto md:h-auto p-0 shadow-none border-0 md:border md:shadow-sm"
                  aria-label="Share"
                >
                  <Share2 className="size-4 md:mr-2" />
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

        <div className="grid gap-12 lg:grid-cols-[1fr_380px] lg:gap-16 mt-2">
          {/* Left column - main content */}
          <div className="min-w-0 max-w-3xl space-y-6">
          {/* Key stats - same style as index cards */}
          <div className="flex items-center gap-4 text-sm font-medium text-zinc-900">
            <span className="flex items-center gap-1.5" aria-label={`${listing.seats} passengers`}>
              <Users className="size-4 shrink-0" aria-hidden />
              {listing.seats} passengers
            </span>
            <span className="flex items-center gap-1.5" aria-label={`${listing.luggage} luggages`}>
              <Briefcase className="size-4 shrink-0" aria-hidden />
              {listing.luggage} luggages
            </span>
            <span className="flex items-center gap-1.5" aria-label={`${listing.doors} doors`}>
              <DoorClosed className="size-4 shrink-0" aria-hidden />
              {listing.doors} doors
            </span>
          </div>

          <Separator />

          {/* Listed by */}
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-start gap-4">
              <Link
                href={listing.hostId ? `/user/${listing.hostId}` : "#"}
                className="flex shrink-0 focus-visible:rounded-full focus-visible:outline focus-visible:ring-2 focus-visible:ring-ring"
              >
                <Avatar className="size-10">
                  <AvatarImage
                    src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face"
                    alt={hostName}
                  />
                  <AvatarFallback className="text-lg">{hostName.slice(0, 1)}</AvatarFallback>
                </Avatar>
              </Link>
              <div>
                <p className="flex items-center gap-2 font-semibold">
                  Alexander C.
                  <span className="inline-flex items-center gap-1 text-xs font-medium text-green-600">
                    <CheckCircle className="size-3.5 text-green-600" aria-hidden />
                    Verified
                  </span>
                </p>
                <p className="mt-1 flex items-center gap-1.5 text-sm text-muted-foreground">
                  <Star size={14} weight="fill" className="text-amber-400 shrink-0" aria-hidden />
                  <button
                    type="button"
                    onClick={() => scrollToSection("reviews")}
                    className="font-medium text-foreground hover:underline cursor-pointer text-left"
                  >
                    {rating.toFixed(1)}
                  </button>
                  <span>•</span>
                  <button
                    type="button"
                    onClick={() => scrollToSection("reviews")}
                    className="font-medium text-foreground hover:underline cursor-pointer text-left"
                  >
                    {reviewCount} reviews
                  </button>
                  <span>•</span>
                  <span>Joined Mar 2024</span>
                </p>
              </div>
            </div>
            <Button asChild variant="outline" className="shrink-0">
              <Link href={`/messages?with=${listing.hostId ?? ""}`}>Contact host</Link>
            </Button>
          </div>

          <Separator />

          {/* About the vehicle */}
          <section>
            <h2 className="text-lg font-semibold">About the vehicle</h2>
            <p className="mt-2 text-muted-foreground whitespace-pre-line">
              {showMoreDesc ? fullDescription : shortDesc}
            </p>
            {hasMultipleParagraphs && !showMoreDesc && (
              <Button
                variant="ghost"
                className="mt-2 h-auto p-0 font-medium underline"
                onClick={() => setShowMoreDesc(true)}
              >
                Show more
              </Button>
            )}
          </section>

          <Separator />

          {/* This car has */}
          <section>
            <h2 className="text-lg font-semibold">This car has</h2>
            <ul className="mt-3 grid gap-3 sm:grid-cols-2">
              {CAR_FEATURES.map(({ icon, label }) => {
                const Icon = FEATURE_ICONS[icon as keyof typeof FEATURE_ICONS];
                return (
                  <li key={icon} className="flex items-center gap-3">
                    {Icon && <Icon className="size-5 text-zinc-600" />}
                    <span>{label}</span>
                  </li>
                );
              })}
            </ul>
          </section>

          <Separator />

          {/* What this car offers - Features nav scroll target */}
          <section id="features" className="scroll-mt-24">
            <h2 className="text-lg font-semibold">What this car offers</h2>
            <div className="mt-3 space-y-4">
              {visibleAmenities.map(([category, items]) => (
                <div key={category}>
                  <p className="font-medium text-zinc-900">{category}</p>
                  <ul className="mt-1 grid gap-1 text-sm text-muted-foreground sm:grid-cols-2">
                    {items.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
            {!showAllAmenities && totalAmenityCount > 8 && (
              <Button
                variant="ghost"
                className="mt-2 h-auto p-0 font-medium underline"
                onClick={() => setShowAllAmenities(true)}
              >
                Show all {totalAmenityCount} amenities
              </Button>
            )}
          </section>

          <Separator />

          {/* Where you'll pick up */}
          <section id="location" className="scroll-mt-24">
            <h2 className="text-lg font-semibold">Where you&apos;ll pick up</h2>
            <div className="mt-3 overflow-hidden rounded-lg border bg-zinc-100">
              <div className="relative aspect-[21/9] w-full">
                <iframe
                  title="Pickup location map"
                  src={getMapEmbedUrl(listing)}
                  className="absolute inset-0 h-full w-full border-0"
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
              <p className="flex items-center gap-2 p-3 text-sm font-medium">
                <MapPin className="size-4 shrink-0 text-zinc-500" />
                {getListingLocation(listing).fullAddress}
              </p>
            </div>
          </section>

          <Separator />

          {/* Things to know */}
          <section>
            <h2 className="text-lg font-semibold">Things to know</h2>
            <div className="mt-3 space-y-4">
              <div>
                <p className="font-medium">Pickup</p>
                <p className="text-sm text-muted-foreground">10:00 AM – 8:00 PM</p>
              </div>
              <div>
                <p className="font-medium">Return</p>
                <p className="text-sm text-muted-foreground">Same as pickup time</p>
              </div>
              <div>
                <p className="font-medium">Mileage</p>
                <p className="text-sm text-muted-foreground">200 miles/day included</p>
              </div>
              <div>
                <p className="font-medium">Fuel policy</p>
                <p className="text-sm text-muted-foreground">Return with same fuel level</p>
              </div>
            </div>
          </section>

          <Separator />

          {/* Cancellation policy */}
          <section>
            <h2 className="text-lg font-semibold">Cancellation policy</h2>
            <div className="mt-3 space-y-4">
              <p className="text-sm text-muted-foreground">
                Free cancellation up to 24 hours before pickup. Cancellations within 24 hours of pickup will be charged 50% of the rental fee. No-shows are charged the full rental amount.
              </p>
            </div>
          </section>

          <Separator />

          {/* Reviews */}
          <section id="reviews" className="scroll-mt-24">
            <h2 className="text-lg font-semibold">Reviews</h2>
            <p className="mt-1 flex items-center gap-1.5 text-sm text-muted-foreground">
              <Star size={14} weight="fill" className="text-amber-400 shrink-0" aria-hidden />
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
                            className="text-amber-400"
                          />
                        ))}
                      </div>
                      <span className="text-muted-foreground">·</span>
                      <span className="text-muted-foreground">{r.date}</span>
                      <span className="text-muted-foreground">·</span>
                      <span className="text-muted-foreground">{r.stayDuration}</span>
                    </div>
                    <p className="text-sm text-zinc-700 whitespace-pre-line">{displayText}</p>
                    {needsTruncate && (
                      <button
                        type="button"
                        className="font-medium underline bg-transparent hover:bg-transparent p-0 h-auto cursor-pointer"
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
              className="mt-4"
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
                  <Star size={14} weight="fill" className="text-amber-400 shrink-0" aria-hidden />
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
                              className="text-amber-400"
                            />
                          ))}
                        </div>
                        <span className="text-muted-foreground">·</span>
                        <span className="text-muted-foreground">{r.date}</span>
                        <span className="text-muted-foreground">·</span>
                        <span className="text-muted-foreground">{r.stayDuration}</span>
                      </div>
                      <p className="text-sm text-zinc-700 whitespace-pre-line">{r.text}</p>
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
              {/* Pricing */}
              <div className="px-5 py-3">
                <div className="flex flex-wrap items-baseline gap-2">
                  <span className="text-muted-foreground line-through tabular-nums">
                    ${Math.round(listing.pricePerDay * 2)}
                  </span>
                  <span className="text-2xl font-bold tabular-nums underline">
                    ${listing.pricePerDay}/day
                  </span>
                </div>
                <p className="mt-1 text-xs text-muted-foreground">Before taxes</p>
              </div>
              <Separator />

              {/* Your trip */}
              <div className="px-5 py-3">
                <h3 className="font-semibold">Your trip</h3>
                <div className="mt-3 space-y-3">
                  <div>
                    <p className="text-sm font-medium">Trip start</p>
                    <div className="mt-1.5 flex gap-2">
                      <Popover open={datesAnchor === "start"} onOpenChange={(open) => setDatesAnchor(open ? "start" : null)}>
                        <PopoverAnchor asChild>
                          <button
                            type="button"
                            onClick={() => setDatesAnchor("start")}
                            className="flex h-9 min-w-0 flex-1 items-center justify-between gap-1 rounded-md border border-input bg-transparent px-3 py-2 text-left text-sm shadow-xs"
                          >
                            <span className={dateRange?.from ? "text-foreground" : "text-muted-foreground"}>
                              {dateRange?.from ? format(dateRange.from, "MMM d, yyyy") : "Select date"}
                            </span>
                            <ChevronDown className="size-4 shrink-0 text-muted-foreground" />
                          </button>
                        </PopoverAnchor>
                        <PopoverContent
                          side="bottom"
                          align={isLargeViewport ? "end" : "start"}
                          className="w-auto p-0"
                        >
                          <DateRangePickerContent
                            value={dateRange}
                            onChange={setDateRange}
                            onClose={() => setDatesAnchor(null)}
                          />
                        </PopoverContent>
                      </Popover>
                      <TimePicker
                        value={tripStartTime}
                        onChange={setTripStartTime}
                        placeholder="10:00 AM"
                        showIcon={false}
                        triggerClassName="h-9 w-24 rounded-md border border-input bg-transparent px-3"
                      />
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Trip end</p>
                    <div className="mt-1.5 flex gap-2">
                      <Popover open={datesAnchor === "end"} onOpenChange={(open) => setDatesAnchor(open ? "end" : null)}>
                        <PopoverAnchor asChild>
                          <button
                            type="button"
                            onClick={() => setDatesAnchor("end")}
                            className="flex h-9 min-w-0 flex-1 items-center justify-between gap-1 rounded-md border border-input bg-transparent px-3 py-2 text-left text-sm shadow-xs"
                          >
                            <span className={dateRange?.to ? "text-foreground" : "text-muted-foreground"}>
                              {dateRange?.to ? format(dateRange.to, "MMM d, yyyy") : "Select date"}
                            </span>
                            <ChevronDown className="size-4 shrink-0 text-muted-foreground" />
                          </button>
                        </PopoverAnchor>
                        <PopoverContent
                          side="bottom"
                          align={isLargeViewport ? "end" : "start"}
                          className="w-auto p-0"
                        >
                          <DateRangePickerContent
                            value={dateRange}
                            onChange={setDateRange}
                            onClose={() => setDatesAnchor(null)}
                          />
                        </PopoverContent>
                      </Popover>
                      <TimePicker
                        value={tripEndTime}
                        onChange={setTripEndTime}
                        placeholder="10:00 AM"
                        showIcon={false}
                        triggerClassName="h-9 w-24 rounded-md border border-input bg-transparent px-3"
                      />
                    </div>
                  </div>
                </div>
              </div>
              <Separator />

              {/* Pickup & return location */}
              <div className="px-5 py-3">
                <h3 className="font-semibold">Pickup & return location</h3>
                <div className="mt-3">
                  {locationEditOpen ? (
                    <div className="space-y-1.5">
                      <Label htmlFor="pickup-location" className="text-xs font-medium text-zinc-600">
                        Pickup & return location
                      </Label>
                      <Popover
                        open={locationPopoverOpen}
                        onOpenChange={(open) => {
                          setLocationPopoverOpen(open);
                          if (!open) {
                            setTimeout(() => {
                              const inputEl = document.getElementById("pickup-location");
                              if (inputEl && document.activeElement !== inputEl) {
                                setLocationEditOpen(false);
                              }
                            }, 0);
                          }
                        }}
                        modal={false}
                      >
                        <PopoverAnchor asChild>
                          <Input
                            id="pickup-location"
                            type="text"
                            autoComplete="off"
                            placeholder="City, address, or hotel"
                            value={locationSearchValue}
                            onChange={(e) => setLocationSearchValue(e.target.value)}
                            onFocus={() => setLocationPopoverOpen(true)}
                            className="min-h-10 border border-zinc-200 bg-white text-sm shadow-none focus-visible:border-[#156EF5] focus-visible:ring-0"
                            aria-label="Pickup and return location"
                            aria-expanded={locationPopoverOpen}
                          />
                        </PopoverAnchor>
                        <PopoverContent
                          role="listbox"
                          align="start"
                          sideOffset={8}
                          className="z-[100] w-[var(--radix-popover-trigger-width)] min-w-[280px] max-w-[360px] p-0"
                          onOpenAutoFocus={(e) => e.preventDefault()}
                        >
                          <ul className="max-h-[280px] overflow-auto py-1">
                            {(() => {
                              const filtered = locationSearchValue.trim()
                                ? PICKUP_LOCATION_OPTIONS.filter((addr) =>
                                    addr.toLowerCase().includes(locationSearchValue.trim().toLowerCase())
                                  )
                                : PICKUP_LOCATION_OPTIONS;
                              if (filtered.length === 0) {
                                return (
                                  <li className="px-3 py-2 text-sm text-zinc-500">No results</li>
                                );
                              }
                              return filtered.map((addr) => (
                                <li key={addr}>
                                  <button
                                    type="button"
                                    role="option"
                                    className="w-full px-3 py-2.5 text-left text-sm text-zinc-900 hover:bg-zinc-100 focus:bg-zinc-100 focus:outline-none"
                                    onMouseDown={(e) => {
                                      e.preventDefault();
                                      setPickupLocationOverride(addr);
                                      setLocationSearchValue(addr);
                                      setLocationEditOpen(false);
                                      setLocationPopoverOpen(false);
                                    }}
                                  >
                                    {addr}
                                  </button>
                                </li>
                              ));
                            })()}
                          </ul>
                        </PopoverContent>
                      </Popover>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-sm">{pickupLocationOverride ?? getListingLocation(listing).fullAddress}</p>
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8 shrink-0"
                        aria-label="Edit location"
                        onClick={() => {
                          setLocationSearchValue(pickupLocationOverride ?? getListingLocation(listing).fullAddress);
                          setLocationEditOpen(true);
                          setLocationPopoverOpen(true);
                        }}
                      >
                        <Pencil className="size-3.5" />
                      </Button>
                    </div>
                  )}
                </div>
              </div>
              <Separator />

              <div className="px-5 py-3">
                <Button asChild className="h-12 w-full bg-primary hover:bg-primary/90 font-semibold">
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

      {/* Sticky bottom bar on small viewports (replaces right card) */}
      <div className="fixed bottom-0 left-0 right-0 z-50 lg:hidden border-t bg-white shadow-[0_-1px_3px_rgba(0,0,0,0.05)]">
        <div className="mx-auto flex max-w-[1400px] items-center justify-between gap-4 px-4 py-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))]">
          <div>
            <div className="flex flex-wrap items-baseline gap-2">
              <span className="text-muted-foreground line-through tabular-nums text-sm">
                ${Math.round(listing.pricePerDay * 2)}
              </span>
              <span className="text-xl font-bold tabular-nums underline">
                ${listing.pricePerDay}/day
              </span>
            </div>
            <p className="mt-0.5 text-xs text-muted-foreground">Before taxes</p>
          </div>
          <Button asChild className="h-12 shrink-0 rounded-lg bg-primary px-6 font-semibold hover:bg-primary/90">
            <Link href={`/checkout?listingId=${id}`}>Reserve</Link>
          </Button>
        </div>
      </div>
      <div className="h-20 lg:hidden" aria-hidden />
    </div>
  );
}
