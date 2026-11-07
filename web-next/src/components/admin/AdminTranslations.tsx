"use client";


import React, { useState } from 'react';
import { Languages } from 'lucide-react';
import { 
  useTranslations, 
  useTranslationKeys, 
  useAutoTranslate, 
  useCreateTranslation, 
  useUpdateTranslation,
  useBulkAutoTranslate
} from '@/hooks/useTranslations';
import { toast } from 'sonner';
import ImportTranslationsButton from './ImportTranslationsButton';
import BulkTranslationControls from './translations/BulkTranslationControls';
import TranslationTabs from './translations/TranslationTabs';

export default function AdminTranslations() {
  const [selectedLanguage, setSelectedLanguage] = useState('en');
  const [selectedTargetLanguages, setSelectedTargetLanguages] = useState<string[]>([]);

  const { data: translations = [] } = useTranslations();
  const { data: translationKeys = [] } = useTranslationKeys();
  const autoTranslate = useAutoTranslate();
  const createTranslation = useCreateTranslation();
  const updateTranslation = useUpdateTranslation();
  const bulkAutoTranslate = useBulkAutoTranslate();

  const getTranslationsByLanguage = (language: string) => {
    return translations.filter(t => t.language === language);
  };

  const getTranslationByKey = (key: string, language: string) => {
    return translations.find(t => t.key === key && t.language === language);
  };

  const handleAutoTranslate = async (key: string, sourceLanguage: string, targetLanguage: string) => {
    const sourceTranslation = getTranslationByKey(key, sourceLanguage);
    if (!sourceTranslation) {
      toast.error('Kaynak çeviri bulunamadı');
      return;
    }

    try {
      const translatedText = await autoTranslate.mutateAsync({
        text: sourceTranslation.value,
        targetLanguage,
        sourceLanguage,
        context: `Translation key: ${key}`
      });

      const existingTranslation = getTranslationByKey(key, targetLanguage);
      
      if (existingTranslation) {
        await updateTranslation.mutateAsync({
          id: existingTranslation.id,
          value: translatedText,
          is_auto_translated: true
        });
      } else {
        await createTranslation.mutateAsync({
          key,
          language: targetLanguage,
          value: translatedText,
          category: sourceTranslation.category,
          is_auto_translated: true
        });
      }
    } catch (error) {
      console.error('Çeviri hatası:', error);
      toast.error('Çeviri yapılırken hata oluştu');
    }
  };

  const handleBulkAutoTranslate = async () => {
    console.log('Toplu çeviri başlatılıyor...');
    console.log('Kaynak dil:', selectedLanguage);
    console.log('Hedef diller:', selectedTargetLanguages);
    
    if (selectedTargetLanguages.length === 0) {
      toast.error('Lütfen en az bir hedef dil seçin');
      return;
    }

    const sourceTranslations = getTranslationsByLanguage(selectedLanguage);
    console.log('Kaynak çeviriler:', sourceTranslations);
    
    if (sourceTranslations.length === 0) {
      toast.error(`${selectedLanguage} dilinde çeviri bulunamadı`);
      return;
    }

    const keys = sourceTranslations.map(t => t.key);
    console.log('Çevrilecek anahtarlar:', keys);

    try {
      toast.info('Toplu çeviri başlatıldı...');
      const result = await bulkAutoTranslate.mutateAsync({
        sourceLanguage: selectedLanguage,
        targetLanguages: selectedTargetLanguages,
        keys
      });
      console.log('Toplu çeviri sonucu:', result);
    } catch (error) {
      console.error('Toplu çeviri hatası:', error);
      toast.error('Toplu çeviri sırasında hata oluştu: ' + error.message);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Languages className="h-6 w-6" />
          <h1 className="text-2xl font-bold">Çeviri Yönetimi</h1>
        </div>
        
        <div className="flex items-center space-x-4">
          <ImportTranslationsButton />
          
          <BulkTranslationControls
            selectedLanguage={selectedLanguage}
            setSelectedLanguage={setSelectedLanguage}
            selectedTargetLanguages={selectedTargetLanguages}
            setSelectedTargetLanguages={setSelectedTargetLanguages}
            sourceTranslationsCount={getTranslationsByLanguage(selectedLanguage).length}
            totalTranslations={translations.length}
            onBulkTranslate={handleBulkAutoTranslate}
          />
        </div>
      </div>

      <TranslationTabs
        translations={translations}
        translationKeys={translationKeys}
        onAutoTranslate={handleAutoTranslate}
      />
    </div>
  );
}
