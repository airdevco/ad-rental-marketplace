import Link from "next/link";
import { Suspense } from "react";
import { Button } from "@/components/ui/button";
import { HeroSearch } from "@/components/landing/hero-search";
import { HeroWithScrollPadding } from "@/components/landing/hero-with-scroll-padding";
import { SelectorAndFeaturedRentals } from "@/components/landing/selector-and-featured-rentals";

const valueProps = [
  {
    title: "Search your way",
    description: "Browse by list or explore on the map. Same cars, the view that fits you.",
  },
  {
    title: "Book with confidence",
    description: "See availability, reviews, and host details before you commit.",
  },
  {
    title: "Message directly",
    description: "Chat with hosts to ask questions and coordinate pickup.",
  },
];

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

      {/* Value props */}
      <section id="value-props" className="py-16 md:py-20" aria-labelledby="value-props-heading">
        <div className="container mx-auto max-w-[1400px]">
          <h2 id="value-props-heading" className="sr-only">
            Why use Rentals
          </h2>
          <div className="grid gap-8 md:grid-cols-3">
            {valueProps.map(({ title, description }) => (
              <div key={title} className="space-y-2">
                <h3 className="text-lg font-semibold">{title}</h3>
                <p className="text-muted-foreground">{description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 md:py-20" id="contact" aria-labelledby="cta-heading">
        <div className="container mx-auto max-w-[1400px] text-center">
          <h2 id="cta-heading" className="text-2xl font-bold md:text-3xl">
            Ready to find your next rental car?
          </h2>
          <p className="mt-2 text-muted-foreground">
            Sign up to save favorites, message hosts, and manage bookings.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Button asChild size="lg">
              <Link href="/signup">Sign up</Link>
            </Button>
            <Button variant="ghost" size="lg" asChild>
              <Link href="/login">Log in</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
