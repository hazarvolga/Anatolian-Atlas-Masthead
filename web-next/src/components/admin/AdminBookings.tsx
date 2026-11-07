"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useAdminReservations } from "@/hooks/useAdminReservations";
import { useUpdateReservationStatus } from "@/hooks/useReservations";
import { format } from "date-fns";

export default function AdminReservations() {
  const { data: reservations = [], isLoading } = useAdminReservations();
  const updateReservationStatus = useUpdateReservationStatus();
  
  const handleStatusChange = async (reservationId: string, status: string) => {
    await updateReservationStatus.mutateAsync({ reservationId, status });
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
  
  if (isLoading) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto mb-4"></div>
        <p className="text-lg">Loading reservations...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>All Reservations</CardTitle>
          <CardDescription>
            Complete list of all reservations in the system ({reservations.length} total reservations)
          </CardDescription>
        </CardHeader>
        <CardContent>
          {reservations.length === 0 ? (
            <p className="text-center py-8 text-muted-foreground">No reservations found.</p>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Tour</TableHead>
                    <TableHead>Guest Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Phone</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Guests</TableHead>
                    <TableHead>Total Price</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead>Special Requests</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {reservations.map((reservation) => (
                    <TableRow key={reservation.id}>
                      <TableCell className="font-mono text-xs">
                        {reservation.id.slice(0, 8)}...
                      </TableCell>
                      <TableCell className="font-medium">
                        {reservation.tours?.name || 'Tour'}
                      </TableCell>
                      <TableCell>{reservation.guest_name}</TableCell>
                      <TableCell className="text-sm">{reservation.guest_email}</TableCell>
                      <TableCell>{reservation.guest_phone || 'N/A'}</TableCell>
                      <TableCell>
                        {format(new Date(reservation.booking_date), "MMM dd, yyyy")}
                      </TableCell>
                      <TableCell>
                        {reservation.adults}A{reservation.children > 0 && `, ${reservation.children}C`}
                      </TableCell>
                      <TableCell className="font-medium">
                        ${Number(reservation.total_price).toFixed(2)}
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(reservation.status)}>
                          {reservation.status?.charAt(0).toUpperCase() + reservation.status?.slice(1)}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm">
                        {format(new Date(reservation.created_at), "MMM dd, yyyy")}
                      </TableCell>
                      <TableCell className="max-w-xs">
                        <div className="truncate text-sm" title={reservation.special_requests || ''}>
                          {reservation.special_requests || 'None'}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col gap-1">
                          {reservation.status === 'pending' && (
                            <>
                              <Button
                                size="sm"
                                className="text-xs px-2 py-1 h-auto"
                                onClick={() => handleStatusChange(reservation.id, 'confirmed')}
                                disabled={updateReservationStatus.isPending}
                              >
                                Confirm
                              </Button>
                              <Button
                                size="sm"
                                variant="destructive"
                                className="text-xs px-2 py-1 h-auto"
                                onClick={() => handleStatusChange(reservation.id, 'cancelled')}
                                disabled={updateReservationStatus.isPending}
                              >
                                Cancel
                              </Button>
                            </>
                          )}
                          
                          {reservation.status === 'confirmed' && (
                            <Button
                              size="sm"
                              variant="outline"
                              className="text-xs px-2 py-1 h-auto"
                              onClick={() => handleStatusChange(reservation.id, 'completed')}
                              disabled={updateReservationStatus.isPending}
                            >
                              Complete
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
