
import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Wand2, Loader2 } from 'lucide-react';
import { useBulkAutoTranslate } from '@/hooks/useTranslations';

const languages = [
  { code: 'en', name: 'English', flag: '🇬🇧' },
  { code: 'tr', name: 'Türkçe', flag: '🇹🇷' },
  { code: 'it', name: 'Italiano', flag: '🇮🇹' },
  { code: 'es', name: 'Español', flag: '🇪🇸' }
];

interface BulkTranslationControlsProps {
  selectedLanguage: string;
  setSelectedLanguage: (lang: string) => void;
  selectedTargetLanguages: string[];
  setSelectedTargetLanguages: React.Dispatch<React.SetStateAction<string[]>>;
  sourceTranslationsCount: number;
  totalTranslations: number;
  onBulkTranslate: () => void;
}

export default function BulkTranslationControls({
  selectedLanguage,
  setSelectedLanguage,
  selectedTargetLanguages,
  setSelectedTargetLanguages,
  sourceTranslationsCount,
  totalTranslations,
  onBulkTranslate
}: BulkTranslationControlsProps) {
  const bulkAutoTranslate = useBulkAutoTranslate();

  return (
    <Card className="p-4">
      <div className="flex items-center space-x-4">
        <div>
          <label className="text-sm font-medium">Kaynak Dil:</label>
          <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {languages.map(lang => (
                <SelectItem key={lang.code} value={lang.code}>
                  {lang.flag} {lang.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div>
          <label className="text-sm font-medium">Hedef Diller:</label>
          <div className="flex space-x-2 mt-1">
            {languages
              .filter(lang => lang.code !== selectedLanguage)
              .map(lang => (
                <Button
                  key={lang.code}
                  variant={selectedTargetLanguages.includes(lang.code) ? "default" : "outline"}
                  size="sm"
                  onClick={() => {
                    setSelectedTargetLanguages(prev => 
                      prev.includes(lang.code) 
                        ? prev.filter(l => l !== lang.code)
                        : [...prev, lang.code]
                    );
                  }}
                >
                  {lang.flag}
                </Button>
              ))}
          </div>
        </div>
        
        <Button 
          onClick={onBulkTranslate}
          disabled={bulkAutoTranslate.isPending || selectedTargetLanguages.length === 0}
          className="flex items-center space-x-2"
        >
          {bulkAutoTranslate.isPending ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Wand2 className="h-4 w-4" />
          )}
          <span>
            {bulkAutoTranslate.isPending ? 'Çevriliyor...' : 'Toplu Çeviri'}
          </span>
        </Button>
      </div>
      
      {/* Debug bilgileri */}
      <div className="mt-4 text-xs text-gray-500">
        <p>Kaynak dil: {selectedLanguage}</p>
        <p>Hedef diller: {selectedTargetLanguages.join(', ') || 'Seçilmedi'}</p>
        <p>Toplam çeviri: {totalTranslations}</p>
        <p>Kaynak dilde çeviri: {sourceTranslationsCount}</p>
      </div>
    </Card>
  );
}
