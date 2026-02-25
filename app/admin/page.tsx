import type { Metadata } from "next";
import { AdminDashboardClient } from "@/components/admin/admin-dashboard-client";

export const metadata: Metadata = {
  title: "Admin portal – Rento",
  description: "Platform admin dashboard for Rento.",
};

export default function AdminPage() {
  return <AdminDashboardClient />;
}
