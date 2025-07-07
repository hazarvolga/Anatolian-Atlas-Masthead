import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "@/components/ui/use-toast";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001';

const getAuthHeaders = () => {
  const token = localStorage.getItem('authToken');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export interface Destination {
  id: string;
  name: string;
  description?: string;
  image_url?: string;
  country?: string;
  city?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  coords?: string;
  best_time?: string;
  activities?: string;
  google_maps_url?: string;
  gallery_images?: string[];
  extra_info?: string;
}

export interface CreateDestinationData {
  name: string;
  description?: string;
  image_url?: string;
  country?: string;
  city?: string;
  is_active?: boolean;
  coords?: string;
  best_time?: string;
  activities?: string;
  google_maps_url?: string;
  gallery_images?: string[];
  extra_info?: string;
}

export const useDestinations = () => {
  return useQuery({
    queryKey: ['destinations'],
    queryFn: async () => {
      const { data } = await axios.get(`${API_BASE_URL}/api/destinations`);
      return data;
    },
  });
};

export const useAdminDestinations = () => {
  return useQuery({
    queryKey: ['admin-destinations'],
    queryFn: async () => {
      const { data } = await axios.get(`${API_BASE_URL}/api/admin/destinations`, { headers: getAuthHeaders() });
      return data;
    },
  });
};

export const useCreateDestination = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (destinationData: CreateDestinationData) => {
      const { data } = await axios.post(`${API_BASE_URL}/api/admin/destinations`, destinationData, { headers: getAuthHeaders() });
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-destinations'] });
      queryClient.invalidateQueries({ queryKey: ['destinations'] });
      toast({
        title: "Destinasyon Oluşturuldu",
        description: "Destinasyon başarıyla oluşturuldu.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Oluşturma Başarısız",
        description: error.response?.data?.message || "Destinasyon oluşturulurken bir hata oluştu.",
        variant: "destructive",
      });
    },
  });
};

export const useUpdateDestination = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ destinationId, destinationData }: { destinationId: string; destinationData: Partial<CreateDestinationData> }) => {
      const { data } = await axios.put(`${API_BASE_URL}/api/admin/destinations/${destinationId}`, destinationData, { headers: getAuthHeaders() });
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-destinations'] });
      queryClient.invalidateQueries({ queryKey: ['destinations'] });
      toast({
        title: "Destinasyon Güncellendi",
        description: "Destinasyon başarıyla güncellendi.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Güncelleme Başarısız",
        description: error.response?.data?.message || "Destinasyon güncellenirken bir hata oluştu.",
        variant: "destructive",
      });
    },
  });
};

export const useDeleteDestination = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (destinationId: string) => {
      await axios.delete(`${API_BASE_URL}/api/admin/destinations/${destinationId}`, { headers: getAuthHeaders() });
      return destinationId;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-destinations'] });
      queryClient.invalidateQueries({ queryKey: ['destinations'] });
      toast({
        title: "Destinasyon Silindi",
        description: "Destinasyon başarıyla silindi.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Silme Başarısız",
        description: error.response?.data?.message || "Destinasyon silinirken bir hata oluştu.",
        variant: "destructive",
      });
    },
  });
};
