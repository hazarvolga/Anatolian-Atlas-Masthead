"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Eye,
  Mail,
  Calendar,
  CreditCard,
  Bell,
  Lock,
  Gift,
  X,
} from "lucide-react";

const EMAIL_TEMPLATES = [
  {
    id: "1",
    name: "Welcome Email",
    description:
      "Welcome new users with a warm greeting and getting-started information.",
    icon: Mail,
    type: "welcome",
    status: "preview",
    features: [
      "Personal greeting",
      "Getting started guide",
      "Contact information",
      "Unsubscribe link",
    ],
  },
  {
    id: "2",
    name: "Booking Confirmation",
    description:
      "Confirm reservation details with itinerary summary and meeting point.",
    icon: Calendar,
    type: "booking_confirmation",
    status: "preview",
    features: [
      "Booking reference",
      "Tour details",
      "Meeting point",
      "Cancellation policy",
    ],
  },
  {
    id: "3",
    name: "Booking Cancellation",
    description:
      "Communicate booking cancellations and refund timelines clearly.",
    icon: X,
    type: "booking_cancellation",
    status: "preview",
    features: [
      "Cancellation reason",
      "Refund details",
      "Support contact",
    ],
  },
  {
    id: "4",
    name: "Payment Failed",
    description: "Notify travelers when a payment attempt fails.",
    icon: CreditCard,
    type: "payment_failed",
    status: "preview",
    features: ["Retry payment link", "Reservation status", "Support contact"],
  },
  {
    id: "5",
    name: "Booking Reminder",
    description: "Remind travelers before their scheduled tour departure.",
    icon: Bell,
    type: "booking_reminder",
    status: "preview",
    features: ["Departure time", "Meeting instructions", "Packing checklist"],
  },
  {
    id: "6",
    name: "Password Reset",
    description: "Secure password reset instructions.",
    icon: Lock,
    type: "password_reset",
    status: "preview",
    features: ["Reset link", "Expiration notice", "Security notice"],
  },
  {
    id: "7",
    name: "Newsletter & Offers",
    description: "Seasonal destination stories and curated tour announcements.",
    icon: Gift,
    type: "promotional",
    status: "preview",
    features: ["Editorial story", "Featured tours", "One-click unsubscribe"],
  },
];

export default function EmailTemplateManager() {
  const router = useRouter();
  const [selectedPreview, setSelectedPreview] = useState<
    (typeof EMAIL_TEMPLATES)[number] | null
  >(null);

  return (
    <div className="space-y-6">
      <div className="rounded-lg border bg-muted/40 p-4 text-sm text-muted-foreground">
        <strong>Integration note:</strong> Email subscription consent and KVKK
        preferences are persisted in PostgreSQL. Outbound SMTP/transactional
        delivery requires connecting an email provider in your backend
        environment.
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {EMAIL_TEMPLATES.map((template) => {
          const Icon = template.icon;
          return (
            <Card key={template.id} className="flex flex-col justify-between">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Icon className="h-5 w-5 text-primary" />
                    <CardTitle className="text-base">{template.name}</CardTitle>
                  </div>
                  <Badge variant="secondary">{template.status}</Badge>
                </div>
                <CardDescription>{template.description}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-wrap gap-1">
                  {template.features.map((feature) => (
                    <Badge key={feature} variant="outline" className="text-xs">
                      {feature}
                    </Badge>
                  ))}
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1"
                    onClick={() => setSelectedPreview(template)}
                  >
                    <Eye className="h-4 w-4 mr-1" />
                    Quick Preview
                  </Button>
                  <Button
                    size="sm"
                    className="flex-1"
                    onClick={() =>
                      router.push(`/admin?tab=emails&templateId=${template.id}`)
                    }
                  >
                    Details
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Dialog
        open={!!selectedPreview}
        onOpenChange={(open) => !open && setSelectedPreview(null)}
      >
        <DialogContent className="max-w-xl">
          <DialogHeader>
            <DialogTitle>{selectedPreview?.name}</DialogTitle>
            <DialogDescription>
              {selectedPreview?.description}
            </DialogDescription>
          </DialogHeader>
          {selectedPreview && (
            <div className="rounded-lg border p-6 bg-background space-y-4 text-sm">
              <div className="border-b pb-3">
                <p className="font-serif text-lg font-semibold">
                  NextStopTurkey
                </p>
                <p className="text-xs text-muted-foreground">
                  Template type: {selectedPreview.type}
                </p>
              </div>
              <p>Hello Traveler,</p>
              <p className="text-muted-foreground">
                {selectedPreview.description}
              </p>
              <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
                {selectedPreview.features.map((f) => (
                  <li key={f}>{f}</li>
                ))}
              </ul>
              <div className="border-t pt-3 text-xs text-muted-foreground">
                NextStopTurkey · Manage preferences or unsubscribe at{" "}
                <code>/unsubscribe</code>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
