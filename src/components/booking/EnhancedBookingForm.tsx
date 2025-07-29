
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { useEnhancedBookingForm } from "@/hooks/useEnhancedBookingForm";
import { useEnhancedBooking } from "@/hooks/useEnhancedBooking";
import BookingFormHeader from "./BookingFormHeader";
import TourSelectionSection from "./TourSelectionSection";
import CalendarSection from "./CalendarSection";
import TravelersSection from "./TravelersSection";
import AccommodationSection from "./AccommodationSection";
import AddOnsSection from "./AddOnsSection";
import PromotionalSection from "./PromotionalSection";
import GuestInfoSection from "./GuestInfoSection";
import BookingSummarySection from "./BookingSummarySection";
import BookingSubmitButton from "./BookingSubmitButton";

interface EnhancedBookingFormProps {
  preselectedTourId?: string;
}

export default function EnhancedBookingForm({ preselectedTourId }: EnhancedBookingFormProps) {
  const {
    form,
    selectedTourId,
    setSelectedTourId,
    tours,
    toursLoading,
    selectedTour,
    customers,
    setCustomers,
    hasAvailability,
    createPayment,
    onSubmit,
    pricingLoading,
    pricingError,
  } = useEnhancedBookingForm(preselectedTourId);

  const {
    bookingData,
    updateBookingData,
    calculateTotals,
  } = useEnhancedBooking();

  const isMultiDayTour = selectedTour?.tour_type === 'multiple_day';
  const selectedDate = form.watch("bookingDate");
  const totals = calculateTotals();

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      <BookingFormHeader />
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <TourSelectionSection
            control={form.control}
            tours={tours}
            toursLoading={toursLoading}
            onTourChange={setSelectedTourId}
            preselectedTourId={preselectedTourId}
          />

          <CalendarSection
            selectedTourId={selectedTourId}
            selectedDate={selectedDate}
            onDateSelect={(date) => form.setValue("bookingDate", date)}
            checkInDate={bookingData.checkInDate}
            checkOutDate={bookingData.checkOutDate}
            onCheckInSelect={(date) => updateBookingData({ checkInDate: date })}
            onCheckOutSelect={(date) => updateBookingData({ checkOutDate: date })}
            isMultiDay={isMultiDayTour}
          />

          <TravelersSection
            selectedTourId={selectedTourId}
            selectedDate={selectedDate}
            selectedTour={selectedTour}
            customers={customers}
            onCustomersChange={setCustomers}
          />

          <AccommodationSection
            isMultiDayTour={isMultiDayTour}
            selectedTourId={selectedTourId}
            customers={customers}
            selectedRooms={bookingData.rooms || []}
            onRoomsChange={(rooms) => updateBookingData({ rooms })}
          />

          <AddOnsSection
            selectedTourId={selectedTourId}
            customers={customers}
            selectedAddOns={bookingData.addOns || []}
            onAddOnsChange={(addOns) => updateBookingData({ addOns })}
          />

          <PromotionalSection
            selectedTourId={selectedTourId}
            appliedCode={bookingData.promotionalCode}
            onCodeApply={(code, discount) => {
              updateBookingData({ 
                promotionalCode: code, 
                discountAmount: discount 
              });
            }}
            bookingTotal={totals.subtotal}
          />

          <GuestInfoSection 
            customers={customers}
            control={form.control}
          />

          <BookingSummarySection
            customers={customers}
            totals={totals}
            pricingLoading={pricingLoading}
            pricingError={pricingError}
          />

          <BookingSubmitButton
            isPending={createPayment.isPending}
            hasAvailability={hasAvailability}
            pricingLoading={pricingLoading}
            customers={customers}
            finalTotal={totals.finalTotal}
          />
        </form>
      </Form>
    </div>
  );
}
