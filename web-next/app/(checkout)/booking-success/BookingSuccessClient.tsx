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
import { CheckCircle, ArrowLeft } from "lucide-react";
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
}

export default function BookingSuccessClient() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const sessionId = searchParams.get("session_id");
  const bookingId = searchParams.get("booking_id");
  const verifyPayment = useVerifyPayment();
  const [bookingData, setBookingData] = useState<BookingDetails | null>(null);
  const [isReservationOnly, setIsReservationOnly] = useState(false);

  const fetchReservationDetails = useCallback(async (id: string) => {
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
        guest_name: "Rezervasyon Sahibi",
        guest_email: "",
        booking_date: new Date().toISOString(),
        adults: 1,
        children: 0,
        total_price: 0,
        status: "confirmed",
      });
    }
  }, []);

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
      <div className="flex-1 flex items-center justify-center pt-20 py-16">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-center text-red-600">
              Invalid Session
            </CardTitle>
            <CardDescription className="text-center">
              No payment session found.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => router.push("/")} className="w-full">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Home
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="pt-20">
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto">
            {bookingData ? (
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-center mb-4">
                    <CheckCircle className="h-16 w-16 text-green-500" />
                  </div>
                  <CardTitle className="text-center text-2xl">
                    {isReservationOnly
                      ? "Rezervasyon Başarılı!"
                      : "Payment Successful!"}
                  </CardTitle>
                  <CardDescription className="text-center">
                    {isReservationOnly
                      ? "Rezervasyonunuz başarıyla alındı. Detayları aşağıda görebilirsiniz."
                      : "Your payment has been processed and your booking is confirmed."}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="bg-muted/40 p-4 rounded-lg">
                      <h3 className="font-semibold mb-3">
                        {isReservationOnly
                          ? "Rezervasyon Detayları"
                          : "Booking Details"}
                      </h3>
                      <div className="space-y-2 text-sm">
                        <p>
                          <span className="font-medium">
                            {isReservationOnly
                              ? "Rezervasyon ID:"
                              : "Booking ID:"}
                          </span>
                          <span className="text-muted-foreground ml-2">
                            {bookingData.id || "N/A"}
                          </span>
                        </p>
                        <p>
                          <span className="font-medium">
                            {isReservationOnly ? "Misafir Adı:" : "Guest Name:"}
                          </span>
                          <span className="text-muted-foreground ml-2">
                            {bookingData.guest_name || "N/A"}
                          </span>
                        </p>
                        <p>
                          <span className="font-medium">
                            {isReservationOnly ? "E-posta:" : "Email:"}
                          </span>
                          <span className="text-muted-foreground ml-2">
                            {bookingData.guest_email ||
                              bookingData.contact_email ||
                              "N/A"}
                          </span>
                        </p>
                        <p>
                          <span className="font-medium">
                            {isReservationOnly
                              ? "Rezervasyon Tarihi:"
                              : "Booking Date:"}
                          </span>
                          <span className="text-muted-foreground ml-2">
                            {bookingData.booking_date
                              ? new Date(
                                  bookingData.booking_date
                                ).toLocaleDateString(undefined, {
                                  timeZone: "UTC",
                                })
                              : "N/A"}
                          </span>
                        </p>
                        <p>
                          <span className="font-medium">
                            {isReservationOnly
                              ? "Yetişkin Sayısı:"
                              : "Adults:"}
                          </span>
                          <span className="text-muted-foreground ml-2">
                            {bookingData.adults || 0}
                          </span>
                        </p>
                        {(bookingData.children ?? 0) > 0 && (
                          <p>
                            <span className="font-medium">
                              {isReservationOnly
                                ? "Çocuk Sayısı:"
                                : "Children:"}
                            </span>
                            <span className="text-muted-foreground ml-2">
                              {bookingData.children}
                            </span>
                          </p>
                        )}
                        <p>
                          <span className="font-medium">
                            {isReservationOnly
                              ? "Toplam Tutar:"
                              : "Total Amount:"}
                          </span>
                          <span className="text-muted-foreground ml-2">
                            €{bookingData.total_price || 0}
                          </span>
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Button
                        onClick={() => router.push("/my-reservations")}
                        className="w-full"
                      >
                        {isReservationOnly
                          ? "Rezervasyonlarımı Görüntüle"
                          : "View My Reservations"}
                      </Button>
                      <Button
                        onClick={() => router.push("/")}
                        variant="outline"
                        className="w-full"
                      >
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        {isReservationOnly ? "Anasayfaya Dön" : "Back to Home"}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardHeader>
                  <CardTitle className="text-center text-yellow-600">
                    Rezervasyon Alındı
                  </CardTitle>
                  <CardDescription className="text-center">
                    Ödeme yapılmadığı için bir ödeme oturumu oluşturulmadı.
                    <br />
                    Rezervasyonunuz başarıyla kaydedildi. Detayları profilinizden
                    veya rezervasyonlarım sayfasından görüntüleyebilirsiniz.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <Button
                      onClick={() => router.push("/my-reservations")}
                      className="w-full"
                    >
                      Rezervasyonlarımı Görüntüle
                    </Button>
                    <Button
                      onClick={() => router.push("/")}
                      variant="outline"
                      className="w-full"
                    >
                      <ArrowLeft className="h-4 w-4 mr-2" />
                      Anasayfaya Dön
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
