"use client";


import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "@/components/ui/use-toast";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3001';

interface EmailNotificationData {
  bookingId: string;
  type: 'confirmation' | 'cancellation' | 'completion';
}

export const useEmailNotifications = () => {
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3001';

  return useMutation({
    mutationFn: async (data: EmailNotificationData) => {
      console.log('Sending email notification:', data);
      try {
        const response = await axios.post(`${API_BASE_URL}/api/email/send-notification`, data, {
          headers: { Authorization: `Bearer ${localStorage.getItem('authToken')}` }
        });
        return response.data;
      } catch (err: any) {
        console.error('Error sending email:', err.response?.data || err.message);
        throw new Error(err.response?.data?.message || 'Failed to send email');
      }
    },
    onSuccess: () => {
      toast({
        title: "Email Sent",
        description: "Notification email has been sent successfully.",
      });
    },
    onError: (error: any) => {
      console.error('Email notification failed:', error);
      toast({
        title: "Email Failed",
        description: "Failed to send notification email.",
        variant: "destructive",
      });
    },
  });
};
