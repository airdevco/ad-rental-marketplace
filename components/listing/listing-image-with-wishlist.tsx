"use client";

import { useState } from "react";
import Image from "next/image";
import { Heart, ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

type ListingImageWithWishlistProps = {
  images: string[];
  alt: string;
  listingId?: string;
  sizes?: string;
  className?: string;
  /** When false, the wishlist heart is hidden (e.g. dashboard). */
  showWishlist?: boolean;
  /** Initial wishlisted state (defaults to false). */
  defaultWishlisted?: boolean;
  /** Called when the wishlist state changes. */
  onWishlistChange?: (wishlisted: boolean) => void;
  /** Optional overlay on the image (e.g. status badge). Rendered top-left when provided. */
  topOverlay?: React.ReactNode;
};

/** Reusable listing image carousel with wishlist heart, nav arrows, and dots */
export function ListingImageWithWishlist({
  images,
  alt,
  listingId,
  sizes = "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw",
  className,
  showWishlist = true,
  defaultWishlisted = false,
  onWishlistChange,
  topOverlay,
}: ListingImageWithWishlistProps) {
  const len = images.length;
  const hasMultiple = len > 1;

  // Internal index for seamless loop: 0 = clone of last, 1..len = real, len+1 = clone of first
  const [internalIndex, setInternalIndex] = useState(1);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(defaultWishlisted);
  const displayIndex = internalIndex === 0 ? len - 1 : internalIndex === len + 1 ? 0 : internalIndex - 1;

  function goNext(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    if (!hasMultiple) return;
    setInternalIndex((i) => i + 1);
    setIsTransitioning(true);
  }

  function goPrev(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    if (!hasMultiple) return;
    setInternalIndex((i) => i - 1);
    setIsTransitioning(true);
  }

  function handleTransitionEnd() {
    if (!hasMultiple) return;
    setIsTransitioning(false);
    setInternalIndex((i) => {
      if (i === 0) return len;
      if (i === len + 1) return 1;
      return i;
    });
  }

  function goToDot(index: number) {
    if (!hasMultiple || index === displayIndex) return;
    setInternalIndex(index + 1);
    setIsTransitioning(true);
  }

  function handleWishlistClick(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    setIsWishlisted((prev) => {
      const next = !prev;
      onWishlistChange?.(next);
      return next;
    });
  }

  const loopedSlides = hasMultiple
    ? [images[len - 1], ...images, images[0]]
    : images;
  const slideCount = loopedSlides.length;
  const translatePct = hasMultiple
    ? (internalIndex / slideCount) * 100
    : 0;

  return (
    <div
      className={cn(
        "group relative aspect-[400/260] w-full overflow-hidden rounded-xl bg-zinc-100",
        className
      )}
    >
      {/* Image strip - explicit widths, no overflow */}
      <div
        className="flex h-full flex-nowrap transition-transform duration-300 ease-out"
        style={{
          width: `${slideCount * 100}%`,
          transform: `translateX(-${hasMultiple ? translatePct : 0}%)`,
          transitionDuration: isTransitioning ? "300ms" : "0ms",
        }}
        onTransitionEnd={handleTransitionEnd}
      >
        {loopedSlides.map((src, i) => (
          <div
            key={i}
            className="relative h-full shrink-0 flex-none"
            style={{ width: `${100 / slideCount}%`, minWidth: `${100 / slideCount}%` }}
          >
            <Image
              src={src}
              alt={alt}
              fill
              className="object-cover"
              sizes={sizes}
            />
          </div>
        ))}
      </div>

      {/* Optional overlay (e.g. status badge) - top right */}
      {topOverlay && (
        <div className="absolute right-2 top-2 z-10">{topOverlay}</div>
      )}

      {/* Wishlist heart - upper right (hidden when showWishlist is false) */}
      {showWishlist && (
        <button
          type="button"
          onClick={handleWishlistClick}
          aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
          className="absolute right-2 top-2 z-10 flex size-9 items-center justify-center p-1 transition-transform duration-200 hover:scale-110 focus-visible:outline focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        >
          <Heart
            className={cn(
              "size-5 transition-colors duration-200",
              isWishlisted
                ? "fill-red-500 stroke-red-500"
                : "fill-zinc-600 stroke-white stroke-[1]"
            )}
            aria-hidden
          />
        </button>
      )}

      {/* Left/Right nav buttons - scale with tile on small viewports */}
      {hasMultiple && (
        <>
          <button
            type="button"
            onClick={goPrev}
            aria-label="Previous image"
            className={cn(
              "absolute left-2 top-1/2 z-10 flex -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-zinc-700 shadow-sm transition-opacity duration-200 hover:bg-white focus-visible:outline focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
              "size-6 sm:size-7 md:size-8",
              "md:opacity-0 md:group-hover:opacity-100"
            )}
          >
            <ChevronLeft className="size-4 sm:size-4 md:size-5" aria-hidden />
          </button>
          <button
            type="button"
            onClick={goNext}
            aria-label="Next image"
            className={cn(
              "absolute right-2 top-1/2 z-10 flex -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-zinc-700 shadow-sm transition-opacity duration-200 hover:bg-white focus-visible:outline focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
              "size-6 sm:size-7 md:size-8",
              "md:opacity-0 md:group-hover:opacity-100"
            )}
          >
            <ChevronRight className="size-4 sm:size-4 md:size-5" aria-hidden />
          </button>

          {/* Nav dots - full tile width, closer spacing */}
          <div
            className={cn(
              "absolute bottom-1.5 left-0 right-0 z-10 flex items-center justify-center gap-0 px-8 transition-opacity duration-200 ease-out md:bottom-2",
              "md:opacity-0 md:group-hover:opacity-100"
            )}
          >
            {images.map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  goToDot(i);
                }}
                aria-label={`Go to image ${i + 1}`}
                aria-current={i === displayIndex ? "true" : undefined}
                className="flex size-4 shrink-0 items-center justify-center rounded-full"
              >
                <span
                  className={cn(
                    "rounded-full transition-all duration-300 ease-out",
                    i === displayIndex
                      ? "h-2 w-2 bg-white shadow-sm"
                      : "h-1.5 w-1.5 bg-white/60 hover:bg-white/80"
                  )}
                />
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
