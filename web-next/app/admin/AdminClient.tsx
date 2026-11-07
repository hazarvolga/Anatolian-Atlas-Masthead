"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { useIsAdmin, useUserRole } from "@/hooks/useUserRole";
import {
  SidebarProvider,
  SidebarTrigger,
  SidebarInset,
} from "@/components/ui/sidebar";
import AdminSidebar from "@/components/admin/AdminSidebar";
import AdminStats from "@/components/admin/AdminStats";

const AdminTours = dynamic(() => import("@/components/admin/AdminTours"));
const AdminDestinations = dynamic(
  () => import("@/components/admin/AdminDestinations")
);
const AdminCalendar = dynamic(() => import("@/components/admin/AdminCalendar"));
const AdminReservations = dynamic(
  () => import("@/components/admin/AdminReservations")
);
const AdminMessages = dynamic(() => import("@/components/admin/AdminMessages"));
const AdminUsers = dynamic(() => import("@/components/admin/AdminUsers"));
const AdminReviews = dynamic(() => import("@/components/admin/AdminReviews"));
const AdminPages = dynamic(() => import("@/components/admin/AdminPages"));
const AdminNavigation = dynamic(
  () => import("@/components/admin/AdminNavigation")
);
const AdminTranslations = dynamic(
  () => import("@/components/admin/AdminTranslations")
);
const AdminStripeSettings = dynamic(
  () => import("@/components/admin/AdminStripeSettings")
);
const AISettings = dynamic(() => import("@/components/admin/AISettings"));
const AdminSiteSettings = dynamic(
  () => import("@/components/admin/AdminSiteSettings")
);
const AdminEmailManagement = dynamic(
  () => import("@/components/admin/email/AdminEmailManagement")
);
const EmailTemplateDetail = dynamic(
  () => import("@/components/admin/email/EmailTemplateDetail")
);
const EmailTestPage = dynamic(
  () => import("@/components/admin/email/EmailTestPage")
);
const EmailServiceSettings = dynamic(
  () => import("@/components/admin/email/EmailServiceSettings")
);
const EmailDeliverySettings = dynamic(
  () => import("@/components/admin/email/EmailDeliverySettings")
);
const EmailDeliveryTest = dynamic(
  () => import("@/components/admin/email/EmailDeliveryTest")
);

const VALID_TABS = [
  "stats",
  "destinations",
  "tours",
  "calendar",
  "reservations",
  "messages",
  "users",
  "reviews",
  "pages",
  "navigation",
  "translations",
  "emails",
  "email-test",
  "email-services",
  "email-delivery",
  "email-monitoring",
  "stripe",
  "ai",
  "site-settings",
];

export default function AdminClient() {
  const { user, loading } = useAuth();
  const isAdmin = useIsAdmin();
  const { isLoading: isRoleLoading } = useUserRole();
  const searchParams = useSearchParams();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("stats");

  useEffect(() => {
    const tab = searchParams.get("tab");
    const templateId = searchParams.get("templateId");

    if (templateId) {
      setActiveTab("email-template-detail");
    } else if (tab && VALID_TABS.includes(tab)) {
      setActiveTab(tab);
    }
  }, [searchParams]);

  useEffect(() => {
    if (!loading && !isRoleLoading && (!user || !isAdmin)) {
      router.replace("/auth");
    }
  }, [loading, isRoleLoading, user, isAdmin, router]);

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    router.push(`/admin?tab=${tab}`);
  };

  if (loading || isRoleLoading || !user || !isAdmin) {
    return null;
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
      case "messages":
        return <AdminMessages />;
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
      case "email-delivery":
        return <EmailDeliverySettings />;
      case "email-monitoring":
        return <EmailDeliveryTest />;
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
      case "messages":
        return "Messages";
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
      case "email-delivery":
        return "Delivery Settings";
      case "email-monitoring":
        return "Email Monitoring";
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
    <div className="min-h-screen bg-background">
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
            <div className="mx-auto max-w-7xl">{renderContent()}</div>
          </main>
        </SidebarInset>
      </SidebarProvider>
    </div>
  );
}
