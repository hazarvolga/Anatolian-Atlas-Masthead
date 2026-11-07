"use client";

import { use } from "react";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import AdminSidebar from "@/components/admin/AdminSidebar";
import { useAdminDestinations } from "@/hooks/useDestinations";
import AdminDestinationForm from "@/components/admin/AdminDestinationForm";
import Footer from "@/components/Footer";

export default function AdminDestinationEditPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const { data: destinations = [] } = useAdminDestinations();

  const destination = destinations.find((dest) => dest.id === id);

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
                      {destination
                        ? "Edit Destination"
                        : "Destination Not Found"}
                    </h1>
                    <p className="text-muted-foreground">
                      {destination
                        ? "Update destination information"
                        : "The requested destination could not be found"}
                    </p>
                  </div>
                </div>

                {destination ? (
                  <AdminDestinationForm
                    destination={destination}
                    onSuccess={handleSuccess}
                  />
                ) : (
                  <Card>
                    <CardHeader>
                      <CardTitle>Destination Not Found</CardTitle>
                      <CardDescription>
                        The destination you&apos;re looking for doesn&apos;t
                        exist or has been removed.
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Button
                        onClick={() => router.push("/admin?tab=destinations")}
                      >
                        Return to Destinations
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
