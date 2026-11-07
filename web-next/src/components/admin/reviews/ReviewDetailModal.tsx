"use client";


import Image from "next/image";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { Star, User, MapPin, Calendar, CheckCircle, XCircle } from "lucide-react";
import { useUpdateReviewStatus } from "@/hooks/useAdminReviews";

interface ReviewDetailModalProps {
  review: any;
  isOpen: boolean;
  onClose: () => void;
}

export default function ReviewDetailModal({ review, isOpen, onClose }: ReviewDetailModalProps) {
  const updateReviewStatus = useUpdateReviewStatus();

  if (!review) return null;

  const handleApprove = async () => {
    try {
      await updateReviewStatus.mutateAsync({ reviewId: review.id, is_verified: true });
      onClose();
    } catch (error) {
      console.error('Approve failed:', error);
    }
  };

  const handleReject = async () => {
    try {
      await updateReviewStatus.mutateAsync({ reviewId: review.id, is_verified: false });
      onClose();
    } catch (error) {
      console.error('Reject failed:', error);
    }
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`h-5 w-5 ${
              star <= rating
                ? 'fill-yellow-400 text-yellow-400'
                : 'text-gray-300'
            }`}
          />
        ))}
        <span className="ml-2 text-lg font-semibold">({rating}/5)</span>
      </div>
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Review Details
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Tour Information */}
          <div className="flex items-start gap-4 p-4 bg-muted/50 rounded-lg">
            {review.tours?.image_url && (
              <Image
                src={review.tours.image_url}
                alt={review.tours.name}
                width={64}
                height={64}
                sizes="64px"
                className="w-16 h-16 rounded object-cover"
              />
            )}
            <div className="flex-1">
              <h3 className="font-semibold text-lg">{review.tours?.name || 'Unknown Tour'}</h3>
              <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                <MapPin className="h-4 w-4" />
                Tour Review
              </div>
            </div>
          </div>

          {/* User Information */}
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-full">
              <User className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h4 className="font-medium">{review.profiles?.full_name || 'Anonymous User'}</h4>
              <p className="text-sm text-muted-foreground">{review.profiles?.email}</p>
            </div>
          </div>

          {/* Rating */}
          <div className="space-y-2">
            <h4 className="font-medium">Rating</h4>
            {renderStars(review.rating)}
          </div>

          {/* Title */}
          {review.title && (
            <div className="space-y-2">
              <h4 className="font-medium">Title</h4>
              <p className="text-lg font-semibold">{review.title}</p>
            </div>
          )}

          {/* Comment */}
          {review.comment && (
            <div className="space-y-2">
              <h4 className="font-medium">Comment</h4>
              <p className="text-muted-foreground leading-relaxed">{review.comment}</p>
            </div>
          )}

          {/* Status and Date */}
          <div className="flex items-center justify-between pt-4 border-t">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">{format(new Date(review.created_at), "PPP")}</span>
              </div>
              <Badge variant={review.is_verified ? "default" : "secondary"}>
                {review.is_verified ? 'Approved' : 'Pending'}
              </Badge>
            </div>

            <div className="flex gap-2">
              {!review.is_verified && (
                <Button
                  onClick={handleApprove}
                  className="bg-green-600 hover:bg-green-700"
                  disabled={updateReviewStatus.isPending}
                >
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Approve
                </Button>
              )}
              
              {review.is_verified && (
                <Button
                  onClick={handleReject}
                  variant="outline"
                  disabled={updateReviewStatus.isPending}
                >
                  <XCircle className="h-4 w-4 mr-2" />
                  Reject
                </Button>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
