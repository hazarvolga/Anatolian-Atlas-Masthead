"use client";

import { useMutation } from "@tanstack/react-query";
import { toast } from "@/components/ui/use-toast";
import { api } from "@/lib/api/client";

interface EmailNotificationData {
  bookingId: string;
  type: "confirmation" | "cancellation" | "completion";
}

export const useEmailNotifications = () => {
  return useMutation({
    mutationFn: async (data: EmailNotificationData) => {
      try {
        const response = await api.post("/api/email/send-notification", data);
        return response.data;
      } catch (err: any) {
        throw new Error(
          err.response?.data?.message || "Failed to send email"
        );
      }
    },
    onSuccess: () => {
      toast({
        title: "Email Sent",
        description: "Notification email has been sent successfully.",
      });
    },
    onError: () => {
      toast({
        title: "Email Failed",
        description: "Failed to send notification email.",
        variant: "destructive",
      });
    },
  });
};
