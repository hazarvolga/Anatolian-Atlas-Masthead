import type { Metadata } from "next";
import DestinationsClient from "./DestinationsClient";

export const metadata: Metadata = {
  title: "Destinations",
  description:
    "Discover breathtaking locations across Turkey and plan your perfect adventure.",
};

export default function DestinationsPage() {
  return <DestinationsClient />;
}
