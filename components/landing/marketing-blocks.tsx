import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Search, CalendarCheck, KeyRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

/* ─── How It Works ─── */

const steps = [
  {
    title: "Find your place",
    description: "Browse by location, dates, and type. Narrow by bedrooms, price, and more.",
    icon: Search,
  },
  {
    title: "Book instantly",
    description: "Reserve in seconds with no paperwork. Confirm and you're set.",
    icon: CalendarCheck,
  },
  {
    title: "Move in",
    description: "Self check-in with keyless entry. Full protection included with every stay.",
    icon: KeyRound,
  },
];

export function HowItWorks() {
  return (
    <section className="py-20" aria-labelledby="how-heading">
      <div className="container mx-auto max-w-[1400px]">
        <p className="mb-3 text-center text-xs font-medium uppercase tracking-widest text-zinc-400">
          How it works
        </p>
        <h2 id="how-heading" className="mb-12 text-center text-2xl font-semibold tracking-tight text-zinc-900 sm:text-3xl">
          Simple steps to your next stay
        </h2>
        <div className="grid gap-12 sm:grid-cols-3 sm:gap-8">
          {steps.map((s) => {
            const Icon = s.icon;
            return (
              <div key={s.title} className="flex flex-col items-center text-center">
                <Icon className="size-10 shrink-0 text-zinc-400 sm:size-12" strokeWidth={1.5} aria-hidden />
                <h3 className="mt-5 text-lg font-semibold text-zinc-900 sm:text-xl">{s.title}</h3>
                <p className="mt-2 max-w-[260px] text-[15px] leading-relaxed text-zinc-500">{s.description}</p>
              </div>
            );
          })}
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
    count: "320+ homes",
    img: "https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=600&h=800&fit=crop",
  },
  {
    city: "Los Angeles",
    state: "CA",
    count: "580+ homes",
    img: "https://images.unsplash.com/photo-1534190760961-74e8c1c5c3da?w=600&h=800&fit=crop",
  },
  {
    city: "New York",
    state: "NY",
    count: "410+ homes",
    img: "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=600&h=800&fit=crop",
  },
  {
    city: "Miami",
    state: "FL",
    count: "290+ homes",
    img: "https://images.unsplash.com/photo-1533106497176-45ae19e68ba2?w=600&h=800&fit=crop",
  },
];

