
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { useAdminDestinations, useDeleteDestination, useUpdateDestination } from "@/hooks/useDestinations";
import { format } from "date-fns";
import { Edit, Trash2, Plus, MapPin, Loader2 } from "lucide-react";
import LoadingSpinner from "./LoadingSpinner";
import EmptyState from "./EmptyState";
import ErrorAlert from "./ErrorAlert";
import { toast } from "sonner";

export default function AdminDestinations() {
  const navigate = useNavigate();
  const { data: destinations = [], isLoading, error, refetch } = useAdminDestinations();
  const deleteDestination = useDeleteDestination();
  const updateDestination = useUpdateDestination();
  const [loadingActions, setLoadingActions] = useState<Record<string, boolean>>({});
  
  const handleDelete = async (destinationId: string, destinationName: string) => {
    if (!confirm(`Are you sure you want to delete "${destinationName}" destination?`)) {
      return;
    }
    
    setLoadingActions(prev => ({ ...prev, [`delete-${destinationId}`]: true }));
    
    try {
      await deleteDestination.mutateAsync(destinationId);
      toast.success(`"${destinationName}" destination deleted successfully`);
    } catch (error) {
      toast.error("Failed to delete destination. Please try again.");
    } finally {
      setLoadingActions(prev => ({ ...prev, [`delete-${destinationId}`]: false }));
    }
  };
  
  const handleToggleStatus = async (destinationId: string, currentStatus: boolean) => {
    setLoadingActions(prev => ({ ...prev, [`toggle-${destinationId}`]: true }));
    
    try {
      await updateDestination.mutateAsync({ 
        destinationId, 
        destinationData: { is_active: !currentStatus }
      });
      toast.success(`Destination ${!currentStatus ? 'activated' : 'deactivated'} successfully`);
    } catch (error) {
      toast.error("Failed to update destination status. Please try again.");
    } finally {
      setLoadingActions(prev => ({ ...prev, [`toggle-${destinationId}`]: false }));
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
        message="There was an error loading the destinations. Please check your connection and try again."
        onRetry={() => refetch()}
        retryLabel="Reload destinations"
      />
    );
  }
  
  const activeDestinations = destinations.filter(dest => dest.is_active);
  const inactiveDestinations = destinations.filter(dest => !dest.is_active);
  
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
                  {activeDestinations.map((destination) => (
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
                              <Badge variant="default" className="bg-green-500 hover:bg-green-600 self-start sm:self-center">
                                Active
                              </Badge>
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
                                onCheckedChange={() => handleToggleStatus(destination.id, destination.is_active)}
                                disabled={loadingActions[`toggle-${destination.id}`]}
                              />
                              {loadingActions[`toggle-${destination.id}`] && (
                                <Loader2 className="h-3 w-3 animate-spin text-muted-foreground" />
                              )}
                            </div>
                            
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handleEdit(destination.id)}
                              className="gap-1 hover:bg-blue-50 hover:border-blue-200"
                            >
                              <Edit className="h-4 w-4" />
                              <span className="hidden sm:inline">Edit</span>
                            </Button>
                            
                            <Button 
                              variant="destructive" 
                              size="sm"
                              onClick={() => handleDelete(destination.id, destination.name)}
                              disabled={loadingActions[`delete-${destination.id}`]}
                              className="gap-1"
                            >
                              {loadingActions[`delete-${destination.id}`] ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                              ) : (
                                <Trash2 className="h-4 w-4" />
                              )}
                              <span className="hidden sm:inline">Delete</span>
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                  {activeDestinations.length === 0 && (
                    <EmptyState
                      icon={MapPin}
                      title="No active destinations"
                      description="All destinations are currently inactive. Activate some destinations to make them visible."
                      className="border-green-200 bg-green-50/30"
                    />
                  )}
                </div>
              </div>

              {/* Inactive Destinations */}
              {inactiveDestinations.length > 0 && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-red-600 flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-red-500"></div>
                      Inactive Destinations
                    </h3>
                    <Badge variant="secondary" className="bg-red-100 text-red-800 px-3 py-1">
                      {inactiveDestinations.length}
                    </Badge>
                  </div>
                  <div className="grid gap-4">
                    {inactiveDestinations.map((destination) => (
                      <Card key={destination.id} className="border-l-4 border-l-red-500 bg-gradient-to-r from-red-50/50 to-transparent hover:shadow-md transition-all duration-200">
                        <CardContent className="p-4">
                          <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-4">
                            <div className="flex-1 min-w-0 opacity-75">
                              <div className="flex flex-col sm:flex-row sm:items-start gap-2 sm:gap-3 mb-3">
                                <div className="flex-1 min-w-0">
                                  <h4 className="font-semibold text-lg text-muted-foreground truncate">{destination.name}</h4>
                                  <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
                                    <MapPin className="h-3 w-3 flex-shrink-0" />
                                    <span className="truncate">{destination.city}, {destination.country}</span>
                                  </p>
                                </div>
                                <Badge variant="secondary" className="bg-red-500 text-white self-start sm:self-center">
                                  Inactive
                                </Badge>
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
                                  onCheckedChange={() => handleToggleStatus(destination.id, destination.is_active)}
                                  disabled={loadingActions[`toggle-${destination.id}`]}
                                />
                                {loadingActions[`toggle-${destination.id}`] && (
                                  <Loader2 className="h-3 w-3 animate-spin text-muted-foreground" />
                                )}
                              </div>
                              
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => handleEdit(destination.id)}
                                className="gap-1 hover:bg-blue-50 hover:border-blue-200"
                              >
                                <Edit className="h-4 w-4" />
                                <span className="hidden sm:inline">Edit</span>
                              </Button>
                              
                              <Button 
                                variant="destructive" 
                                size="sm"
                                onClick={() => handleDelete(destination.id, destination.name)}
                                disabled={loadingActions[`delete-${destination.id}`]}
                                className="gap-1"
                              >
                                {loadingActions[`delete-${destination.id}`] ? (
                                  <Loader2 className="h-4 w-4 animate-spin" />
                                ) : (
                                  <Trash2 className="h-4 w-4" />
                                )}
                                <span className="hidden sm:inline">Delete</span>
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
