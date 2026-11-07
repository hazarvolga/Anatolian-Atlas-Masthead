"use client";


import { useState } from "react";
import Image from "next/image";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Star, Eye, CheckCircle, XCircle, Trash2 } from "lucide-react";
import { format } from "date-fns";
import { useUpdateReviewStatus, useDeleteReview } from "@/hooks/useAdminReviews";
import ReviewDetailModal from "./ReviewDetailModal";

interface ReviewsTableProps {
  reviews: any[];
  selectedReviews: string[];
  onReviewSelect: (reviewId: string, checked: boolean) => void;
}

export default function ReviewsTable({ 
  reviews, 
  selectedReviews, 
  onReviewSelect 
}: ReviewsTableProps) {
  const [selectedReview, setSelectedReview] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const updateReviewStatus = useUpdateReviewStatus();
  const deleteReview = useDeleteReview();

  const handleViewDetails = (review: any) => {
    setSelectedReview(review);
    setIsModalOpen(true);
  };

  const handleApprove = async (reviewId: string) => {
    try {
      await updateReviewStatus.mutateAsync({ reviewId, is_verified: true });
    } catch (error) {
      console.error('Approve failed:', error);
    }
  };

  const handleReject = async (reviewId: string) => {
    try {
      await updateReviewStatus.mutateAsync({ reviewId, is_verified: false });
    } catch (error) {
      console.error('Reject failed:', error);
    }
  };

  const handleDelete = async (reviewId: string) => {
    if (window.confirm('Are you sure you want to delete this review?')) {
      try {
        await deleteReview.mutateAsync(reviewId);
      } catch (error) {
        console.error('Delete failed:', error);
      }
    }
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`h-4 w-4 ${
              star <= rating
                ? 'fill-yellow-400 text-yellow-400'
                : 'text-gray-300'
            }`}
          />
        ))}
        <span className="ml-1 text-sm">({rating})</span>
      </div>
    );
  };

  if (reviews.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">No reviews found</p>
      </div>
    );
  }

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-12">
              <Checkbox
                checked={selectedReviews.length === reviews.length && reviews.length > 0}
                onCheckedChange={(checked) => {
                  reviews.forEach(review => onReviewSelect(review.id, !!checked));
                }}
              />
            </TableHead>
            <TableHead>Tour</TableHead>
            <TableHead>User</TableHead>
            <TableHead>Rating</TableHead>
            <TableHead>Title</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {reviews.map((review) => (
            <TableRow key={review.id}>
              <TableCell>
                <Checkbox
                  checked={selectedReviews.includes(review.id)}
                  onCheckedChange={(checked) => onReviewSelect(review.id, !!checked)}
                />
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  {review.tours?.image_url && (
                    <Image
                      src={review.tours.image_url}
                      alt={review.tours.name}
                      width={32}
                      height={32}
                      sizes="32px"
                      className="w-8 h-8 rounded object-cover"
                    />
                  )}
                  <span className="font-medium">{review.tours?.name || 'Unknown Tour'}</span>
                </div>
              </TableCell>
              <TableCell>
                <div>
                  <p className="font-medium">{review.profiles?.full_name || 'Anonymous'}</p>
                  <p className="text-sm text-muted-foreground">{review.profiles?.email}</p>
                </div>
              </TableCell>
              <TableCell>
                {renderStars(review.rating)}
              </TableCell>
              <TableCell>
                <p className="font-medium truncate max-w-32">
                  {review.title || 'No title'}
                </p>
              </TableCell>
              <TableCell>
                <Badge variant={review.is_verified ? "default" : "secondary"}>
                  {review.is_verified ? 'Approved' : 'Pending'}
                </Badge>
              </TableCell>
              <TableCell>
                {format(new Date(review.created_at), "MMM d, yyyy")}
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-1">
                  <Button
                    onClick={() => handleViewDetails(review)}
                    size="sm"
                    variant="ghost"
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                  
                  {!review.is_verified && (
                    <Button
                      onClick={() => handleApprove(review.id)}
                      size="sm"
                      variant="ghost"
                      className="text-green-600 hover:text-green-700"
                    >
                      <CheckCircle className="h-4 w-4" />
                    </Button>
                  )}
                  
                  {review.is_verified && (
                    <Button
                      onClick={() => handleReject(review.id)}
                      size="sm"
                      variant="ghost"
                      className="text-yellow-600 hover:text-yellow-700"
                    >
                      <XCircle className="h-4 w-4" />
                    </Button>
                  )}
                  
                  <Button
                    onClick={() => handleDelete(review.id)}
                    size="sm"
                    variant="ghost"
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <ReviewDetailModal
        review={selectedReview}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
}
