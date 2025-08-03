
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Loader2 } from "lucide-react";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import AdminSidebar from "@/components/admin/AdminSidebar";
import { useAdminTour } from "@/hooks/useAdminTour";
import AdminTourForm from "@/components/admin/AdminTourForm";
import Footer from "@/components/Footer";

export default function AdminTourEdit() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: tour, isLoading, error } = useAdminTour(id || "");

  const handleSuccess = () => {
    navigate("/admin?tab=tours");
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <SidebarProvider>
        <div className="min-h-screen flex w-full">
          <AdminSidebar activeTab="tours" onTabChange={() => {}} />
          
          <SidebarInset className="flex-1">
            <main className="flex-1 p-6">
              <div className="max-w-4xl mx-auto space-y-6">
                <div className="flex items-center gap-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => navigate("/admin?tab=tours")}
                  >
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back to Tours
                  </Button>
                  <div>
                    <h1 className="text-2xl font-bold">
                      {isLoading ? "Loading..." : tour ? "Edit Tour" : "Tour Not Found"}
                    </h1>
                    <p className="text-muted-foreground">
                      {isLoading ? "Fetching tour details..." : tour ? "Update tour information" : "The requested tour could not be found"}
                    </p>
                  </div>
                </div>
                
                {isLoading ? (
                  <div className="flex justify-center items-center py-10">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  </div>
                ) : tour ? (
                  <AdminTourForm 
                    tour={tour}
                    onSuccess={handleSuccess}
                  />
                ) : (
                  <Card>
                    <CardHeader>
                      <CardTitle>Tour Not Found</CardTitle>
                      <CardDescription>
                        {error ? error.message : "The tour you're looking for doesn't exist or has been removed."}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Button onClick={() => navigate("/admin?tab=tours")}>
                        Return to Tours
                      </Button>
                    </CardContent>
                  </Card>
                )}
              </div>
            </main>
          </SidebarInset>
        </div>
      </SidebarProvider>
      
      <Footer />
    </div>
  );
}
