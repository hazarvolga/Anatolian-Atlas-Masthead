"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Shield } from "lucide-react";

export default function EmailDeliverySettings() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="h-5 w-5" />
          Email Delivery &amp; Quota Settings
        </CardTitle>
        <CardDescription>
          Rate limiting and delivery rules for outbound emails
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Alert>
          <AlertDescription>
            Delivery rate limits and bounce handling activate automatically once
            an outbound SMTP or transactional email provider is connected.
          </AlertDescription>
        </Alert>
      </CardContent>
    </Card>
  );
}
