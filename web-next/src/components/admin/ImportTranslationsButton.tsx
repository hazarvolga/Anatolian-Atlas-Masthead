"use client";


import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Upload, Loader2 } from 'lucide-react';
import { useCreateTranslation } from '@/hooks/useTranslations';
import { toast } from 'sonner';
import { en } from '@/locales/en';
import { tr } from '@/locales/tr';
import { it } from '@/locales/it';
import { es } from '@/locales/es';

const translations = {
  en,
  tr,
  it,
  es
};

export default function ImportTranslationsButton() {
  const [isImporting, setIsImporting] = useState(false);
  const createTranslation = useCreateTranslation();

  const flattenObject = (obj: any, prefix = ''): Record<string, string> => {
    const flattened: Record<string, string> = {};
    
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        const newKey = prefix ? `${prefix}.${key}` : key;
        
        if (typeof obj[key] === 'object' && obj[key] !== null && !Array.isArray(obj[key])) {
          Object.assign(flattened, flattenObject(obj[key], newKey));
        } else {
          flattened[newKey] = String(obj[key]);
        }
      }
    }
    
    return flattened;
  };

  const getCategoryFromKey = (key: string): string => {
    const parts = key.split('.');
    return parts[0] || 'general';
  };

  const importTranslations = async () => {
    setIsImporting(true);
    
    try {
      let importCount = 0;
      
      for (const [language, translationObj] of Object.entries(translations)) {
        console.log(`${language} dili için çeviriler aktarılıyor...`);
        
        const flattenedTranslations = flattenObject(translationObj);
        
        for (const [key, value] of Object.entries(flattenedTranslations)) {
          try {
            await createTranslation.mutateAsync({
              key,
              language,
              value,
              category: getCategoryFromKey(key),
              is_auto_translated: false
            });
            importCount++;
          } catch (error) {
            // Eğer çeviri zaten varsa, hata vermez sadece geçer
            console.log(`${key} - ${language} çevirisi zaten mevcut veya hata: ${error}`);
          }
        }
      }
      
      toast.success(`${importCount} çeviri başarıyla aktarıldı`);
    } catch (error) {
      console.error('Çeviriler aktarılırken hata:', error);
      toast.error('Çeviriler aktarılırken hata oluştu');
    } finally {
      setIsImporting(false);
    }
  };

  return (
    <Button
      onClick={importTranslations}
      disabled={isImporting}
      variant="outline"
      className="flex items-center space-x-2"
    >
      {isImporting ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <Upload className="h-4 w-4" />
      )}
      <span>
        {isImporting ? 'Aktarılıyor...' : 'Statik Çevirileri Aktar'}
      </span>
    </Button>
  );
}
