"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { RefreshCw, Eye } from "lucide-react";

export default function EmailLogsViewer() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'sent':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'failed':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <RefreshCw className="h-6 w-6 animate-spin mr-2" />
        Loading email logs...
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-lg font-semibold">Email Delivery Logs</h3>
          <p className="text-sm text-muted-foreground">
            Monitor email delivery status and troubleshoot issues
          </p>
        </div>
        <Button className="flex items-center gap-2">
          <RefreshCw className="h-4 w-4" />
          Refresh
        </Button>
      </div>

      <div className="space-y-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-start justify-between">
              <div className="flex-1 space-y-2">
                <div className="flex items-center gap-3">
                  <Badge className={getStatusColor('sent')}>
                    SENT
                  </Badge>
                  <Badge variant="outline">
                    Welcome Email
                  </Badge>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium">To:</span> user@example.com
                  </div>
                  <div>
                    <span className="font-medium">From:</span> noreply@yourdomain.com
                  </div>
                  <div className="md:col-span-2">
                    <span className="font-medium">Subject:</span> Welcome to our platform!
                  </div>
                  <div>
                    <span className="font-medium">Sent:</span> {new Date().toLocaleString()}
                  </div>
                  <div>
                    <span className="font-medium">Created:</span> {new Date().toLocaleString()}
                  </div>
                </div>
              </div>

              <Button variant="outline" size="sm" className="ml-4">
                <Eye className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-start justify-between">
              <div className="flex-1 space-y-2">
                <div className="flex items-center gap-3">
                  <Badge className={getStatusColor('pending')}>
                    PENDING
                  </Badge>
                  <Badge variant="outline">
                    Booking Confirmation
                  </Badge>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium">To:</span> customer@example.com
                  </div>
                  <div>
                    <span className="font-medium">From:</span> noreply@yourdomain.com
                  </div>
                  <div className="md:col-span-2">
                    <span className="font-medium">Subject:</span> Your booking has been confirmed
                  </div>
                  <div>
                    <span className="font-medium">Sent:</span> Pending
                  </div>
                  <div>
                    <span className="font-medium">Created:</span> {new Date().toLocaleString()}
                  </div>
                </div>
              </div>

              <Button variant="outline" size="sm" className="ml-4">
                <Eye className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}