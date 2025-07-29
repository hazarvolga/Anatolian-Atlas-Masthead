import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Send, Mail, AlertCircle, CheckCircle2 } from "lucide-react";

export default function TestEmailSender() {
  const [recipientEmail, setRecipientEmail] = useState("");
  const [customSubject, setCustomSubject] = useState("");
  const [customBody, setCustomBody] = useState("");
  const [loading, setLoading] = useState(false);
  const [welcomeLoading, setWelcomeLoading] = useState(false);
  const [sendStatus, setSendStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');
  const [welcomeStatus, setWelcomeStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState<string>("");
  const [welcomeErrorMsg, setWelcomeErrorMsg] = useState<string>("");

  const handleSendWelcomeTest = async () => {
    if (!recipientEmail) {
      setWelcomeStatus('error');
      setWelcomeErrorMsg("Lütfen email adresi girin.");
      return;
    }

    setWelcomeLoading(true);
    setWelcomeStatus('sending');
    setWelcomeErrorMsg("");

    try {
      const response = await fetch("/functions/v1/send-welcome-account-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: recipientEmail,
          fullName: "Test Kullanıcı",
          tour: "Hoş Geldiniz",
          destination: "MareSereno Ailesi"
        })
      });
      if (!response.ok) {
        const err = await response.text();
        setWelcomeStatus('error');
        setWelcomeErrorMsg(err || "Welcome mail gönderilemedi.");
      } else {
        setWelcomeStatus('success');
      }
    } catch (err: any) {
      setWelcomeStatus('error');
      setWelcomeErrorMsg(err?.message || "Welcome mail gönderilemedi.");
    } finally {
      setWelcomeLoading(false);
    }
  };

  const handleSendTest = async () => {
    if (!recipientEmail || !customSubject || !customBody) {
      setSendStatus('error');
      setErrorMsg("Lütfen tüm alanları doldurun.");
      return;
    }

    setLoading(true);
    setSendStatus('sending');
    setErrorMsg("");

    try {
      const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001';
      const response = await axios.post(`${API_BASE_URL}/api/admin/email/send-test`, {
        email: recipientEmail,
        fullName: "Test Kullanıcı",
        tour: customSubject,
        destination: customBody
      }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('authToken')}` }
      });
      if (response.status !== 200) {
        setSendStatus('error');
        setErrorMsg(response.data?.message || "Mail gönderilemedi.");
      } else {
        setSendStatus('success');
      }
    } catch (err: any) {
      setSendStatus('error');
      setErrorMsg(err?.response?.data?.message || err?.message || "Mail gönderilemedi.");
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setRecipientEmail("");
    setCustomSubject("");
    setCustomBody("");
    setSendStatus('idle');
    setWelcomeStatus('idle');
    setErrorMsg("");
    setWelcomeErrorMsg("");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Mail className="h-5 w-5 text-primary" />
        <div>
          <h3 className="text-lg font-semibold">Send Test Email</h3>
          <p className="text-sm text-muted-foreground">
            Test your email templates by sending them to any email address
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Configuration Panel */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Email Configuration</CardTitle>
            <CardDescription>
              Configure the test email settings
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="recipient">Recipient Email *</Label>
              <Input
                id="recipient"
                type="email"
                placeholder="test@example.com"
                value={recipientEmail}
                onChange={(e) => setRecipientEmail(e.target.value)}
                required
              />
            </div>

            <div>
              <Label htmlFor="subject">Subject *</Label>
              <Input
                id="subject"
                placeholder="Test Email Subject"
                value={customSubject}
                onChange={(e) => setCustomSubject(e.target.value)}
                required
              />
            </div>

            <div>
              <Label htmlFor="body">Body *</Label>
              <Textarea
                id="body"
                placeholder="Test email body or destination info"
                value={customBody}
                onChange={(e) => setCustomBody(e.target.value)}
                required
              />
            </div>

            <Button
              onClick={handleSendTest}
              disabled={loading}
              className="w-full"
            >
              {loading ? "Sending..." : <><Send className="w-4 h-4 mr-2" />Send Test Email</>}
            </Button>
            
            <Button
              onClick={handleSendWelcomeTest}
              disabled={welcomeLoading}
              className="w-full"
              variant="outline"
            >
              {welcomeLoading ? "Sending..." : <><Send className="w-4 h-4 mr-2" />Send Welcome Email</>}
            </Button>
            
            {sendStatus === 'error' && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{errorMsg || "Mail gönderilemedi."}</AlertDescription>
              </Alert>
            )}
            {sendStatus === 'success' && (
              <Alert>
                <CheckCircle2 className="h-4 w-4" />
                <AlertDescription>Test maili başarıyla gönderildi!</AlertDescription>
              </Alert>
            )}
            
            {welcomeStatus === 'error' && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{welcomeErrorMsg || "Welcome mail gönderilemedi."}</AlertDescription>
              </Alert>
            )}
            {welcomeStatus === 'success' && (
              <Alert>
                <CheckCircle2 className="h-4 w-4" />
                <AlertDescription>Welcome maili başarıyla gönderildi!</AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}