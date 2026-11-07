import type { Metadata } from "next";
import { siteConfig } from "@/config/site.config";
import MyReservationsClient from "./MyReservationsClient";

export const metadata: Metadata = {
  title: "My Reservations",
  description: `View and manage your ${siteConfig.brand.name} tour reservations.`,
  robots: { index: false, follow: false },
};

export default function MyReservationsPage() {
  return <MyReservationsClient />;
}
