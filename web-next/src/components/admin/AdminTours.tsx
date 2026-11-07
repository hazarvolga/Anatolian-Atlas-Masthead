"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { useAdminTours, useDeleteTour, useUpdateTour } from "@/hooks/useAdminTours";
import { format } from "date-fns";
import { Edit, Trash2, Plus, MapPin, Loader2 } from "lucide-react";
import LoadingSpinner from "./LoadingSpinner";
import EmptyState from "./EmptyState";
import ErrorAlert from "./ErrorAlert";
import { toast } from "sonner";

// Define the Tour type based on backend response
interface Tour {
  id: string;
  title: string;
  destination_name: string;
  status: 'active' | 'draft' | 'archived';
  price_adult: number;
  duration_hours: number;
  max_participants: number;
  created_at: string;
  reservation_count: number;
}

export default function AdminTours() {
  const router = useRouter();
  const navigate = (path: string) => router.push(path);
  const { data: tours = [], isLoading, error, refetch } = useAdminTours();
  const deleteTourMutation = useDeleteTour();
  const updateTourMutation = useUpdateTour();
  
  const [loadingActions, setLoadingActions] = useState<Record<string, boolean>>({});

  const handleDelete = async (tourId: string, tourTitle: string) => {
    if (!confirm(`Are you sure you want to delete "${tourTitle}" tour?`)) {
      return;
    }
    
    setLoadingActions(prev => ({ ...prev, [`delete-${tourId}`]: true }));
    
    try {
      await deleteTourMutation.mutateAsync(tourId);
      toast.success(`"${tourTitle}" tour deleted successfully`);
    } catch (error) {
      toast.error("Failed to delete tour. Please try again.");
    } finally {
      setLoadingActions(prev => ({ ...prev, [`delete-${tourId}`]: false }));
    }
  };
  
  const handleToggleStatus = async (tour: Tour) => {
    const newStatus = tour.status === 'active' ? 'draft' : 'active';
    setLoadingActions(prev => ({ ...prev, [`toggle-${tour.id}`]: true }));
    
    try {
      // Correctly structure the payload for the mutation
      await updateTourMutation.mutateAsync({ 
        tourId: tour.id, 
        tourData: { status: newStatus }
      });
      toast.success(`Tour "${tour.title}" status updated to ${newStatus}`);
    } catch (error) {
      toast.error("Failed to update tour status. Please try again.");
    } finally {
      setLoadingActions(prev => ({ ...prev, [`toggle-${tour.id}`]: false }));
    }
  };

  const handleEdit = (tourId: string) => {
    navigate(`/admin/tours/edit/${tourId}`);
  };
  
  if (isLoading) {
    return (
      <div className="text-center py-16">
        <LoadingSpinner size="lg" text="Loading tours..." />
      </div>
    );
  }
  
  if (error) {
    return (
      <ErrorAlert 
        title="Failed to load tours"
        message={error instanceof Error ? error.message : "An unknown error occurred."}
        onRetry={() => refetch()}
        retryLabel="Reload tours"
      />
    );
  }
  
  const activeTours = tours.filter((tour: Tour) => tour.status === 'active');
  const inactiveTours = tours.filter((tour: Tour) => tour.status !== 'active');
  
  return (
    <div className="space-y-6">
      <Card className="shadow-sm border-border/50">
        <CardHeader className="pb-4">
          <div className="flex flex-col gap-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="space-y-1">
                <CardTitle className="text-xl md:text-2xl">Tour Management</CardTitle>
                <CardDescription className="text-sm md:text-base">
                  Create, edit and manage tours ({tours.length} total)
                </CardDescription>
              </div>
              <div className="flex flex-col sm:flex-row gap-2">
                <Button 
                  onClick={() => navigate("/admin/tours/create")}
                  className="gap-2"
                >
                  <Plus className="h-4 w-4" />
                  <span className="hidden sm:inline">Create New Tour</span>
                  <span className="sm:hidden">Create</span>
                </Button>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-8">
          {tours.length === 0 ? (
            <EmptyState
              icon={MapPin}
              title="No tours yet"
              description="Start by creating your first tour to offer amazing experiences to your customers."
              actionLabel="Create first tour"
              onAction={() => navigate("/admin/tours/create")}
            />
          ) : (
            <>
              {/* Active Tours */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-green-600 flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-green-500"></div>
                    Active Tours
                  </h3>
                  <Badge variant="secondary" className="bg-green-100 text-green-800 px-3 py-1">
                    {activeTours.length}
                  </Badge>
                </div>
                <div className="grid gap-4">
                  {activeTours.map((tour: Tour) => (
                    <Card key={tour.id} className="border-l-4 border-l-green-500 bg-gradient-to-r from-green-50/50 to-transparent hover:shadow-md transition-all duration-200 hover:scale-[1.01]">
                      <CardContent className="p-4">
                        <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-4">
                          <div className="flex-1 min-w-0">
                            <div className="flex flex-col sm:flex-row sm:items-start gap-2 sm:gap-3 mb-3">
                              <div className="flex-1 min-w-0">
                                <h4 className="font-semibold text-lg truncate">{tour.title}</h4>
                                <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 mt-1">
                                  <p className="text-sm text-muted-foreground flex items-center gap-1">
                                    <MapPin className="h-3 w-3 flex-shrink-0" />
                                    <span className="truncate">{tour.destination_name}</span>
                                  </p>
                                </div>
                              </div>
                              <div className="flex flex-wrap gap-2">
                                <Badge variant="default" className="bg-green-500 hover:bg-green-600">
                                  Active
                                </Badge>
                                <Badge variant="outline" className="border-gray-300">
                                  {tour.reservation_count} Reservations
                                </Badge>
                              </div>
                            </div>
                            <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 md:gap-4 text-xs text-muted-foreground">
                              <span className="truncate font-medium">₺{Number(tour.price_adult).toFixed(2)}</span>
                              <span className="truncate">{tour.duration_hours}h duration</span>
                              <span className="truncate">Max {tour.max_participants} people</span>
                              <span className="truncate">Created: {format(new Date(tour.created_at), "dd/MM/yyyy")}</span>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-2 pt-3 xl:pt-0 border-t xl:border-t-0 xl:border-l xl:pl-4">
                            <div className="flex items-center gap-2">
                              <span className="text-xs text-muted-foreground hidden sm:inline">Status</span>
                              <Switch
                                checked={tour.status === 'active'}
                                onCheckedChange={() => handleToggleStatus(tour)}
                                disabled={loadingActions[`toggle-${tour.id}`]}
                              />
                            </div>
                            <Button variant="outline" size="icon" onClick={() => handleEdit(tour.id)}>
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="destructive" 
                              size="icon" 
                              onClick={() => handleDelete(tour.id, tour.title)}
                              disabled={loadingActions[`delete-${tour.id}`]}
                            >
                              {loadingActions[`delete-${tour.id}`] ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>

              {/* Inactive Tours */}
              {inactiveTours.length > 0 && (
                <div className="space-y-4 pt-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-gray-500 flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-gray-400"></div>
                      Draft & Archived Tours
                    </h3>
                    <Badge variant="secondary" className="bg-gray-100 text-gray-800 px-3 py-1">
                      {inactiveTours.length}
                    </Badge>
                  </div>
                  <div className="grid gap-4">
                    {inactiveTours.map((tour: Tour) => (
                      <Card key={tour.id} className="border-l-4 border-l-gray-400 bg-gray-50/50 hover:shadow-md transition-all duration-200 hover:scale-[1.01]">
                        <CardContent className="p-4">
                          <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-4">
                            <div className="flex-1 min-w-0">
                              <div className="flex flex-col sm:flex-row sm:items-start gap-2 sm:gap-3 mb-3">
                                <div className="flex-1 min-w-0">
                                  <h4 className="font-semibold text-lg truncate text-gray-700">{tour.title}</h4>
                                  <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 mt-1">
                                    <p className="text-sm text-muted-foreground flex items-center gap-1">
                                      <MapPin className="h-3 w-3 flex-shrink-0" />
                                      <span className="truncate">{tour.destination_name}</span>
                                    </p>
                                  </div>
                                </div>
                                <div className="flex flex-wrap gap-2">
                                  <Badge variant="secondary" className="capitalize">
                                    {tour.status}
                                  </Badge>
                                  <Badge variant="outline" className="border-gray-300">
                                    {tour.reservation_count} Reservations
                                  </Badge>
                                </div>
                              </div>
                              <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 md:gap-4 text-xs text-muted-foreground">
                                <span className="truncate font-medium">₺{Number(tour.price_adult).toFixed(2)}</span>
                                <span className="truncate">{tour.duration_hours}h duration</span>
                                <span className="truncate">Max {tour.max_participants} people</span>
                                <span className="truncate">Created: {format(new Date(tour.created_at), "dd/MM/yyyy")}</span>
                              </div>
                            </div>
                            
                            <div className="flex items-center gap-2 pt-3 xl:pt-0 border-t xl:border-t-0 xl:border-l xl:pl-4">
                              <div className="flex items-center gap-2">
                                <span className="text-xs text-muted-foreground hidden sm:inline">Status</span>
                                <Switch
                                  checked={tour.status === 'active'}
                                  onCheckedChange={() => handleToggleStatus(tour)}
                                  disabled={loadingActions[`toggle-${tour.id}`]}
                                />
                              </div>
                              <Button variant="outline" size="icon" onClick={() => handleEdit(tour.id)}>
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button 
                                variant="destructive" 
                                size="icon" 
                                onClick={() => handleDelete(tour.id, tour.title)}
                                disabled={loadingActions[`delete-${tour.id}`]}
                              >
                                {loadingActions[`delete-${tour.id}`] ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
