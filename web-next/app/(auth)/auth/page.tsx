import type { Metadata } from "next";
import { siteConfig } from "@/config/site.config";
import AuthClient from "./AuthClient";

export const metadata: Metadata = {
  title: "Sign In",
  description: `Sign in or create an account on ${siteConfig.brand.name}.`,
  robots: { index: false, follow: false },
};

export default function AuthPage() {
  return <AuthClient />;
}
