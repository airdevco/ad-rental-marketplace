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
} from "@/components/landing/marketing-blocks";

export default function Home() {
  return (
    <div className="min-h-screen w-full">
      {/* Hero - background same width as header content (logo to sign up) */}
      <HeroWithScrollPadding aria-labelledby="hero-heading">
        <div className="container mx-auto w-full max-w-[1400px]">
          <div className="relative w-full overflow-hidden rounded-3xl pb-16 pt-14 md:pb-20 md:pt-18">
            <div className="relative text-center">
              <h1
                id="hero-heading"
                className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl md:text-6xl"
              >
                Skip the rental counter
              </h1>
              <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
                Find your perfect ride and rent cars from local hosts
              </p>
              <div className="mt-8 flex flex-col items-center">
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

      {/* Marketing blocks */}
      <HowItWorks />
      <PopularDestinations />
      <Testimonials />
      <TrustAndSafety />
      <HostCta />
    </div>
  );
}
