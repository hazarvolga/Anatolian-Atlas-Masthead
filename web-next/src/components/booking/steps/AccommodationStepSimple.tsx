"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface RoomOption {
  key: string;
  label: string;
  price: number;
  maxQty: number;
  adults: number;
  children: number;
}

interface Room {
  type: string;
  quantity: number;
  adults: number;
  children: number;
  id?: string;
}

interface AccommodationStepSimpleProps {
  rooms: Room[];
  roomPrices?: Record<string, number>;
  onRoomsChange: (rooms: Room[]) => void;
}

const DEFAULT_ROOM_OPTIONS: RoomOption[] = [
  {
    key: "single",
    label: "1 Guest · Private Single Suite",
    price: 180,
    maxQty: 4,
    adults: 1,
    children: 0,
  },
  {
    key: "double",
    label: "2 Guests · Double Archival Suite",
    price: 320,
    maxQty: 3,
    adults: 2,
    children: 0,
  },
];

export default function AccommodationStepSimple({
  rooms,
  roomPrices = {},
  onRoomsChange,
}: AccommodationStepSimpleProps) {
  const roomOptions: RoomOption[] = DEFAULT_ROOM_OPTIONS.map((option) => ({
    ...option,
    price:
      roomPrices[option.key] !== undefined
        ? roomPrices[option.key]
        : option.price,
  }));

  const [qtys, setQtys] = useState<{ [k: string]: number }>(() => {
    const initial: { [k: string]: number } = {};
    roomOptions.forEach((opt) => {
      const matching = rooms.filter((r) => r.type === opt.key);
      initial[opt.key] = matching.length;
    });
    return initial;
  });

  // Sync qtys when rooms are restored from sessionStorage
  useEffect(() => {
    const nextQtys: { [k: string]: number } = {};
    roomOptions.forEach((opt) => {
      nextQtys[opt.key] = rooms.filter((r) => r.type === opt.key).length;
    });
    setQtys((prev) => {
      const changed = roomOptions.some(
        (opt) => (prev[opt.key] || 0) !== (nextQtys[opt.key] || 0)
      );
      return changed ? nextQtys : prev;
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rooms.length]);

  const emitRooms = (nextQtys: { [k: string]: number }) => {
    const updatedRooms: Room[] = [];
    roomOptions.forEach((opt) => {
      const qty = nextQtys[opt.key] || 0;
      for (let i = 0; i < qty; i++) {
        updatedRooms.push({
          id: `${opt.key}-${i}`,
          type: opt.key,
          quantity: 1,
          adults: opt.adults,
          children: opt.children,
        });
      }
    });
    onRoomsChange(updatedRooms);
  };

  const handleIncrease = (type: string) => {
    const maxQty = roomOptions.find((opt) => opt.key === type)?.maxQty ?? 4;
    const next = {
      ...qtys,
      [type]: Math.min((qtys[type] || 0) + 1, maxQty),
    };
    setQtys(next);
    emitRooms(next);
  };

  const handleDecrease = (type: string) => {
    const next = {
      ...qtys,
      [type]: Math.max((qtys[type] || 0) - 1, 0),
    };
    setQtys(next);
    emitRooms(next);
  };

  const total = roomOptions.reduce(
    (sum, opt) => sum + (qtys[opt.key] || 0) * opt.price,
    0
  );

  return (
    <Card className="border-border bg-card">
      <CardHeader>
        <CardTitle className="font-serif text-xl font-normal">
          Select Suite Allocation
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {roomOptions.map((opt) => (
            <div
              key={opt.key}
              className="flex items-center justify-between bg-background border border-border px-4 py-4"
            >
              <div>
                <div className="font-medium text-base text-foreground">
                  {opt.label}
                </div>
                <div className="font-mono text-xs text-text-secondary mt-1">
                  SUPPLEMENT RATE: €{opt.price}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  size="icon"
                  variant="outline"
                  data-testid={`room-minus-${opt.key}`}
                  aria-label={`Decrease ${opt.label}`}
                  className="w-8 h-8 border-border"
                  onClick={() => handleDecrease(opt.key)}
                  disabled={(qtys[opt.key] || 0) === 0}
                >
                  –
                </Button>
                <span
                  data-testid={`room-count-${opt.key}`}
                  aria-live="polite"
                  className="w-7 text-center font-mono text-base"
                >
                  {qtys[opt.key] || 0}
                </span>
                <Button
                  type="button"
                  size="icon"
                  variant="outline"
                  data-testid={`room-plus-${opt.key}`}
                  aria-label={`Increase ${opt.label}`}
                  className="w-8 h-8 border-border"
                  onClick={() => handleIncrease(opt.key)}
                  disabled={(qtys[opt.key] || 0) === opt.maxQty}
                >
                  +
                </Button>
              </div>
            </div>
          ))}

          <div className="flex items-center justify-between pt-4 border-t border-border font-mono text-xs uppercase tracking-widest">
            <span className="text-text-secondary">SUITE ALLOCATION TOTAL</span>
            <span className="text-foreground font-semibold text-sm">
              €{total}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
