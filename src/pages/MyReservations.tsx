import { useState } from "react";
import { useReservations, useUpdateReservationStatus } from "@/hooks/useReservations";
import { useAuth } from "@/contexts/AuthContext";
import { Navigate } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { useUserReviews } from "@/hooks/useReviews";
import { format } from "date-fns";
import { Star } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ReviewForm from "@/components/reviews/ReviewForm";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export default function MyReservations() {
  const { user, loading } = useAuth();
  const { data: reservations = [], isLoading } = useReservations();
  const { data: userReviews = [] } = useUserReviews();
  const updateReservationStatus = useUpdateReservationStatus();
  const [reviewDialogOpen, setReviewDialogOpen] = useState<string | null>(null);

  if (loading) {
    return null;
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  const getReservationDate = (reservation: { reservationDate?: string | Date | null; booking_date?: string | Date | null }) => {
    const value = reservation.reservationDate ?? reservation.booking_date;
    const date = value ? new Date(value) : null;
    return date && !Number.isNaN(date.getTime()) ? date : null;
  };
  
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
          <h1 className="text-3xl font-bold mb-6">My Reservations</h1>
          <p className="text-lg text-muted-foreground mb-8">View and manage your tour reservations</p>
          
          {isLoading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-lg">Loading your reservations...</p>
            </div>
          ) : reservations.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-lg text-muted-foreground mb-4">You don't have any reservations yet.</p>
              <Button onClick={() => window.location.href = '/tours'}>
                Browse Tours
              </Button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Tour Name</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Guests</TableHead>
                    <TableHead>Total</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {reservations.map((reservation) => (
                    <TableRow key={reservation.id}>
                      <TableCell className="font-medium">{reservation.tour?.title || reservation.tours?.name || 'Tour'}</TableCell>
                      <TableCell>{getReservationDate(reservation) ? format(getReservationDate(reservation)!, "PPP") : '—'}</TableCell>
                      <TableCell>{reservation.numAdults ?? reservation.adults ?? 0} adults{(reservation.numChildren ?? reservation.children ?? 0) > 0 && `, ${reservation.numChildren ?? reservation.children} children`}</TableCell>
                      <TableCell>₺{Number(reservation.totalPrice ?? reservation.total_price ?? 0).toFixed(2)}</TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(reservation.status)}>
                          {reservation.status?.charAt(0).toUpperCase() + reservation.status?.slice(1)}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right space-x-2">
                        <Button
                          size="sm"
                          variant="destructive"
                          disabled={updateReservationStatus.isPending}
                          onClick={() => handleCancelReservation(reservation.id)}
                        >
                          Cancel
                        </Button>
                        {!hasReviewForTour(reservation.tour?.id || reservation.tours?.id) && reservation.status === 'completed' && (
                          <Dialog open={reviewDialogOpen === reservation.id} onOpenChange={(isOpen) => setReviewDialogOpen(isOpen ? reservation.id : null)}>
                            <DialogTrigger asChild>
                              <Button size="sm" variant="outline">
                                <Star className="h-4 w-4 mr-2" /> Review
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-[425px]">
                              <ReviewForm tourId={reservation.tour?.id || reservation.tours?.id} onReviewSubmitted={() => setReviewDialogOpen(null)} />
                            </DialogContent>
                          </Dialog>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </main>
        <Footer />
      </div>
    );
  }
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">My Reservations</h1>
        <p className="text-lg text-muted-foreground mb-8">View and manage your tour reservations</p>
  
        {isLoading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-lg">Loading your reservations...</p>
          </div>
        ) : reservations.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-lg text-muted-foreground mb-4">You don't have any reservations yet.</p>
            <Button onClick={() => window.location.href = '/tours'}>
              Browse Tours
            </Button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Tour Name</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Guests</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {reservations.map((reservation) => (
                  <TableRow key={reservation.id}>
                    <TableCell className="font-medium">{reservation.tour?.title || reservation.tours?.name || 'Tour'}</TableCell>
                    <TableCell>{getReservationDate(reservation) ? format(getReservationDate(reservation)!, "PPP") : '—'}</TableCell>
                    <TableCell>{reservation.numAdults ?? reservation.adults ?? 0} adults{(reservation.numChildren ?? reservation.children ?? 0) > 0 && `, ${reservation.numChildren ?? reservation.children} children`}</TableCell>
                    <TableCell>₺{Number(reservation.totalPrice ?? reservation.total_price ?? 0).toFixed(2)}</TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(reservation.status)}>
                        {reservation.status?.charAt(0).toUpperCase() + reservation.status?.slice(1)}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right space-x-2">
                      <Button
                        size="sm"
                        variant="destructive"
                        disabled={updateReservationStatus.isPending}
                        onClick={() => handleCancelReservation(reservation.id)}
                      >
                        Cancel
                      </Button>
                      {!hasReviewForTour(reservation.tour?.id || reservation.tours?.id) && reservation.status === 'completed' && (
                        <Dialog open={reviewDialogOpen === reservation.id} onOpenChange={(isOpen) => setReviewDialogOpen(isOpen ? reservation.id : null)}>
                          <DialogTrigger asChild>
                            <Button size="sm" variant="outline">
                              <Star className="h-4 w-4 mr-2" /> Review
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="sm:max-w-[425px]">
                            <ReviewForm tourId={reservation.tours?.id} onReviewSubmitted={() => setReviewDialogOpen(null)} />
                          </DialogContent>
                        </Dialog>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
