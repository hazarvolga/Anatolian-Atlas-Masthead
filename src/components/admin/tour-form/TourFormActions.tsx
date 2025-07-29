
import { Button } from "@/components/ui/button";
import { Save } from "lucide-react";
import { TourFormData } from "@/hooks/useAdminTourForm";
import { UseFormReturn } from "react-hook-form";

interface TourFormActionsProps {
  form: UseFormReturn<TourFormData>;
  tour?: any;
  onSubmit: (data: TourFormData, shouldClose?: boolean) => Promise<void>;
}

export default function TourFormActions({ form, tour, onSubmit }: TourFormActionsProps) {
  const isSubmitting = form.formState.isSubmitting;

  return (
    <div className="flex gap-4 mt-6 pt-6 border-t">
      <Button 
        onClick={form.handleSubmit((data) => onSubmit(data, false))} 
        disabled={isSubmitting} 
        variant="outline"
        className="flex-1"
        size="lg"
      >
        <Save className="h-4 w-4 mr-2" />
        {isSubmitting ? "Saving..." : tour ? "Update Tour" : "Create Tour"}
      </Button>
      <Button 
        onClick={form.handleSubmit((data) => onSubmit(data, true))} 
        disabled={isSubmitting} 
        className="flex-1"
        size="lg"
      >
        <Save className="h-4 w-4 mr-2" />
        {isSubmitting ? "Saving..." : tour ? "Save & Close" : "Create & Close"}
      </Button>
    </div>
  );
}
