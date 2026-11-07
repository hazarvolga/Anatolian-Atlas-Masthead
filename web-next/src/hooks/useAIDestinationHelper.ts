"use client";

import { useState } from "react";
import axios from "axios";
import { API_BASE_URL } from "@/lib/api/client";

const BASE_FUNC_URL = `${API_BASE_URL}/api`;

export function useAIDestinationHelper({ accessToken }: { accessToken: string | null }) {
  const [loading, setLoading] = useState(false);
  const [aiResult, setAIResult] = useState<string | null>(null);
  const [imageHelper, setImageHelper] = useState<{ alt?: string; valid?: boolean; error?: string } | null>(null);
  const [enrichedData, setEnrichedData] = useState<{ coords?: string, bestTime?: string, activities?: string[], error?: string, rawText?: string }|null>(null);

  // Description generation
  const askAIForDescription = async (name: string, country?: string, city?: string) => {
    setLoading(true);
    setAIResult(null);
    try {
      const response = await fetch(`${BASE_FUNC_URL}/ai-destination-helper`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          action: "generate_description",
          name,
          country,
          city,
        }),
      });
      const data = await response.json();
      if (response.ok) setAIResult(data.suggestion);
      else setAIResult("AI önerisi alınamadı: " + (data.error || "Bilinmeyen hata"));
    } catch (e: any) {
      setAIResult(
        e.message.includes("AI anahtarı eksik")
          ? "AI Settings bölümünden API anahtarı kaydetmeniz gerekmektedir!" 
          : e.message || "Beklenmeyen hata oluştu"
      );
    }
    setLoading(false);
  };

  // Image helper
  const getImageAltText = async (imageUrl: string, name: string) => {
    setImageHelper(null);
    setLoading(true);
    try {
      const response = await fetch(`${BASE_FUNC_URL}/ai-destination-helper`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          action: "image_alt",
          imageUrl,
          name,
        }),
      });
      const data = await response.json();
      if (response.ok) setImageHelper({ alt: data.alt, valid: data.valid });
      else setImageHelper({ error: data.error });
    } catch (e: any) {
      setImageHelper({ 
        error: e.message.includes("AI anahtarı eksik")
          ? "AI Settings bölümünden API anahtarı kaydediniz!"
          : e.message 
      });
    }
    setLoading(false);
  };

  const enrichData = async (name: string, country?: string, city?: string) => {
    setEnrichedData(null);
    setLoading(true);
    try {
      const response = await axios.post(`${API_BASE_URL}/api/ai/enrich-data`, {
        name,
        country,
        city,
      }, {
        headers: {
          "Authorization": `Bearer ${accessToken}`,
        },
      });
      if (response.status === 200) setEnrichedData(response.data);
      else setEnrichedData({ error: response.data.error });
    } catch (e: any) {
      setEnrichedData({ 
        error: e.message.includes("AI anahtarı eksik")
          ? "AI API anahtarı eksik! AI Settings formundan kaydetmelisiniz."
          : e.message 
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
