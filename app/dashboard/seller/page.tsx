import type { Metadata } from "next";
import { Suspense } from "react";
import { SellerDashboardClient } from "@/components/dashboard/seller-dashboard-client";

export const metadata: Metadata = {
  title: "Seller dashboard – Rento",
  description: "Manage your rental listings, bookings, and payouts.",
};

function DashboardFallback() {
  return (
    <div className="flex min-h-[50vh] items-center justify-center">
      <div className="text-sm text-zinc-500">Loading…</div>
    </div>
  );
}

export default function SellerDashboardPage() {
  return (
    <div className="-mt-16">
      <Suspense fallback={<DashboardFallback />}>
        <SellerDashboardClient />
      </Suspense>
    </div>
  );
}
