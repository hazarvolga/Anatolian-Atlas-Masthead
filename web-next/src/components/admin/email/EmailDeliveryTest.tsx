"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Activity } from "lucide-react";

export default function EmailDeliveryTest() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Activity className="h-5 w-5" />
          Email Monitoring &amp; Diagnostics
        </CardTitle>
        <CardDescription>
          Monitor subscription health and outbound delivery status
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Alert>
          <AlertDescription>
            Database-backed email subscriptions and signed token verification
            are operational. Outbound SMTP telemetry requires a connected email
            provider.
          </AlertDescription>
        </Alert>
      </CardContent>
    </Card>
  );
}
