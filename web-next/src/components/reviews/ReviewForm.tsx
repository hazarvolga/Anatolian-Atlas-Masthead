"use client";

import { useState } from "react";
import { Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useCreateReview, useUpdateReview } from "@/hooks/useReviews";
import { useLanguage } from "@/contexts/LanguageContext";

interface ReviewFormProps {
  tourId: string;
  bookingId?: string;
  existingReview?: {
    id: string;
    rating: number;
    title?: string;
    comment?: string;
  };
  onSuccess?: () => void;
}

export default function ReviewForm({ tourId, bookingId, existingReview, onSuccess }: ReviewFormProps) {
  const { t } = useLanguage();
  const [rating, setRating] = useState(existingReview?.rating || 0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [title, setTitle] = useState(existingReview?.title || "");
  const [comment, setComment] = useState(existingReview?.comment || "");
  
  const createReview = useCreateReview();
  const updateReview = useUpdateReview();
  
  const isEditing = !!existingReview;
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (rating === 0) {
      return;
    }
    
    const reviewData = {
      rating,
      title: title.trim() || undefined,
      comment: comment.trim() || undefined,
    };
    
    try {
      if (isEditing) {
        await updateReview.mutateAsync({
          reviewId: existingReview.id,
          reviewData
        });
      } else {
        await createReview.mutateAsync({
          tour_id: tourId,
          booking_id: bookingId,
          ...reviewData
        });
      }
      
      onSuccess?.();
    } catch (error) {
      // Error is handled in the hooks
    }
  };
  
  const isPending = createReview.isPending || updateReview.isPending;
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>{isEditing ? t.reviews.editReview : t.reviews.writeReview}</CardTitle>
        <CardDescription>
          Share your experience with other travelers
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Rating */}
          <div className="space-y-2">
            <Label>{t.reviews.rating} *</Label>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  className="text-2xl transition-colors"
                  onMouseEnter={() => setHoveredRating(star)}
                  onMouseLeave={() => setHoveredRating(0)}
                  onClick={() => setRating(star)}
                >
                  <Star
                    className={`h-8 w-8 ${
                      star <= (hoveredRating || rating)
                        ? 'fill-yellow-400 text-yellow-400'
                        : 'text-gray-300'
                    }`}
                  />
                </button>
              ))}
            </div>
          </div>
          
          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title">{t.reviews.reviewTitle}</Label>
            <Input
              id="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Summarize your experience"
              maxLength={100}
            />
          </div>
          
          {/* Comment */}
          <div className="space-y-2">
            <Label htmlFor="comment">{t.reviews.comment}</Label>
            <Textarea
              id="comment"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Tell others about your experience..."
              rows={4}
              maxLength={1000}
            />
          </div>
          
          <div className="flex gap-4">
            <Button 
              type="submit" 
              disabled={rating === 0 || isPending}
            >
              {isPending ? t.booking.processing : isEditing ? t.reviews.update : t.reviews.submit}
            </Button>
            
            {onSuccess && (
              <Button 
                type="button" 
                variant="outline"
                onClick={onSuccess}
              >
                {t.reviews.cancel}
              </Button>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
