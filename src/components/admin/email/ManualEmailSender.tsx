import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Send, Mail, AlertCircle, CheckCircle2 } from "lucide-react";

export default function ManualEmailSender() {
  const [recipientEmail, setRecipientEmail] = useState("");
  const [recipientName, setRecipientName] = useState("");
  const [loading, setLoading] = useState(false);
  const [sendStatus, setSendStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState<string>("");

  const handleSendManualWelcome = async () => {
    if (!recipientEmail) {
      setSendStatus('error');
      setErrorMsg("Lütfen email adresi girin.");
      return;
    }

    setLoading(true);
    setSendStatus('sending');
    setErrorMsg("");

    try {
      const response = await fetch("/functions/v1/send-welcome-account-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: recipientEmail,
          fullName: recipientName || "Değerli Müşterimiz",
          tour: "Hoş Geldiniz",
          destination: "MareSereno Ailesi"
        })
      });
      
      if (!response.ok) {
        const err = await response.text();
        setSendStatus('error');
        setErrorMsg(err || "Email gönderilemedi.");
      } else {
        setSendStatus('success');
        setRecipientEmail("");
        setRecipientName("");
      }
    } catch (err: any) {
      setSendStatus('error');
      setErrorMsg(err?.message || "Email gönderilemedi.");
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setRecipientEmail("");
    setRecipientName("");
    setSendStatus('idle');
    setErrorMsg("");
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Mail className="h-5 w-5" />
          Manuel Email Gönder
        </CardTitle>
        <CardDescription>
          Belirli bir kullanıcıya manuel olarak welcome email gönderin
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="email">Email Adresi *</Label>
          <Input
            id="email"
            type="email"
            placeholder="kullanici@example.com"
            value={recipientEmail}
            onChange={(e) => setRecipientEmail(e.target.value)}
            required
          />
        </div>

        <div>
          <Label htmlFor="name">Tam Adı (İsteğe bağlı)</Label>
          <Input
            id="name"
            placeholder="Müşteri Adı"
            value={recipientName}
            onChange={(e) => setRecipientName(e.target.value)}
          />
        </div>

        <Button
          onClick={handleSendManualWelcome}
          disabled={loading}
          className="w-full"
        >
          {loading ? "Gönderiliyor..." : <><Send className="w-4 h-4 mr-2" />Welcome Email Gönder</>}
        </Button>

        {sendStatus === 'error' && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{errorMsg}</AlertDescription>
          </Alert>
        )}

        {sendStatus === 'success' && (
          <Alert>
            <CheckCircle2 className="h-4 w-4" />
            <AlertDescription>Welcome email başarıyla gönderildi!</AlertDescription>
          </Alert>
        )}

        {sendStatus !== 'idle' && (
          <Button variant="outline" onClick={resetForm} className="w-full">
            Formu Temizle
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
