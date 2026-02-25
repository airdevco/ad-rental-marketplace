import type { Metadata } from "next";
import { Suspense } from "react";
import { OnboardingWizard } from "@/components/host/onboarding-wizard";

export const metadata: Metadata = {
  title: "List your property – Rento",
  description: "Become a host and start earning by listing your home on Rento.",
};

export default function BecomeAHostPage() {
  return (
    <Suspense fallback={<div className="flex min-h-screen items-center justify-center"><div className="text-sm text-zinc-500">Loading…</div></div>}>
      <OnboardingWizard />
    </Suspense>
  );
}
