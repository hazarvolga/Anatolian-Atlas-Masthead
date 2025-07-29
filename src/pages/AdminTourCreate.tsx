
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import AdminSidebar from "@/components/admin/AdminSidebar";
import AdminTourForm from "@/components/admin/AdminTourForm";
import Footer from "@/components/Footer";

export default function AdminTourCreate() {
  const navigate = useNavigate();
  
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
                    <h1 className="text-2xl font-bold">Create New Tour</h1>
                    <p className="text-muted-foreground">
                      Add a new tour to the platform
                    </p>
                  </div>
                </div>
                
                <AdminTourForm onSuccess={handleSuccess} />
              </div>
            </main>
          </SidebarInset>
        </div>
      </SidebarProvider>
      
      <Footer />
    </div>
  );
}
