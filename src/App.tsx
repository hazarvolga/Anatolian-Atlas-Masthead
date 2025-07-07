import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { ThemeProvider } from "next-themes";
import Index from "./pages/Index";
import Tours from "./pages/Tours";
import TourDetail from "./pages/TourDetail";
import BookingPage from "./pages/BookingPage";
import Contact from "./pages/Contact";
import Auth from "./pages/Auth";
import Profile from "./pages/Profile";
import MyReservations from "./pages/MyBookings";
import BookingSuccess from "./pages/BookingSuccess";
import BookingCancel from "./pages/BookingCancel";
import Admin from "./pages/Admin";
import AdminTourCreate from "./pages/AdminTourCreate";
import AdminTourEdit from "./pages/AdminTourEdit";
import AdminDestinationCreate from "./pages/AdminDestinationCreate";
import AdminDestinationEdit from "./pages/AdminDestinationEdit";
import AdminPageEditor from "./pages/AdminPageEditor";
import Gallery from "./pages/Gallery";
import Destinations from "./pages/Destinations";
import UnsubscribePage from "./pages/UnsubscribePage";
import EmailConfirmationPage from "./pages/EmailConfirmationPage";
import NotFound from "./pages/NotFound";
import DynamicPage from "@/components/DynamicPage";
import DestinationDetail from "./pages/DestinationDetail";
import { HelmetProvider } from "react-helmet-async";

const queryClient = new QueryClient();

function App() {
  return (
    <HelmetProvider>
    <QueryClientProvider client={queryClient}>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        <LanguageProvider>
          <AuthProvider>
            <TooltipProvider>
              <Toaster />
              <Sonner />
              <BrowserRouter>
                <Routes>
                  {/* Static routes - these take precedence */}
                  <Route path="/" element={<Index />} />
                  <Route path="/profile" element={<Profile />} />
                  <Route path="/tours" element={<Tours />} />
                  <Route path="/tours/:id" element={<TourDetail />} />
                  <Route path="/book/:tourId" element={<BookingPage />} />
                  <Route path="/contact" element={<Contact />} />
                  <Route path="/auth" element={<Auth />} />
                  <Route path="/profile" element={<Profile />} />
                  <Route path="/my-reservations" element={<MyReservations />} />
                  <Route path="/booking-success" element={<BookingSuccess />} />
                  <Route path="/booking-cancel" element={<BookingCancel />} />
                  <Route path="/admin" element={<Admin />} />
                  <Route path="/admin/tours/create" element={<AdminTourCreate />} />
                  <Route path="/admin/tours/edit/:id" element={<AdminTourEdit />} />
                  <Route path="/admin/destinations/create" element={<AdminDestinationCreate />} />
                  <Route path="/admin/destinations/edit/:id" element={<AdminDestinationEdit />} />
                  <Route path="/admin/pages/edit/:id" element={<AdminPageEditor />} />
                  <Route path="/gallery" element={<Gallery />} />
                  <Route path="/destinations" element={<Destinations />} />
                  <Route path="/destinations/:id" element={<DestinationDetail />} />
                  <Route path="/unsubscribe" element={<UnsubscribePage />} />
                  <Route path="/email-confirmation" element={<EmailConfirmationPage />} />
                  
                  {/* Dynamic page route - catches all other paths */}
                  <Route path="/:slug" element={<DynamicPage />} />
                  
                  {/* 404 page - must be last */}
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </BrowserRouter>
            </TooltipProvider>
          </AuthProvider>
        </LanguageProvider>
      </ThemeProvider>
    </QueryClientProvider>
    </HelmetProvider>
  );
}

export default App;
