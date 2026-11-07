"use client";

import { useRouter, useSearchParams } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Mail } from "lucide-react";
import { useSiteSettings } from "@/hooks/useSiteSettings";

export default function EmailTemplateDetail() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { settings: siteSettings } = useSiteSettings();
  const templateId = searchParams.get("templateId") || "1";

  const companyName =
    siteSettings?.company_name || siteSettings?.site_title || "NextStopTurkey";
  const contactEmail =
    siteSettings?.support_email ||
    siteSettings?.contact_email ||
    "info@nextstopturkey.com";

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => router.push("/admin?tab=emails")}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Templates
          </Button>
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <Mail className="h-6 w-6" />
              Template #{templateId}
            </h1>
            <p className="text-muted-foreground">
              Previewing template with site settings for {companyName}
            </p>
          </div>
        </div>
        <Badge variant="secondary">Preview Only</Badge>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Template Preview</CardTitle>
          <CardDescription>
            Rendered with active site settings ({contactEmail})
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-lg border p-6 bg-background space-y-4">
            <h2 className="text-xl font-serif font-semibold">{companyName}</h2>
            <p className="text-sm text-muted-foreground">
              Thank you for exploring Türkiye with {companyName}. For assistance,
              contact us at {contactEmail}.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
