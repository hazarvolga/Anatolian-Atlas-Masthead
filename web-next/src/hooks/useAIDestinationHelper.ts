"use client";

import { useState } from "react";
import { api } from "@/lib/api/client";

export function useAIDestinationHelper({
  accessToken,
}: {
  accessToken?: string | null;
}) {
  const [loading, setLoading] = useState(false);
  const [aiResult, setAIResult] = useState<string | null>(null);
  const [imageHelper, setImageHelper] = useState<{
    alt?: string;
    valid?: boolean;
    error?: string;
  } | null>(null);
  const [enrichedData, setEnrichedData] = useState<{
    coords?: string;
    bestTime?: string;
    activities?: string[];
    error?: string;
    rawText?: string;
  } | null>(null);

  const askAIForDescription = async (
    name: string,
    country?: string,
    city?: string
  ) => {
    setLoading(true);
    setAIResult(null);
    try {
      const { data } = await api.post(
        "/api/ai-destination-helper",
        {
          action: "generate_description",
          name,
          country,
          city,
        },
        accessToken
          ? { headers: { Authorization: `Bearer ${accessToken}` } }
          : undefined
      );
      if (data?.suggestion) setAIResult(data.suggestion);
      else
        setAIResult(
          "AI önerisi alınamadı: " + (data?.error || "Bilinmeyen hata")
        );
    } catch (e: any) {
      const msg = e.response?.data?.error || e.message || "";
      setAIResult(
        msg.includes("AI anahtarı eksik")
          ? "AI Settings bölümünden API anahtarı kaydetmeniz gerekmektedir!"
          : msg || "Beklenmeyen hata oluştu"
      );
    }
    setLoading(false);
  };

  const getImageAltText = async (imageUrl: string, name: string) => {
    setImageHelper(null);
    setLoading(true);
    try {
      const { data } = await api.post(
        "/api/ai-destination-helper",
        {
          action: "image_alt",
          imageUrl,
          name,
        },
        accessToken
          ? { headers: { Authorization: `Bearer ${accessToken}` } }
          : undefined
      );
      if (data?.alt) setImageHelper({ alt: data.alt, valid: data.valid });
      else setImageHelper({ error: data?.error });
    } catch (e: any) {
      const msg = e.response?.data?.error || e.message || "";
      setImageHelper({
        error: msg.includes("AI anahtarı eksik")
          ? "AI Settings bölümünden API anahtarı kaydediniz!"
          : msg,
      });
    }
    setLoading(false);
  };

  const enrichData = async (
    name: string,
    country?: string,
    city?: string
  ) => {
    setEnrichedData(null);
    setLoading(true);
    try {
      const response = await api.post(
        "/api/ai/enrich-data",
        { name, country, city },
        accessToken
          ? { headers: { Authorization: `Bearer ${accessToken}` } }
          : undefined
      );
      if (response.status === 200) setEnrichedData(response.data);
      else setEnrichedData({ error: response.data?.error });
    } catch (e: any) {
      const msg = e.response?.data?.error || e.message || "";
      setEnrichedData({
        error: msg.includes("AI anahtarı eksik")
          ? "AI API anahtarı eksik! AI Settings formundan kaydetmelisiniz."
          : msg,
      });
    }
    setLoading(false);
  };

  return {
    loading,
    aiResult,
    askAIForDescription,
    getImageAltText,
    imageHelper,
    enrichedData,
    enrichData,
  };
}
