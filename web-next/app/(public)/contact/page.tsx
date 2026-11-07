import type { Metadata } from "next";
import ContactClient from "./ContactClient";

export const metadata: Metadata = {
  title: "Contact Us",
  description: "Get in touch with our team for tour questions, reservations and support.",
};

export default function ContactPage() {
  return <ContactClient />;
}
