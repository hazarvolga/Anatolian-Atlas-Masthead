"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import EmailTemplateManager from "@/components/admin/email/EmailTemplateManager";
import EmailLogsViewer from "@/components/admin/email/EmailLogsViewer";
import AdminEmailConsent from "@/components/admin/email/AdminEmailConsent";
import { Mail, FileText, Send, Shield } from "lucide-react";

export default function AdminEmailManagement() {
  const [activeTab, setActiveTab] = useState("consent");

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
          <Mail className="h-5 w-5 text-primary-foreground" />
        </div>
        <div>
          <h1 className="text-2xl font-bold">Email & Consent Management</h1>
          <p className="text-muted-foreground">
            Manage subscriber consent (KVKK/GDPR) and inspect email templates
          </p>
        </div>
      </div>

      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="space-y-6"
      >
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="consent" className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            Consent & KVKK
          </TabsTrigger>
          <TabsTrigger value="templates" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Templates
          </TabsTrigger>
          <TabsTrigger value="logs" className="flex items-center gap-2">
            <Mail className="h-4 w-4" />
            Email Logs
          </TabsTrigger>
          <TabsTrigger value="test" className="flex items-center gap-2">
            <Send className="h-4 w-4" />
            SMTP Status
          </TabsTrigger>
        </TabsList>

        <TabsContent value="consent">
          <AdminEmailConsent />
        </TabsContent>

        <TabsContent value="templates">
          <Card>
            <CardHeader>
              <CardTitle>Email Templates</CardTitle>
              <CardDescription>
                Preview email templates used across the platform
              </CardDescription>
            </CardHeader>
            <CardContent>
              <EmailTemplateManager />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="logs">
          <Card>
            <CardHeader>
              <CardTitle>Email Delivery Logs</CardTitle>
              <CardDescription>
                View and monitor email delivery status and history
              </CardDescription>
            </CardHeader>
            <CardContent>
              <EmailLogsViewer />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="test">
          <Card>
            <CardHeader>
              <CardTitle>Outbound Email Integration</CardTitle>
              <CardDescription>
                SMTP / transactional email provider status
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground text-sm">
                Subscriber consent and signed double opt-in / unsubscribe tokens
                are active. Outbound SMTP dispatch is not configured in the
                default template environment.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
