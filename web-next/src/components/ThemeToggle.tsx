"use client";

import { Moon, Palette, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useDesignSystem } from "@/contexts/DesignSystemContext";
import { THEME_PRESETS, type ThemePresetId } from "@/design/tokens";

const PRESET_ENTRIES = Object.values(THEME_PRESETS);

export default function ThemeToggle() {
  const { config, setPreset, toggleMode } = useDesignSystem();
  const isDark = config.mode === "dark";

  return (
    <div className="inline-flex items-center gap-1">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            aria-label="Select theme preset"
            className="h-9 px-2.5 rounded-control border border-border/70 hover:border-foreground font-mono text-[10px] uppercase tracking-[0.12em] gap-1.5"
          >
            <Palette className="h-3.5 w-3.5 text-primary" />
            <span className="hidden xl:inline">
              {THEME_PRESETS[config.preset].label.split(" ")[0]}
            </span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="end"
          className="w-56 rounded-card border-border bg-card p-1.5"
        >
          <DropdownMenuLabel className="font-mono text-[10px] uppercase tracking-[0.14em] text-text-secondary">
            Concept Preset
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          {PRESET_ENTRIES.map((preset) => {
            const active = config.preset === preset.id;
            return (
              <DropdownMenuItem
                key={preset.id}
                onClick={() => setPreset(preset.id as ThemePresetId, true)}
                className={`flex flex-col items-start gap-0.5 py-2 px-2.5 cursor-pointer rounded-control ${
                  active ? "bg-primary/10 text-primary font-semibold" : ""
                }`}
              >
                <div className="flex items-center justify-between w-full text-xs uppercase tracking-[0.12em]">
                  <span>{preset.label}</span>
                  <span className="font-mono text-[10px] opacity-70">
                    {preset.defaultMode}
                  </span>
                </div>
                <span className="text-[11px] text-text-secondary line-clamp-1 font-normal normal-case tracking-normal">
                  {preset.fonts.displayName.split(" (")[0]} ·{" "}
                  {preset.fonts.sansName.split(" (")[0]}
                </span>
              </DropdownMenuItem>
            );
          })}
        </DropdownMenuContent>
      </DropdownMenu>

      <Button
        variant="ghost"
        size="icon-sm"
        onClick={toggleMode}
        aria-label={`Switch to ${isDark ? "light" : "dark"} mode`}
        className="rounded-control border border-border/70 hover:border-foreground"
      >
        {isDark ? (
          <Sun className="h-4 w-4 text-primary" />
        ) : (
          <Moon className="h-4 w-4 text-foreground" />
        )}
      </Button>
    </div>
  );
}
