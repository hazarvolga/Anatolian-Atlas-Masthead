
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Translation, TranslationKey } from '@/hooks/useTranslations';
import TranslationItem from './TranslationItem';

const languages = [
  { code: 'en', name: 'English', flag: '🇬🇧' },
  { code: 'tr', name: 'Türkçe', flag: '🇹🇷' },
  { code: 'it', name: 'Italiano', flag: '🇮🇹' },
  { code: 'es', name: 'Español', flag: '🇪🇸' }
];

interface TranslationTabsProps {
  translations: Translation[];
  translationKeys: TranslationKey[];
  onAutoTranslate: (key: string, sourceLanguage: string, targetLanguage: string) => void;
}

export default function TranslationTabs({
  translations,
  translationKeys,
  onAutoTranslate
}: TranslationTabsProps) {
  const getTranslationsByLanguage = (language: string) => {
    return translations.filter(t => t.language === language);
  };

  const getTranslationByKey = (key: string, language: string) => {
    return translations.find(t => t.key === key && t.language === language);
  };

  return (
    <Tabs defaultValue="en" className="w-full">
      <TabsList className="grid w-full grid-cols-4">
        {languages.map(lang => (
          <TabsTrigger key={lang.code} value={lang.code} className="flex items-center space-x-2">
            <span>{lang.flag}</span>
            <span>{lang.name}</span>
          </TabsTrigger>
        ))}
      </TabsList>

      {languages.map(language => (
        <TabsContent key={language.code} value={language.code} className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>{language.flag} {language.name} Çevirileri</span>
                <Badge variant="secondary">
                  {getTranslationsByLanguage(language.code).length} çeviri
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {translationKeys.map(keyData => (
                  <TranslationItem
                    key={keyData.key}
                    keyData={keyData}
                    translation={getTranslationByKey(keyData.key, language.code)}
                    language={language.code}
                    onAutoTranslate={onAutoTranslate}
                  />
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      ))}
    </Tabs>
  );
}
