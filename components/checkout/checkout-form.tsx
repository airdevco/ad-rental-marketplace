"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Shield, Lock, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type CheckoutFormProps = { rentalId: string | null };

export function CheckoutForm({ rentalId }: CheckoutFormProps) {
  const router = useRouter();

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    router.push("/order/confirmation?rentalId=" + (rentalId ?? ""));
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Primary driver */}
      <section>
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-zinc-900">Primary driver</h2>
          <Button variant="ghost" size="sm" asChild>
            <Link href="/login">Log in</Link>
          </Button>
        </div>
        <div className="mt-4 space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="checkout-country">Country</Label>
              <Select defaultValue="us">
                <SelectTrigger id="checkout-country" className="h-10">
                  <SelectValue placeholder="Country" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="us">US +1</SelectItem>
                  <SelectItem value="ca">Canada +1</SelectItem>
                  <SelectItem value="uk">UK +44</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="checkout-phone">Mobile number</Label>
              <Input
                id="checkout-phone"
                name="phone"
                type="tel"
                autoComplete="tel"
                placeholder="Mobile number"
                className="h-10"
                required
              />
            </div>
          </div>
          <p className="text-xs text-muted-foreground">
            By providing a phone number, you consent to receive automated text messages with trip or account updates.
          </p>
          <div className="space-y-2">
            <Label htmlFor="checkout-email">Email</Label>
            <Input
              id="checkout-email"
              name="email"
              type="email"
              autoComplete="email"
              placeholder="Email"
              className="h-10"
              required
            />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="checkout-first">First name on driver&apos;s license</Label>
              <Input
                id="checkout-first"
                name="firstName"
                type="text"
                autoComplete="given-name"
                placeholder="First name"
                className="h-10"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="checkout-last">Last name on driver&apos;s license</Label>
              <Input
                id="checkout-last"
                name="lastName"
                type="text"
                autoComplete="family-name"
                placeholder="Last name"
                className="h-10"
                required
              />
            </div>
          </div>
          <p className="text-xs text-muted-foreground">
            You can add a preferred name through your Account later.
          </p>
          <div className="space-y-2">
            <Label htmlFor="checkout-age">Age</Label>
            <Select>
              <SelectTrigger id="checkout-age" className="h-10">
                <SelectValue placeholder="Select your age" />
              </SelectTrigger>
              <SelectContent>
                {Array.from({ length: 50 }, (_, i) => 21 + i).map((age) => (
                  <SelectItem key={age} value={String(age)}>
                    {age}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex gap-2 rounded-lg border border-blue-200 bg-blue-50 px-3 py-2.5">
            <Info className="size-4 shrink-0 text-blue-600 mt-0.5" aria-hidden />
            <p className="text-sm text-blue-900">
              After booking, you&apos;ll need to submit more information to avoid cancellation and fees.
            </p>
          </div>
          <p className="text-sm text-muted-foreground">
            You can add additional drivers to your trip for free after booking.
          </p>
        </div>
      </section>

      {/* Protection */}
      <section>
        <h2 className="text-lg font-semibold text-zinc-900">Protection</h2>
        <div className="mt-4 flex items-center justify-between rounded-lg border border-zinc-200 bg-white px-4 py-3">
          <div className="flex items-center gap-3">
            <Shield className="size-5 text-zinc-500" aria-hidden />
            <div>
              <p className="font-medium text-zinc-900">Protection options</p>
              <p className="text-sm text-muted-foreground">Select your age to see protection options</p>
            </div>
          </div>
          <Button type="button" variant="outline" size="sm">
            Add
          </Button>
        </div>
      </section>

      {/* Extras */}
      <section>
        <h2 className="text-lg font-semibold text-zinc-900">Extras</h2>
        <div className="mt-4 flex items-center justify-between rounded-lg border border-zinc-200 bg-white px-4 py-3">
          <p className="text-sm font-medium text-zinc-900">Prepaid EV recharge</p>
          <Button type="button" variant="outline" size="sm">
            Add
          </Button>
        </div>
      </section>

      {/* Booking rate */}
      <section>
        <h2 className="text-lg font-semibold text-zinc-900">Booking rate</h2>
        <div className="mt-4 space-y-3">
          <label className="flex cursor-pointer items-start gap-3 rounded-lg border border-zinc-200 bg-white p-4 transition-colors hover:bg-zinc-50 has-[:checked]:border-primary has-[:checked]:ring-2 has-[:checked]:ring-primary/20">
            <input type="radio" name="booking-rate" value="non-refundable" defaultChecked className="mt-1 size-4" />
            <div className="min-w-0 flex-1">
              <p className="font-medium text-zinc-900">Non-refundable</p>
              <p className="text-lg font-semibold tabular-nums">$826.96/mo</p>
              <p className="mt-1 text-sm text-muted-foreground">
                Pay the full amount now. No refunds or changes.
              </p>
              <p className="mt-1 text-sm font-medium text-green-600">
                Save $545.18, limited-time offer{" "}
                <Link href="#" className="underline hover:no-underline">Learn more</Link>
              </p>
            </div>
          </label>
          <label className="flex cursor-pointer items-start gap-3 rounded-lg border border-zinc-200 bg-white p-4 transition-colors hover:bg-zinc-50 has-[:checked]:border-primary has-[:checked]:ring-2 has-[:checked]:ring-primary/20">
            <input type="radio" name="booking-rate" value="refundable" className="mt-1 size-4" />
            <div className="min-w-0 flex-1">
              <p className="font-medium text-zinc-900">Refundable</p>
              <p className="text-lg font-semibold tabular-nums">$1,010.72/mo</p>
              <p className="mt-1 text-sm text-muted-foreground">
                Cancel for free up to 24 hours before. $0 due now.
              </p>
            </div>
          </label>
        </div>
      </section>

      {/* Payment schedule */}
      <section>
        <h2 className="text-lg font-semibold text-zinc-900">Payment schedule</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          3 interest-free payments Due 30 days before the start of each rental month
        </p>
        <div className="mt-4 space-y-2">
          {[
            { date: "Feb 6, 2026", amount: 826.96 },
            { date: "Feb 18, 2026", amount: 826.96, defaultChecked: true },
            { date: "Mar 20, 2026", amount: 799.38 },
          ].map(({ date, amount, defaultChecked }) => (
            <label
              key={date}
              className="flex cursor-pointer items-center gap-3 rounded-lg border border-zinc-200 bg-white px-4 py-3 transition-colors hover:bg-zinc-50 has-[:checked]:border-primary has-[:checked]:ring-2 has-[:checked]:ring-primary/20"
            >
              <input type="radio" name="payment-schedule" value={date} defaultChecked={defaultChecked} className="size-4" />
              <span className="flex-1 text-sm">Due {date}</span>
              <span className="tabular-nums font-medium">${amount.toLocaleString()}</span>
            </label>
          ))}
        </div>
        <Link href="#" className="mt-2 inline-block text-sm font-medium text-primary hover:underline">
          See details
        </Link>
      </section>

      {/* Payment method */}
      <section>
        <h2 className="text-lg font-semibold text-zinc-900">Payment method</h2>
        <p className="mt-1 flex items-center gap-2 text-sm text-muted-foreground">
          <Lock className="size-4" aria-hidden />
          Your information will be stored securely.
        </p>
        <Tabs defaultValue="card" className="mt-4">
          <TabsList className="mb-4">
            <TabsTrigger value="card">Card</TabsTrigger>
            <TabsTrigger value="gpay">Google Pay</TabsTrigger>
          </TabsList>
          <TabsContent value="card" className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="checkout-card">Card number</Label>
              <Input
                id="checkout-card"
                name="card"
                type="text"
                autoComplete="cc-number"
                placeholder="1234 1234 1234 1234"
                className="h-10"
              />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="checkout-exp">Expiration date</Label>
                <Input
                  id="checkout-exp"
                  name="exp"
                  type="text"
                  autoComplete="cc-exp"
                  placeholder="MM/YY"
                  className="h-10"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="checkout-cvc">Security code</Label>
                <Input
                  id="checkout-cvc"
                  name="cvc"
                  type="text"
                  autoComplete="cc-csc"
                  placeholder="CVC"
                  className="h-10"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="checkout-country-pay">Country</Label>
              <Select defaultValue="us">
                <SelectTrigger id="checkout-country-pay" className="h-10">
                  <SelectValue placeholder="Country" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="us">United States</SelectItem>
                  <SelectItem value="ca">Canada</SelectItem>
                  <SelectItem value="uk">United Kingdom</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="checkout-zip">ZIP code</Label>
              <Input
                id="checkout-zip"
                name="zip"
                type="text"
                autoComplete="postal-code"
                placeholder="12345"
                className="h-10"
              />
            </div>
            <p className="text-xs text-muted-foreground">
              By providing your card information, you allow us to charge your card for future payments in accordance with our terms.
            </p>
            <div className="flex items-center gap-2">
              <Checkbox id="checkout-promos" />
              <Label htmlFor="checkout-promos" className="text-sm font-normal cursor-pointer">
                Send me promotions and announcements via email
              </Label>
            </div>
            <div className="flex items-start gap-2">
              <Checkbox id="checkout-terms" />
              <Label htmlFor="checkout-terms" className="text-sm font-normal cursor-pointer">
                I agree to pay the total shown and to the{" "}
                <Link href="#" className="underline hover:no-underline">terms of service</Link>,{" "}
                <Link href="#" className="underline hover:no-underline">cancellation policy</Link> and I acknowledge the{" "}
                <Link href="#" className="underline hover:no-underline">privacy policy</Link>
              </Label>
            </div>
          </TabsContent>
          <TabsContent value="gpay">
            <p className="text-sm text-muted-foreground">Google Pay coming soon.</p>
          </TabsContent>
        </Tabs>

        <Button
          type="submit"
          size="lg"
          className="mt-6 h-12 w-full font-semibold"
        >
          Book trip
        </Button>
      </section>
    </form>
  );
}
