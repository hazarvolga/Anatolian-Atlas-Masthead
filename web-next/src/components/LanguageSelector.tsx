"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Globe } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

type LanguageOption = {
  code: string;
  label: string;
  name: string;
};

const LANGUAGES: LanguageOption[] = [
  { code: "en", label: "EN", name: "English" },
  { code: "tr", label: "TR", name: "Türkçe" },
  { code: "es", label: "ES", name: "Español" },
  { code: "it", label: "IT", name: "Italiano" },
];

export default function LanguageSelector() {
  const { language, setLanguage } = useLanguage();

  return (
    <div className="flex items-center">
      <Select value={language} onValueChange={setLanguage}>
        <SelectTrigger
          className="h-9 w-auto min-w-[4.5rem] px-2.5 gap-1.5 border border-border/70 hover:border-foreground rounded-control bg-transparent font-mono text-[10px] uppercase tracking-[0.12em] focus:ring-0"
          aria-label="Select Language"
        >
          <Globe className="h-3.5 w-3.5 text-text-secondary shrink-0" />
          <SelectValue placeholder="EN">
            {language.toUpperCase()}
          </SelectValue>
        </SelectTrigger>
        <SelectContent
          align="end"
          className="w-[150px] rounded-card border-border bg-card"
        >
          {LANGUAGES.map((lang) => (
            <SelectItem
              key={lang.code}
              value={lang.code}
              className="cursor-pointer text-xs font-sans"
            >
              <span className="font-mono text-[10px] uppercase tracking-wider text-primary mr-2">
                {lang.label}
              </span>
              <span>{lang.name}</span>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
