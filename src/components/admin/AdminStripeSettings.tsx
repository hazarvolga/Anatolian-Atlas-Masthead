
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, CreditCard, Eye, EyeOff, ExternalLink } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useStripeSettings, useUpdateStripeSettings } from "@/hooks/useStripeSettings";

export default function AdminStripeSettings() {
  const { data: stripeSettings, isLoading } = useStripeSettings();
  const updateStripeSettings = useUpdateStripeSettings();
  
  const [formData, setFormData] = useState({
    stripe_secret_key: '',
    stripe_publishable_key: '',
    webhook_secret: '',
    is_live_mode: false,
  });
  
  const [showSecrets, setShowSecrets] = useState({
    secret: false,
    webhook: false,
  });

  // Update form when data loads
  useState(() => {
    if (stripeSettings) {
      setFormData({
        stripe_secret_key: '',
        stripe_publishable_key: stripeSettings.stripe_publishable_key || '',
        webhook_secret: '',
        is_live_mode: stripeSettings.is_live_mode || false,
      });
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const updateData: any = {};
    
    if (formData.stripe_secret_key.trim()) {
      updateData.stripe_secret_key = formData.stripe_secret_key;
    }
    
    if (formData.stripe_publishable_key.trim()) {
      updateData.stripe_publishable_key = formData.stripe_publishable_key;
    }
    
    if (formData.webhook_secret.trim()) {
      updateData.webhook_secret = formData.webhook_secret;
    }
    
    updateData.is_live_mode = formData.is_live_mode;
    
    updateStripeSettings.mutate(updateData);
  };

  const maskKey = (key: string | undefined) => {
    if (!key) return '';
    return key.substring(0, 8) + '••••••••••••••••';
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-2">
          <CreditCard className="h-6 w-6" />
          <h2 className="text-2xl font-bold">Stripe Ayarları</h2>
        </div>
        <Card>
          <CardContent className="pt-6">
            <div className="animate-pulse space-y-4">
              <div className="h-4 bg-gray-200 rounded w-1/4"></div>
              <div className="h-10 bg-gray-200 rounded"></div>
              <div className="h-4 bg-gray-200 rounded w-1/4"></div>
              <div className="h-10 bg-gray-200 rounded"></div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <CreditCard className="h-6 w-6" />
        <h2 className="text-2xl font-bold">Stripe Ayarları</h2>
        {stripeSettings?.is_live_mode ? (
          <Badge variant="destructive">Canlı Mod</Badge>
        ) : (
          <Badge variant="secondary">Test Modu</Badge>
        )}
      </div>
      
      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          Stripe API anahtarlarınızı buradan yönetebilirsiniz. Güvenlik nedeniyle, gizli anahtarlar maskelenmiş olarak gösterilir.
        </AlertDescription>
      </Alert>

      <Card>
        <CardHeader>
          <CardTitle>API Anahtarları</CardTitle>
          <CardDescription>
            Stripe ödeme entegrasyonu için gerekli API anahtarlarını yapılandırın.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="publishable_key">Publishable Key</Label>
                <Input
                  id="publishable_key"
                  type="text"
                  placeholder="pk_test_... veya pk_live_..."
                  value={formData.stripe_publishable_key}
                  onChange={(e) => setFormData({ ...formData, stripe_publishable_key: e.target.value })}
                />
                {stripeSettings?.stripe_publishable_key && (
                  <p className="text-sm text-muted-foreground">
                    Mevcut: {maskKey(stripeSettings.stripe_publishable_key)}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="secret_key">Secret Key</Label>
                <div className="relative">
                  <Input
                    id="secret_key"
                    type={showSecrets.secret ? "text" : "password"}
                    placeholder="sk_test_... veya sk_live_..."
                    value={formData.stripe_secret_key}
                    onChange={(e) => setFormData({ ...formData, stripe_secret_key: e.target.value })}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3"
                    onClick={() => setShowSecrets({ ...showSecrets, secret: !showSecrets.secret })}
                  >
                    {showSecrets.secret ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
                {stripeSettings?.stripe_secret_key && (
                  <p className="text-sm text-muted-foreground">
                    Mevcut gizli anahtar yapılandırılmış
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="webhook_secret">Webhook Secret</Label>
                <div className="relative">
                  <Input
                    id="webhook_secret"
                    type={showSecrets.webhook ? "text" : "password"}
                    placeholder="whsec_..."
                    value={formData.webhook_secret}
                    onChange={(e) => setFormData({ ...formData, webhook_secret: e.target.value })}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3"
                    onClick={() => setShowSecrets({ ...showSecrets, webhook: !showSecrets.webhook })}
                  >
                    {showSecrets.webhook ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
                {stripeSettings?.webhook_secret && (
                  <p className="text-sm text-muted-foreground">
                    Mevcut webhook secret yapılandırılmış
                  </p>
                )}
              </div>
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="live_mode">Canlı Mod</Label>
                <p className="text-sm text-muted-foreground">
                  Gerçek ödemeleri kabul etmek için canlı modu etkinleştirin
                </p>
              </div>
              <Switch
                id="live_mode"
                checked={formData.is_live_mode}
                onCheckedChange={(checked) => setFormData({ ...formData, is_live_mode: checked })}
              />
            </div>

            <div className="flex gap-4">
              <Button 
                type="submit" 
                disabled={updateStripeSettings.isPending}
                className="flex-1"
              >
                {updateStripeSettings.isPending ? 'Kaydediliyor...' : 'Ayarları Kaydet'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Yararlı Linkler</CardTitle>
          <CardDescription>
            Stripe hesabınızı yönetmek için faydalı linkler
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Button variant="outline" asChild className="justify-start">
              <a href="https://dashboard.stripe.com/apikeys" target="_blank" rel="noopener noreferrer">
                <ExternalLink className="h-4 w-4 mr-2" />
                API Anahtarları
              </a>
            </Button>
            <Button variant="outline" asChild className="justify-start">
              <a href="https://dashboard.stripe.com/webhooks" target="_blank" rel="noopener noreferrer">
                <ExternalLink className="h-4 w-4 mr-2" />
                Webhook Ayarları
              </a>
            </Button>
            <Button variant="outline" asChild className="justify-start">
              <a href="https://dashboard.stripe.com/payments" target="_blank" rel="noopener noreferrer">
                <ExternalLink className="h-4 w-4 mr-2" />
                Ödemeler
              </a>
            </Button>
            <Button variant="outline" asChild className="justify-start">
              <a href="https://dashboard.stripe.com/test/dashboard" target="_blank" rel="noopener noreferrer">
                <ExternalLink className="h-4 w-4 mr-2" />
                Test Dashboard
              </a>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
