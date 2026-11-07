import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Navigate, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { useReservations } from "@/hooks/useReservations";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function Profile() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const { data: reservations = [], isLoading } = useReservations();

  if (loading) {
    return null;
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  const toDate = (value: unknown) => {
    const date = value ? new Date(value as string | number | Date) : null;
    return date && !Number.isNaN(date.getTime()) ? date : null;
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto mt-24">
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Kullanıcı Profili</CardTitle>
              <CardDescription>Kişisel bilgileriniz ve hesap detayları</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p>
                    <span className="font-medium">Ad Soyad: </span>
                    {user.user_metadata?.full_name || user.email}
                  </p>
                  <p>
                    <span className="font-medium">Email: </span>
                    {user.email}
                  </p>
                  <p>
                    <span className="font-medium">Kullanıcı ID: </span>
                    {user.id}
                  </p>
                  <p>
                    <span className="font-medium">Oluşturulma: </span>
                    {user.created_at && format(new Date(user.created_at), "PPPP")}
                  </p>
                </div>
                <div>
                  <p>
                    <span className="font-medium">Son Giriş: </span>
                    {user.last_sign_in_at ? format(new Date(user.last_sign_in_at), "PPpp") : "Bilinmiyor"}
                  </p>
                  <p>
                    <span className="font-medium">Email Doğrulandı: </span>
                    {user.email_confirmed_at ? "Evet" : "Hayır"}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Rezervasyonlarım</CardTitle>
              <CardDescription>Tüm işlemleriniz ve geçmiş rezervasyonlar burada</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex justify-center items-center py-8">
                  <div className="animate-spin w-10 h-10 border-4 border-primary border-b-transparent rounded-full" />
                </div>
              ) : reservations.length === 0 ? (
                <div className="py-6 text-muted-foreground text-center">
                  Herhangi bir rezervasyonunuz bulunmuyor.
                  <div className="mt-3">
                    <Button onClick={() => navigate("/tours")}>Tur Seç ve Rezervasyon Yap</Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                  {reservations.map((reservation) => (
                    <Card key={reservation.id} className="border-2 border-muted">
                      <CardHeader className="pb-3 flex flex-row items-baseline justify-between">
                        <div>
                          <CardTitle className="text-lg">
                            {reservation.tour?.title || reservation.tours?.name || "Tur"}
                          </CardTitle>
                          <CardDescription>
                            {reservation.tour?.location || reservation.tours?.location || ""}
                          </CardDescription>
                        </div>
                        <Badge>
                          {reservation.status?.charAt(0).toUpperCase() + reservation.status?.slice(1)}
                        </Badge>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          <div>
                            <p><b>Rezervasyon Tarihi:</b> {toDate(reservation.reservationDate ?? reservation.booking_date) ? format(toDate(reservation.reservationDate ?? reservation.booking_date)!, "PPP") : "—"}</p>
                            <p><b>Kişi Sayısı:</b> {reservation.numAdults ?? reservation.adults ?? 0} yetişkin{(reservation.numChildren ?? reservation.children ?? 0) > 0 ? `, ${reservation.numChildren ?? reservation.children} çocuk` : ""}</p>
                            <p><b>Durum:</b> {reservation.status}</p>
                            <p><b>Oluşturulma:</b> {toDate(reservation.created_at) ? format(toDate(reservation.created_at)!, "PPP") : "—"}</p>
                          </div>
                          <div>
                            <p><b>İsim:</b> {[reservation.user?.first_name, reservation.user?.last_name].filter(Boolean).join(" ") || reservation.guest_name || user.email}</p>
                            <p><b>Email:</b> {reservation.user?.email || reservation.guest_email || user.email}</p>
                            {reservation.guest_phone && <p><b>Telefon:</b> {reservation.guest_phone}</p>}
                            <p><b>Toplam:</b> €{Number(reservation.totalPrice ?? reservation.total_price ?? 0).toFixed(2)}</p>
                          </div>
                        </div>
                        {reservation.special_requests && (
                          <div className="pt-3"><b>Özel Notlar:</b> {reservation.special_requests}</div>
                        )}
                        {/* Fatura benzeri özet */}
                        <div className="mt-5 p-4 bg-muted/60 rounded-lg text-xs">
                          <b>Fatura Detayları</b><br />
                          <span>Ödeme Toplamı: €{Number(reservation.totalPrice ?? reservation.total_price ?? 0).toFixed(2)}</span><br />
                          <span>Misafir Adı: {[reservation.user?.first_name, reservation.user?.last_name].filter(Boolean).join(" ") || reservation.guest_name || user.email}</span><br />
                          <span>Misafir Emaili: {reservation.user?.email || reservation.guest_email || user.email}</span><br />
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
}
