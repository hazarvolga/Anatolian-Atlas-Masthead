import { useState } from "react";
import { useAdminReservations, useAdminUpdateReservationStatus } from "@/hooks/useAdminReservations";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { MoreHorizontal, User, Calendar, Tag, Hash, Mail, Phone, Package, Loader2 } from "lucide-react";
import LoadingSpinner from "./LoadingSpinner";
import EmptyState from "./EmptyState";
import ErrorAlert from "./ErrorAlert";
import { toast } from "sonner";

const statusColors: { [key: string]: string } = {
  pending: "bg-yellow-100 text-yellow-800 border-yellow-300",
  confirmed: "bg-blue-100 text-blue-800 border-blue-300",
  completed: "bg-green-100 text-green-800 border-green-300",
  cancelled: "bg-red-100 text-red-800 border-red-300",
};

const statusIcons: { [key: string]: React.ReactNode } = {
  pending: <Loader2 className="h-3 w-3 animate-spin mr-1.5" />,
  confirmed: <Calendar className="h-3 w-3 mr-1.5" />,
  completed: <Package className="h-3 w-3 mr-1.5" />,
  cancelled: <Tag className="h-3 w-3 mr-1.5" />,
};

type ReservationStatus = 'pending' | 'confirmed' | 'completed' | 'cancelled';

export default function AdminReservations() {
  const { data: reservations = [], isLoading, error, refetch } = useAdminReservations();
  const updateStatusMutation = useAdminUpdateReservationStatus();
  const [loadingActions, setLoadingActions] = useState<Record<string, boolean>>({});

  const handleStatusChange = async (reservationId: string, status: ReservationStatus) => {
    setLoadingActions(prev => ({ ...prev, [reservationId]: true }));
    try {
      await updateStatusMutation.mutateAsync({ reservationId, status });
    } catch (err) {
      // Error toast is handled by the mutation hook
    } finally {
      setLoadingActions(prev => ({ ...prev, [reservationId]: false }));
    }
  };

  if (isLoading) {
    return (
      <div className="text-center py-16">
        <LoadingSpinner size="lg" text="Loading reservations..." />
      </div>
    );
  }

  if (error) {
    return (
      <ErrorAlert 
        title="Failed to load reservations"
        message={error instanceof Error ? error.message : "An unknown error occurred."}
        onRetry={() => refetch()}
        retryLabel="Reload reservations"
      />
    );
  }

  return (
    <Card className="shadow-sm border-border/50">
      <CardHeader>
        <CardTitle className="text-xl md:text-2xl">Reservation Management</CardTitle>
        <CardDescription className="text-sm md:text-base">
          View and manage all customer reservations ({reservations.length} total)
        </CardDescription>
      </CardHeader>
      <CardContent>
        {reservations.length === 0 ? (
          <EmptyState
            icon={Calendar}
            title="No reservations yet"
            description="When customers book tours, their reservations will appear here."
          />
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Guest & Tour</TableHead>
                  <TableHead>Booking Details</TableHead>
                  <TableHead>Pricing</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {reservations.map((reservation: any) => {
                  const user = reservation.user || {};
                  const tour = reservation.tour || {};
                  const guestName = [user.first_name, user.last_name].filter(Boolean).join(" ") || "Guest";
                  const reservationDate = reservation.reservationDate;
                  const numAdults = reservation.numAdults ?? 0;
                  const numChildren = reservation.numChildren ?? 0;
                  const totalPrice = Number(reservation.totalPrice ?? 0);
                  const currencySymbol = reservation.priceCurrency === "TRY" ? "₺" : "€";
                  const status = reservation.status as ReservationStatus;

                  return (
                    <TableRow key={reservation.id}>
                      <TableCell className="font-medium align-top">
                        <div className="flex items-center gap-2 mb-1">
                          <User className="h-4 w-4 text-muted-foreground" />
                          <span className="font-semibold">{guestName}</span>
                        </div>
                        <div className="text-xs text-muted-foreground flex items-center gap-2 mb-1">
                           <Mail className="h-3 w-3" /> {user.email || "Not provided"}
                        </div>
                         <div className="text-xs text-muted-foreground flex items-center gap-2">
                           <Phone className="h-3 w-3" /> {user.phone || "Not provided"}
                        </div>
                        <div className="border-t my-2"></div>
                        <div className="flex items-center gap-2">
                          <Package className="h-4 w-4 text-muted-foreground" />
                          <span className="font-semibold">{tour.title || "N/A"}</span>
                        </div>
                        <div className="text-xs text-muted-foreground pl-6">
                          {tour.destination?.name || "Unknown Destination"}
                        </div>
                      </TableCell>
                      <TableCell className="align-top">
                        <div className="flex items-center gap-2 mb-1">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          <span>{format(new Date(reservationDate), "E, dd MMM yyyy")}</span>
                        </div>
                        <div className="text-xs text-muted-foreground pl-6">
                          Booked on {format(new Date(reservation.created_at), "dd MMM, p")}
                        </div>
                        <div className="flex items-center gap-2 mt-1">
                          <Hash className="h-4 w-4 text-muted-foreground" />
                          <span className="font-mono text-xs">{reservation.id}</span>
                        </div>
                      </TableCell>
                      <TableCell className="align-top">
                        <div className="font-semibold">{currencySymbol}{totalPrice.toFixed(2)}</div>
                        <div className="text-xs text-muted-foreground">
                          {numAdults} Adults, {numChildren} Children
                        </div>
                      </TableCell>
                      <TableCell className="align-top">
                        <Badge className={`capitalize ${statusColors[status]}`}>
                          {statusIcons[status]}
                          {status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right align-top">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" disabled={loadingActions[reservation.id]}>
                              {loadingActions[reservation.id] ? <Loader2 className="h-4 w-4 animate-spin" /> : <MoreHorizontal className="h-4 w-4" />}
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            {(['pending', 'confirmed', 'completed', 'cancelled'] as ReservationStatus[]).map(s => (
                              <DropdownMenuItem 
                                key={s}
                                disabled={status === s}
                                onClick={() => handleStatusChange(reservation.id, s)}
                                className="capitalize"
                              >
                                Mark as {s}
                              </DropdownMenuItem>
                            ))}
                          </DropdownMenuContent>
                        </DropdownMenu>
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
