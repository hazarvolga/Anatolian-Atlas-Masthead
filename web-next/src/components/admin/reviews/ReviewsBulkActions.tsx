"use client";


import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { useBulkUpdateReviews } from "@/hooks/useAdminReviews";
import { CheckCircle, XCircle, MessageSquare } from "lucide-react";
import { toast } from "sonner";

interface ReviewsBulkActionsProps {
  reviews: any[];
  selectedReviews: string[];
  setSelectedReviews: (reviews: string[]) => void;
}

export default function ReviewsBulkActions({ 
  reviews, 
  selectedReviews, 
  setSelectedReviews 
}: ReviewsBulkActionsProps) {
  const bulkUpdateReviews = useBulkUpdateReviews();

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedReviews(reviews.map(review => review.id));
    } else {
      setSelectedReviews([]);
    }
  };

  const handleBulkApprove = async () => {
    if (selectedReviews.length === 0) {
      toast.error("Please select reviews to approve");
      return;
    }

    try {
      await bulkUpdateReviews.mutateAsync({ 
        reviewIds: selectedReviews, 
        is_verified: true 
      });
      setSelectedReviews([]);
    } catch (error) {
      console.error('Bulk approve failed:', error);
    }
  };

  const handleBulkReject = async () => {
    if (selectedReviews.length === 0) {
      toast.error("Please select reviews to reject");
      return;
    }

    try {
      await bulkUpdateReviews.mutateAsync({ 
        reviewIds: selectedReviews, 
        is_verified: false 
      });
      setSelectedReviews([]);
    } catch (error) {
      console.error('Bulk reject failed:', error);
    }
  };

  return (
    <div className="space-y-4 p-4 border rounded-lg bg-muted/50">
      <div className="flex items-center gap-2">
        <MessageSquare className="h-4 w-4 text-muted-foreground" />
        <h3 className="font-medium">Bulk Actions</h3>
        <span className="text-sm text-muted-foreground">
          ({selectedReviews.length} selected)
        </span>
      </div>
      
      <div className="flex items-center gap-2">
        <Checkbox
          checked={selectedReviews.length === reviews.length && reviews.length > 0}
          onCheckedChange={handleSelectAll}
        />
        <span className="text-sm">Select All Reviews</span>
      </div>
      
      {selectedReviews.length > 0 && (
        <div className="flex items-center gap-2">
          <Button 
            onClick={handleBulkApprove}
            disabled={bulkUpdateReviews.isPending}
            size="sm"
            className="bg-green-600 hover:bg-green-700"
          >
            <CheckCircle className="h-4 w-4 mr-2" />
            Approve Selected
          </Button>
          
          <Button 
            onClick={handleBulkReject}
            disabled={bulkUpdateReviews.isPending}
            variant="destructive"
            size="sm"
          >
            <XCircle className="h-4 w-4 mr-2" />
            Reject Selected
          </Button>
        </div>
      )}
    </div>
  );
}
