import type { Metadata } from "next";
import { SellerDashboardClient } from "@/components/dashboard/seller-dashboard-client";

export const metadata: Metadata = {
  title: "Seller dashboard – Rento",
  description: "Manage your rental listings, bookings, and payouts.",
};

export default function SellerDashboardPage() {
  return <SellerDashboardClient />;
}
