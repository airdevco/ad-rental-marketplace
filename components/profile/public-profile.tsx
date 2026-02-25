"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import { Star, MessageCircle, MapPin, Globe } from "lucide-react";
import { Star as StarPhosphor } from "@phosphor-icons/react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import { X } from "lucide-react";
import { VehicleListingCard } from "@/components/landing/vehicle-listing-card";
import type { VehicleListing } from "@/lib/vehicle-listings";
import type { ListingReview } from "@/lib/vehicle-listings";

/* -------------------------------------------------------------------------- */
/*  Types                                                                      */
/* -------------------------------------------------------------------------- */

export type SellerProfile = {
  type: "seller";
  id: string;
  name: string;
  photo: string;
  bio: string;
  location?: string;
  memberSince?: string;
  yearsHosting?: number;
  listings: VehicleListing[];
  reviews: ListingReview[];
  reviewCount: number;
  rating: number;
};

export type BuyerProfile = {
  type: "buyer";
  id: string;
  firstName: string;
  lastName: string;
  photo: string;
  location?: string;
  languages?: string[];
  about?: string;
  memberSince?: string;
  reviews: ListingReview[];
  reviewCount: number;
  rating: number;
};

type PublicProfileProps = {
  profile: SellerProfile | BuyerProfile;
};

/* -------------------------------------------------------------------------- */
/*  Constants                                                                  */
/* -------------------------------------------------------------------------- */

const REVIEW_TRUNCATE_LENGTH = 200;
const PREVIEW_REVIEW_COUNT = 4;
const PREVIEW_LISTING_COUNT = 6;

/* -------------------------------------------------------------------------- */
/*  Review card (reusable)                                                     */
/* -------------------------------------------------------------------------- */

