import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, ArrowLeft, Download } from "lucide-react";
import { useVerifyPayment } from "@/hooks/usePayments";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function BookingSuccess() {
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const bookingId = searchParams.get('booking_id');
  const verifyPayment = useVerifyPayment();
  const [bookingData, setBookingData] = useState<any>(null);
  const [isReservationOnly, setIsReservationOnly] = useState(false);
  
  useEffect(() => {
    console.log('🔍 BookingSuccess - URL parametreleri:', { sessionId, bookingId });
    
    if (sessionId) {
      console.log('💳 Ödeme oturumu bulundu, doğrulanıyor...');
      verifyPayment.mutate(sessionId, {
        onSuccess: (data) => {
          if (data.success) {
            setBookingData(data.booking);
          }
        }
      });
    } else if (bookingId && bookingId !== 'undefined') {
      console.log('📝 Rezervasyon ID bulundu, sadece rezervasyon modu aktif');
      setIsReservationOnly(true);
      // Rezervasyon detaylarını çek
      fetchReservationDetails(bookingId);
    }
  }, [sessionId, bookingId]);
  
  const fetchReservationDetails = async (id: string) => {
    try {
      console.log('🔍 Rezervasyon detayları getiriliyor:', id);
      
      // Backend'den rezervasyon detaylarını çek
      const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001';
      const response = await axios.get(`${API_BASE_URL}/api/reservations/${id}`);
      const data = response.data;
      
      if (data) {
        console.log('✅ Rezervasyon detayları alındı:', data);
        setBookingData(data);
      } else {
        console.error('❌ Rezervasyon bulunamadı');
        // Fallback data
        setBookingData({
          id: id,
          guest_name: 'Rezervasyon Sahibi',
          guest_email: 'email@example.com',
          booking_date: new Date().toISOString(),
          adults: 1,
          children: 0,
          total_price: 0,
          status: 'confirmed'
        });
      }
    } catch (error: any) {
      console.error('❌ Rezervasyon detayları alınamadı:', error.response?.data || error.message);
      // Fallback data
      setBookingData({
        id: id,
        guest_name: 'Rezervasyon Sahibi',
        guest_email: 'email@example.com',
        booking_date: new Date().toISOString(),
        adults: 1,
        children: 0,
        total_price: 0,
        status: 'confirmed'
      });
    }
  };
  
  if (!sessionId && (!bookingId || bookingId === 'undefined')) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 flex items-center justify-center pt-20">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle className="text-center text-red-600">Invalid Session</CardTitle>
              <CardDescription className="text-center">
                No payment session found.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button onClick={() => window.location.href = "/"} className="w-full">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Home
              </Button>
            </CardContent>
          </Card>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 pt-20">
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
                      {isReservationOnly ? 'Rezervasyon Başarılı!' : 'Payment Successful!'}
                    </CardTitle>
                    <CardDescription className="text-center">
                      {isReservationOnly ? 
                        'Rezervasyonunuz başarıyla alındı. Detayları aşağıda görebilirsiniz.' :
                        'Your payment has been processed and your booking is confirmed.'
                      }
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <h3 className="font-semibold mb-3">
                          {isReservationOnly ? 'Rezervasyon Detayları' : 'Booking Details'}
                        </h3>
                        <div className="space-y-2 text-sm">
                          <p>
                            <span className="font-medium">
                              {isReservationOnly ? 'Rezervasyon ID:' : 'Booking ID:'}
                            </span>
                            <span className="text-gray-600 ml-2">
                              {bookingData.id || 'N/A'}
                            </span>
                          </p>
                          <p>
                            <span className="font-medium">
                              {isReservationOnly ? 'Misafir Adı:' : 'Guest Name:'}
                            </span>
                            <span className="text-gray-600 ml-2">
                              {bookingData.guest_name || 'N/A'}
                            </span>
                          </p>
                          <p>
                            <span className="font-medium">
                              {isReservationOnly ? 'E-posta:' : 'Email:'}
                            </span>
                            <span className="text-gray-600 ml-2">
                              {bookingData.guest_email || bookingData.contact_email || 'N/A'}
                            </span>
                          </p>
                          <p>
                            <span className="font-medium">
                              {isReservationOnly ? 'Rezervasyon Tarihi:' : 'Booking Date:'}
                            </span>
                            <span className="text-gray-600 ml-2">
                              {bookingData.booking_date ? new Date(bookingData.booking_date).toLocaleDateString() : 'N/A'}
                            </span>
                          </p>
                          <p>
                            <span className="font-medium">
                              {isReservationOnly ? 'Yetişkin Sayısı:' : 'Adults:'}
                            </span>
                            <span className="text-gray-600 ml-2">
                              {bookingData.adults || 0}
                            </span>
                          </p>
                          {bookingData.children && bookingData.children > 0 && (
                            <p>
                              <span className="font-medium">
                                {isReservationOnly ? 'Çocuk Sayısı:' : 'Children:'}
                              </span>
                              <span className="text-gray-600 ml-2">
                                {bookingData.children}
                              </span>
                            </p>
                          )}
                          <p>
                            <span className="font-medium">
                              {isReservationOnly ? 'Toplam Tutar:' : 'Total Amount:'}
                            </span>
                            <span className="text-gray-600 ml-2">
                              ${bookingData.total_price || 0}
                            </span>
                          </p>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Button onClick={() => window.location.href = "/my-reservations"} className="w-full">
                          {isReservationOnly ? 'Rezervasyonlarımı Görüntüle' : 'View My Reservations'}
                        </Button>
                        <Button onClick={() => window.location.href = "/"} variant="outline" className="w-full">
                          <ArrowLeft className="h-4 w-4 mr-2" />
                          {isReservationOnly ? 'Anasayfaya Dön' : 'Back to Home'}
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-center text-yellow-600">Rezervasyon Alındı</CardTitle>
                    <CardDescription className="text-center">
                      Ödeme yapılmadığı için bir ödeme oturumu oluşturulmadı.<br />
                      Rezervasyonunuz başarıyla kaydedildi. Detayları profilinizden veya rezervasyonlarım sayfasından görüntüleyebilirsiniz.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <Button onClick={() => window.location.href = "/my-reservations"} className="w-full">
                        Rezervasyonlarımı Görüntüle
                      </Button>
                      <Button onClick={() => window.location.href = "/"} variant="outline" className="w-full">
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
      </main>
      
      <Footer />
    </div>
  );
}
