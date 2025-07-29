import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import EmailTemplateManager from "@/components/admin/email/EmailTemplateManager";
import EmailLogsViewer from "@/components/admin/email/EmailLogsViewer";
import AdminEmailConsent from "@/components/admin/email/AdminEmailConsent";
import { Mail, FileText, Send, Shield } from "lucide-react";

export default function AdminEmailManagement() {
  const [activeTab, setActiveTab] = useState("templates");

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
          <Mail className="h-5 w-5 text-white" />
        </div>
        <div>
          <h1 className="text-3xl font-bold">Email Management</h1>
          <p className="text-muted-foreground">Manage email templates and delivery</p>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="templates" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Templates
          </TabsTrigger>
          <TabsTrigger value="consent" className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            Consent & KVKK
          </TabsTrigger>
          <TabsTrigger value="logs" className="flex items-center gap-2">
            <Mail className="h-4 w-4" />
            Email Logs
          </TabsTrigger>
          <TabsTrigger value="test" className="flex items-center gap-2">
            <Send className="h-4 w-4" />
            Test Email
          </TabsTrigger>
        </TabsList>

        <TabsContent value="templates">
          <Card>
            <CardHeader>
              <CardTitle>Email Templates</CardTitle>
              <CardDescription>
                Manage and customize email templates used throughout the application
              </CardDescription>
            </CardHeader>
            <CardContent>
              <EmailTemplateManager />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="consent">
          <AdminEmailConsent />
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
              <CardTitle>Send Test Email</CardTitle>
              <CardDescription>
                Email testleri için Email Test sayfasını kullanın
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Email template testleri için <strong>Email Test</strong> sayfasına gidin.
                Tüm email türlerini test edebilir ve gerçek gönderim yapabilirsiniz.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}