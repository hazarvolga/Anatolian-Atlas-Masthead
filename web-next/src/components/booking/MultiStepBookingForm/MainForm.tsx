"use client";

import { useState, useEffect, useMemo } from "react";
import { ChevronLeft, ChevronRight, CreditCard, RotateCcw, Wallet } from "lucide-react";
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

interface PersistedBookingDraft {
  currentStep: number;
  adults: number;
  children: number;
  checkInDateIso: string | null;
  rooms: any[];
  addOns: string[];
  guestName: string;
  guestEmail: string;
  guestPhone: string;
  specialRequests: string;
  updatedAt: string;
}

function getStorageKey(tourId: string): string {
  return `nst_booking_draft_${tourId || "default"}`;
}

export default function MainForm({ preselectedTourId }: MultiStepBookingFormProps) {
  const { user } = useAuth();
  const { data: tours = [] } = useTours();
  const [selectedTourId] = useState(preselectedTourId || "");
  const storageKey = getStorageKey(selectedTourId);

  const [currentStep, setCurrentStep] = useState(1);
  const [checkInDate, setCheckInDate] = useState<Date | undefined>(() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 14);
    tomorrow.setHours(12, 0, 0, 0);
    return tomorrow;
  });
  const [adults, setAdults] = useState(2);
  const [children, setChildren] = useState(0);
  const [rooms, setRooms] = useState<any[]>([]);
  const [addOns, setAddOns] = useState<string[]>([]);
  const [hydratedFromStorage, setHydratedFromStorage] = useState(false);
  const [lastSavedIso, setLastSavedIso] = useState<string | null>(null);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [currentAction, setCurrentAction] = useState<"full" | "deposit" | "reserve" | null>(null);
  const [pendingAction, setPendingAction] = useState<"full" | "deposit" | "reserve" | null>(null);

  // Match tour by id or slug
  const selectedTour = tours.find(
    (tour) =>
      tour.id === selectedTourId ||
      (tour as unknown as { slug?: string }).slug === selectedTourId
  );
  const isMultiDayTour = selectedTour?.tour_type === "multiple_day";

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      tourId: preselectedTourId || "",
      adults: 2,
      children: 0,
      guestName: "",
      guestEmail: user?.email || "",
      guestPhone: "",
      specialRequests: "",
    },
  });

  // 1. Hydrate booking draft from sessionStorage on mount
  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const raw = window.sessionStorage.getItem(storageKey);
      if (raw) {
        const parsed = JSON.parse(raw) as Partial<PersistedBookingDraft>;
        if (typeof parsed.currentStep === "number" && parsed.currentStep >= 1) {
          setCurrentStep(parsed.currentStep);
        }
        if (typeof parsed.adults === "number" && parsed.adults >= 1) {
          setAdults(parsed.adults);
          form.setValue("adults", parsed.adults);
        }
        if (typeof parsed.children === "number" && parsed.children >= 0) {
          setChildren(parsed.children);
          form.setValue("children", parsed.children);
        }
        if (parsed.checkInDateIso) {
          const restoredDate = new Date(parsed.checkInDateIso);
          if (!Number.isNaN(restoredDate.getTime())) {
            setCheckInDate(restoredDate);
          }
        }
        if (Array.isArray(parsed.rooms)) {
          setRooms(parsed.rooms);
        }
        if (Array.isArray(parsed.addOns)) {
          setAddOns(parsed.addOns);
        }
        if (typeof parsed.guestName === "string") {
          form.setValue("guestName", parsed.guestName);
        }
        if (typeof parsed.guestEmail === "string" && parsed.guestEmail) {
          form.setValue("guestEmail", parsed.guestEmail);
        }
        if (typeof parsed.guestPhone === "string") {
          form.setValue("guestPhone", parsed.guestPhone);
        }
        if (typeof parsed.specialRequests === "string") {
          form.setValue("specialRequests", parsed.specialRequests);
        }
        if (parsed.updatedAt) {
          setLastSavedIso(parsed.updatedAt);
        }
      }
    } catch {
      // Ignore corrupt sessionStorage payloads
    } finally {
      setHydratedFromStorage(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [storageKey]);

  const watchedGuestName = form.watch("guestName");
  const watchedGuestEmail = form.watch("guestEmail");
  const watchedGuestPhone = form.watch("guestPhone");
  const watchedSpecialRequests = form.watch("specialRequests");

  // 2. Persist booking draft to sessionStorage whenever any stage or field changes
  useEffect(() => {
    if (!hydratedFromStorage || typeof window === "undefined") return;
    try {
      const nowIso = new Date().toISOString();
      const snapshot: PersistedBookingDraft = {
        currentStep,
        adults,
        children,
        checkInDateIso: checkInDate ? checkInDate.toISOString() : null,
        rooms,
        addOns,
        guestName: watchedGuestName || "",
        guestEmail: watchedGuestEmail || "",
        guestPhone: watchedGuestPhone || "",
        specialRequests: watchedSpecialRequests || "",
        updatedAt: nowIso,
      };
      window.sessionStorage.setItem(storageKey, JSON.stringify(snapshot));
      setLastSavedIso(nowIso);
    } catch {
      // Ignore storage quota errors
    }
  }, [
    hydratedFromStorage,
    storageKey,
    currentStep,
    adults,
    children,
    checkInDate,
    rooms,
    addOns,
    watchedGuestName,
    watchedGuestEmail,
    watchedGuestPhone,
    watchedSpecialRequests,
  ]);

  useEffect(() => {
    form.setValue("adults", adults);
    form.setValue("children", children);
  }, [adults, children, form]);

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

  const effectiveGuests = useMemo(() => {
    if (isMultiDayTour && rooms.length > 0) {
      return {
        adults: rooms.reduce((sum, room) => sum + (room.adults || 0), 0),
        children: rooms.reduce((sum, room) => sum + (room.children || 0), 0),
      };
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
      setAdults(totalAdults > 0 ? totalAdults : 0);
      setChildren(totalChildren >= 0 ? totalChildren : 0);
    }
    setRooms(newRooms);
  };

  const nextStep = () => {
    if (validateCurrentStep()) {
      setCurrentStep((prev) => Math.min(prev + 1, formSteps.length));
    }
  };

  const prevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const resetDraft = () => {
    if (typeof window !== "undefined") {
      window.sessionStorage.removeItem(storageKey);
    }
    setCurrentStep(1);
    setAdults(2);
    setChildren(0);
    setRooms([]);
    setAddOns([]);
    form.reset({
      tourId: preselectedTourId || "",
      adults: 2,
      children: 0,
      guestName: "",
      guestEmail: user?.email || "",
      guestPhone: "",
      specialRequests: "",
    });
    setLastSavedIso(null);
  };

  const progressPercentage = ((currentStep - 1) / Math.max(formSteps.length - 1, 1)) * 100;

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
      if (currentAction === "reserve") {
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
      console.error("Action failed:", error);
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pendingAction]);

  const handleAction = (action: "full" | "deposit" | "reserve") => {
    setCurrentAction(action);
    setPendingAction(action);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <Form {...form}>
        <form onSubmit={(e) => e.preventDefault()}>
          {/* Session State Persistence Status Strip */}
          <div
            data-testid="booking-session-ledger"
            className="mb-6 px-4 py-2.5 border border-border bg-card flex flex-wrap items-center justify-between gap-3 font-mono text-[11px] uppercase tracking-widest text-text-secondary"
          >
            <div className="flex items-center gap-2">
              <span className="inline-block w-2 h-2 rounded-full bg-primary" />
              <span>
                SESSION LEDGER ACTIVE · STAGE 0{currentStep} OF 0{formSteps.length}
                {lastSavedIso ? " · AUTO-SAVED TO SESSION" : ""}
              </span>
            </div>
            <button
              type="button"
              onClick={resetDraft}
              className="inline-flex items-center gap-1.5 text-[11px] font-mono uppercase tracking-widest text-text-secondary hover:text-foreground transition-colors"
            >
              <RotateCcw className="w-3 h-3" />
              Reset Draft
            </button>
          </div>

          <FormHeader tourName={selectedTour?.name || selectedTour?.title} />

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
              data-testid="booking-prev-stage"
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
                data-testid="booking-next-stage"
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
