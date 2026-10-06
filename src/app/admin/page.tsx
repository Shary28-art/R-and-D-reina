import type { Metadata } from "next";
import { AdminDashboardClient } from "@/components/admin/AdminDashboardClient";

export const metadata: Metadata = {
  title: "Admin Portal | R&D by Reina",
  description: "Management dashboard for orders, Zelle payment verification, quote requests, and rental inventory.",
};

export default function AdminPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-10 md:px-6 md:py-14">
      <AdminDashboardClient />
    </div>
  );
}
