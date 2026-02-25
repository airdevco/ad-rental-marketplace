import type { Metadata } from "next";
import { Suspense } from "react";
import { AdminDashboardClient } from "@/components/admin/admin-dashboard-client";

export const metadata: Metadata = {
  title: "Admin portal – Rento",
  description: "Platform admin dashboard for Rento.",
};

export default function AdminPage() {
  return (
    <Suspense fallback={<div className="flex h-[calc(100vh-4rem)] items-center justify-center bg-white"><div className="text-sm text-muted-foreground">Loading…</div></div>}>
      <AdminDashboardClient />
    </Suspense>
  );
}
