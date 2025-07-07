import { Form } from "@/components/ui/form";
import { useModernBookingForm } from "@/hooks/useModernBookingForm";
import TourSelectionSection from "./sections/TourSelectionSection";
import DateSelectionSection from "./sections/DateSelectionSection";
import GuestConfigSection from "./sections/GuestConfigSection";
import GuestInfoSection from "./sections/GuestInfoSection";
import PaymentSection from "./sections/PaymentSection";
import RealTimePricingSidebar from "./RealTimePricingSidebar";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertTriangle } from "lucide-react";
import { useState } from "react";

interface ModernBookingFormProps {
  preselectedTourId?: string;
}

export default function ModernBookingForm({ preselectedTourId }: ModernBookingFormProps) {
  const {
    form,
    tours,
    toursLoading,
    selectedTourId,
    setSelectedTourId,
    checkInDate,
    setCheckInDate,
    checkOutDate,
    setCheckOutDate,
    adults,
    setAdults,
    children,
    setChildren,
    customers,
    setCustomers,
    rooms,
    setRooms,
    pricing,
    pricingLoading,
    totalNights,
    totalGuests,
    selectedTour,
    isMultiDayTour,
    createPayment,
    onSubmit,
  } = useModernBookingForm(preselectedTourId);

  const [showMembershipPrompt, setShowMembershipPrompt] = useState(true);
  const [wantsAccount, setWantsAccount] = useState<boolean|null>(null);

  const handleTourChange = (tourId: string) => {
    console.log('Tour changed to:', tourId);
    setSelectedTourId(tourId);
    form.setValue("tourId", tourId);
  };

  const shouldShowGuestInfo = (!isMultiDayTour && !!checkInDate) || (isMultiDayTour && !!checkInDate && !!checkOutDate);
  const canProceedToPayment = shouldShowGuestInfo && totalGuests > 0 && pricing.total > 0;

  console.log('ModernBookingForm render state:', {
    selectedTourId,
    selectedTourName: selectedTour?.name,
    checkInDate: !!checkInDate,
    checkOutDate: !!checkOutDate,
    isMultiDayTour,
    shouldShowGuestInfo,
    canProceedToPayment,
    pricingTotal: pricing.total,
    totalGuests,
    customersCount: customers.length
  });

  // Üyelik isteme promptu
  if (showMembershipPrompt) {
    return (
      <div className="max-w-2xl mx-auto p-8 bg-card rounded-lg shadow">
        <h2 className="text-2xl font-bold mb-4">Hesap Oluşturmak İster misiniz?</h2>
        <p className="mb-4 text-muted-foreground">
          Hesap oluşturarak sonraki rezervasyonlarınızda size özel avantajlardan ve daha hızlı rezervasyon imkanından faydalanabilirsiniz. Ayrıca, seçtiğiniz tura ve destinasyona özel bilgiler de hesabınızda sizi bekliyor olacak!
        </p>
        <div className="flex gap-4 py-2">
          <button
            className="bg-primary hover:bg-primary/80 text-white font-medium py-2 px-6 rounded"
            onClick={() => { setShowMembershipPrompt(false); setWantsAccount(true); }}
          >
            Evet, Üye Olmak İsterim
          </button>
          <button
            className="bg-muted text-muted-foreground font-medium py-2 px-6 rounded border"
            onClick={() => { setShowMembershipPrompt(false); setWantsAccount(false); }}
          >
            Hayır, Misafir Olarak Devam Et
          </button>
        </div>
      </div>
    );
  }

  // <<<<<< FIX: Burada onSubmit hook'u TUM parametreleri alacak şekilde ayarlandı!
  const customOnSubmit = async (values: any) => {
    await onSubmit(
      values,
      checkInDate,
      checkOutDate,
      isMultiDayTour,
      rooms,
      [],
      pricing,
      wantsAccount,
      selectedTour
    );
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Complete Your Booking</h1>
        <p className="text-muted-foreground">
          Secure your perfect getaway with our transparent pricing and flexible options.
        </p>
      </div>

      {/* Error Alert for debugging */}
      {createPayment.error && (
        <Alert variant="destructive" className="mb-6">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            Booking Error: {createPayment.error.message}
          </AlertDescription>
        </Alert>
      )}

      <Form {...form}>
        <form onSubmit={form.handleSubmit(customOnSubmit)}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Booking Form */}
            <div className="lg:col-span-2 space-y-6">
              {/* Tour Selection */}
              <TourSelectionSection
                control={form.control}
                tours={tours}
                toursLoading={toursLoading}
                onTourChange={handleTourChange}
                preselectedTourId={preselectedTourId}
              />

              {/* Date Selection */}
              {selectedTourId && (
                <DateSelectionSection
                  selectedTourId={selectedTourId}
                  checkInDate={checkInDate}
                  onCheckInSelect={setCheckInDate}
                  isMultiDayTour={isMultiDayTour}
                />
              )}

              {/* Guest Configuration - Now uses customers state */}
              {checkInDate && (
                <GuestConfigSection
                  checkInDate={checkInDate}
                  checkOutDate={checkOutDate}
                  adults={adults}
                  children={children}
                  onAdultsChange={setAdults}
                  onChildrenChange={setChildren}
                  customers={customers}
                  onCustomersChange={setCustomers}
                  isMultiDayTour={isMultiDayTour}
                  rooms={rooms}
                  onRoomConfigChange={setRooms}
                  selectedTour={selectedTour}
                />
              )}

              {/* Guest Information */}
              {shouldShowGuestInfo && (
                <GuestInfoSection
                  control={form.control}
                  shouldShow={true}
                />
              )}
            </div>

            {/* Pricing Sidebar */}
            <div className="lg:col-span-1">
              <RealTimePricingSidebar
                pricing={pricing}
                checkInDate={checkInDate}
                checkOutDate={checkOutDate}
                totalGuests={totalGuests}
                totalNights={totalNights}
                isLoading={pricingLoading}
                selectedTour={selectedTour}
              />

              {/* Payment Button */}
              {canProceedToPayment && (
                <PaymentSection
                  pricing={pricing}
                  isLoading={pricingLoading}
                  isPending={createPayment.isPending}
                />
              )}
            </div>
          </div>
        </form>
      </Form>
    </div>
  );
}
