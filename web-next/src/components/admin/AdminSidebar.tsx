"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/AuthContext";
import { Home, ChevronRight, ChevronDown, Settings, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";
import { ADMIN_SIDEBAR_SECTIONS } from "./AdminSidebarItems";

interface AdminSidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export default function AdminSidebar({ activeTab, onTabChange }: AdminSidebarProps) {
  const { signOut } = useAuth();
  const router = useRouter();
  const navigate = (path: string) => router.push(path);
  
  // Collapsible state for each section
  const [collapsedSections, setCollapsedSections] = useState<Record<string, boolean>>({
    "Dashboard": false,
    "Content": false,
    "Reservations & Users": false,
    "Settings": false,
  });

  const toggleSection = (sectionLabel: string) => {
    setCollapsedSections(prev => ({
      ...prev,
      [sectionLabel]: !prev[sectionLabel]
    }));
  };

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  const sidebarItems = [
    { id: "dashboard", label: "Dashboard", icon: "Home", path: "/admin?tab=dashboard" },
    { id: "content", label: "Content", icon: "FileText", path: "/admin?tab=content" },
    { id: "reservations", label: "Reservations", icon: "CalendarCheck", path: "/admin?tab=reservations" },
    { id: "users", label: "Users", icon: "Users", path: "/admin?tab=users" },
    { id: "settings", label: "Settings", icon: "Settings", path: "/admin?tab=settings" },
  ];

  return (
    <Sidebar className="border-r border-border/50 bg-white dark:bg-gray-900">
      <SidebarHeader className="border-b border-border/50 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-700">
        <div className="flex flex-col gap-2 p-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center shadow-md">
              <Settings className="h-4 w-4 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Admin Panel
              </h2>
              <p className="text-xs text-gray-600 dark:text-gray-400">Management Center</p>
            </div>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent className="px-4 py-4 bg-white dark:bg-gray-900">
        {ADMIN_SIDEBAR_SECTIONS.map((section) => {
          const isCollapsed = collapsedSections[section.label];
          const hasActiveItem = section.items.some(item => item.id === activeTab);
          
          return (
            <SidebarGroup key={section.label} className="mb-4">
              <SidebarGroupLabel 
                className={cn(
                  "flex items-center justify-between cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg px-3 py-2 transition-colors",
                  "text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider",
                  hasActiveItem && "text-blue-600 dark:text-blue-400"
                )}
                onClick={() => toggleSection(section.label)}
              >
                <span>{section.label}</span>
                {isCollapsed ? (
                  <ChevronRight className="h-3 w-3 transition-transform" />
                ) : (
                  <ChevronDown className="h-3 w-3 transition-transform" />
                )}
              </SidebarGroupLabel>
              
              <div className={cn(
                "overflow-hidden transition-all duration-300 ease-in-out",
                isCollapsed ? "max-h-0 opacity-0" : "max-h-96 opacity-100"
              )}>
                <SidebarGroupContent className="mt-2">
                  <SidebarMenu className="space-y-1">
                    {section.items.map((item) => (
                      <SidebarMenuItem key={item.id}>
                        <SidebarMenuButton
                          isActive={activeTab === item.id || (item.id === 'emails' && activeTab === 'email-template-detail')}
                          onClick={() => onTabChange(item.id)}
                          size="sm"
                          className={cn(
                            "group relative w-full px-3 py-2 rounded-lg transition-all duration-200",
                            "hover:bg-gray-100 dark:hover:bg-gray-800 hover:shadow-sm",
                            (activeTab === item.id || (item.id === 'emails' && activeTab === 'email-template-detail'))
                              ? "bg-gradient-to-r from-blue-100 to-indigo-100 dark:from-blue-900/30 dark:to-indigo-900/30 text-blue-700 dark:text-blue-300 shadow-sm border border-blue-200 dark:border-blue-700"
                              : "text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100"
                          )}
                        >
                          <div className="flex items-center gap-3 w-full">
                            <div className={cn(
                              "w-6 h-6 rounded-md flex items-center justify-center transition-all duration-200",
                              (activeTab === item.id || (item.id === 'emails' && activeTab === 'email-template-detail'))
                                ? "bg-blue-200/50 dark:bg-blue-800/50" 
                                : "group-hover:bg-gray-200 dark:group-hover:bg-gray-700"
                            )}>
                              <item.icon className="h-4 w-4" />
                            </div>
                            <span className="font-medium text-sm truncate">{item.label}</span>
                          </div>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    ))}
                  </SidebarMenu>
                </SidebarGroupContent>
              </div>
            </SidebarGroup>
          );
        })}
      </SidebarContent>

      <SidebarFooter className="border-t border-border/50 bg-gray-50 dark:bg-gray-800">
        <div className="p-3 space-y-2">
          <Button 
            variant="outline" 
            size="sm" 
            className="w-full justify-start rounded-lg border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-blue-900/30 hover:text-blue-600 dark:hover:text-blue-400 hover:border-blue-300 dark:hover:border-blue-600 transition-all duration-200"
            onClick={() => navigate("/")}
          >
            <Home className="h-4 w-4 mr-2" />
            Back to Website
          </Button>
          <Button 
            variant="destructive" 
            size="sm" 
            className="w-full justify-start rounded-lg bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-700 hover:bg-red-500 hover:text-white dark:hover:bg-red-600 transition-all duration-200"
            onClick={handleSignOut}
          >
            <LogOut className="h-4 w-4 mr-2" />
            Sign Out
          </Button>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
