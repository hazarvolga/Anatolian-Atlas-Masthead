import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from '@/hooks/use-toast';
import { Send, Mail, CheckCircle2, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

const EmailTestPage = () => {
  const [email, setEmail] = useState('');
  const [fullName, setFullName] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState('');
  const [loading, setLoading] = useState(false);
  const [sendStatus, setSendStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState<string>("");

  const emailTemplates = [
    { 
      id: 'welcome', 
      name: 'Welcome Email', 
      description: 'Yeni kullanıcılara hoş geldin maili gönder',
      category: 'User',
      color: 'bg-green-500'
    },
    { 
      id: 'booking-confirmation', 
      name: 'Booking Confirmation', 
      description: 'Müşteriye rezervasyon onayı maili gönder',
      category: 'Booking',
      color: 'bg-blue-500'
    },
    { 
      id: 'booking-notification', 
      name: 'Admin Notification', 
      description: 'Yöneticiye rezervasyon bildirimi gönder',
      category: 'Admin',
      color: 'bg-purple-500'
    },
    { 
      id: 'payment-confirmation', 
      name: 'Payment Confirmation', 
      description: 'Ödeme onayı maili gönder',
      category: 'Payment',
      color: 'bg-emerald-500'
    },
    { 
      id: 'payment-failed', 
      name: 'Payment Failed', 
      description: 'Ödeme başarısız bildirimi gönder',
      category: 'Payment',
      color: 'bg-red-500'
    },
    { 
      id: 'booking-cancelled', 
      name: 'Booking Cancelled', 
      description: 'Rezervasyon iptal bildirimi gönder',
      category: 'Booking',
      color: 'bg-orange-500'
    },
    { 
      id: 'booking-reminder', 
      name: 'Booking Reminder', 
      description: 'Rezervasyon hatırlatma maili gönder',
      category: 'Booking',
      color: 'bg-cyan-500'
    },
    { 
      id: 'password-reset', 
      name: 'Password Reset', 
      description: 'Şifre sıfırlama maili gönder',
      category: 'User',
      color: 'bg-indigo-500'
    },
    { 
      id: 'newsletter', 
      name: 'Newsletter', 
      description: 'Bülten maili gönder',
      category: 'Marketing',
      color: 'bg-teal-500'
    },
    { 
      id: 'promotional', 
      name: 'Promotional Email', 
      description: 'Promosyon ve kampanya maili gönder',
      category: 'Marketing',
      color: 'bg-pink-500'
    },
  ];

  const handleSendTestEmail = async () => {
    if (!email || !selectedTemplate) {
      setSendStatus('error');
      setErrorMsg("Lütfen email adresi ve template seçin.");
      return;
    }

    setLoading(true);
    setSendStatus('sending');
    setErrorMsg("");

    try {
      const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001';

      let response;
      
      switch (selectedTemplate) {
        case 'welcome':
          response = await axios.post(`${API_BASE_URL}/api/admin/email/send-welcome-test`, {
            email: email,
            fullName: fullName || "Test Kullanıcı",
            tour: "Hoş Geldiniz",
            destination: "MareSereno Ailesi"
          }, {
            headers: { Authorization: `Bearer ${localStorage.getItem('authToken')}` }
          });
          break;
        case 'booking-confirmation':
          response = await axios.post(`${API_BASE_URL}/api/admin/email/send-test`, {
            email: email,
            fullName: fullName || "Test Kullanıcı",
            tour: "Test Turu",
            destination: "Test Destinasyon"
          }, {
            headers: { Authorization: `Bearer ${localStorage.getItem('authToken')}` }
          });
          break;
        case 'booking-notification':
          response = await axios.post(`${API_BASE_URL}/api/admin/email/send-notification-test`, {
            bookingId: "test-123",
            customerName: fullName || "Test Kullanıcı",
            customerEmail: email,
            customerPhone: "+90 555 000 00 00",
            tourName: "Test Turu",
            bookingDate: new Date().toISOString().split('T')[0],
            totalPrice: 1000,
            adults: 2,
            children: 0,
            specialRequests: "Test rezervasyon"
          }, {
            headers: { Authorization: `Bearer ${localStorage.getItem('authToken')}` }
          });
          break;
        case 'payment-confirmation':
          response = await axios.post(`${API_BASE_URL}/api/admin/email/send-test`, {
            email: email,
            fullName: fullName || "Test Kullanıcı",
            tour: "Test Turu - Ödeme Onayı",
            destination: "Test Destinasyon"
          }, {
            headers: { Authorization: `Bearer ${localStorage.getItem('authToken')}` }
          });
          break;
        case 'payment-failed':
          response = await axios.post(`${API_BASE_URL}/api/admin/email/send-test`, {
            email: email,
            fullName: fullName || "Test Kullanıcı",
            tour: "Test Turu - Ödeme Başarısız",
            destination: "Ödeme işleminiz tamamlanamadı"
          }, {
            headers: { Authorization: `Bearer ${localStorage.getItem('authToken')}` }
          });
          break;
        case 'booking-cancelled':
          response = await axios.post(`${API_BASE_URL}/api/admin/email/send-test`, {
            email: email,
            fullName: fullName || "Test Kullanıcı",
            tour: "Test Turu - İptal Edildi",
            destination: "Rezervasyonunuz iptal edilmiştir"
          }, {
            headers: { Authorization: `Bearer ${localStorage.getItem('authToken')}` }
          });
          break;
        case 'booking-reminder':
          response = await axios.post(`${API_BASE_URL}/api/admin/email/send-test`, {
            email: email,
            fullName: fullName || "Test Kullanıcı",
            tour: "Test Turu - Hatırlatma",
            destination: "Yaklaşan tur hatırlatmanız"
          }, {
            headers: { Authorization: `Bearer ${localStorage.getItem('authToken')}` }
          });
          break;
        case 'password-reset':
          response = await axios.post(`${API_BASE_URL}/api/admin/email/send-password-reset-test`, {
            email: email,
            fullName: fullName || "Test Kullanıcı",
            tour: "Şifre Sıfırlama",
            destination: "Şifrenizi sıfırlama talebi"
          }, {
            headers: { Authorization: `Bearer ${localStorage.getItem('authToken')}` }
          });
          break;
        case 'newsletter':
          response = await axios.post(`${API_BASE_URL}/api/admin/email/send-test`, {
            email: email,
            fullName: fullName || "Test Kullanıcı",
            tour: "MareSereno Bülteni",
            destination: "Bu ayki haberler ve kampanyalar"
          }, {
            headers: { Authorization: `Bearer ${localStorage.getItem('authToken')}` }
          });
          break;
        case 'promotional':
          response = await axios.post(`${API_BASE_URL}/api/admin/email/send-test`, {
            email: email,
            fullName: fullName || "Test Kullanıcı",
            tour: "Özel Kampanya",
            destination: "%30 İndirim Fırsatı!"
          }, {
            headers: { Authorization: `Bearer ${localStorage.getItem('authToken')}` }
          });
          break;
        default:
          throw new Error('Geçersiz template seçimi');
      }
      
      if (!response || response.status !== 200) {
        setSendStatus('error');
        setErrorMsg(response?.data?.message || "Email gönderilemedi.");
      } else {
        setSendStatus('success');
        toast({
          title: "Email Gönderildi! ✅",
          description: `${emailTemplates.find(t => t.id === selectedTemplate)?.name} başarıyla gönderildi.`,
        });
      }
    } catch (err: any) {
      setSendStatus('error');
      setErrorMsg(err?.response?.data?.message || err?.message || "Email gönderilemedi.");
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setEmail("");
    setFullName("");
    setSelectedTemplate("");
    setSendStatus('idle');
    setErrorMsg("");
  };

  return (
    <div className="container mx-auto py-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2">Email Template Test Page</h1>
          <p className="text-gray-600">Test all email templates with beautiful React Email designs</p>
        </div>

        {/* Template Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {['User', 'Booking', 'Payment', 'Marketing', 'Admin'].map((category) => {
            const count = emailTemplates.filter(t => t.category === category).length;
            return count > 0 ? (
              <Card key={category} className="text-center">
                <CardContent className="pt-4">
                  <div className="text-2xl font-bold text-primary">{count}</div>
                  <div className="text-sm text-muted-foreground">{category}</div>
                </CardContent>
              </Card>
            ) : null;
          })}
        </div>

        {/* Test Settings */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Test Settings</CardTitle>
            <CardDescription>Configure test email recipient</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <Label htmlFor="email">Test Email Address *</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="hulyaekiz@gmail.com"
                />
              </div>
              <div>
                <Label htmlFor="fullName">Full Name (Optional)</Label>
                <Input
                  id="fullName"
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Hulya Ekiz"
                />
              </div>
              <div>
                <Label htmlFor="template">Email Template *</Label>
                <Select value={selectedTemplate} onValueChange={setSelectedTemplate}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select email template" />
                  </SelectTrigger>
                  <SelectContent>
                    {emailTemplates.map((template) => (
                      <SelectItem key={template.id} value={template.id}>
                        {template.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Email Templates */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-6">
          {emailTemplates.map((template) => (
            <Card 
              key={template.id} 
              className={`cursor-pointer transition-all hover:shadow-md hover:scale-105 ${
                selectedTemplate === template.id ? 'ring-2 ring-primary shadow-lg' : ''
              }`}
              onClick={() => setSelectedTemplate(template.id)}
            >
              <CardHeader>
                <div className="flex items-center justify-between mb-2">
                  <div className={`w-3 h-3 rounded-full ${template.color}`}></div>
                  <span className="text-xs font-medium text-muted-foreground bg-muted px-2 py-1 rounded-full">
                    {template.category}
                  </span>
                </div>
                <CardTitle className="text-base flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  {template.name}
                </CardTitle>
                <CardDescription className="text-sm">
                  {template.description}
                </CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>

        {/* Send Button */}
        <Card>
          <CardContent className="pt-6">
            <Button
              onClick={handleSendTestEmail}
              disabled={loading || !email || !selectedTemplate}
              className="w-full"
              size="lg"
            >
              {loading ? "Gönderiliyor..." : <><Send className="w-4 h-4 mr-2" />Send Test Email</>}
            </Button>

            {sendStatus === 'error' && (
              <Alert variant="destructive" className="mt-4">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{errorMsg}</AlertDescription>
              </Alert>
            )}

            {sendStatus === 'success' && (
              <Alert className="mt-4">
                <CheckCircle2 className="h-4 w-4" />
                <AlertDescription>Email başarıyla gönderildi!</AlertDescription>
              </Alert>
            )}

            {sendStatus !== 'idle' && (
              <Button variant="outline" onClick={resetForm} className="w-full mt-4">
                Reset Form
              </Button>
            )}
          </CardContent>
        </Card>

        {/* Email Features */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>📧 Email Features</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold mb-2">✨ Design Features</h3>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Modern React Email components</li>
                  <li>• Responsive email layouts</li>
                  <li>• Beautiful color schemes</li>
                  <li>• Professional typography</li>
                  <li>• Interactive buttons and cards</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold mb-2">🔧 Dynamic Features</h3>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Supabase functions integration</li>
                  <li>• Resend API ile güvenli gönderim</li>
                  <li>• Dynamic content rendering</li>
                  <li>• Error handling & status tracking</li>
                  <li>• GDPR/KVKK compliance</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default EmailTestPage;
