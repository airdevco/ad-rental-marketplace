import { Suspense } from "react";
import { BuyerDashboardClient } from "@/components/dashboard/buyer-dashboard-client";

export const metadata = {
  title: "My dashboard",
  description: "Manage your reservations, profile, and wishlists",
};

export default function BuyerDashboardPage() {
  return (
    <Suspense>
      <BuyerDashboardClient />
    </Suspense>
  );
}
