"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "sonner";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3001";

const getAuthHeaders = () => {
  const token = localStorage.getItem("authToken");
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export type ContactMessageStatus = "new" | "read" | "replied" | "archived";

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  subject: string;
  message: string;
  status: ContactMessageStatus;
  source: string | null;
  created_at: string;
  updated_at: string;
}

export const useAdminContactMessages = () => {
  return useQuery({
    queryKey: ["admin-contact-messages"],
    queryFn: async () => {
      try {
        const { data } = await axios.get(`${API_BASE_URL}/api/admin/contact-messages`, {
          headers: getAuthHeaders(),
        });
        return data as ContactMessage[];
      } catch (err: unknown) {
        const message = axios.isAxiosError(err) ? err.response?.data?.message : undefined;
        throw new Error(message || "Failed to fetch contact messages");
      }
    },
  });
};

export const useAdminUpdateContactMessageStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, status }: { id: string; status: ContactMessageStatus }) => {
      const { data } = await axios.patch(
        `${API_BASE_URL}/api/admin/contact-messages/${id}`,
        { status },
        { headers: getAuthHeaders() }
      );
      return data as ContactMessage;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-contact-messages"] });
      toast.success("Message status updated");
    },
    onError: (error: unknown) => {
      const message = axios.isAxiosError(error) ? error.response?.data?.message : undefined;
      toast.error(message || "Failed to update message status.");
    },
  });
};