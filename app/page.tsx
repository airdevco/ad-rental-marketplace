import { Suspense } from "react";
import { HeroSearch } from "@/components/landing/hero-search";
import { HeroWithScrollPadding } from "@/components/landing/hero-with-scroll-padding";
import { SelectorAndFeaturedRentals } from "@/components/landing/selector-and-featured-rentals";
import {
  HowItWorks,
  PopularDestinations,
  Testimonials,
  HostCta,
} from "@/components/landing/marketing-blocks";

export default function Home() {
  return (
    <div className="min-h-screen w-full overflow-x-hidden">
      <HeroWithScrollPadding aria-labelledby="hero-heading">
        <div className="container mx-auto w-full max-w-[1400px] px-4 sm:px-6 lg:px-8">
          <div className="relative w-full pb-14 pt-12 md:pb-18 md:pt-16">
            <div className="relative text-center">
              <h1
                id="hero-heading"
                className="text-5xl font-semibold tracking-tight text-zinc-900 sm:text-6xl md:text-7xl"
              >
                Find your next stay
              </h1>
              <p className="mx-auto mt-4 max-w-sm text-[15px] leading-relaxed text-muted-foreground md:text-base">
                Rent from local hosts. Simple booking, real homes.
              </p>
              <div className="mt-9 flex flex-col items-center">
                <HeroSearch />
              </div>
            </div>
          </div>
        </div>
      </HeroWithScrollPadding>

      <div className="container mx-auto w-full max-w-[1400px] px-4 sm:px-6 lg:px-8">
        <Suspense fallback={<div className="py-16 text-center text-muted-foreground">Loading...</div>}>
          <SelectorAndFeaturedRentals />
        </Suspense>
      </div>

      <PopularDestinations />
      <HowItWorks />
      <Testimonials />
      <HostCta />
    </div>
  );
}
