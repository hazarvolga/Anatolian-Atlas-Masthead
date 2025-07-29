import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useIsAdmin } from "@/hooks/useUserRole";
import { Navigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { SidebarProvider, SidebarTrigger, SidebarInset } from "@/components/ui/sidebar";
import AdminSidebar from "@/components/admin/AdminSidebar";
import AdminStats from "@/components/admin/AdminStats";
import AdminTours from "@/components/admin/AdminTours";
import AdminReservations from "@/components/admin/AdminReservations";
import AdminUsers from "@/components/admin/AdminUsers";
import AdminReviews from "@/components/admin/AdminReviews";
import AdminPages from "@/components/admin/AdminPages";
import AdminNavigation from "@/components/admin/AdminNavigation";
import AdminDestinations from "@/components/admin/AdminDestinations";
import AdminTranslations from "@/components/admin/AdminTranslations";
import AdminCalendar from "@/components/admin/AdminCalendar";
import AdminStripeSettings from "@/components/admin/AdminStripeSettings";
import Footer from "@/components/Footer";
import AISettings from "@/components/admin/AISettings";
import AdminSiteSettings from "@/components/admin/AdminSiteSettings";
import AdminEmailManagement from "@/pages/AdminEmailManagement";
import EmailTemplateDetail from "@/pages/EmailTemplateDetail";
import EmailTestPage from "@/pages/EmailTestPage";
import EmailServiceSettings from "@/components/admin/email/EmailServiceSettings";

export default function Admin() {
  const { user } = useAuth();
  const isAdmin = useIsAdmin();
  const [searchParams, setSearchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState("stats");

  // Update active tab based on URL parameters
  useEffect(() => {
    const tab = searchParams.get("tab");
    const templateId = searchParams.get("templateId");
    
    if (templateId) {
      setActiveTab("email-template-detail");
    } else if (tab && ["stats", "destinations", "tours", "calendar", "reservations", "users", "reviews", "pages", "navigation", "translations", "emails", "email-test", "email-services", "stripe", "ai", "site-settings"].includes(tab)) {
      setActiveTab(tab);
    }
  }, [searchParams]);

  // Update URL when tab changes
  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    setSearchParams({ tab });
  };

  // Don't render anything while loading auth state
  if (user === undefined) {
    return null;
  }

  // Redirect if not authenticated or not admin
  if (!user || !isAdmin) {
    return <Navigate to="/auth" replace />;
  }

  const renderContent = () => {
    switch (activeTab) {
      case "stats":
        return <AdminStats />;
      case "destinations":
        return <AdminDestinations />;
      case "tours":
        return <AdminTours />;
      case "calendar":
        return <AdminCalendar />;
      case "reservations":
        return <AdminReservations />;
      case "users":
        return <AdminUsers />;
      case "reviews":
        return <AdminReviews />;
      case "pages":
        return <AdminPages />;
      case "navigation":
        return <AdminNavigation />;
      case "translations":
        return <AdminTranslations />;
      case "emails":
        return <AdminEmailManagement />;
      case "email-test":
        return <EmailTestPage />;
      case "email-services":
        return <EmailServiceSettings />;
      case "email-template-detail":
        return <EmailTemplateDetail />;
      case "stripe":
        return <AdminStripeSettings />;
      case "ai":
        return <AISettings />;
      case "site-settings":
        return <AdminSiteSettings />;
      default:
        return <AdminStats />;
    }
  };

  const getTabTitle = () => {
    switch (activeTab) {
      case "stats":
        return "Dashboard";
      case "destinations":
        return "Destinations";
      case "tours":
        return "Tours";
      case "calendar":
        return "Calendar";
      case "reservations":
        return "Reservations";
      case "users":
        return "Users";
      case "reviews":
        return "Reviews";
      case "pages":
        return "Pages";
      case "navigation":
        return "Navigation";
      case "translations":
        return "Translations";
      case "emails":
        return "Email Management";
      case "email-test":
        return "Email Testing";
      case "email-services":
        return "Email Services";
      case "email-template-detail":
        return "Email Template";
      case "stripe":
        return "Stripe Settings";
      case "ai":
        return "AI Settings";
      case "site-settings":
        return "Site Settings";
      default:
        return "Dashboard";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <SidebarProvider>
        <AdminSidebar activeTab={activeTab} onTabChange={handleTabChange} />
        <SidebarInset>
          <header className="flex h-16 shrink-0 items-center gap-2 px-4 border-b">
            <SidebarTrigger className="-ml-1" />
            <div className="ml-2">
              <h1 className="text-xl font-semibold">{getTabTitle()}</h1>
            </div>
          </header>

          <main className="flex-1 p-6">
            <div className="mx-auto max-w-7xl">
              {renderContent()}
            </div>
          </main>

          <Footer />
        </SidebarInset>
      </SidebarProvider>
    </div>
  );
}
