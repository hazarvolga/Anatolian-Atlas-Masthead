
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { toast } from 'sonner';

export interface Translation {
  id: string;
  key: string;
  language: string;
  value: string;
  category: string;
  is_auto_translated: boolean;
  created_at: string;
  updated_at: string;
}

export interface TranslationKey {
  id: string;
  key: string;
  category: string;
  description?: string;
  created_at: string;
}

export const useTranslations = () => {
  return useQuery({
    queryKey: ['translations'],
    queryFn: async () => {
      const response = await axios.get('/api/translations');
      return response.data as Translation[];
    },
  });
};

export const useTranslationKeys = () => {
  return useQuery({
    queryKey: ['translation-keys'],
    queryFn: async () => {
      const response = await axios.get('/api/translation-keys');
      return response.data as TranslationKey[];
    },
  });
};

export const useAutoTranslate = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ text, targetLanguage, sourceLanguage = 'en', context }: {
      text: string;
      targetLanguage: string;
      sourceLanguage?: string;
      context?: string;
    }) => {
      const response = await axios.post('/api/translate', {
        text, targetLanguage, sourceLanguage, context
      });
      return response.data.translatedText;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['translations'] });
    },
    onError: (error) => {
      toast.error('Çeviri sırasında hata oluştu: ' + error.message);
    }
  });
};

export const useCreateTranslation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (translation: Omit<Translation, 'id' | 'created_at' | 'updated_at'>) => {
      const response = await axios.post('/api/translations', translation);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['translations'] });
      toast.success('Çeviri başarıyla eklendi');
    },
    onError: (error) => {
      toast.error('Çeviri eklenirken hata oluştu: ' + error.message);
    }
  });
};

export const useUpdateTranslation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...updates }: Partial<Translation> & { id: string }) => {
      const response = await axios.put(`/api/translations/${id}`, { ...updates, updated_at: new Date().toISOString() });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['translations'] });
      toast.success('Çeviri başarıyla güncellendi');
    },
    onError: (error) => {
      toast.error('Çeviri güncellenirken hata oluştu: ' + error.message);
    }
  });
};

export const useBulkAutoTranslate = () => {
  const queryClient = useQueryClient();
  const autoTranslate = useAutoTranslate();
  const createTranslation = useCreateTranslation();

  return useMutation({
    mutationFn: async ({ 
      sourceLanguage = 'en', 
      targetLanguages,
      keys 
    }: {
      sourceLanguage?: string;
      targetLanguages: string[];
      keys: string[];
    }) => {
      const response = await axios.get('/api/translations', {
        params: { language: sourceLanguage, keys }
      });
      const sourceTranslations = response.data;

      const results = [];
      
      for (const targetLang of targetLanguages) {
        for (const sourceTranslation of sourceTranslations) {
          try {
            const translatedText = await autoTranslate.mutateAsync({
              text: sourceTranslation.value,
              targetLanguage: targetLang,
              sourceLanguage,
              context: `Translation key: ${sourceTranslation.key}, Category: ${sourceTranslation.category}`
            });

            await createTranslation.mutateAsync({
              key: sourceTranslation.key,
              language: targetLang,
              value: translatedText,
              category: sourceTranslation.category,
              is_auto_translated: true
            });

            results.push({
              key: sourceTranslation.key,
              language: targetLang,
              success: true
            });
          } catch (error) {
            console.error(`Failed to translate ${sourceTranslation.key} to ${targetLang}:`, error);
            results.push({
              key: sourceTranslation.key,
              language: targetLang,
              success: false,
              error: error.message
            });
          }
        }
      }

      return results;
    },
    onSuccess: (results) => {
      const successful = results.filter(r => r.success).length;
      const failed = results.filter(r => !r.success).length;
      
      if (successful > 0) {
        toast.success(`${successful} çeviri başarıyla tamamlandı`);
      }
      if (failed > 0) {
        toast.error(`${failed} çeviri başarısız oldu`);
      }
      
      queryClient.invalidateQueries({ queryKey: ['translations'] });
    },
    onError: (error) => {
      toast.error('Toplu çeviri sırasında hata oluştu: ' + error.message);
    }
  });
};
