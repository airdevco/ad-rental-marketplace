import { Suspense } from "react";
import { HeroSearch } from "@/components/landing/hero-search";
import { HeroWithScrollPadding } from "@/components/landing/hero-with-scroll-padding";
import { SelectorAndFeaturedRentals } from "@/components/landing/selector-and-featured-rentals";
import {
  HowItWorks,
  PopularDestinations,
  Testimonials,
  TrustAndSafety,
  HostCta,
  FloatingMapButton,
} from "@/components/landing/marketing-blocks";

export default function Home() {
  return (
    <div className="min-h-screen w-full">
      <HeroWithScrollPadding aria-labelledby="hero-heading">
        <div className="container mx-auto w-full max-w-[1400px]">
          <div className="relative w-full overflow-hidden rounded-3xl pb-16 pt-14 md:pb-20 md:pt-18">
            <div className="relative text-center">
              <div className="mx-auto mb-6 inline-flex items-center gap-2 rounded-full border border-zinc-200 bg-zinc-50 px-4 py-1.5 text-sm font-medium text-zinc-500">
                <span className="size-1.5 shrink-0 rounded-full bg-emerald-500" />
                Skip the hotel lobby — 500+ cities worldwide
              </div>
              <h1
                id="hero-heading"
                className="text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl md:text-6xl"
              >
                Find your perfect<br />
                <span className="text-primary">home</span>
              </h1>
              <p className="mx-auto mt-5 max-w-lg text-base leading-relaxed text-muted-foreground md:text-lg">
                Rent homes from local hosts. No queues, no hassle — just great
                places at honest prices.
              </p>
              <div className="mt-10 flex flex-col items-center">
                <HeroSearch />
              </div>
            </div>
          </div>
        </div>
      </HeroWithScrollPadding>

      <div className="container mx-auto w-full max-w-[1400px]">
        <Suspense fallback={<div className="py-16 text-center text-muted-foreground">Loading...</div>}>
          <SelectorAndFeaturedRentals />
        </Suspense>
      </div>

      <HowItWorks />
      <PopularDestinations />
      <Testimonials />
      <TrustAndSafety />
      <HostCta />
      <FloatingMapButton />
    </div>
  );
}
