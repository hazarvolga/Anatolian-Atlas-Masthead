
import { toast } from "@/hooks/use-toast";
import { UseFormReturn } from "react-hook-form";
import { FormData } from "./formConfig";

export const useStepValidation = (
  formSteps: any[],
  currentStep: number,
  adults: number,
  children: number,
  rooms: any[],
  checkInDate?: Date,
  isMultiDayTour?: boolean,
  form?: UseFormReturn<FormData>
) => {
  const validateCurrentStep = () => {
    const currentKey = formSteps[currentStep - 1]?.key;
    switch (currentKey) {
      case "travelers":
        if (adults < 1) {
          toast({
            title: "Adult Required",
            description: "At least 1 adult is required.",
            variant: "destructive",
          });
          return false;
        }
        return true;
      case "accommodation":
        if (isMultiDayTour && rooms.length === 0) {
          toast({
            title: "Room Selection Required",
            description: "Please configure your room preferences.",
            variant: "destructive",
          });
          return false;
        }
        return true;
      case "dates":
        if (!checkInDate) {
          toast({
            title: "Date Selection Required",
            description: "Please select your travel date.",
            variant: "destructive",
          });
          return false;
        }
        return true;
      case "details":
        if (!form) return true;
        // İletişim bilgileri zorunlu kontrolü (Full Name & Email)
        const guestName = form.getValues("guestName");
        const guestEmail = form.getValues("guestEmail");
        if (!guestName || guestName.trim().length < 2) {
          toast({
            title: "Name Required",
            description: "Please enter your full name.",
            variant: "destructive",
          });
          return false;
        }
        if (!guestEmail || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(guestEmail)) {
          toast({
            title: "Valid Email Required",
            description: "Please enter a valid email address.",
            variant: "destructive",
          });
          return false;
        }
        return true;
      default:
        return true;
    }
  };

  return { validateCurrentStep };
};