export function PopularDestinations() {
  return (
    <section className="py-20" aria-labelledby="dest-heading">
      <div className="container mx-auto max-w-[1400px]">
        <div className="mb-10 flex items-center gap-3">
          <h2 id="dest-heading" className="text-2xl font-semibold tracking-tight text-zinc-900 sm:text-3xl">
            Popular destinations
          </h2>
          <Link
            href="/search"
            className="group/viewall flex size-10 shrink-0 items-center justify-center rounded-full bg-zinc-200 text-zinc-900 transition-transform duration-200 ease-out hover:scale-110"
            aria-label="View all destinations"
          >
            <ArrowRight className="size-5" aria-hidden />
          </Link>
        </div>

        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          {destinations.map((d) => (
            <Link
              key={d.city}
              href={`/search?q=${encodeURIComponent(d.city + ", " + d.state)}`}
              className="group"
            >
              <div className="relative aspect-[3/4] w-full overflow-hidden rounded-2xl bg-zinc-100">
                <Image
                  src={d.img}
                  alt={d.city}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 50vw, 25vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/5 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-5">
                  <p className="text-[15px] font-semibold text-white">
                    {d.city}, {d.state}
                  </p>
                  <p className="mt-0.5 text-sm text-white/70">{d.count}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-8 flex justify-center md:hidden">
          <Link
            href="/search"
            className="flex size-10 shrink-0 items-center justify-center rounded-full bg-zinc-200 text-zinc-900 transition-transform duration-200 ease-out hover:scale-110"
            aria-label="View all destinations"
          >
            <ArrowRight className="size-5" aria-hidden />
          </Link>
        </div>
      </div>
    </section>
  );
}

/* ─── Testimonial ─── */

const reviews = [
  {
    name: "Sarah M.",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=96&h=96&fit=crop&crop=face",
    role: "Downtown loft · San Francisco",
    body: "Incredibly smooth from booking to checkout. The home was spotless and check-in was completely keyless.",
  },
  {
    name: "James R.",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=96&h=96&fit=crop&crop=face",
    role: "Beachfront cottage · Miami",
    body: "Better than any hotel I've stayed in. The host was thoughtful, the space was beautiful, and the price was unbeatable.",
  },
  {
    name: "Priya K.",
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=96&h=96&fit=crop&crop=face",
    role: "Studio apartment · New York",
    body: "So easy to find exactly what I needed. Filters are intuitive and I had a confirmed booking in under two minutes.",
  },
  {
    name: "Marcus T.",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=96&h=96&fit=crop&crop=face",
    role: "House · Austin",
    body: "Perfect for a month-long stay. Kitchen was fully equipped and the neighborhood was quiet. Would definitely book again.",
  },
  {
    name: "Elena V.",
    image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=96&h=96&fit=crop&crop=face",
    role: "Condo · Seattle",
    body: "The host left clear instructions and was quick to respond. Place was exactly as described and super clean.",
  },
  {
    name: "David L.",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=96&h=96&fit=crop&crop=face",
    role: "Cabin · Lake Tahoe",
    body: "Amazing weekend getaway. Cozy space with great views. Booking was seamless and check-in was a breeze.",
  },
];

export function Testimonials() {
  return (
    <section className="py-20" aria-labelledby="reviews-heading">
      <div className="container mx-auto max-w-[1400px]">
        <p className="mb-3 text-center text-xs font-medium uppercase tracking-widest text-zinc-400">
          Reviews
        </p>
        <h2
          id="reviews-heading"
          className="mb-12 text-center text-2xl font-semibold tracking-tight text-zinc-900 sm:text-3xl"
        >
          What guests are saying
        </h2>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {reviews.map((r) => (
            <div key={r.name} className="flex flex-col gap-5 rounded-2xl border border-zinc-100 p-6">
              <p className="flex-1 text-[15px] leading-relaxed text-zinc-700">
                &ldquo;{r.body}&rdquo;
              </p>
              <div className="flex items-center gap-3">
                <Avatar className="size-8 shrink-0">
                  <AvatarImage src={r.image} alt={r.name} />
                  <AvatarFallback className="bg-zinc-100 text-xs font-semibold text-zinc-600">
                    {r.name.slice(0, 2)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-semibold text-zinc-900">{r.name}</p>
                  <p className="text-xs text-zinc-400">{r.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── Host CTA — split image layout ─── */

export function HostCta() {
  return (
    <section className="py-20" aria-labelledby="host-heading">
      <div className="container mx-auto max-w-[1400px]">
        <div className="grid items-center gap-10 md:grid-cols-2 md:gap-16">
          {/* Photo */}
          <div className="relative aspect-[4/5] w-full overflow-hidden rounded-2xl bg-zinc-100">
            <Image
              src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=900&h=1125&fit=crop"
              alt="Beautiful home interior"
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </div>

          {/* Copy */}
          <div>
            <p className="mb-4 text-xs font-medium uppercase tracking-widest text-zinc-400">
              For property owners
            </p>
            <h2
              id="host-heading"
              className="text-2xl font-semibold tracking-tight text-zinc-900 sm:text-3xl"
            >
              Your home could be earning right now
            </h2>
            <p className="mt-4 max-w-sm text-[15px] leading-relaxed text-zinc-500">
              List in minutes. Hosts on Rento earn an average of{" "}
              <span className="font-semibold text-zinc-900">$1,200/month</span> with flexible
              scheduling that fits around your life.
            </p>

            <div className="mt-8 grid grid-cols-2 gap-6">
              {[
                { num: "$1,200", label: "Avg. monthly earnings" },
                { num: "500+", label: "Cities covered" },
                { num: "2 min", label: "To list your home" },
                { num: "4.9 ★", label: "Average rating" },
              ].map((s) => (
                <div key={s.num}>
                  <p className="text-xl font-semibold tabular-nums text-zinc-900">{s.num}</p>
                  <p className="mt-0.5 text-sm text-zinc-500">{s.label}</p>
                </div>
              ))}
            </div>

            <Button
              className="mt-8 h-11 w-fit gap-1.5 rounded-[5px] px-4 font-semibold shadow-none"
              asChild
            >
              <Link href="/dashboard/seller">
                Start hosting
                <ArrowRight className="size-4" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
