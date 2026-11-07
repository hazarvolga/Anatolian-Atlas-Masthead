"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CheckCircle, ArrowLeft, Info } from "lucide-react";
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
  const router = useRouter();
  const sessionId = searchParams.get("session_id");
  const bookingId = searchParams.get("booking_id");
  const isDemoParam = searchParams.get("demo") === "true";
  const verifyPayment = useVerifyPayment();
  const [bookingData, setBookingData] = useState<BookingDetails | null>(null);
  const [isReservationOnly, setIsReservationOnly] = useState(false);

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
                .join(" ") || "N/A",
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
      setIsReservationOnly(true);
      fetchReservationDetails(bookingId);
    }
  }, [sessionId, bookingId, fetchReservationDetails]); // eslint-disable-line react-hooks/exhaustive-deps

  if (!sessionId && (!bookingId || bookingId === "undefined")) {
    return (
      <div className="flex-1 flex items-center justify-center pt-28 py-16">
        <Card className="w-full max-w-md border-border">
          <CardHeader>
            <CardTitle className="text-center font-serif text-2xl">
              No Booking Session Found
            </CardTitle>
            <CardDescription className="text-center">
              Please select a journey from the tours catalog to begin a reservation.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => router.push("/tours")} className="w-full">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Explore Tours
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const isDemoBooking =
    Boolean(bookingData?.isDemo) ||
    isDemoParam ||
    Boolean(bookingId?.startsWith("DEMO-"));

  return (
    <div className="pt-28 pb-20">
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto space-y-6">
            {isDemoBooking && (
              <div
                role="status"
                className="flex items-start gap-3 rounded-lg border border-primary/30 bg-primary/5 p-4 text-sm text-foreground"
              >
                <Info className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-foreground">
                    Template Demo Mode — Simulated Reservation
                  </p>
                  <p className="text-muted-foreground mt-1">
                    This confirmation demonstrates the end-to-end NextStopTurkey
                    booking flow using local sample data. No live payment was
                    charged. Connect the Express/PostgreSQL backend and Stripe
                    keys to process live reservations.
                  </p>
                </div>
              </div>
            )}

            {bookingData ? (
              <Card className="border-border">
                <CardHeader>
                  <div className="flex items-center justify-center mb-4">
                    <CheckCircle className="h-14 w-14 text-success" />
                  </div>
                  <CardTitle className="text-center font-serif text-3xl">
                    {isDemoBooking
                      ? "Demo Reservation Complete"
                      : isReservationOnly
                        ? "Reservation Confirmed"
                        : "Payment & Booking Confirmed"}
                  </CardTitle>
                  <CardDescription className="text-center">
                    {isDemoBooking
                      ? "Your sample itinerary request has been recorded in this browser session."
                      : "Your reservation details are summarized below."}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="bg-muted/40 p-6 rounded-lg border border-border/60">
                      <h3 className="font-serif text-lg font-semibold mb-4">
                        Booking Summary
                      </h3>
                      <dl className="space-y-2.5 text-sm">
                        <div className="flex justify-between gap-4">
                          <dt className="text-muted-foreground">Reference ID</dt>
                          <dd className="font-mono font-medium text-foreground">
                            {bookingData.id || "N/A"}
                          </dd>
                        </div>
                        {bookingData.tour_title && (
                          <div className="flex justify-between gap-4">
                            <dt className="text-muted-foreground">Journey</dt>
                            <dd className="font-medium text-right text-foreground">
                              {bookingData.tour_title}
                            </dd>
                          </div>
                        )}
                        <div className="flex justify-between gap-4">
                          <dt className="text-muted-foreground">Lead Traveler</dt>
                          <dd className="font-medium text-foreground">
                            {bookingData.guest_name || "N/A"}
                          </dd>
                        </div>
                        {(bookingData.guest_email ||
                          bookingData.contact_email) && (
                          <div className="flex justify-between gap-4">
                            <dt className="text-muted-foreground">Email</dt>
                            <dd className="font-medium text-foreground">
                              {bookingData.guest_email ||
                                bookingData.contact_email}
                            </dd>
                          </div>
                        )}
                        <div className="flex justify-between gap-4">
                          <dt className="text-muted-foreground">
                            Departure Date
                          </dt>
                          <dd className="font-medium text-foreground tabular-nums">
                            {bookingData.booking_date
                              ? new Date(
                                  bookingData.booking_date
                                ).toLocaleDateString("en-GB", {
                                  day: "2-digit",
                                  month: "short",
                                  year: "numeric",
                                  timeZone: "UTC",
                                })
                              : "N/A"}
                          </dd>
                        </div>
                        <div className="flex justify-between gap-4">
                          <dt className="text-muted-foreground">Travelers</dt>
                          <dd className="font-medium text-foreground tabular-nums">
                            {bookingData.adults || 1} Adult
                            {(bookingData.adults || 1) > 1 ? "s" : ""}
                            {(bookingData.children ?? 0) > 0
                              ? `, ${bookingData.children} Child${bookingData.children === 1 ? "" : "ren"}`
                              : ""}
                          </dd>
                        </div>
                        <div className="flex justify-between gap-4 pt-3 border-t border-border">
                          <dt className="font-semibold text-foreground">
                            Total Amount
                          </dt>
                          <dd className="font-serif text-lg font-semibold text-primary tabular-nums">
                            €{bookingData.total_price || 0}
                          </dd>
                        </div>
                      </dl>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <Button
                        onClick={() => router.push("/tours")}
                        className="w-full"
                      >
                        Explore More Journeys
                      </Button>
                      <Button
                        onClick={() => router.push("/")}
                        variant="outline"
                        className="w-full"
                      >
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Return to Atlas
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ) : null}
          </div>
        </div>
      </section>
    </div>
  );
}
