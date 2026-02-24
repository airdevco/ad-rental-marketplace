import type { Metadata } from "next";
import { OnboardingWizard } from "@/components/host/onboarding-wizard";

export const metadata: Metadata = {
  title: "List your property – Rento",
  description: "Become a host and start earning by listing your home on Rento.",
};

export default function BecomeAHostPage() {
  return <OnboardingWizard />;
}
