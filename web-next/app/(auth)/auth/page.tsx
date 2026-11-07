import type { Metadata } from "next";
import AuthClient from "./AuthClient";

export const metadata: Metadata = {
  title: "Sign In",
  description: "Sign in or create an account on NextStopTurkey.",
  robots: { index: false, follow: false },
};

export default function AuthPage() {
  return <AuthClient />;
}
