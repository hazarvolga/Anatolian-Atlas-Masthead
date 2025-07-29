import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Trash2, Plus } from "lucide-react";

interface TourBenefitsItineraryProps {
  benefits: string[];
  itinerary: Array<{ day: number; title: string; description: string; }>;
  onBenefitsChange: (benefits: string[]) => void;
  onItineraryChange: (itinerary: Array<{ day: number; title: string; description: string; }>) => void;
  tourType?: "one_day" | "multiple_day" | "date_range";
}

export default function TourBenefitsItinerary({ 
  benefits, 
  itinerary, 
  onBenefitsChange, 
  onItineraryChange,
  tourType
}: TourBenefitsItineraryProps) {
  const [newBenefit, setNewBenefit] = useState("");
  const [newItineraryItem, setNewItineraryItem] = useState({
    day: 1,
    title: "",
    description: ""
  });

  const addBenefit = () => {
    if (newBenefit.trim()) {
      onBenefitsChange([...benefits, newBenefit.trim()]);
      setNewBenefit("");
    }
  };

  const removeBenefit = (index: number) => {
    const updatedBenefits = benefits.filter((_, i) => i !== index);
    onBenefitsChange(updatedBenefits);
  };

  const addItineraryItem = () => {
    if (newItineraryItem.title.trim() && newItineraryItem.description.trim()) {
      const updatedItinerary = [...itinerary, { ...newItineraryItem }];
      updatedItinerary.sort((a, b) => a.day - b.day);
      onItineraryChange(updatedItinerary);
      setNewItineraryItem({
        day: Math.max(...itinerary.map(item => item.day), 0) + 1,
        title: "",
        description: ""
      });
    }
  };

  const removeItineraryItem = (index: number) => {
    const updatedItinerary = itinerary.filter((_, i) => i !== index);
    onItineraryChange(updatedItinerary);
  };

  // Clear itinerary when tour type changes to one_day
  useEffect(() => {
    if (tourType === 'one_day' && itinerary.length > 0) {
      // Reset itinerary if tour type changes to one_day
      onItineraryChange([]);
    }
  }, [tourType, itinerary.length, onItineraryChange]);

  return (
    <div className="space-y-6">
      {/* Tour Benefits Section */}
      <Card>
        <CardHeader>
          <CardTitle>Tour Benefits</CardTitle>
          <CardDescription>
            Add key benefits and features of this tour
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Add New Benefit */}
            <div className="flex gap-2">
              <Input
                value={newBenefit}
                onChange={(e) => setNewBenefit(e.target.value)}
                placeholder="Enter a benefit or feature"
                className="flex-1"
              />
              <Button onClick={addBenefit} disabled={!newBenefit.trim()}>
                <Plus className="h-4 w-4 mr-2" />
                Add
              </Button>
            </div>

            {/* Benefits List */}
            <div className="flex flex-wrap gap-2">
              {benefits.map((benefit, index) => (
                <Badge key={index} variant="secondary" className="flex items-center gap-1">
                  {benefit}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeBenefit(index)}
                    className="h-4 w-4 p-0 hover:bg-transparent"
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </Badge>
              ))}
              {benefits.length === 0 && (
                <p className="text-sm text-muted-foreground">No benefits added yet.</p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tour Itinerary Section - Only show for multiple_day and date_range tours */}
      {tourType && tourType !== 'one_day' && (
        <Card>
          <CardHeader>
            <CardTitle>Tour Itinerary</CardTitle>
            <CardDescription>
              Add day-by-day schedule and activities for multi-day tours
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {/* Add New Itinerary Item */}
              <div className="grid gap-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Day Number</Label>
                    <Input
                      type="number"
                      min={1}
                      value={newItineraryItem.day}
                      onChange={(e) => setNewItineraryItem({
                        ...newItineraryItem,
                        day: parseInt(e.target.value) || 1
                      })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Title</Label>
                    <Input
                      value={newItineraryItem.title}
                      onChange={(e) => setNewItineraryItem({
                        ...newItineraryItem,
                        title: e.target.value
                      })}
                      placeholder="Enter title for this day"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Description</Label>
                  <Textarea
                    value={newItineraryItem.description}
                    onChange={(e) => setNewItineraryItem({
                      ...newItineraryItem,
                      description: e.target.value
                    })}
                    placeholder="Describe the activities and experiences for this day"
                    rows={3}
                  />
                </div>

                <div className="flex items-end">
                  <Button 
                    onClick={addItineraryItem} 
                    disabled={!newItineraryItem.title.trim() || !newItineraryItem.description.trim()}
                    className="w-full"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Day
                  </Button>
                </div>
              </div>

              {/* Existing Itinerary Items */}
              <div className="space-y-4">
                {itinerary.length > 0 ? (
                  itinerary.sort((a, b) => a.day - b.day).map((item, index) => (
                    <div key={index} className="p-4 border rounded-lg bg-gray-50 dark:bg-gray-900">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <Badge variant="outline">Day {item.day}</Badge>
                            <h4 className="font-semibold">{item.title}</h4>
                          </div>
                          <p className="text-sm text-muted-foreground">{item.description}</p>
                        </div>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => removeItineraryItem(index)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <p>No itinerary items added yet.</p>
                    <p className="text-sm">Add day-by-day activities above to create the tour schedule.</p>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
