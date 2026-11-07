"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { useAdminDestinations, useDeleteDestination, useUpdateDestination, Destination } from "@/hooks/useDestinations";
import { format } from "date-fns";
import { Edit, Trash2, Plus, MapPin, Loader2, Package } from "lucide-react";
import LoadingSpinner from "./LoadingSpinner";
import EmptyState from "./EmptyState";
import ErrorAlert from "./ErrorAlert";
import { toast } from "sonner";

export default function AdminDestinations() {
  const router = useRouter();
  const navigate = (path: string) => router.push(path);
  const { data: destinations = [], isLoading, error, refetch } = useAdminDestinations();
  const deleteDestinationMutation = useDeleteDestination();
  const updateDestinationMutation = useUpdateDestination();
  const [loadingActions, setLoadingActions] = useState<Record<string, boolean>>({});
  
  const handleDelete = async (destinationId: string, destinationName: string) => {
    if (!confirm(`Are you sure you want to delete "${destinationName}" destination?`)) {
      return;
    }
    
    setLoadingActions(prev => ({ ...prev, [`delete-${destinationId}`]: true }));
    
    try {
      await deleteDestinationMutation.mutateAsync(destinationId);
      toast.success(`"${destinationName}" destination deleted successfully`);
    } catch (error) {
      toast.error("Failed to delete destination. Please try again.");
    } finally {
      setLoadingActions(prev => ({ ...prev, [`delete-${destinationId}`]: false }));
    }
  };
  
  const handleToggleStatus = async (destination: Destination) => {
    const newStatus = !destination.is_active;
    setLoadingActions(prev => ({ ...prev, [`toggle-${destination.id}`]: true }));
    
    try {
      await updateDestinationMutation.mutateAsync({ 
        destinationId: destination.id, 
        destinationData: { is_active: newStatus }
      });
      toast.success(`Destination "${destination.name}" status updated to ${newStatus ? 'active' : 'inactive'}`);
    } catch (error) {
      toast.error("Failed to update destination status. Please try again.");
    } finally {
      setLoadingActions(prev => ({ ...prev, [`toggle-${destination.id}`]: false }));
    }
  };

  const handleEdit = (destinationId: string) => {
    navigate(`/admin/destinations/edit/${destinationId}`);
  };
  
  if (isLoading) {
    return (
      <div className="text-center py-16">
        <LoadingSpinner size="lg" text="Loading destinations..." />
      </div>
    );
  }
  
  if (error) {
    return (
      <ErrorAlert 
        title="Failed to load destinations"
        message={error instanceof Error ? error.message : "An unknown error occurred."}
        onRetry={() => refetch()}
        retryLabel="Reload destinations"
      />
    );
  }
  
  const activeDestinations = destinations.filter((dest: Destination) => dest.is_active);
  const inactiveDestinations = destinations.filter((dest: Destination) => !dest.is_active);
  
  return (
    <div className="space-y-6">
      <Card className="shadow-sm border-border/50">
        <CardHeader className="pb-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="space-y-1">
              <CardTitle className="text-xl md:text-2xl">Destination Management</CardTitle>
              <CardDescription className="text-sm md:text-base">
                Create, edit and manage destinations ({destinations.length} total)
              </CardDescription>
            </div>
            <Button 
              onClick={() => navigate("/admin/destinations/create")}
              className="w-full sm:w-auto gap-2"
            >
              <Plus className="h-4 w-4" />
              <span className="hidden sm:inline">Create New Destination</span>
              <span className="sm:hidden">Create</span>
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-8">
          {destinations.length === 0 ? (
            <EmptyState
              icon={MapPin}
              title="No destinations yet"
              description="Start by creating your first destination to organize your tours better."
              actionLabel="Create first destination"
              onAction={() => navigate("/admin/destinations/create")}
            />
          ) : (
            <>
              {/* Active Destinations */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-green-600 flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-green-500"></div>
                    Active Destinations
                  </h3>
                  <Badge variant="secondary" className="bg-green-100 text-green-800 px-3 py-1">
                    {activeDestinations.length}
                  </Badge>
                </div>
                <div className="grid gap-4">
                  {activeDestinations.map((destination: Destination) => (
                    <Card key={destination.id} className="border-l-4 border-l-green-500 bg-gradient-to-r from-green-50/50 to-transparent hover:shadow-md transition-all duration-200 hover:scale-[1.01]">
                      <CardContent className="p-4">
                        <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-4">
                          <div className="flex-1 min-w-0">
                            <div className="flex flex-col sm:flex-row sm:items-start gap-2 sm:gap-3 mb-3">
                              <div className="flex-1 min-w-0">
                                <h4 className="font-semibold text-lg truncate">{destination.name}</h4>
                                <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
                                  <MapPin className="h-3 w-3 flex-shrink-0" />
                                  <span className="truncate">{destination.city}, {destination.country}</span>
                                </p>
                              </div>
                              <div className="flex flex-wrap gap-2">
                                <Badge variant="default" className="bg-green-500 hover:bg-green-600 self-start sm:self-center">
                                  Active
                                </Badge>
                                <Badge variant="outline" className="flex items-center gap-1">
                                  <Package className="h-3 w-3" />
                                  {destination._count?.tours ?? 0} Tours
                                </Badge>
                              </div>
                            </div>
                            <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
                              <span>Created: {format(new Date(destination.created_at), "dd/MM/yyyy")}</span>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-2 pt-3 xl:pt-0 border-t xl:border-t-0 xl:border-l xl:pl-4">
                            <div className="flex items-center gap-2">
                              <span className="text-xs text-muted-foreground hidden sm:inline">Status</span>
                              <Switch
                                checked={destination.is_active}
                                onCheckedChange={() => handleToggleStatus(destination)}
                                disabled={loadingActions[`toggle-${destination.id}`]}
                              />
                            </div>
                            <Button variant="outline" size="icon" onClick={() => handleEdit(destination.id)}>
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="destructive" 
                              size="icon" 
                              onClick={() => handleDelete(destination.id, destination.name)}
                              disabled={loadingActions[`delete-${destination.id}`]}
                            >
                              {loadingActions[`delete-${destination.id}`] ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>

              {/* Inactive Destinations */}
              {inactiveDestinations.length > 0 && (
                <div className="space-y-4 pt-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-gray-500 flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-gray-400"></div>
                      Inactive Destinations
                    </h3>
                    <Badge variant="secondary" className="bg-gray-100 text-gray-800 px-3 py-1">
                      {inactiveDestinations.length}
                    </Badge>
                  </div>
                  <div className="grid gap-4">
                    {inactiveDestinations.map((destination: Destination) => (
                      <Card key={destination.id} className="border-l-4 border-l-gray-400 bg-gray-50/50 hover:shadow-md transition-all duration-200 hover:scale-[1.01]">
                        <CardContent className="p-4">
                          <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-4">
                            <div className="flex-1 min-w-0">
                              <div className="flex flex-col sm:flex-row sm:items-start gap-2 sm:gap-3 mb-3">
                                <div className="flex-1 min-w-0">
                                  <h4 className="font-semibold text-lg truncate text-gray-700">{destination.name}</h4>
                                  <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
                                    <MapPin className="h-3 w-3 flex-shrink-0" />
                                    <span className="truncate">{destination.city}, {destination.country}</span>
                                  </p>
                                </div>
                                <div className="flex flex-wrap gap-2">
                                  <Badge variant="secondary" className="self-start sm:self-center">
                                    Inactive
                                  </Badge>
                                  <Badge variant="outline" className="flex items-center gap-1">
                                    <Package className="h-3 w-3" />
                                    {destination._count?.tours ?? 0} Tours
                                  </Badge>
                                </div>
                              </div>
                              <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
                                <span>Created: {format(new Date(destination.created_at), "dd/MM/yyyy")}</span>
                              </div>
                            </div>
                            
                            <div className="flex items-center gap-2 pt-3 xl:pt-0 border-t xl:border-t-0 xl:border-l xl:pl-4">
                              <div className="flex items-center gap-2">
                                <span className="text-xs text-muted-foreground hidden sm:inline">Status</span>
                                <Switch
                                  checked={destination.is_active}
                                  onCheckedChange={() => handleToggleStatus(destination)}
                                  disabled={loadingActions[`toggle-${destination.id}`]}
                                />
                              </div>
                              <Button variant="outline" size="icon" onClick={() => handleEdit(destination.id)}>
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button 
                                variant="destructive" 
                                size="icon" 
                                onClick={() => handleDelete(destination.id, destination.name)}
                                disabled={loadingActions[`delete-${destination.id}`]}
                              >
                                {loadingActions[`delete-${destination.id}`] ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
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
