
"use client";

import { Star, User } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useTourReviews } from "@/hooks/useReviews";
import { useLanguage } from "@/contexts/LanguageContext";
import { format } from "date-fns";

interface ReviewsListProps {
  tourId: string;
}

export default function ReviewsList({ tourId }: ReviewsListProps) {
  const { t } = useLanguage();
  const { data: reviews = [], isLoading, error } = useTourReviews(tourId);
  
  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-6">
              <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
              <div className="space-y-2">
                <div className="h-3 bg-gray-200 rounded"></div>
                <div className="h-3 bg-gray-200 rounded w-5/6"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">{t.common.error} loading reviews</p>
      </div>
    );
  }
  
  if (reviews.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground text-lg mb-2">{t.reviews.noReviews}</p>
        <p className="text-sm text-muted-foreground">{t.reviews.beFirst}</p>
      </div>
    );
  }
  
  const averageRating = reviews.length > 0 
    ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length 
    : 0;
  
  return (
    <div className="space-y-6">
      {/* Summary */}
      <div className="flex items-center gap-4 p-6 bg-muted/50 rounded-lg">
        <div className="flex items-center gap-2">
          <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
          <span className="text-xl font-semibold">
            {averageRating.toFixed(1)}
          </span>
        </div>
        <div className="text-muted-foreground">
          {t.reviews.basedOn} {reviews.length} {t.reviews.review}{reviews.length !== 1 ? 's' : ''}
        </div>
      </div>
      
      {/* Reviews */}
      <div className="space-y-4">
        {reviews.map((review) => (
          <Card key={review.id}>
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <User className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-medium">{t.reviews.anonymous}</h4>
                    <p className="text-sm text-muted-foreground">
                      {format(new Date(review.created_at), "MMM d, yyyy")}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`h-4 w-4 ${
                        star <= review.rating
                          ? 'fill-yellow-400 text-yellow-400'
                          : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
              </div>
              
              {review.title && (
                <h5 className="font-medium mb-2">{review.title}</h5>
              )}
              
              {review.comment && (
                <p className="text-muted-foreground leading-relaxed">
                  {review.comment}
                </p>
              )}
              
              {review.is_verified && (
                <Badge variant="secondary" className="mt-3">
                  {t.reviews.verified}
                </Badge>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
