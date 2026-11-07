import { Home, Mail, Users, Settings, BarChart2, Map, Calendar, Star, FileText, Languages, CreditCard, Bot, Palette, Send, Shield, Activity, Inbox } from 'lucide-react';

export const ADMIN_SIDEBAR_SECTIONS = [
  {
    label: "Dashboard",
    items: [
      { id: "stats", label: "Stats", icon: BarChart2 },
      { id: "calendar", label: "Calendar", icon: Calendar },
    ],
  },
  {
    label: "Content",
    items: [
      { id: "tours", label: "Tours", icon: Map },
      { id: "destinations", label: "Destinations", icon: Map },
      { id: "pages", label: "Pages", icon: FileText },
      { id: "reviews", label: "Reviews", icon: Star },
      { id: "navigation", label: "Navigation", icon: Home },
    ],
  },
  {
    label: "Reservations & Users",
    items: [
      { id: "reservations", label: "Reservations", icon: Calendar, path: "/admin?tab=reservations" },
      { id: "messages", label: "Messages", icon: Inbox },
      { id: "users", label: "Users", icon: Users },
    ],
  },
  {
    label: "Settings",
    items: [
      { id: "emails", label: "Email Templates", icon: Mail },
      { id: "email-test", label: "Email Test", icon: Mail },
      { id: "email-services", label: "Email Services", icon: Send },
      { id: "email-delivery", label: "Delivery Settings", icon: Shield },
      { id: "email-monitoring", label: "Email Monitoring", icon: Activity },
      { id: "translations", label: "Translations", icon: Languages },
      { id: "stripe", label: "Stripe", icon: CreditCard },
      { id: "ai", label: "AI Settings", icon: Bot },
      { id: "site-settings", label: "Site Settings", icon: Palette },
    ],
  },
];