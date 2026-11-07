import type { Metadata } from "next";
import GalleryClient from "./GalleryClient";

export const metadata: Metadata = {
  title: "Gallery",
  description: "Browse photos from our destinations, tours and experiences.",
};

export default function GalleryPage() {
  return <GalleryClient />;
}
