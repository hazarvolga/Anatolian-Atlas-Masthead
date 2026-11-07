"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { ArrowLeft, ArrowUpRight, Check } from "lucide-react";
import { useVerifyPayment } from "@/hooks/usePayments";
import { api } from "@/lib/api/client";

interface BookingDetails {
  id: string;
  guest_name?: string;
  guest_email?: string;
  contact_email?: string;
  booking_date?: string;
  adults?: number;
  children?: number;
  total_price?: number | string;
  status?: string;
  tour_title?: string;
  isDemo?: boolean;
}

export default function BookingSuccessClient() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const bookingId = searchParams.get("booking_id");
  const isDemoParam = searchParams.get("demo") === "true";
  const verifyPayment = useVerifyPayment();
  const [bookingData, setBookingData] = useState<BookingDetails | null>(null);

  const fetchReservationDetails = useCallback(
    async (id: string) => {
      if (isDemoParam || id.startsWith("DEMO-")) {
        const stored =
          typeof window !== "undefined"
            ? sessionStorage.getItem(`demo_booking_${id}`)
            : null;
        if (stored) {
          try {
            const parsed = JSON.parse(stored);
            setBookingData({ ...parsed, isDemo: true });
            return;
          } catch {
            // Fall through to default demo object
          }
        }
        setBookingData({
          id,
          guest_name: "Template Demo Traveler",
          guest_email: "demo@nextstopturkey.com",
          booking_date: new Date().toISOString(),
          adults: 2,
          children: 0,
          total_price: 370,
          status: "demo_simulated",
          isDemo: true,
        });
        return;
      }

      try {
        const response = await api.get(`/api/reservations/${id}`);
        const data = response.data;

        if (data) {
          setBookingData({
            id: data.id,
            guest_name:
              [data.user?.first_name, data.user?.last_name]
                .filter(Boolean)
                .join(" ") || "Traveler",
            guest_email: data.user?.email || "",
            booking_date: data.reservationDate,
            adults: data.numAdults,
            children: data.numChildren,
            total_price: data.totalPrice,
            status: data.status,
          });
        }
      } catch {
        setBookingData({
          id,
          guest_name: "Traveler",
          guest_email: "",
          booking_date: new Date().toISOString(),
          adults: 1,
          children: 0,
          total_price: 0,
          status: "confirmed",
        });
      }
    },
    [isDemoParam]
  );

  useEffect(() => {
    if (sessionId) {
      verifyPayment.mutate(sessionId, {
        onSuccess: (data) => {
          if (data.success) {
            setBookingData(data.booking);
          }
        },
      });
    } else if (bookingId && bookingId !== "undefined") {
      fetchReservationDetails(bookingId);
    }
  }, [sessionId, bookingId, fetchReservationDetails]); // eslint-disable-line react-hooks/exhaustive-deps

  if (!sessionId && (!bookingId || bookingId === "undefined")) {
    return (
      <main className="pt-28 pb-24 bg-background min-h-screen flex items-center">
        <div className="container">
          <div className="max-w-lg mx-auto border border-border bg-card p-10 text-center space-y-4">
            <span className="editorial-kicker block">NO ACTIVE MANIFEST</span>
            <h1 className="font-serif text-3xl text-foreground">
              No Reservation Session Found
            </h1>
            <p className="text-sm text-text-secondary">
              Select a regional journey from our expedition catalogue to initiate a reservation dossier.
            </p>
            <Link href="/tours" className="btn-primary inline-flex mt-2">
              <span>Explore Expedition Catalogue</span>
              <ArrowUpRight className="ml-2 h-4 w-4" />
            </Link>
          </div>
        </div>
      </main>
    );
  }

  const isDemoBooking =
    Boolean(bookingData?.isDemo) ||
    isDemoParam ||
    Boolean(bookingId?.startsWith("DEMO-"));

  return (
    <main className="pt-24 pb-24 bg-background min-h-screen">
      <div className="container max-w-3xl">
        {isDemoBooking && (
          <div
            role="status"
            className="mb-8 border border-primary bg-card p-5 text-xs leading-relaxed"
          >
            <span className="text-[10px] uppercase tracking-[0.16em] text-primary font-semibold block mb-1">
              TEMPLATE PREVIEW MODE — SIMULATED RESERVATION MANIFEST
            </span>
            <p className="text-text-secondary">
              This confirmation demonstrates the complete NextStopTurkey booking flow using local sample data. No live payment was charged. Connect the Express/PostgreSQL backend and Stripe keys to process live reservations.
            </p>
          </div>
        )}

        {bookingData && (
          <article className="border border-border bg-card">
            {/* Dark Ink Header */}
            <div className="p-8 sm:p-10 bg-foreground text-background flex flex-col sm:flex-row sm:items-center justify-between gap-6">
              <div className="space-y-2">
                <span className="text-[10px] uppercase tracking-[0.18em] text-primary-subtle font-semibold block">
                  DISPATCH CONFIRMATION · GALATA BUREAU
                </span>
                <h1 className="font-serif text-3xl sm:text-4xl text-background">
                  {isDemoBooking
                    ? "Expedition Dossier Logged"
                    : "Reservation Confirmed"}
                </h1>
              </div>
              <div className="w-12 h-12 bg-primary text-primary-foreground flex items-center justify-center shrink-0">
                <Check className="h-6 w-6" />
              </div>
            </div>

            {/* Tabular Manifest Details */}
            <div className="p-8 sm:p-10 space-y-8">
              <dl className="divide-y divide-border border-y border-border text-xs tabular-nums">
                <div className="py-4 flex justify-between gap-4">
                  <dt className="uppercase tracking-[0.14em] text-text-secondary">
                    MANIFEST REFERENCE
                  </dt>
                  <dd className="font-mono font-semibold text-foreground">
                    {bookingData.id || "N/A"}
                  </dd>
                </div>
                {bookingData.tour_title && (
                  <div className="py-4 flex justify-between gap-4">
                    <dt className="uppercase tracking-[0.14em] text-text-secondary">
                      EXPEDITION ROUTE
                    </dt>
                    <dd className="font-serif text-base text-right text-foreground">
                      {bookingData.tour_title}
                    </dd>
                  </div>
                )}
                <div className="py-4 flex justify-between gap-4">
                  <dt className="uppercase tracking-[0.14em] text-text-secondary">
                    LEAD TRAVELER
                  </dt>
                  <dd className="font-medium text-foreground">
                    {bookingData.guest_name || "Traveler"}
                  </dd>
                </div>
                {(bookingData.guest_email || bookingData.contact_email) && (
                  <div className="py-4 flex justify-between gap-4">
                    <dt className="uppercase tracking-[0.14em] text-text-secondary">
                      DISPATCH EMAIL
                    </dt>
                    <dd className="font-medium text-foreground">
                      {bookingData.guest_email || bookingData.contact_email}
                    </dd>
                  </div>
                )}
                <div className="py-4 flex justify-between gap-4">
                  <dt className="uppercase tracking-[0.14em] text-text-secondary">
                    DEPARTURE DATE
                  </dt>
                  <dd className="font-medium text-foreground">
                    {bookingData.booking_date
                      ? new Date(bookingData.booking_date).toLocaleDateString(
                          "en-GB",
                          {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                            timeZone: "UTC",
                          }
                        )
                      : "Scheduled"}
                  </dd>
                </div>
                <div className="py-4 flex justify-between gap-4">
                  <dt className="uppercase tracking-[0.14em] text-text-secondary">
                    PARTY SIZE
                  </dt>
                  <dd className="font-medium text-foreground">
                    {bookingData.adults || 1} Adult
                    {(bookingData.adults || 1) > 1 ? "s" : ""}
                    {(bookingData.children ?? 0) > 0
                      ? `, ${bookingData.children} Child${
                          bookingData.children === 1 ? "" : "ren"
                        }`
                      : ""}
                  </dd>
                </div>
                <div className="py-4 flex justify-between items-baseline gap-4">
                  <dt className="uppercase tracking-[0.14em] font-semibold text-foreground">
                    TOTAL EXPEDITION TARIFF
                  </dt>
                  <dd className="font-serif text-3xl text-primary">
                    €{bookingData.total_price || 0}
                  </dd>
                </div>
              </dl>

              <div className="flex flex-wrap items-center justify-between gap-4">
                <Link href="/" className="btn-outline">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Return to Atlas
                </Link>
                <Link href="/tours" className="btn-primary">
                  <span>Explore More Routes</span>
                  <ArrowUpRight className="ml-2 h-4 w-4" />
                </Link>
              </div>
            </div>
          </article>
        )}
      </div>
    </main>
  );
}
