import Link from "next/link";
import Image from "next/image";
import {
  ShieldCheck,
  Clock,
  MapPin,
  Star,
  Car,
  CalendarCheck,
  KeyRound,
  Headset,
  TrendingUp,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

/* ─── How It Works ─── */

const steps = [
  {
    icon: MapPin,
    title: "Find your car",
    description:
      "Browse hundreds of vehicles near you. Filter by price, type, and dates.",
  },
  {
    icon: CalendarCheck,
    title: "Book instantly",
    description:
      "Reserve in seconds with flexible pickup times. No waiting at a counter.",
  },
  {
    icon: KeyRound,
    title: "Hit the road",
    description:
      "Pick up from the host, or get it delivered. Drive away with full insurance.",
  },
];

export function HowItWorks() {
  return (
    <section className="py-20 md:py-24" aria-labelledby="how-heading">
      <div className="container mx-auto max-w-[1400px]">
        <div className="text-center">
          <span className="mb-4 block text-xs font-medium uppercase tracking-widest text-muted-foreground">
            How it works
          </span>
          <h2
            id="how-heading"
            className="text-2xl font-bold tracking-tight md:text-3xl"
          >
            Renting a car is easy
          </h2>
          <p className="mx-auto mt-2 max-w-xl text-muted-foreground">
            Three simple steps from search to steering wheel.
          </p>
        </div>

        <div className="mt-14 grid gap-10 md:grid-cols-3">
          {steps.map((step, i) => (
            <div key={step.title} className="flex flex-col items-center text-center">
              <span className="mb-3 flex size-8 items-center justify-center rounded-full bg-[#1e3a5f] text-sm font-bold text-white">
                {i + 1}
              </span>
              <div className="flex size-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                <step.icon className="size-6" strokeWidth={1.75} />
              </div>
              <h3 className="mt-5 text-lg font-semibold">{step.title}</h3>
              <p className="mt-1.5 max-w-xs text-muted-foreground leading-relaxed">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── Popular Destinations ─── */

const destinations = [
  {
    city: "San Francisco",
    state: "CA",
    count: "320+ cars",
    img: "https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=600&h=400&fit=crop",
  },
  {
    city: "Los Angeles",
    state: "CA",
    count: "580+ cars",
    img: "https://images.unsplash.com/photo-1534190760961-74e8c1c5c3da?w=600&h=400&fit=crop",
  },
  {
    city: "New York",
    state: "NY",
    count: "410+ cars",
    img: "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=600&h=400&fit=crop",
  },
  {
    city: "Miami",
    state: "FL",
    count: "290+ cars",
    img: "https://images.unsplash.com/photo-1533106497176-45ae19e68ba2?w=600&h=400&fit=crop",
  },
];

export function PopularDestinations() {
  return (
    <section className="py-20 md:py-24" aria-labelledby="dest-heading">
      <div className="container mx-auto max-w-[1400px]">
        <div className="flex items-end justify-between gap-4">
          <div>
            <h2 id="dest-heading" className="text-2xl font-bold tracking-tight md:text-3xl">
              Popular destinations
            </h2>
            <p className="mt-1.5 text-muted-foreground">
              Explore top cities with the most cars available.
            </p>
          </div>
          <Button variant="outline" className="hidden shrink-0 md:inline-flex" asChild>
            <Link href="/search">View all rentals</Link>
          </Button>
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {destinations.map((d) => (
            <Link
              key={d.city}
              href={`/search?q=${encodeURIComponent(d.city + ", " + d.state)}`}
              className="group"
            >
              <div className="relative aspect-[4/3] w-full overflow-hidden rounded-xl bg-zinc-100">
                <Image
                  src={d.img}
                  alt={d.city}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                <div className="absolute bottom-0 left-0 p-4 text-white">
                  <p className="text-lg font-semibold leading-tight">
                    {d.city}, {d.state}
                  </p>
                  <p className="mt-0.5 text-sm text-white/80">{d.count}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-6 text-center md:hidden">
          <Button variant="outline" asChild>
            <Link href="/search">View all rentals</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}

/* ─── Testimonials ─── */

const reviews = [
  {
    name: "Sarah M.",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=96&h=96&fit=crop&crop=face",
    role: "Rented a Tesla Model Y",
    rating: 5,
    body: "Incredibly smooth experience from booking to return. The car was spotless, and the host was super responsive. Will definitely book again!",
  },
  {
    name: "James K.",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=96&h=96&fit=crop&crop=face",
    role: "Rented a BMW X5",
    rating: 5,
    body: "Way better than traditional rental agencies. Picked up the car in 5 minutes, no paperwork hassle. The pricing was transparent too.",
  },
  {
    name: "Priya R.",
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=96&h=96&fit=crop&crop=face",
    role: "Rented a Honda CR-V",
    rating: 5,
    body: "Perfect for our family road trip. The host even included a child seat for free. Communication was fantastic throughout.",
  },
];

export function Testimonials() {
  return (
    <section className="py-20 md:py-24" aria-labelledby="reviews-heading">
      <div className="container mx-auto max-w-[1400px]">
        <div className="text-center">
          <span className="mb-4 block text-xs font-medium uppercase tracking-widest text-muted-foreground">
            Reviews
          </span>
          <h2
            id="reviews-heading"
            className="text-2xl font-bold tracking-tight md:text-3xl"
          >
            Loved by renters everywhere
          </h2>
          <p className="mx-auto mt-2 max-w-xl text-muted-foreground">
            Don&apos;t take our word for it. Here&apos;s what real customers say.
          </p>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {reviews.map((r) => (
            <Card key={r.name} className="gap-0 border-zinc-200 p-0 shadow-none">
              <CardContent className="flex flex-col gap-4 p-6">
                <div className="flex gap-0.5">
                  {Array.from({ length: r.rating }).map((_, i) => (
                    <Star
                      key={i}
                      className="size-4 fill-amber-400 text-amber-400"
                    />
                  ))}
                </div>
                <p className="leading-relaxed text-foreground">
                  &ldquo;{r.body}&rdquo;
                </p>
                <div className="flex items-center gap-3">
                  <Avatar className="size-9">
                    <AvatarImage src={r.image} alt={r.name} />
                    <AvatarFallback className="text-xs font-medium">
                      {r.name.slice(0, 2)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-medium">{r.name}</p>
                    <p className="text-xs text-muted-foreground">{r.role}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── Trust & Safety ─── */

const trustItems = [
  {
    icon: ShieldCheck,
    title: "Insurance included",
    description:
      "Every trip comes with liability insurance so you can drive worry-free.",
  },
  {
    icon: Headset,
    title: "24/7 support",
    description:
      "Our team is always available to help with any issue, day or night.",
  },
  {
    icon: Clock,
    title: "Flexible cancellation",
    description:
      "Plans change. Cancel up to 24 hours before your trip for a full refund.",
  },
  {
    icon: TrendingUp,
    title: "Transparent pricing",
    description:
      "No hidden fees. The price you see is the price you pay, every time.",
  },
];

export function TrustAndSafety() {
  return (
    <section className="py-20 md:py-24" aria-labelledby="trust-heading">
      <div className="container mx-auto max-w-[1400px]">
        <div className="flex flex-col gap-12 md:flex-row md:items-start md:gap-16">
          <div className="shrink-0 md:w-[340px]">
            <span className="mb-4 block text-xs font-medium uppercase tracking-widest text-muted-foreground">
              Trust &amp; safety
            </span>
            <h2
              id="trust-heading"
              className="text-2xl font-bold tracking-tight md:text-3xl"
            >
              Drive with peace of mind
            </h2>
            <p className="mt-2 text-muted-foreground">
              We&apos;ve built protections into every step of the rental journey.
            </p>
          </div>

          <div className="grid flex-1 gap-6 sm:grid-cols-2">
            {trustItems.map((item) => (
              <div key={item.title} className="flex gap-4">
                <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <item.icon className="size-5" strokeWidth={1.75} />
                </div>
                <div>
                  <h3 className="font-semibold">{item.title}</h3>
                  <p className="mt-1 leading-relaxed text-muted-foreground">
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─── Host CTA Banner ─── */

export function HostCta() {
  return (
    <section className="py-20 md:py-24" aria-labelledby="host-heading">
      <div className="container mx-auto max-w-[1400px]">
        <div className="flex flex-col items-center gap-8 rounded-2xl bg-[#1e3a5f] px-6 py-14 text-center text-white md:px-16 md:py-20">
          <div className="flex size-14 items-center justify-center rounded-2xl bg-white/15">
            <Car className="size-7 text-white" strokeWidth={1.75} />
          </div>
          <div className="max-w-2xl space-y-3">
            <h2
              id="host-heading"
              className="text-2xl font-bold tracking-tight md:text-3xl text-white"
            >
              Turn your car into a money maker
            </h2>
            <p className="text-white/80">
              List your vehicle in minutes and start earning. Hosts on Rento
              earn an average of $800/month with flexible scheduling.
            </p>
          </div>
          <div className="flex flex-wrap justify-center gap-3">
            <Button
              size="lg"
              variant="secondary"
              className="font-semibold"
              asChild
            >
              <Link href="/dashboard/seller">Start hosting</Link>
            </Button>
            <Button
              size="lg"
              variant="ghost"
              className="font-semibold text-white hover:bg-white/15 hover:text-white"
              asChild
            >
              <Link href="/search">Learn more</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
