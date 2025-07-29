
import { Control } from "react-hook-form";
import GuestDetailsStep from "../steps/GuestDetailsStep";
import AccommodationStepSimple from "../steps/AccommodationStepSimple";
import SingleDateSelectionStep from "../steps/SingleDateSelectionStep";
import GuestInfoStep from "../steps/GuestInfoStep";
import ReviewStep from "../steps/ReviewStep";
import { FormData } from "./formConfig";

interface StepContentRendererProps {
  currentStep: number;
  formSteps: any[];
  selectedTourId: string;
  adults: number;
  children: number;
  rooms: any[];
  checkInDate?: Date;
  isMultiDayTour: boolean;
  selectedTour: any;
  pricing: any;
  roomPrices?: Record<string, number>;
  pricingLoading: boolean;
  control: Control<FormData>;
  onAdultsChange: (value: number) => void;
  onChildrenChange: (value: number) => void;
  updateGuestsFromRooms: (rooms: any[]) => void;
  onCheckInSelect: (date: Date) => void;
}

export default function StepContentRenderer({
  currentStep,
  formSteps,
  selectedTourId,
  adults,
  children,
  rooms,
  checkInDate,
  isMultiDayTour,
  selectedTour,
  pricing,
  roomPrices = {},
  pricingLoading,
  control,
  onAdultsChange,
  onChildrenChange,
  updateGuestsFromRooms,
  onCheckInSelect
}: StepContentRendererProps) {
  const currentKey = formSteps[currentStep - 1]?.key;
  if (!currentKey) return null;

  switch (currentKey) {
    case "travelers":
      return (
        <GuestDetailsStep
          adults={adults}
          children={children}
          onAdultsChange={onAdultsChange}
          onChildrenChange={onChildrenChange}
        />
      );
    case "accommodation":
      return (
        <AccommodationStepSimple
          rooms={rooms}
          roomPrices={roomPrices}
          onRoomsChange={updateGuestsFromRooms}
        />
      );
    case "dates":
      return (
        <SingleDateSelectionStep
          selectedTourId={selectedTourId}
          checkInDate={checkInDate}
          onCheckInSelect={onCheckInSelect}
          isMultiDay={isMultiDayTour}
        />
      );
    case "details":
      return <GuestInfoStep control={control} />;
    case "review":
      return (
        <ReviewStep
          selectedTour={selectedTour}
          checkInDate={checkInDate}
          checkOutDate={undefined}
          adults={isMultiDayTour ? rooms.reduce((sum, room) => sum + (room.adults || 0), 0) : adults}
          children={isMultiDayTour ? rooms.reduce((sum, room) => sum + (room.children || 0), 0) : children}
          rooms={rooms}
          pricing={pricing}
          pricingLoading={pricingLoading}
        />
      );
    default:
      return null;
  }
}
