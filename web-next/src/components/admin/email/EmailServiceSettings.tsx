"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Settings } from "lucide-react";

export default function EmailServiceSettings() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Settings className="h-5 w-5" />
          Email Service Providers
        </CardTitle>
        <CardDescription>
          Outbound SMTP and transactional email provider integration
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Alert>
          <AlertDescription>
            Subscriber consent (KVKK/GDPR) and double opt-in token verification
            are managed in the <strong>Email Templates → Consent &amp; KVKK</strong>{" "}
            tab. To enable live email dispatch, configure your SMTP or
            transactional provider credentials in the backend environment.
          </AlertDescription>
        </Alert>
      </CardContent>
    </Card>
  );
}
