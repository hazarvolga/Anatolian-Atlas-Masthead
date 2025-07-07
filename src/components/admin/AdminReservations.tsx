import { useAdminReservations } from "@/hooks/useAdminReservations";
import { useUpdateReservationStatus } from "@/hooks/useReservations";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export default function AdminReservations() {
  const { data: reservations = [], isLoading, error } = useAdminReservations();
  const updateReservationStatus = useUpdateReservationStatus();

  console.log('🔍 AdminReservations render:', { reservations, isLoading, error });

  if (isLoading) {
    return <div className="p-8 text-center">Loading reservations...</div>;
  }

  if (error) {
    console.error('❌ Error in AdminReservations:', error);
    return (
      <Card>
        <CardHeader>
          <CardTitle>Reservations</CardTitle>
          <CardDescription>Error loading reservations</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-red-500">
            <p>Error loading reservations: {error.message}</p>
            <p className="text-sm text-muted-foreground mt-2">Check browser console for details</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Reservations</CardTitle>
        <CardDescription>All reservations in the system</CardDescription>
      </CardHeader>
      <CardContent>
        {reservations.length === 0 ? (
          <p className="text-center py-8 text-muted-foreground">No reservations found.</p>
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
                  <TableHead>Guest Info</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {reservations.map((reservation) => {
                  const guest = reservation.guest_details || {};
                  return (
                    <TableRow key={reservation.id}>
                      <TableCell className="font-medium">
                        {reservation.tours?.name || 'Tour'}
                        <div className="text-sm text-muted-foreground">{reservation.tours?.location || ''}</div>
                      </TableCell>
                      <TableCell>
                        {format(new Date(reservation.booking_date), "PPP")}
                        <div className="text-xs text-muted-foreground">Created: {format(new Date(reservation.created_at), "PPP p")}</div>
                      </TableCell>
                      <TableCell>{reservation.adults} adults / {reservation.children} children</TableCell>
                      <TableCell>₺{Number(reservation.total_price).toFixed(2)}</TableCell>
                      <TableCell>
                        <Badge>{reservation.status}</Badge>
                      </TableCell>
                      <TableCell>
                        <div>{guest.name || "-"}</div>
                        <div className="text-sm text-muted-foreground">{guest.email || reservation.contact_email || "-"}</div>
                        <div className="text-sm text-muted-foreground">{guest.phone || reservation.contact_phone || "-"}</div>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          size="sm"
                          variant="destructive"
                          disabled={updateReservationStatus.isPending}
                          onClick={() => updateReservationStatus.mutateAsync({ reservationId: reservation.id, status: 'cancelled' })}
                        >
                          Cancel
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
