"use client";


import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { format } from "date-fns";

interface ReviewsExportProps {
  reviews: any[];
}

export default function ReviewsExport({ reviews }: ReviewsExportProps) {
  const exportToCSV = () => {
    const headers = ['Tour Name', 'User Name', 'User Email', 'Rating', 'Title', 'Comment', 'Status', 'Created At', 'Review ID'];
    const csvData = reviews.map(review => [
      review.tours?.name || 'Unknown Tour',
      review.profiles?.full_name || 'Anonymous',
      review.profiles?.email || '',
      review.rating,
      review.title || '',
      review.comment || '',
      review.is_verified ? 'Approved' : 'Pending',
      format(new Date(review.created_at), "yyyy-MM-dd HH:mm:ss"),
      review.id
    ]);

    const csvContent = [headers, ...csvData]
      .map(row => row.map(cell => `"${cell}"`).join(','))
      .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `reviews_export_${format(new Date(), 'yyyy-MM-dd')}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Button onClick={exportToCSV} variant="outline">
      <Download className="h-4 w-4 mr-2" />
      Export CSV ({reviews.length} reviews)
    </Button>
  );
}
