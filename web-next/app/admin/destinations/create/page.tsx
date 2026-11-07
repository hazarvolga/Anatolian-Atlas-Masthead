"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import AdminSidebar from "@/components/admin/AdminSidebar";
import AdminDestinationForm from "@/components/admin/AdminDestinationForm";
import Footer from "@/components/Footer";

export default function AdminDestinationCreatePage() {
  const router = useRouter();

  const handleSuccess = () => {
    router.push("/admin?tab=destinations");
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <SidebarProvider>
        <div className="min-h-screen flex w-full">
          <AdminSidebar
            activeTab="destinations"
            onTabChange={(tab) => router.push(`/admin?tab=${tab}`)}
          />

          <SidebarInset className="flex-1">
            <main className="flex-1 p-6">
              <div className="max-w-4xl mx-auto space-y-6">
                <div className="flex items-center gap-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => router.push("/admin?tab=destinations")}
                  >
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back to Destinations
                  </Button>
                  <div>
                    <h1 className="text-2xl font-bold">
                      Create New Destination
                    </h1>
                    <p className="text-muted-foreground">
                      Add a new destination to the platform
                    </p>
                  </div>
                </div>

                <AdminDestinationForm onSuccess={handleSuccess} />
              </div>
            </main>
          </SidebarInset>
        </div>
      </SidebarProvider>

      <Footer />
    </div>
  );
}
