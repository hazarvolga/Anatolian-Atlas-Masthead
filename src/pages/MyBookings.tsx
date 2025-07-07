import { useState } from "react";
import { useReservations, useUpdateReservationStatus } from "@/hooks/useReservations";
import { useAuth } from "@/contexts/AuthContext";
import { Navigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { useUserReviews } from "@/hooks/useReviews";
import { format } from "date-fns";
import { Star } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ReviewForm from "@/components/reviews/ReviewForm";

export default function MyReservations() {
  const { user } = useAuth();
  const { data: reservations = [], isLoading } = useReservations();
  const { data: userReviews = [] } = useUserReviews();
  const updateReservationStatus = useUpdateReservationStatus();
  const [reviewDialogOpen, setReviewDialogOpen] = useState<string | null>(null);
  
  if (!user) {
    return <Navigate to="/auth" replace />;
  }
  
  const handleCancelReservation = async (reservationId: string) => {
    if (confirm('Are you sure you want to cancel this reservation?')) {
      await updateReservationStatus.mutateAsync({ reservationId, status: 'cancelled' });
    }
  };
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      case 'completed': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };
  
  const hasReviewForTour = (tourId: string) => {
    return userReviews.some(review => review.tour_id === tourId);
  };
  
  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 container mx-auto px-4 py-8">
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-lg">Loading your reservations...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 container mx-auto px-4 py-8">
        <Card>
          <CardHeader>
            <CardTitle>My Reservations</CardTitle>
            <CardDescription>
              View and manage your tour reservations
            </CardDescription>
          </CardHeader>
          <CardContent>
            {reservations.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-lg text-muted-foreground mb-4">You don't have any reservations yet.</p>
                <Button onClick={() => window.location.href = '/tours'}>
                  Browse Tours
                </Button>
              </div>
            ) : (
              <div className="space-y-6">
                {reservations.map((reservation) => (
                  <div key={reservation.id} className="p-6 border rounded-lg">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-medium text-lg">{reservation.tours?.name || 'Tour'}</h3>
                          <Badge className={getStatusColor(reservation.status)}>
                            {reservation.status?.charAt(0).toUpperCase() + reservation.status?.slice(1)}
                          </Badge>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                          <div>
                            <p><strong>Date:</strong> {format(new Date(reservation.booking_date), "PPP")}</p>
                            <p><strong>Guests:</strong> {reservation.adults} adults{reservation.children > 0 && `, ${reservation.children} children`}</p>
                            <p><strong>Total:</strong> ₺{Number(reservation.total_price).toFixed(2)}</p>
                          </div>
                          <div>
                            <p><strong>Guest Name:</strong> {reservation.guest_name}</p>
                            <p><strong>Email:</strong> {reservation.guest_email}</p>
                            {reservation.guest_phone && (
                              <p><strong>Phone:</strong> {reservation.guest_phone}</p>
                            )}
                          </div>
                        </div>
                        
                        {reservation.special_requests && (
                          <div className="mt-3">
                            <p className="text-sm"><strong>Special Requests:</strong> {reservation.special_requests}</p>
                          </div>
                        )}
                        
                        <p className="text-xs text-muted-foreground mt-3">
                          Booked: {format(new Date(reservation.created_at), "PPP")}
                        </p>
                      </div>
                      
                      <div className="flex flex-col gap-2 ml-4">
                        {(reservation.status === 'pending' || reservation.status === 'confirmed') && (
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleCancelReservation(reservation.id)}
                            disabled={updateReservationStatus.isPending}
                          >
                            Cancel Reservation
                          </Button>
                        )}
                        
                        {reservation.status === 'completed' && !hasReviewForTour(reservation.tour_id) && (
                          <Dialog 
                            open={reviewDialogOpen === reservation.id} 
                            onOpenChange={(open) => setReviewDialogOpen(open ? reservation.id : null)}
                          >
                            <DialogTrigger asChild>
                              <Button variant="outline" size="sm">
                                <Star className="h-4 w-4 mr-2" />
                                Write Review
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-2xl">
                              <ReviewForm
                                tourId={reservation.tour_id}
                                bookingId={reservation.id}
                                onSuccess={() => setReviewDialogOpen(null)}
                              />
                            </DialogContent>
                          </Dialog>
                        )}
                        
                        {reservation.status === 'completed' && hasReviewForTour(reservation.tour_id) && (
                          <Badge variant="secondary" className="text-xs">
                            Review Submitted
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
  );
}
