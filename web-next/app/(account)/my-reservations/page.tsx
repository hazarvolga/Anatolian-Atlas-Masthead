import type { Metadata } from "next";
import MyReservationsClient from "./MyReservationsClient";

export const metadata: Metadata = {
  title: "My Reservations",
  description: "View and manage your NextStopTurkey tour reservations.",
};

export default function MyReservationsPage() {
  return <MyReservationsClient />;
}
