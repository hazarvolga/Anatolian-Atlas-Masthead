
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Edit3, Save, X, Wand2, Loader2 } from 'lucide-react';
import { Translation, TranslationKey, useAutoTranslate, useUpdateTranslation } from '@/hooks/useTranslations';

interface TranslationItemProps {
  keyData: TranslationKey;
  translation: Translation | undefined;
  language: string;
  onAutoTranslate: (key: string, sourceLanguage: string, targetLanguage: string) => void;
}

export default function TranslationItem({
  keyData,
  translation,
  language,
  onAutoTranslate
}: TranslationItemProps) {
  const [editingTranslation, setEditingTranslation] = useState<string | null>(null);
  const [editValue, setEditValue] = useState('');
  const autoTranslate = useAutoTranslate();
  const updateTranslation = useUpdateTranslation();

  const handleEdit = (translation: Translation) => {
    setEditingTranslation(translation.id);
    setEditValue(translation.value);
  };

  const handleSave = async (translation: Translation) => {
    try {
      await updateTranslation.mutateAsync({
        id: translation.id,
        value: editValue,
        is_auto_translated: false
      });
      setEditingTranslation(null);
      setEditValue('');
    } catch (error) {
      console.error('Çeviri güncellenirken hata:', error);
    }
  };

  const isEditing = editingTranslation === translation?.id;

  return (
    <div className="border rounded-lg p-4">
      <div className="flex items-start justify-between mb-2">
        <div>
          <code className="text-sm bg-gray-100 px-2 py-1 rounded">
            {keyData.key}
          </code>
          <Badge variant="outline" className="ml-2">
            {keyData.category}
          </Badge>
          {translation?.is_auto_translated && (
            <Badge variant="secondary" className="ml-2">
              AI Çevirisi
            </Badge>
          )}
        </div>
        
        <div className="flex items-center space-x-2">
          {translation && !isEditing && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleEdit(translation)}
            >
              <Edit3 className="h-4 w-4" />
            </Button>
          )}
          
          {!translation && language !== 'en' && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onAutoTranslate(keyData.key, 'en', language)}
              disabled={autoTranslate.isPending}
            >
              {autoTranslate.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Wand2 className="h-4 w-4" />
              )}
            </Button>
          )}
        </div>
      </div>
      
      {translation ? (
        isEditing ? (
          <div className="space-y-2">
            <Textarea
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              className="min-h-[80px]"
            />
            <div className="flex justify-end space-x-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setEditingTranslation(null);
                  setEditValue('');
                }}
              >
                <X className="h-4 w-4" />
              </Button>
              <Button
                size="sm"
                onClick={() => handleSave(translation)}
                disabled={updateTranslation.isPending}
              >
                {updateTranslation.isPending ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Save className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>
        ) : (
          <p className="text-sm text-gray-600">{translation.value}</p>
        )
      ) : (
        <p className="text-sm text-gray-400 italic">Çeviri mevcut değil</p>
      )}
    </div>
  );
}
