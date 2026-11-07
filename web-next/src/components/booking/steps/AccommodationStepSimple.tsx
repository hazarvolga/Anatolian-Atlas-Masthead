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
  roomPrices?: Record<string, number>; // Veritabanından alınan oda tiplerine göre fiyatlar
  onRoomsChange: (rooms: Room[]) => void;
}

// Default oda seçenekleri, fiyatlar props'tan gelmezse bu değerler kullanılır
const DEFAULT_ROOM_OPTIONS: RoomOption[] = [
  { key: "single", label: "1 Person (Single Room)", price: 100, maxQty: 4, adults: 1, children: 0 },
  { key: "double", label: "2 People (Double Room)", price: 200, maxQty: 3, adults: 2, children: 0 },
  // Triple room seçeneği admin panelden ayarlanacak
];

export default function AccommodationStepSimple({
  rooms,
  roomPrices = {}, // Default boş nesne
  onRoomsChange,
}: AccommodationStepSimpleProps) {
  // Dinamik olarak oda seçeneklerini oluştur
  const roomOptions: RoomOption[] = DEFAULT_ROOM_OPTIONS.map(option => ({
    ...option,
    // Eğer roomPrices içinde bu tip için fiyat varsa onu kullan, yoksa default fiyatı kullan
    price: roomPrices[option.key] !== undefined ? roomPrices[option.key] : option.price
  }));
  
  console.log("Room prices from DB:", roomPrices);
  console.log("Room options with prices:", roomOptions);
  
  // Her oda tipi için seçili miktar state'i
  const [qtys, setQtys] = useState<{ [k: string]: number }>(() => {
    const initial: { [k: string]: number } = {};
    roomOptions.forEach(opt => {
      initial[opt.key] = rooms.find(r => r.type === opt.key)?.quantity || 0;
    });
    return initial;
  });

  // Effect: Seçimler değişince parent'a güncelle
  useEffect(() => {
    // Her oda tipini ayrı oda olarak düşünelim, çoklu oda seçimi olduğunda
    // her biri için ayrı oda objesi oluşturalım
    let updatedRooms: Room[] = [];
    
    roomOptions.forEach(opt => {
      const qty = qtys[opt.key] || 0;
      if (qty > 0) {
        // Her bir oda için ayrı obje oluştur
        for (let i = 0; i < qty; i++) {
          updatedRooms.push({
            id: `${opt.key}-${i}`,
            type: opt.key,
            quantity: 1,
            adults: opt.adults,
            children: opt.children
          });
        }
      }
    });
    
    console.log('Updated rooms with guest counts:', updatedRooms);
    onRoomsChange(updatedRooms);
    // eslint-disable-next-line
  }, [JSON.stringify(qtys)]);

  const handleIncrease = (type: string) => {
    setQtys(prev => ({
      ...prev,
      [type]:
        Math.min((prev[type] || 0) + 1, roomOptions.find(opt => opt.key === type)!.maxQty)
    }));
  };

  const handleDecrease = (type: string) => {
    setQtys(prev => ({
      ...prev,
      [type]: Math.max((prev[type] || 0) - 1, 0)
    }));
  };

  // Toplam fiyat
  const total = roomOptions.reduce(
    (sum, opt) => sum + (qtys[opt.key] || 0) * opt.price,
    0
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>Select your option</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-5">
          {roomOptions.map(opt => (
            <div
              key={opt.key}
              className="flex items-center justify-between bg-white dark:bg-gray-900 border rounded-lg px-4 py-4 mb-3"
            >
              <div>
                <div className="font-semibold text-base">{opt.label}</div>
                <div className="text-sm text-muted-foreground mt-1">– ${opt.price}</div>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  size="icon"
                  variant="outline"
                  className={`w-8 h-8 text-xl border-2 ${qtys[opt.key] === 0 ? "border-gray-200" : "border-primary"}`}
                  onClick={() => handleDecrease(opt.key)}
                  disabled={qtys[opt.key] === 0}
                >
                  –
                </Button>
                <span className="w-7 text-center font-medium text-lg">{qtys[opt.key] || 0}</span>
                <Button
                  type="button"
                  size="icon"
                  variant="outline"
                  className={`w-8 h-8 text-xl border-2 ${qtys[opt.key] === opt.maxQty ? "border-gray-200" : "border-primary"}`}
                  onClick={() => handleIncrease(opt.key)}
                  disabled={qtys[opt.key] === opt.maxQty}
                >
                  +
                </Button>
              </div>
            </div>
          ))}

          <div className="flex flex-col items-center mt-4">
            <span className="font-semibold text-lg">Total: ${total}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
