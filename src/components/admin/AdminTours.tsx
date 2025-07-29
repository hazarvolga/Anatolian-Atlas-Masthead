
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { useAdminTours, useDeleteTour, useToggleTourStatus } from "@/hooks/useAdminTours";
import { updateExistingTours } from "@/utils/updateToursData";
import { format } from "date-fns";
import { Edit, Trash2, Plus, MapPin, RefreshCw, Loader2 } from "lucide-react";
import LoadingSpinner from "./LoadingSpinner";
import EmptyState from "./EmptyState";
import ErrorAlert from "./ErrorAlert";
import { toast } from "sonner";

export default function AdminTours() {
  const navigate = useNavigate();
  const { data: tours = [], isLoading, error, refetch } = useAdminTours();
  const deleteTour = useDeleteTour();
  const toggleTourStatus = useToggleTourStatus();
  const [isUpdating, setIsUpdating] = useState(false);
  const [loadingActions, setLoadingActions] = useState<Record<string, boolean>>({});
  
  const handleDelete = async (tourId: string, tourName: string) => {
    if (!confirm(`Are you sure you want to delete "${tourName}" tour?`)) {
      return;
    }
    
    setLoadingActions(prev => ({ ...prev, [`delete-${tourId}`]: true }));
    
    try {
      await deleteTour.mutateAsync(tourId);
      toast.success(`"${tourName}" tour deleted successfully`);
    } catch (error) {
      toast.error("Failed to delete tour. Please try again.");
    } finally {
      setLoadingActions(prev => ({ ...prev, [`delete-${tourId}`]: false }));
    }
  };
  
  const handleToggleStatus = async (tourId: string, currentStatus: boolean) => {
    setLoadingActions(prev => ({ ...prev, [`toggle-${tourId}`]: true }));
    
    try {
      await toggleTourStatus.mutateAsync({ 
        tourId, 
        isActive: !currentStatus 
      });
      toast.success(`Tour ${!currentStatus ? 'activated' : 'deactivated'} successfully`);
    } catch (error) {
      toast.error("Failed to update tour status. Please try again.");
    } finally {
      setLoadingActions(prev => ({ ...prev, [`toggle-${tourId}`]: false }));
    }
  };

  const handleEdit = (tourId: string) => {
    navigate(`/admin/tours/edit/${tourId}`);
  };
  
  const handleUpdateTours = async () => {
    setIsUpdating(true);
    try {
      await updateExistingTours();
      await refetch();
      toast.success("Tours updated successfully!");
    } catch (error) {
      console.error('Error updating tours:', error);
      toast.error("Failed to update tours. Please try again.");
    } finally {
      setIsUpdating(false);
    }
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
        message="There was an error loading the tours. Please check your connection and try again."
        onRetry={() => refetch()}
        retryLabel="Reload tours"
      />
    );
  }
  
  const activeTours = tours.filter(tour => tour.is_active);
  const inactiveTours = tours.filter(tour => !tour.is_active);
  
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
                  onClick={handleUpdateTours}
                  disabled={isUpdating}
                  variant="outline"
                  className="gap-2"
                >
                  <RefreshCw className={`h-4 w-4 ${isUpdating ? 'animate-spin' : ''}`} />
                  <span className="hidden sm:inline">Update Tours Data</span>
                  <span className="sm:hidden">Update</span>
                </Button>
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
                  {activeTours.map((tour) => (
                    <Card key={tour.id} className="border-l-4 border-l-green-500 bg-gradient-to-r from-green-50/50 to-transparent hover:shadow-md transition-all duration-200 hover:scale-[1.01]">
                      <CardContent className="p-4">
                        <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-4">
                          <div className="flex-1 min-w-0">
                            <div className="flex flex-col sm:flex-row sm:items-start gap-2 sm:gap-3 mb-3">
                              <div className="flex-1 min-w-0">
                                <h4 className="font-semibold text-lg truncate">{tour.name}</h4>
                                <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 mt-1">
                                  <p className="text-sm text-muted-foreground flex items-center gap-1">
                                    <MapPin className="h-3 w-3 flex-shrink-0" />
                                    <span className="truncate">{tour.location}</span>
                                  </p>
                                  {tour.destinations && (
                                    <Badge variant="outline" className="text-xs bg-blue-100 text-blue-800 self-start sm:self-center">
                                      {tour.destinations.name}
                                    </Badge>
                                  )}
                                </div>
                              </div>
                              <div className="flex flex-wrap gap-2">
                                <Badge variant="default" className="bg-green-500 hover:bg-green-600">
                                  Active
                                </Badge>
                                <Badge variant="outline" className="border-gray-300">
                                  {tour.difficulty}
                                </Badge>
                              </div>
                            </div>
                            <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 md:gap-4 text-xs text-muted-foreground">
                              <span className="truncate font-medium">₺{Number(tour.price).toFixed(2)}</span>
                              <span className="truncate">{tour.duration}h duration</span>
                              <span className="truncate">Max {tour.max_group_size} people</span>
                              <span className="truncate">Created: {format(new Date(tour.created_at), "dd/MM/yyyy")}</span>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-2 pt-3 xl:pt-0 border-t xl:border-t-0 xl:border-l xl:pl-4">
                            <div className="flex items-center gap-2">
                              <span className="text-xs text-muted-foreground hidden sm:inline">Status</span>
                              <Switch
                                checked={tour.is_active}
                                onCheckedChange={() => handleToggleStatus(tour.id, tour.is_active)}
                                disabled={loadingActions[`toggle-${tour.id}`]}
                              />
                              {loadingActions[`toggle-${tour.id}`] && (
                                <Loader2 className="h-3 w-3 animate-spin text-muted-foreground" />
                              )}
                            </div>
                            
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handleEdit(tour.id)}
                              className="gap-1 hover:bg-blue-50 hover:border-blue-200"
                            >
                              <Edit className="h-4 w-4" />
                              <span className="hidden sm:inline">Edit</span>
                            </Button>
                            
                            <Button 
                              variant="destructive" 
                              size="sm"
                              onClick={() => handleDelete(tour.id, tour.name)}
                              disabled={loadingActions[`delete-${tour.id}`]}
                              className="gap-1"
                            >
                              {loadingActions[`delete-${tour.id}`] ? (
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
                  {activeTours.length === 0 && (
                    <EmptyState
                      icon={MapPin}
                      title="No active tours"
                      description="All tours are currently inactive. Activate some tours to make them visible to customers."
                      className="border-green-200 bg-green-50/30"
                    />
                  )}
                </div>
              </div>

              {/* Inactive Tours */}
              {inactiveTours.length > 0 && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-red-600 flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-red-500"></div>
                      Inactive Tours
                    </h3>
                    <Badge variant="secondary" className="bg-red-100 text-red-800 px-3 py-1">
                      {inactiveTours.length}
                    </Badge>
                  </div>
                  <div className="grid gap-4">
                    {inactiveTours.map((tour) => (
                      <Card key={tour.id} className="border-l-4 border-l-red-500 bg-gradient-to-r from-red-50/50 to-transparent hover:shadow-md transition-all duration-200">
                        <CardContent className="p-4">
                          <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-4">
                            <div className="flex-1 min-w-0 opacity-75">
                              <div className="flex flex-col sm:flex-row sm:items-start gap-2 sm:gap-3 mb-3">
                                <div className="flex-1 min-w-0">
                                  <h4 className="font-semibold text-lg text-muted-foreground truncate">{tour.name}</h4>
                                  <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 mt-1">
                                    <p className="text-sm text-muted-foreground flex items-center gap-1">
                                      <MapPin className="h-3 w-3 flex-shrink-0" />
                                      <span className="truncate">{tour.location}</span>
                                    </p>
                                    {tour.destinations && (
                                      <Badge variant="outline" className="text-xs bg-gray-100 text-gray-600 self-start sm:self-center">
                                        {tour.destinations.name}
                                      </Badge>
                                    )}
                                  </div>
                                </div>
                                <div className="flex flex-wrap gap-2">
                                  <Badge variant="secondary" className="bg-red-500 text-white">
                                    Inactive
                                  </Badge>
                                  <Badge variant="outline" className="border-gray-300 text-gray-500">
                                    {tour.difficulty}
                                  </Badge>
                                </div>
                              </div>
                              <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 md:gap-4 text-xs text-muted-foreground">
                                <span className="truncate">₺{Number(tour.price).toFixed(2)}</span>
                                <span className="truncate">{tour.duration}h duration</span>
                                <span className="truncate">Max {tour.max_group_size} people</span>
                                <span className="truncate">Created: {format(new Date(tour.created_at), "dd/MM/yyyy")}</span>
                              </div>
                            </div>
                            
                            <div className="flex items-center gap-2 pt-3 xl:pt-0 border-t xl:border-t-0 xl:border-l xl:pl-4">
                              <div className="flex items-center gap-2">
                                <span className="text-xs text-muted-foreground hidden sm:inline">Status</span>
                                <Switch
                                  checked={tour.is_active}
                                  onCheckedChange={() => handleToggleStatus(tour.id, tour.is_active)}
                                  disabled={loadingActions[`toggle-${tour.id}`]}
                                />
                                {loadingActions[`toggle-${tour.id}`] && (
                                  <Loader2 className="h-3 w-3 animate-spin text-muted-foreground" />
                                )}
                              </div>
                              
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => handleEdit(tour.id)}
                                className="gap-1 hover:bg-blue-50 hover:border-blue-200"
                              >
                                <Edit className="h-4 w-4" />
                                <span className="hidden sm:inline">Edit</span>
                              </Button>
                              
                              <Button 
                                variant="destructive" 
                                size="sm"
                                onClick={() => handleDelete(tour.id, tour.name)}
                                disabled={loadingActions[`delete-${tour.id}`]}
                                className="gap-1"
                              >
                                {loadingActions[`delete-${tour.id}`] ? (
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
