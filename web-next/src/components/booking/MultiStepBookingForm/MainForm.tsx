"use client";

import { useState, useEffect, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, CreditCard, Wallet } from "lucide-react";
import { Form } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuth } from "@/contexts/AuthContext";
import { useTours } from "@/hooks/useTours";
import { useRealTimePricing } from "@/hooks/useRealTimePricing";
import { toast } from "@/components/ui/use-toast";
import FormHeader from "./FormHeader";
import StepNavigation from "./StepNavigation";
import StepCard from "./StepCard";
import StepContentRenderer from "./StepContentRenderer";
import { formSchema, FormData, MultiStepBookingFormProps } from "./formConfig";
import { useStepConfiguration } from "./stepConfig";
import { useBookingMutations } from "./formHandlers";
import { useStepValidation } from "./stepValidation";

export default function MainForm({ preselectedTourId }: MultiStepBookingFormProps) {
  const { user } = useAuth();
  const { data: tours = [], isLoading: toursLoading } = useTours();
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedTourId] = useState(preselectedTourId || "");
  const [checkInDate, setCheckInDate] = useState<Date>();
  const [adults, setAdults] = useState(2);
  const [children, setChildren] = useState(0);
  const [rooms, setRooms] = useState<any[]>([]);
  const [addOns, setAddOns] = useState<string[]>([]);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [currentAction, setCurrentAction] = useState<'full' | 'deposit' | 'reserve' | null>(null);
  const [pendingAction, setPendingAction] = useState<'full' | 'deposit' | 'reserve' | null>(null);

  // Find selected tour
  const selectedTour = tours.find((tour) => tour.id === selectedTourId);
  const isMultiDayTour = selectedTour?.tour_type === 'multiple_day';

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      tourId: preselectedTourId || "",
      adults: adults,
      children: children,
      guestName: "",
      guestEmail: user?.email || "",
      guestPhone: "",
      specialRequests: "",
    },
  });

  const updateFormValues = () => {
    form.setValue("adults", adults);
    form.setValue("children", children);
  };

  useEffect(() => {
    updateFormValues();
  }, [adults, children]);

  const { formSteps } = useStepConfiguration(isMultiDayTour);
  const bookingMutations = useBookingMutations(user);
  const { validateCurrentStep } = useStepValidation(
    formSteps,
    currentStep,
    adults,
    children,
    rooms,
    checkInDate,
    isMultiDayTour,
    form
  );

  // Multi-day turlarda odalardan yolcu sayılarını hesapla
  const effectiveGuests = useMemo(() => {
    if (isMultiDayTour && rooms.length > 0) {
      const roomGuests = {
        adults: rooms.reduce((sum, room) => sum + (room.adults || 0), 0),
        children: rooms.reduce((sum, room) => sum + (room.children || 0), 0)
      };
      return roomGuests;
    }
    return { adults, children };
  }, [isMultiDayTour, rooms, adults, children]);

  const { pricing, isLoading: pricingLoading } = useRealTimePricing(
    selectedTourId,
    checkInDate,
    undefined,
    rooms,
    addOns,
    effectiveGuests.adults,
    effectiveGuests.children
  );

  const updateGuestsFromRooms = (newRooms: any[]) => {
    if (isMultiDayTour && newRooms.length > 0) {
      const totalAdults = newRooms.reduce((sum, room) => sum + (room.adults || 0), 0);
      const totalChildren = newRooms.reduce((sum, room) => sum + (room.children || 0), 0);
      
      // Always update guest counts based on selected rooms for multi-day tours
      setAdults(totalAdults > 0 ? totalAdults : 0);
      setChildren(totalChildren >= 0 ? totalChildren : 0);
      
      console.log('Updated guests from rooms:', { 
        totalAdults, 
        totalChildren, 
        rooms: newRooms.map(r => `${r.type}: ${r.adults} adults, ${r.children} children`) 
      });
    }
    setRooms(newRooms);
  };

  const nextStep = () => {
    if (validateCurrentStep()) {
      setCurrentStep(prev => Math.min(prev + 1, formSteps.length));
    }
  };

  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const progressPercentage = ((currentStep - 1) / (formSteps.length - 1)) * 100;

  const handlePaymentAction = async (values: FormData) => {
    if (!checkInDate) {
      toast({
        title: "Departure Date Required",
        description: "Please select a departure date before completing your reservation.",
        variant: "destructive",
      });
      return;
    }

    if (!currentAction) return;
    
    setIsProcessingPayment(true);
    try {
      if (currentAction === 'reserve') {
        await bookingMutations.handleReserve(
          values,
          checkInDate,
          adults,
          children,
          rooms,
          addOns,
          pricing?.total ?? 0
        );
      } else {
        const result = await bookingMutations.handlePayment(
          values,
          checkInDate,
          adults,
          children,
          rooms,
          addOns,
          pricing?.total ?? 0,
          currentAction
        );
        if (result?.url) {
          window.location.href = result.url;
        }
      }
    } catch (error) {
      console.error('Action failed:', error);
    } finally {
      setIsProcessingPayment(false);
      setCurrentAction(null);
    }
  };

  useEffect(() => {
    if (pendingAction) {
      form.handleSubmit(handlePaymentAction)();
      setPendingAction(null);
    }
    // eslint-disable-next-line
  }, [pendingAction]);

  const handleAction = (action: 'full' | 'deposit' | 'reserve') => {
    setCurrentAction(action);
    setPendingAction(action);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <Form {...form}>
        <form onSubmit={(e) => e.preventDefault()}>
          <FormHeader tourName={selectedTour?.name} />

          <StepNavigation
            steps={formSteps}
            currentStep={currentStep}
            isMultiDayTour={isMultiDayTour}
            onPrev={prevStep}
            onNext={nextStep}
            progress={progressPercentage}
            isFirstStep={currentStep === 1}
            isLastStep={currentStep === formSteps.length}
          />

          {/* Step Content */}
          <StepCard
            stepNumber={currentStep}
            stepTitle={formSteps[currentStep - 1]?.title || ""}
          >
            <StepContentRenderer
              currentStep={currentStep}
              formSteps={formSteps}
              selectedTourId={selectedTourId}
              adults={adults}
              children={children}
              rooms={rooms}
              checkInDate={checkInDate}
              isMultiDayTour={isMultiDayTour}
              selectedTour={selectedTour}
              pricing={pricing}
              roomPrices={pricing?.roomPrices || {}}
              pricingLoading={pricingLoading}
              control={form.control}
              onAdultsChange={setAdults}
              onChildrenChange={setChildren}
              updateGuestsFromRooms={updateGuestsFromRooms}
              onCheckInSelect={setCheckInDate}
            />
          </StepCard>

          {/* Navigation & Settlement Ledger Buttons */}
          <div className="flex flex-wrap items-start justify-between gap-4 mt-8 pt-6 border-t border-border">
            <button
              type="button"
              onClick={prevStep}
              disabled={currentStep === 1}
              className="btn-outline py-3.5 px-6 disabled:opacity-40 disabled:pointer-events-none"
            >
              <ChevronLeft className="w-4 h-4 mr-2" />
              Previous Stage
            </button>

            {currentStep === formSteps.length ? (
              <div className="flex flex-col sm:flex-row flex-wrap gap-3">
                <button
                  type="button"
                  className="btn-primary py-3.5 px-6"
                  disabled={isProcessingPayment || pricingLoading || !checkInDate}
                  onClick={() => handleAction("full")}
                >
                  <CreditCard className="w-4 h-4 mr-2" />
                  {isProcessingPayment && currentAction === "full"
                    ? "Processing..."
                    : `Full Settlement — €${(pricing?.total ?? 0).toFixed(2)}`}
                </button>

                <button
                  type="button"
                  className="btn-secondary py-3.5 px-6"
                  disabled={isProcessingPayment || pricingLoading || !checkInDate}
                  onClick={() => handleAction("deposit")}
                >
                  <Wallet className="w-4 h-4 mr-2" />
                  {isProcessingPayment && currentAction === "deposit"
                    ? "Processing..."
                    : `20% Deposit — €${
                        pricing?.deposit
                          ? pricing.deposit.toFixed(2)
                          : ((pricing?.total ?? 0) * 0.2).toFixed(2)
                      }`}
                </button>

                <button
                  type="button"
                  className="btn-outline py-3.5 px-6"
                  disabled={isProcessingPayment || !checkInDate}
                  onClick={() => handleAction("reserve")}
                >
                  {isProcessingPayment && currentAction === "reserve"
                    ? "Processing..."
                    : "Hold Reservation Only"}
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={nextStep}
                className="btn-primary py-3.5 px-7"
              >
                Next Stage
                <ChevronRight className="w-4 h-4 ml-2" />
              </button>
            )}
          </div>
        </form>
      </Form>
    </div>
  );
}
