import { Suspense } from "react";
import type { Metadata } from "next";
import EmailConfirmationClient from "./EmailConfirmationClient";

export const metadata: Metadata = {
  title: "Email Confirmation",
  description: "Confirm your email subscription.",
  robots: { index: false, follow: false },
};

export default function EmailConfirmationPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      }
    >
      <EmailConfirmationClient />
    </Suspense>
  );
}
