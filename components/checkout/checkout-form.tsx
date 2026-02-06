"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AuthModal } from "@/components/auth/auth-modal";

const DUMMY_USER = {
  firstName: "Alex",
  lastName: "Smith",
  email: "alex@example.com",
  phoneCountry: "us",
  phoneNumber: "555-123-4567",
  age: "28",
};

/** Format phone as XXX-XXX-XXXX, stores digits only internally */
function formatPhoneNumber(value: string): string {
  const digits = value.replace(/\D/g, "").slice(0, 10);
  if (digits.length <= 3) return digits;
  if (digits.length <= 6) return `${digits.slice(0, 3)}-${digits.slice(3)}`;
  return `${digits.slice(0, 3)}-${digits.slice(3, 6)}-${digits.slice(6)}`;
}

type CheckoutFormProps = { rentalId: string | null };

type Step = 1 | 2 | 3;

export function CheckoutForm({ rentalId }: CheckoutFormProps) {
  const router = useRouter();
  const [step, setStep] = useState<Step>(1);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);

  const [details, setDetails] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneCountry: "us",
    phoneNumber: "",
    age: "",
  });

  const [bookingRate, setBookingRate] = useState<"non-refundable" | "refundable">("non-refundable");

  function handleLoginSuccess() {
    setIsLoggedIn(true);
    setDetails({
      firstName: DUMMY_USER.firstName,
      lastName: DUMMY_USER.lastName,
      email: DUMMY_USER.email,
      phoneCountry: DUMMY_USER.phoneCountry,
      phoneNumber: DUMMY_USER.phoneNumber,
      age: DUMMY_USER.age,
    });
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    router.push("/order/confirmation?rentalId=" + (rentalId ?? ""));
  }

  function goToStep(s: Step) {
    setStep(s);
  }

  const detailsSummary =
    details.firstName && details.lastName
      ? `${details.firstName} ${details.lastName}`
      : details.email || "—";

  const editBtnClass = "h-auto p-0 font-medium text-foreground hover:bg-transparent underline-offset-4 hover:underline";

  return (
    <>
      <form onSubmit={handleSubmit} className="space-y-0">
        {/* Step 1: Choose how to pay */}
        <section>
          <div
            className="flex cursor-pointer items-center justify-between gap-4 py-4"
            onClick={step !== 1 ? () => goToStep(1) : undefined}
            role={step !== 1 ? "button" : undefined}
          >
            <div>
              <h2 className="text-lg font-semibold text-zinc-900">1. Choose how to pay</h2>
              {step > 1 && (
                <p className="mt-0.5 text-sm text-muted-foreground">
                  {bookingRate === "non-refundable" ? "Non-refundable" : "Refundable"}
                </p>
              )}
            </div>
            {step > 1 ? (
              <Button type="button" variant="ghost" size="sm" className={editBtnClass} onClick={(e) => { e.stopPropagation(); goToStep(1); }}>
                Edit
              </Button>
            ) : null}
          </div>
          {step === 1 && (
            <div className="pb-4">
              <div className="space-y-3 pt-1">
                <label className="flex cursor-pointer items-start gap-3 rounded-lg border border-zinc-200 bg-white p-4 transition-colors hover:bg-zinc-50 has-[:checked]:border-primary has-[:checked]:ring-2 has-[:checked]:ring-primary/20">
                  <input
                    type="radio"
                    name="booking-rate"
                    value="non-refundable"
                    checked={bookingRate === "non-refundable"}
                    onChange={() => setBookingRate("non-refundable")}
                    className="mt-1 size-4"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-zinc-900">Non-refundable</p>
                    <p className="text-lg font-semibold tabular-nums">$826.96/mo</p>
                    <p className="mt-1 text-sm text-muted-foreground">
                      Pay the full amount now. No refunds or changes.
                    </p>
                  </div>
                </label>
                <label className="flex cursor-pointer items-start gap-3 rounded-lg border border-zinc-200 bg-white p-4 transition-colors hover:bg-zinc-50 has-[:checked]:border-primary has-[:checked]:ring-2 has-[:checked]:ring-primary/20">
                  <input
                    type="radio"
                    name="booking-rate"
                    value="refundable"
                    checked={bookingRate === "refundable"}
                    onChange={() => setBookingRate("refundable")}
                    className="mt-1 size-4"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-zinc-900">Refundable</p>
                    <p className="text-lg font-semibold tabular-nums">$1,010.72/mo</p>
                    <p className="mt-1 text-sm text-muted-foreground">
                      Cancel for free up to 24 hours before. $0 due now.
                    </p>
                  </div>
                </label>
              </div>
              <div className="mt-4 flex justify-end">
                <Button
                  type="button"
                  size="sm"
                  className="min-w-[88px]"
                  onClick={() => {
                    if (!isLoggedIn) {
                      setAuthOpen(true);
                    } else {
                      setStep(2);
                    }
                  }}
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </section>

        <div className="border-t border-zinc-200" />

        {/* Step 2: Details */}
        <section>
          <div
            className="flex cursor-pointer items-center justify-between gap-4 py-4"
            onClick={step !== 2 ? () => goToStep(2) : undefined}
            role={step !== 2 ? "button" : undefined}
          >
            <div>
              <h2 className="text-lg font-semibold text-zinc-900">2. Driver details</h2>
              {step > 2 && (
                <p className="mt-0.5 text-sm text-muted-foreground">
                  {detailsSummary}
                </p>
              )}
            </div>
            {step > 2 ? (
              <Button type="button" variant="ghost" size="sm" className={editBtnClass} onClick={(e) => { e.stopPropagation(); goToStep(2); }}>
                Edit
              </Button>
            ) : null}
          </div>
          {step === 2 && (
            <div className="pb-4">
              <div className="space-y-4 pt-1">
                <div className="grid gap-4 grid-cols-1 sm:grid-cols-[1fr_1fr_auto]">
                  <div className="space-y-2 min-w-0">
                    <Label htmlFor="checkout-first">First name</Label>
                    <Input
                      id="checkout-first"
                      value={details.firstName}
                      onChange={(e) => setDetails((d) => ({ ...d, firstName: e.target.value }))}
                      placeholder="First name"
                      className="h-10 w-full"
                      required
                    />
                  </div>
                  <div className="space-y-2 min-w-0">
                    <Label htmlFor="checkout-last">Last name</Label>
                    <Input
                      id="checkout-last"
                      value={details.lastName}
                      onChange={(e) => setDetails((d) => ({ ...d, lastName: e.target.value }))}
                      placeholder="Last name"
                      className="h-10 w-full"
                      required
                    />
                  </div>
                  <div className="space-y-2 min-w-[5rem] shrink-0">
                    <Label htmlFor="checkout-age">Age</Label>
                    <Select
                      value={details.age}
                      onValueChange={(v) => setDetails((d) => ({ ...d, age: v }))}
                    >
                      <SelectTrigger id="checkout-age" className="h-10 w-full min-w-0">
                        <SelectValue placeholder="Age" />
                      </SelectTrigger>
                      <SelectContent>
                        {Array.from({ length: 53 }, (_, i) => 18 + i).map((age) => (
                          <SelectItem key={age} value={String(age)}>
                            {age}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="checkout-email">Email</Label>
                  <Input
                    id="checkout-email"
                    type="email"
                    value={details.email}
                    onChange={(e) => setDetails((d) => ({ ...d, email: e.target.value }))}
                    placeholder="Email"
                    className="h-10"
                    required
                  />
                </div>
                <div className="grid gap-4 grid-cols-1 sm:grid-cols-2">
                  <div className="space-y-2 min-w-0">
                    <Label htmlFor="checkout-country">Country</Label>
                    <Select
                      value={details.phoneCountry}
                      onValueChange={(v) => setDetails((d) => ({ ...d, phoneCountry: v }))}
                    >
                      <SelectTrigger id="checkout-country" className="h-10 w-full">
                        <SelectValue placeholder="Country" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="us">US +1</SelectItem>
                        <SelectItem value="ca">Canada +1</SelectItem>
                        <SelectItem value="uk">UK +44</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2 min-w-0">
                    <Label htmlFor="checkout-phone">Phone number</Label>
                    <Input
                      id="checkout-phone"
                      type="tel"
                      value={details.phoneNumber}
                      onChange={(e) =>
                        setDetails((d) => ({ ...d, phoneNumber: formatPhoneNumber(e.target.value) }))
                      }
                      placeholder="555-555-5555"
                      className="h-10 w-full"
                      required
                    />
                  </div>
                </div>
              </div>
              <div className="mt-4 flex justify-end">
                <Button type="button" size="sm" className="min-w-[88px]" onClick={() => setStep(3)}>
                  Next
                </Button>
              </div>
            </div>
          )}
        </section>

        <div className="border-t border-zinc-200" />

        {/* Step 3: Payment method */}
        <section>
          <div
            className="flex cursor-pointer items-center justify-between gap-4 py-4"
            onClick={step !== 3 ? () => goToStep(3) : undefined}
            role={step !== 3 ? "button" : undefined}
          >
            <h2 className="text-lg font-semibold text-zinc-900">3. Payment method</h2>
          </div>
          {step === 3 && (
            <div className="pb-4">
              <p className="flex items-center gap-2 pt-1 text-sm text-muted-foreground">
                <Lock className="size-4" aria-hidden />
                Your information will be stored securely.
              </p>
              <div className="mt-4 space-y-4">
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
                    <SelectTrigger id="checkout-country-pay" className="h-10 w-full">
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
                  By providing your card information, you allow us to charge your card for future
                  payments in accordance with our terms.
                </p>
              </div>

              <Button type="submit" size="lg" className="mt-6 h-12 w-full">
                Book trip
              </Button>
            </div>
          )}
        </section>
      </form>

      <AuthModal
        open={authOpen}
        onOpenChange={setAuthOpen}
        onSuccess={() => {
          handleLoginSuccess();
          setStep(2);
        }}
      />
    </>
  );
}
