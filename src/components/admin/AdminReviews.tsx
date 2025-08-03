import { useState } from "react";
import { useAdminReviews, useUpdateReviewStatus, useDeleteReview, useBulkUpdateReviews } from "@/hooks/useAdminReviews";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Star, Check, X, Trash2, MoreHorizontal, User, Package, Calendar, MessageSquare, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import LoadingSpinner from "./LoadingSpinner";
import EmptyState from "./EmptyState";
import ErrorAlert from "./ErrorAlert";

const renderStars = (rating: number) => {
  return (
    <div className="flex items-center">
      {[...Array(5)].map((_, i) => (
        <Star
          key={i}
          className={`h-4 w-4 ${i < rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}`}
        />
      ))}
    </div>
  );
};

export default function AdminReviews() {
  const { data: reviews = [], isLoading, error, refetch } = useAdminReviews();
  const updateReviewStatusMutation = useUpdateReviewStatus();
  const deleteReviewMutation = useDeleteReview();
  const bulkUpdateReviewsMutation = useBulkUpdateReviews();
  
  const [selectedReviews, setSelectedReviews] = useState<string[]>([]);

  const handleStatusUpdate = (reviewId: string, is_verified: boolean) => {
    updateReviewStatusMutation.mutate({ reviewId, is_verified });
  };

  const handleDelete = (reviewId: string) => {
    if (confirm('Are you sure you want to delete this review?')) {
      deleteReviewMutation.mutate(reviewId);
    }
  };

  const handleBulkAction = (is_verified: boolean) => {
    if (selectedReviews.length === 0) {
      toast.error(`Please select reviews to ${is_verified ? 'approve' : 'reject'}`);
      return;
    }
    bulkUpdateReviewsMutation.mutate({ reviewIds: selectedReviews, is_verified });
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
    if (selectedReviews.length === reviews.length) {
      setSelectedReviews([]);
    } else {
      setSelectedReviews(reviews.map(review => review.id));
    }
  };

  if (isLoading) {
    return (
      <div className="text-center py-16">
        <LoadingSpinner size="lg" text="Loading reviews..." />
      </div>
    );
  }

  if (error) {
    return (
      <ErrorAlert 
        title="Failed to load reviews"
        message={error instanceof Error ? error.message : "An unknown error occurred."}
        onRetry={() => refetch()}
        retryLabel="Reload reviews"
      />
    );
  }

  return (
    <Card className="shadow-sm border-border/50">
      <CardHeader>
        <CardTitle className="text-xl md:text-2xl">Reviews Management</CardTitle>
        <CardDescription className="text-sm md:text-base">
          Manage and moderate customer reviews ({reviews.length} total)
        </CardDescription>
      </CardHeader>
      <CardContent>
        {reviews.length === 0 ? (
           <EmptyState
            icon={MessageSquare}
            title="No reviews yet"
            description="When customers leave reviews for tours, they will appear here for moderation."
          />
        ) : (
          <>
            {selectedReviews.length > 0 && (
              <div className="flex items-center gap-2 mb-4 p-3 bg-muted rounded-lg border">
                <span className="text-sm font-medium text-muted-foreground">
                  {selectedReviews.length} selected
                </span>
                <Button size="sm" variant="outline" onClick={() => handleBulkAction(true)} disabled={bulkUpdateReviewsMutation.isPending}>
                  <Check className="h-4 w-4 mr-1" />
                  Approve
                </Button>
                <Button size="sm" variant="outline" onClick={() => handleBulkAction(false)} disabled={bulkUpdateReviewsMutation.isPending}>
                  <X className="h-4 w-4 mr-1" />
                  Reject
                </Button>
                 {bulkUpdateReviewsMutation.isPending && <Loader2 className="h-4 w-4 animate-spin" />}
              </div>
            )}

            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-12">
                      <Checkbox
                        checked={reviews.length > 0 && selectedReviews.length === reviews.length}
                        onCheckedChange={toggleSelectAll}
                        aria-label="Select all rows"
                      />
                    </TableHead>
                    <TableHead>Author & Tour</TableHead>
                    <TableHead>Review</TableHead>
                    <TableHead className="text-center">Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {reviews.map((review: any) => (
                    <TableRow key={review.id}>
                      <TableCell>
                        <Checkbox
                          checked={selectedReviews.includes(review.id)}
                          onCheckedChange={() => toggleSelectReview(review.id)}
                          aria-label={`Select review ${review.id}`}
                        />
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2 font-semibold">
                          <User className="h-4 w-4 text-muted-foreground" />
                          {review.user?.name || 'Anonymous'}
                        </div>
                        <div className="text-xs text-muted-foreground pl-6">{review.user?.email}</div>
                        <div className="border-t my-2"></div>
                        <div className="flex items-center gap-2 text-sm">
                          <Package className="h-4 w-4 text-muted-foreground" />
                          {review.tour?.title || 'Unknown Tour'}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2 mb-1">
                          {renderStars(review.rating)}
                          <span className="font-bold text-sm">({review.rating}/5)</span>
                        </div>
                        <p className="text-sm text-muted-foreground line-clamp-3" title={review.comment}>
                          {review.comment}
                        </p>
                        <div className="text-xs text-gray-400 mt-1">
                          {format(new Date(review.created_at), "dd MMM yyyy, p")}
                        </div>
                      </TableCell>
                      <TableCell className="text-center">
                        <Badge variant={review.is_verified ? "default" : "secondary"} className={review.is_verified ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}>
                          {review.is_verified ? "Approved" : "Pending"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" disabled={updateReviewStatusMutation.isPending || deleteReviewMutation.isPending}>
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleStatusUpdate(review.id, !review.is_verified)}>
                              {review.is_verified ? <X className="mr-2 h-4 w-4" /> : <Check className="mr-2 h-4 w-4" />}
                              <span>{review.is_verified ? "Reject" : "Approve"}</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleDelete(review.id)} className="text-red-600">
                              <Trash2 className="mr-2 h-4 w-4" />
                              <span>Delete</span>
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
