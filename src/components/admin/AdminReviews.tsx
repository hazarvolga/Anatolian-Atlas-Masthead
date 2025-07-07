
import { useState } from "react";
import { useAdminReviews, useUpdateReviewStatus, useDeleteReview, useBulkUpdateReviews } from "@/hooks/useAdminReviews";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Star, Check, X, Trash2, Eye } from "lucide-react";
import { toast } from "sonner";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";

export default function AdminReviews() {
  const { data: reviews, isLoading, error } = useAdminReviews();
  const updateReviewStatus = useUpdateReviewStatus();
  const deleteReview = useDeleteReview();
  const bulkUpdateReviews = useBulkUpdateReviews();
  
  const [selectedReviews, setSelectedReviews] = useState<string[]>([]);

  const handleStatusUpdate = (reviewId: string, isVerified: boolean) => {
    updateReviewStatus.mutate({ reviewId, isVerified });
  };

  const handleDelete = (reviewId: string) => {
    if (confirm('Are you sure you want to delete this review?')) {
      deleteReview.mutate(reviewId);
    }
  };

  const handleBulkApprove = () => {
    if (selectedReviews.length === 0) {
      toast.error("Please select reviews to approve");
      return;
    }
    bulkUpdateReviews.mutate({ reviewIds: selectedReviews, isVerified: true });
    setSelectedReviews([]);
  };

  const handleBulkReject = () => {
    if (selectedReviews.length === 0) {
      toast.error("Please select reviews to reject");
      return;
    }
    bulkUpdateReviews.mutate({ reviewIds: selectedReviews, isVerified: false });
    setSelectedReviews([]);
  };

  const toggleSelectReview = (reviewId: string) => {
    setSelectedReviews(prev => 
      prev.includes(reviewId) 
        ? prev.filter(id => id !== reviewId)
        : [...prev, reviewId]
    );
  };

  const toggleSelectAll = () => {
    if (!reviews) return;
    
    if (selectedReviews.length === reviews.length) {
      setSelectedReviews([]);
    } else {
      setSelectedReviews(reviews.map(review => review.id));
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Reviews Management</CardTitle>
          <CardDescription>Loading reviews...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Reviews Management</CardTitle>
          <CardDescription>Error loading reviews</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-red-500">
            Failed to load reviews. Please try again.
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Reviews Management</CardTitle>
        <CardDescription>Manage and moderate customer reviews</CardDescription>
      </CardHeader>
      <CardContent>
        {selectedReviews.length > 0 && (
          <div className="flex gap-2 mb-4 p-3 bg-muted rounded-lg">
            <span className="text-sm font-medium">
              {selectedReviews.length} review(s) selected
            </span>
            <Button size="sm" variant="outline" onClick={handleBulkApprove}>
              <Check className="h-4 w-4 mr-1" />
              Approve All
            </Button>
            <Button size="sm" variant="outline" onClick={handleBulkReject}>
              <X className="h-4 w-4 mr-1" />
              Reject All
            </Button>
          </div>
        )}

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12">
                <Checkbox
                  checked={reviews && selectedReviews.length === reviews.length}
                  onCheckedChange={toggleSelectAll}
                />
              </TableHead>
              <TableHead>Review</TableHead>
              <TableHead>Tour</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Rating</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {reviews?.map((review) => (
              <TableRow key={review.id}>
                <TableCell>
                  <Checkbox
                    checked={selectedReviews.includes(review.id)}
                    onCheckedChange={() => toggleSelectReview(review.id)}
                  />
                </TableCell>
                <TableCell>
                  <div className="max-w-xs">
                    {review.title && (
                      <div className="font-medium truncate">{review.title}</div>
                    )}
                    {review.comment && (
                      <div className="text-sm text-muted-foreground truncate mt-1">
                        {review.comment}
                      </div>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="font-medium">
                    {review.tours?.name || 'Tour not found'}
                  </div>
                </TableCell>
                <TableCell>
                  <div>
                    <div className="font-medium">
                      {review.profiles?.full_name || 'Guest User'}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {review.profiles?.email || 'No email'}
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`h-4 w-4 ${
                          i < review.rating
                            ? 'text-yellow-400 fill-current'
                            : 'text-gray-300'
                        }`}
                      />
                    ))}
                    <span className="ml-1 text-sm">({review.rating})</span>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant={review.is_verified ? 'default' : 'secondary'}>
                    {review.is_verified ? 'Approved' : 'Pending'}
                  </Badge>
                </TableCell>
                <TableCell>
                  {new Date(review.created_at).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleStatusUpdate(review.id, !review.is_verified)}
                    >
                      {review.is_verified ? (
                        <X className="h-4 w-4" />
                      ) : (
                        <Check className="h-4 w-4" />
                      )}
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleDelete(review.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {!reviews || reviews.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            No reviews found.
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
}