function ReviewCard({
  review,
  onShowMore,
}: {
  review: ListingReview;
  onShowMore?: () => void;
}) {
  const needsTruncate = review.text.length > REVIEW_TRUNCATE_LENGTH;
  const displayText = needsTruncate
    ? review.text.slice(0, REVIEW_TRUNCATE_LENGTH).trim() + "..."
    : review.text;

  return (
    <div className="space-y-3">
      <div className="flex items-start gap-3">
        <Avatar className="size-10 shrink-0">
          <AvatarImage src={review.avatarUrl} alt={review.author} />
          <AvatarFallback className="bg-zinc-100 text-zinc-600">
            {review.author.slice(0, 1)}
          </AvatarFallback>
        </Avatar>
        <div className="min-w-0">
          <p className="font-semibold text-zinc-900">{review.author}</p>
          <p className="text-sm text-muted-foreground">{review.location}</p>
        </div>
      </div>
      <div className="flex flex-wrap items-center gap-1 text-sm">
        <div className="flex gap-0.5">
          {Array.from({ length: 5 }).map((_, j) => (
            <StarPhosphor
              key={j}
              size={14}
              weight={j < review.rating ? "fill" : "regular"}
              className="text-zinc-900"
            />
          ))}
        </div>
        <span className="text-muted-foreground">·</span>
        <span className="text-muted-foreground">{review.date}</span>
      </div>
      <p className="text-sm text-muted-foreground whitespace-pre-line">{displayText}</p>
      {needsTruncate && onShowMore && (
        <button
          type="button"
          onClick={onShowMore}
          className="text-sm font-medium underline decoration-1 hover:decoration-2"
        >
          Show more
        </button>
      )}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Reviews section                                                            */
/* -------------------------------------------------------------------------- */

function ReviewsSection({
  reviews,
  reviewCount,
  rating,
  title,
}: {
  reviews: ListingReview[];
  reviewCount: number;
  rating: number;
  title: string;
}) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [scrollToIdx, setScrollToIdx] = useState<number | null>(null);
  const reviewRefs = useRef<(HTMLDivElement | null)[]>([]);

  const previewReviews = reviews.slice(0, PREVIEW_REVIEW_COUNT);

  return (
    <section>
      <div className="flex flex-wrap items-baseline gap-2">
        <h2 className="text-lg font-semibold text-zinc-900">{title}</h2>
        <p className="flex items-center gap-1 text-sm text-muted-foreground">
          <StarPhosphor size={14} weight="fill" className="text-zinc-900 shrink-0" aria-hidden />
          <span>
            {rating.toFixed(2)} · {reviewCount} reviews
          </span>
        </p>
      </div>

      {reviews.length === 0 ? (
        <p className="mt-4 text-sm text-muted-foreground">No reviews yet.</p>
      ) : (
        <>
          <div className="mt-5 grid gap-6 sm:grid-cols-2">
            {previewReviews.map((r, i) => (
              <ReviewCard
                key={i}
                review={r}
                onShowMore={() => {
                  setScrollToIdx(i);
                  setDialogOpen(true);
                }}
              />
            ))}
          </div>

          {reviews.length > PREVIEW_REVIEW_COUNT && (
            <Button
              variant="outline"
              className="mt-6 h-11 rounded-[5px] px-5 font-medium text-zinc-700 shadow-none hover:bg-zinc-100 border-zinc-200"
              onClick={() => {
                setScrollToIdx(null);
                setDialogOpen(true);
              }}
            >
              Show all {reviewCount} reviews
            </Button>
          )}
        </>
      )}

      {/* Reviews popup */}
      <Dialog
        open={dialogOpen}
        onOpenChange={(open) => {
          setDialogOpen(open);
          if (!open) setScrollToIdx(null);
        }}
      >
        <DialogContent
          className="max-h-[90vh] w-[95vw] sm:max-w-[660px] flex flex-col gap-0 p-0 overflow-hidden border-zinc-100"
          showCloseButton={false}
        >
          <DialogTitle className="sr-only">All reviews</DialogTitle>
          <div className="flex shrink-0 items-center justify-between border-b border-zinc-100 px-6 py-4">
            <div>
              <h3 className="text-xl font-semibold text-zinc-900">{title}</h3>
              <p className="mt-0.5 flex items-center gap-1 text-sm text-muted-foreground">
                <StarPhosphor size={13} weight="fill" className="text-zinc-900" aria-hidden />
                {rating.toFixed(2)} · {reviewCount} reviews
              </p>
            </div>
            <DialogClose
              className="rounded-md p-1.5 opacity-70 transition-opacity hover:opacity-100 focus:outline-none focus:ring-0"
              aria-label="Close reviews"
            >
              <X className="size-5" />
            </DialogClose>
          </div>
          <div
            className="min-h-0 flex-1 overflow-y-auto overscroll-contain p-6"
            ref={(el) => {
              if (el && scrollToIdx != null) {
                const target = reviewRefs.current[scrollToIdx];
                if (target) {
                  setTimeout(() => target.scrollIntoView({ block: "start", behavior: "smooth" }), 50);
                }
              }
            }}
          >
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
                      <AvatarFallback className="bg-zinc-100 text-zinc-600">
                        {r.author.slice(0, 1)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="min-w-0">
                      <p className="font-semibold text-zinc-900">{r.author}</p>
                      <p className="text-sm text-muted-foreground">{r.location}</p>
                    </div>
                  </div>
                  <div className="flex flex-wrap items-center gap-1 text-sm">
                    <div className="flex gap-0.5">
                      {Array.from({ length: 5 }).map((_, j) => (
                        <StarPhosphor
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
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/*  Seller profile view                                                        */
/* -------------------------------------------------------------------------- */

function SellerView({ profile }: { profile: SellerProfile }) {
  const shownListings = profile.listings.slice(0, PREVIEW_LISTING_COUNT);
  const hasReviews = profile.reviews.length > 0;
  const hasListings = shownListings.length > 0;

  return (
    <>
      {hasReviews && (
        <ReviewsSection
          reviews={profile.reviews}
          reviewCount={profile.reviewCount}
          rating={profile.rating}
          title="Reviews"
        />
      )}

      {hasListings && (
        <>
          {hasReviews && <Separator className="bg-zinc-100" />}
          <section>
            <h2 className="text-lg font-semibold text-zinc-900">
              {profile.name}&apos;s listings
            </h2>
            <div className="mt-5 grid gap-x-5 gap-y-8 sm:grid-cols-2 lg:grid-cols-3">
              {shownListings.map((listing) => (
                <VehicleListingCard key={listing.id} listing={listing} />
              ))}
            </div>
            {profile.listings.length > PREVIEW_LISTING_COUNT && (
              <Button
                variant="outline"
                className="mt-6 h-11 rounded-[5px] px-5 font-medium text-zinc-700 shadow-none hover:bg-zinc-100 border-zinc-200"
                asChild
              >
                <Link href="/search">View all listings</Link>
              </Button>
            )}
          </section>
        </>
      )}
    </>
  );
}

/* -------------------------------------------------------------------------- */
/*  Buyer profile view                                                         */
/* -------------------------------------------------------------------------- */

function BuyerView({ profile }: { profile: BuyerProfile }) {
  return (
    <>
      {profile.reviews.length > 0 && (
        <ReviewsSection
          reviews={profile.reviews}
          reviewCount={profile.reviewCount}
          rating={profile.rating}
          title={`Reviews of ${profile.firstName}`}
        />
      )}
    </>
  );
}

/* -------------------------------------------------------------------------- */
/*  Main exported component                                                    */
/* -------------------------------------------------------------------------- */

export function PublicProfile({ profile }: PublicProfileProps) {
  const isSeller = profile.type === "seller";
  const name = isSeller
    ? (profile as SellerProfile).name
    : `${(profile as BuyerProfile).firstName} ${(profile as BuyerProfile).lastName}`;
  const photo = profile.photo;
  const initials = isSeller
    ? (profile as SellerProfile).name.slice(0, 1)
    : `${(profile as BuyerProfile).firstName.slice(0, 1)}${(profile as BuyerProfile).lastName.slice(0, 1)}`;

  const sectionHeadingClass = "text-lg font-semibold text-zinc-900";

  return (
    <div className="container mx-auto w-full max-w-[900px] px-4 py-10">
      {/* Top row: card (1/3) + About block (2/3) */}
      <div className="flex flex-col gap-8 sm:flex-row sm:items-stretch sm:gap-8">
        {/* Left: profile card — wider, two columns, no vertical divider */}
        <Card className="w-full shrink-0 sm:w-[56%]">
          <CardContent className="flex flex-col p-6 sm:flex-row sm:items-center sm:gap-6">
            {/* Left: photo, name, subtitle (location or Host), optional Message */}
            <div className="flex flex-col items-center text-center sm:flex-1">
              <div className="shrink-0">
                {photo ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={photo}
                    alt={name}
                    className="size-24 rounded-full border border-zinc-200 object-cover sm:size-28"
                  />
                ) : (
                  <Avatar className="size-24 border border-zinc-200 sm:size-28">
                    <AvatarFallback className="bg-zinc-100 text-3xl font-semibold text-zinc-500">
                      {initials}
                    </AvatarFallback>
                  </Avatar>
                )}
              </div>
              <h1 className="mt-4 text-xl font-bold tracking-tight text-zinc-900">{name}</h1>
              {isSeller ? (
                <p className="mt-0.5 text-sm text-muted-foreground">Host</p>
              ) : (
                (profile as BuyerProfile).location && (
                  <p className="mt-0.5 text-sm text-muted-foreground">
                    {(profile as BuyerProfile).location}
                  </p>
                )
              )}
              {isSeller && (
                <Button
                  asChild
                  className="mt-4 h-10 w-full gap-2 rounded-[5px] bg-primary px-5 font-medium shadow-none hover:bg-primary/90 sm:w-auto"
                >
                  <Link href="/messages">
                    <MessageCircle className="size-4 shrink-0" />
                    Message
                  </Link>
                </Button>
              )}
            </div>

            {/* Metrics: 3 items, column aligned to the right of card, text left-justified; 2 horizontal dividers */}
            <div className="flex w-full flex-col justify-center border-t border-zinc-100 pt-4 sm:border-t-0 sm:w-auto sm:min-w-[120px] sm:pt-0">
              {/* Reviews */}
              <div className="flex flex-col py-3 text-left">
                <span className="text-2xl font-bold tabular-nums text-zinc-900">
                  {profile.reviewCount}
                </span>
                <span className="text-sm font-normal text-muted-foreground">
                  Review{profile.reviewCount !== 1 ? "s" : ""}
                </span>
              </div>
              <div className="border-t border-zinc-100" />
              {/* Rating */}
              <div className="flex flex-col py-3 text-left">
                <span className="flex items-baseline gap-1.5 text-2xl font-bold tabular-nums text-zinc-900">
                  {profile.rating.toFixed(2)}
                  <Star className="size-5 shrink-0 fill-zinc-900 text-zinc-900" aria-hidden />
                </span>
                <span className="text-sm font-normal text-muted-foreground">Rating</span>
              </div>
              <div className="border-t border-zinc-100" />
              {/* Third metric: Years hosting (seller) or Member since (buyer) */}
              <div className="flex flex-col py-3 text-left">
                {isSeller && (profile as SellerProfile).yearsHosting != null ? (
                  <>
                    <span className="text-2xl font-bold tabular-nums text-zinc-900">
                      {(profile as SellerProfile).yearsHosting}
                    </span>
                    <span className="text-sm font-normal text-muted-foreground">
                      {(profile as SellerProfile).yearsHosting === 1 ? "Year" : "Years"} hosting
                    </span>
                  </>
                ) : (
                  <>
                    <span className="text-2xl font-bold tabular-nums text-zinc-900">
                      {(profile as BuyerProfile).memberSince ?? "—"}
                    </span>
                    <span className="text-sm font-normal text-muted-foreground">Member since</span>
                  </>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Right: About — same font size as section headings; less padding below */}
        <div className="min-w-0 flex-1">
          <h2 className={sectionHeadingClass}>About</h2>
          {isSeller ? (
            <>
              {(profile as SellerProfile).bio ? (
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground whitespace-pre-line">
                  {(profile as SellerProfile).bio}
                </p>
              ) : null}
            </>
          ) : (
            <>
              <div className="mt-2 flex flex-col gap-2">
                {(profile as BuyerProfile).location && (
                  <p className="flex items-center gap-2 text-sm text-zinc-700">
                    <MapPin className="size-4 shrink-0 text-muted-foreground" />
                    I live in {(profile as BuyerProfile).location}
                  </p>
                )}
                {(profile as BuyerProfile).languages && (profile as BuyerProfile).languages!.length > 0 && (
                  <p className="flex items-center gap-2 text-sm text-zinc-700">
                    <Globe className="size-4 shrink-0 text-muted-foreground" />
                    I speak {(profile as BuyerProfile).languages!.join(" and ")}
                  </p>
                )}
              </div>
              {(profile as BuyerProfile).about && (
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground whitespace-pre-line">
                  {(profile as BuyerProfile).about}
                </p>
              )}
            </>
          )}
        </div>
      </div>

      {/* Body: Reviews only */}
      <div className="mt-12 border-t border-zinc-100 pt-10">
        {isSeller ? (
          <SellerView profile={profile as SellerProfile} />
        ) : (
          <BuyerView profile={profile as BuyerProfile} />
        )}
      </div>
    </div>
  );
}
