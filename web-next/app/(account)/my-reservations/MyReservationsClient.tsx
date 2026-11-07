"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowUpRight } from "lucide-react";
import { format } from "date-fns";
import {
  useReservations,
  useUpdateReservationStatus,
} from "@/hooks/useReservations";
import { useAuth } from "@/contexts/AuthContext";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { useUserReviews } from "@/hooks/useReviews";
import ReviewForm from "@/components/reviews/ReviewForm";

export default function MyReservationsClient() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const { data: reservations = [], isLoading } = useReservations();
  const { data: userReviews = [] } = useUserReviews();
  const updateReservationStatus = useUpdateReservationStatus();
  const [reviewDialogOpen, setReviewDialogOpen] = useState<string | null>(null);

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/auth");
    }
  }, [loading, user, router]);

  if (loading || !user) {
    return null;
  }

  const getReservationDate = (reservation: {
    reservationDate?: string | Date | null;
    booking_date?: string | Date | null;
  }) => {
    const value = reservation.reservationDate ?? reservation.booking_date;
    const date = value ? new Date(value) : null;
    return date && !Number.isNaN(date.getTime()) ? date : null;
  };

  const formatReservationDate = (reservation: {
    reservationDate?: string | Date | null;
    booking_date?: string | Date | null;
  }) => {
    const date = getReservationDate(reservation);
    return date ? format(date, "PPP") : "—";
  };

  const handleCancelReservation = async (reservationId: string) => {
    if (confirm("Are you sure you want to cancel this reservation?")) {
      await updateReservationStatus.mutateAsync({
        reservationId,
        status: "cancelled",
      });
    }
  };

  const hasReviewForTour = (tourId?: string) => {
    if (!tourId) return false;
    return userReviews.some(
      (review: { tourId?: string; tour_id?: string }) =>
        (review.tourId ?? review.tour_id) === tourId
    );
  };

  return (
    <main className="pt-20 pb-24 bg-background min-h-screen">
      {/* Header */}
      <section className="py-12 md:py-16 bg-card border-b border-border">
        <div className="container">
          <span className="editorial-kicker block">
            TRAVELER EXPEDITION LEDGER
          </span>
          <h1 className="font-serif text-4xl sm:text-5xl text-foreground mt-2">
            My Reservations & Dispatches
          </h1>
        </div>
      </section>

      <section className="py-12 md:py-16">
        <div className="container">
          {isLoading ? (
            <div className="h-64 border border-border bg-muted/40 animate-pulse" />
          ) : reservations.length === 0 ? (
            <div className="border border-border bg-card p-12 text-center space-y-4 max-w-2xl mx-auto">
              <span className="editorial-kicker block">EMPTY MANIFEST</span>
              <h2 className="font-serif text-3xl text-foreground">
                No Scheduled Reservations Found
              </h2>
              <p className="text-sm text-text-secondary max-w-md mx-auto">
                Browse our six regional monographs and scheduled departures to reserve your place on an upcoming route.
              </p>
              <Link href="/tours" className="btn-primary inline-flex mt-2">
                <span>Browse Expedition Catalogue</span>
                <ArrowUpRight className="ml-2 h-4 w-4" />
              </Link>
            </div>
          ) : (
            <div className="space-y-6">
              {reservations.map((reservation, idx) => {
                const tourId = reservation.tourId || reservation.tour_id || "";
                const numChildren =
                  reservation.numChildren ?? reservation.children ?? 0;

                return (
                  <article
                    key={reservation.id}
                    className="border border-border bg-card"
                  >
                    <div className="px-6 py-4 border-b border-border bg-background/60 flex flex-wrap items-center justify-between gap-4">
                      <div className="flex items-baseline gap-3">
                        <span className="text-xs font-semibold uppercase tracking-[0.16em] text-primary tabular-nums">
                          0{idx + 1} /
                        </span>
                        <h3 className="font-serif text-2xl text-foreground">
                          {reservation.tour?.title ||
                            reservation.tours?.name ||
                            "Anatolian Field Route"}
                        </h3>
                      </div>

                      <span className="px-3 py-1 bg-foreground text-background text-[11px] uppercase tracking-[0.15em] font-semibold">
                        {reservation.status || "Confirmed"}
                      </span>
                    </div>

                    <div className="p-6 grid grid-cols-1 md:grid-cols-4 gap-6 text-xs tabular-nums">
                      <div>
                        <span className="block text-[10px] uppercase tracking-[0.14em] text-text-secondary">
                          DEPARTURE DATE
                        </span>
                        <span className="font-medium text-foreground mt-1 block">
                          {formatReservationDate(reservation)}
                        </span>
                      </div>

                      <div>
                        <span className="block text-[10px] uppercase tracking-[0.14em] text-text-secondary">
                          PARTY SIZE
                        </span>
                        <span className="font-medium text-foreground mt-1 block">
                          {reservation.numAdults ?? reservation.adults ?? 1}{" "}
                          Adult(s)
                          {numChildren > 0 && `, ${numChildren} Child(ren)`}
                        </span>
                      </div>

                      <div>
                        <span className="block text-[10px] uppercase tracking-[0.14em] text-text-secondary">
                          LEAD TRAVELER
                        </span>
                        <span className="font-medium text-foreground mt-1 block">
                          {[
                            reservation.user?.first_name,
                            reservation.user?.last_name,
                          ]
                            .filter(Boolean)
                            .join(" ") ||
                            reservation.guest_name ||
                            user.email}
                        </span>
                      </div>

                      <div>
                        <span className="block text-[10px] uppercase tracking-[0.14em] text-text-secondary">
                          TOTAL TARIFF
                        </span>
                        <span className="font-serif text-2xl text-primary mt-0.5 block">
                          €
                          {Number(
                            reservation.totalPrice ??
                              reservation.total_price ??
                              0
                          ).toFixed(2)}
                        </span>
                      </div>
                    </div>

                    <div className="px-6 py-4 border-t border-border bg-background/40 flex flex-wrap items-center justify-between gap-4">
                      <span className="text-xs text-text-secondary tabular-nums">
                        Logged:{" "}
                        {formatReservationDate({
                          booking_date: reservation.created_at,
                        })}
                      </span>

                      <div className="flex flex-wrap items-center gap-3">
                        {(reservation.status === "pending" ||
                          reservation.status === "confirmed") && (
                          <button
                            type="button"
                            onClick={() =>
                              handleCancelReservation(reservation.id)
                            }
                            disabled={updateReservationStatus.isPending}
                            className="px-4 py-2 border border-destructive text-destructive hover:bg-destructive hover:text-destructive-foreground text-xs uppercase tracking-[0.14em] font-semibold transition-colors"
                          >
                            Cancel Reservation
                          </button>
                        )}

                        {reservation.status === "completed" &&
                          tourId &&
                          !hasReviewForTour(tourId) && (
                            <Dialog
                              open={reviewDialogOpen === reservation.id}
                              onOpenChange={(open) =>
                                setReviewDialogOpen(open ? reservation.id : null)
                              }
                            >
                              <DialogTrigger asChild>
                                <button
                                  type="button"
                                  className="btn-outline py-2 px-4"
                                >
                                  Submit Field Note
                                </button>
                              </DialogTrigger>
                              <DialogContent className="max-w-2xl rounded-none">
                                <ReviewForm
                                  tourId={tourId}
                                  bookingId={reservation.id}
                                  onSuccess={() => setReviewDialogOpen(null)}
                                />
                              </DialogContent>
                            </Dialog>
                          )}

                        {reservation.status === "completed" &&
                          hasReviewForTour(tourId) && (
                            <span className="text-xs uppercase tracking-[0.14em] text-primary font-semibold">
                              Field Note Logged
                            </span>
                          )}
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
