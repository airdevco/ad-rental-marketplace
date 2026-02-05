"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import type { DateRange } from "react-day-picker";
import { startOfDay } from "date-fns";
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
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "@/components/ui/calendar";
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

export function ListingDetail({ listing, id }: { listing: VehicleListing; id: string }) {
  const [showMoreDesc, setShowMoreDesc] = useState(false);
  const [showAllAmenities, setShowAllAmenities] = useState(false);
  const [dateRange, setDateRange] = useState<DateRange | undefined>();
  const [activeSection, setActiveSection] = useState<string>("overview");
  const [lineStyle, setLineStyle] = useState<{ left: number; width: number }>({ left: 0, width: 0 });
  const [copied, setCopied] = useState(false);
  const [wishlisted, setWishlisted] = useState(false);
  const galleryRef = useRef<HTMLDivElement>(null);
  const navRef = useRef<HTMLDivElement>(null);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const ignoreObserverRef = useRef(false);
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
  const galleryImages = getListingGalleryImages(listing);
  const mainImage = galleryImages[0];
  const thumbnails = galleryImages.slice(1, 5);
  const rating = listing.rating ?? getDummyRating(listing.id);
  const reviewCount = getListingReviewCount(id);
  const reviews = getListingReviews(id);
  const hostName = listing.hostName ?? "Rento Team";

  const fullDescription =
    listing.description ??
    "Well-maintained vehicle with clean interior. Perfect for city driving and weekend getaways. All rentals include insurance and 24/7 roadside assistance. Regular servicing and detailed cleaning before each rental.";

  const shortDesc = fullDescription.slice(0, 180);
  const isLongDesc = fullDescription.length > 180;

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
      {/* Full-width image gallery - extends edge-to-edge above booking card */}
      <div ref={galleryRef} className="w-screen relative left-1/2 -translate-x-1/2 overflow-hidden">
        <div className="relative grid grid-cols-4 grid-rows-2 gap-1 overflow-hidden">
          <div className="col-span-2 row-span-2 relative aspect-[16/9] overflow-hidden bg-zinc-100">
            <Image
              src={mainImage}
              alt={listing.title}
              fill
              className="object-cover"
              priority
              sizes="100vw"
            />
          </div>
          {thumbnails.map((src, i) => (
            <div key={i} className="relative aspect-[16/9] overflow-hidden bg-zinc-100">
              <Image
                src={src}
                alt={`${listing.title} ${i + 2}`}
                fill
                className="object-cover"
                sizes="25vw"
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
        {/* Title row: car name + Wishlist/Share buttons aligned with booking card */}
        <div className="grid gap-4 lg:grid-cols-[1fr_380px] lg:gap-8 items-start">
          <h1 id="overview" className="text-2xl font-black md:text-3xl">{listing.title}</h1>
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

        <div className="grid gap-8 lg:grid-cols-[1fr_380px] mt-2">
          {/* Left column - main content */}
          <div className="min-w-0 space-y-6">
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
          <p className="flex items-center gap-2 text-sm">
            <Star size={16} weight="fill" className="text-amber-400" aria-hidden />
            <span className="font-medium">{rating.toFixed(1)}</span>
            <span className="text-muted-foreground">•</span>
            <span>Superhost</span>
            <span className="text-muted-foreground">•</span>
            <span>{reviewCount} reviews</span>
          </p>

          <Separator />

          {/* Listed by - keep existing */}
          <div className="flex items-start gap-4">
            <Link
              href={listing.hostId ? `/user/${listing.hostId}` : "#"}
              className="flex shrink-0 focus-visible:rounded-full focus-visible:outline focus-visible:ring-2 focus-visible:ring-ring"
            >
              <Avatar className="size-14">
                <AvatarFallback className="text-lg">{hostName.slice(0, 1)}</AvatarFallback>
              </Avatar>
            </Link>
            <div>
              <p className="font-semibold">{hostName}</p>
              <p className="text-sm text-muted-foreground">Joined in March 2021</p>
              <Badge variant="secondary" className="mt-1">
                Verified
              </Badge>
            </div>
          </div>

          <Separator />

          {/* This car has */}
          <section id="features">
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

          {/* About the vehicle */}
          <section>
            <h2 className="text-lg font-semibold">About the vehicle</h2>
            <p className="mt-2 text-muted-foreground">
              {showMoreDesc ? fullDescription : shortDesc}
              {isLongDesc && !showMoreDesc && "…"}
            </p>
            {isLongDesc && (
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

          {/* What this car offers */}
          <section>
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

          {/* Interior / Exterior (car-specific) */}
          <section>
            <h2 className="text-lg font-semibold">Interior & exterior</h2>
            <div className="mt-3 grid gap-4 sm:grid-cols-2">
              <div className="overflow-hidden rounded-lg bg-zinc-100">
                <div className="relative aspect-video">
                  <Image
                    src={galleryImages[1] ?? mainImage}
                    alt="Interior"
                    fill
                    className="object-cover"
                  />
                </div>
                <p className="p-2 font-medium">Interior</p>
                <p className="px-2 pb-2 text-sm text-muted-foreground">Leather seats, touchscreen</p>
              </div>
              <div className="overflow-hidden rounded-lg bg-zinc-100">
                <div className="relative aspect-video">
                  <Image
                    src={galleryImages[2] ?? mainImage}
                    alt="Exterior"
                    fill
                    className="object-cover"
                  />
                </div>
                <p className="p-2 font-medium">Exterior</p>
                <p className="px-2 pb-2 text-sm text-muted-foreground">Sleek design, alloy wheels</p>
              </div>
            </div>
          </section>

          <Separator />

          {/* Where you'll pick up */}
          <section id="location">
            <h2 className="text-lg font-semibold">Where you&apos;ll pick up</h2>
            <div className="mt-3 overflow-hidden rounded-lg border bg-zinc-100">
              <div className="flex aspect-[21/9] items-center justify-center bg-zinc-200">
                <MapPin className="size-12 text-zinc-400" />
              </div>
              <p className="p-3 text-sm font-medium">
                {listing.location?.city ?? "San Francisco"}, California, United States
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

          {/* Select dates */}
          <section>
            <h2 className="text-lg font-semibold">Select dates to see total price</h2>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="mt-3 w-full justify-start text-left font-normal"
                >
                  <CalendarIcon className="mr-2 size-4" />
                  {dateRange?.from
                    ? dateRange.to
                      ? `${dateRange.from.toLocaleDateString()} – ${dateRange.to.toLocaleDateString()}`
                      : dateRange.from.toLocaleDateString()
                    : "Select dates"}
                </Button>
              </PopoverTrigger>
              <PopoverContent align="start" className="w-auto p-0">
                <Calendar
                  mode="range"
                  numberOfMonths={2}
                  selected={dateRange}
                  onSelect={setDateRange}
                  disabled={{ before: startOfDay(new Date()) }}
                />
              </PopoverContent>
            </Popover>
          </section>

          <Separator />

          {/* Guest reviews */}
          <section id="reviews">
            <h2 className="text-lg font-semibold">Guest reviews</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              {rating.toFixed(2)} overall rating based on {reviewCount} reviews
            </p>
            <div className="mt-4 grid gap-4 sm:grid-cols-3">
              {reviews.map((r, i) => (
                <div key={i} className="space-y-2">
                  <div className="flex gap-1">
                    {Array.from({ length: 5 }).map((_, j) => (
                      <Star
                        key={j}
                        size={14}
                        weight={j < r.rating ? "fill" : "regular"}
                        className="text-amber-400"
                      />
                    ))}
                  </div>
                  <p className="text-sm">{r.text}</p>
                  <p className="text-xs text-muted-foreground">
                    {r.author} · {r.date}
                  </p>
                </div>
              ))}
            </div>
            <Button variant="ghost" className="mt-2 h-auto p-0 font-medium underline">
              Show all {reviewCount} reviews
            </Button>
          </section>

          <Separator />

          {/* Have a question? */}
          <section>
            <h2 className="text-lg font-semibold">Have a question?</h2>
            <p className="mt-2 text-muted-foreground">Ask {hostName} a question.</p>
            <Button asChild variant="outline" className="mt-3">
              <Link href={`/messages?with=${listing.hostId ?? ""}`}>Contact host</Link>
            </Button>
          </section>
        </div>

        {/* Right column - sticky sidebar */}
        <div className="sticky top-20 self-start pt-6 lg:pt-6">
          <Card>
            <CardHeader>
              <p className="text-sm font-semibold">Available for booking</p>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold tabular-nums">${listing.pricePerDay}</span>
                <span className="text-muted-foreground">/ day</span>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left font-normal"
                  >
                    <CalendarIcon className="mr-2 size-4" />
                    Select dates
                  </Button>
                </PopoverTrigger>
                <PopoverContent align="start" className="w-auto p-0">
                  <Calendar
                    mode="range"
                    numberOfMonths={2}
                    selected={dateRange}
                    onSelect={setDateRange}
                    disabled={{ before: startOfDay(new Date()) }}
                  />
                </PopoverContent>
              </Popover>
              <Button asChild className="h-12 w-full bg-zinc-900 hover:bg-zinc-800">
                <Link href={`/checkout?listingId=${id}`}>View availability</Link>
              </Button>
              <Separator />
              {/* Listed by - compact */}
              <Link
                href={listing.hostId ? `/user/${listing.hostId}` : "#"}
                className="flex items-center gap-3 focus-visible:rounded-md focus-visible:outline focus-visible:ring-2 focus-visible:ring-ring"
              >
                <Avatar className="size-10">
                  <AvatarFallback>{hostName.slice(0, 1)}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-semibold">{hostName}</p>
                  <p className="text-sm text-muted-foreground">Superhost · Joined in March 2021</p>
                </div>
              </Link>
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
    </div>
  );
}
