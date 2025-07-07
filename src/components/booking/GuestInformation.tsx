
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Control } from "react-hook-form";
import { BookingFormData } from "@/hooks/useBookingForm";

interface GuestInformationProps {
  control: Control<BookingFormData>;
}

export default function GuestInformation({ control }: GuestInformationProps) {
  return (
    <div className="space-y-4">
      <FormField
        control={control}
        name="guestName"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Full Name</FormLabel>
            <FormControl>
              <Input placeholder="Enter your full name" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={control}
        name="guestEmail"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Email</FormLabel>
            <FormControl>
              <Input type="email" placeholder="Enter your email" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={control}
        name="guestPhone"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Phone (Optional)</FormLabel>
            <FormControl>
              <Input placeholder="Enter your phone number" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={control}
        name="specialRequests"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Special Requests (Optional)</FormLabel>
            <FormControl>
              <Textarea 
                placeholder="Any special requirements or requests..."
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}
