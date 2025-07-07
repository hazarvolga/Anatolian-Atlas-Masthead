import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, CheckCircle, AlertCircle, Settings, Send, BarChart3 } from 'lucide-react';
import { useEmailServiceManager, EmailServiceProvider } from '@/hooks/useEmailServiceManager';
import EmailAnalyticsDashboard from './EmailAnalyticsDashboard';

const EmailServiceSettings: React.FC = () => {
  const {
    providers,
    activeProvider,
    isLoading,
    updateProviderConfig,
    setActiveEmailProvider,
    testEmailService,
    getProviderConfigFields,
  } = useEmailServiceManager();

  const [editingProvider, setEditingProvider] = useState<string | null>(null);
  const [configData, setConfigData] = useState<Record<string, any>>({});
  const [testingProvider, setTestingProvider] = useState<string | null>(null);

  const handleConfigChange = (providerId: string, field: string, value: any) => {
    setConfigData(prev => ({
      ...prev,
      [providerId]: {
        ...prev[providerId],
        [field]: value
      }
    }));
  };

  const handleSaveConfig = async (provider: EmailServiceProvider) => {
    const config = configData[provider.id] || provider.configuration;
    await updateProviderConfig(provider.id, config);
    setEditingProvider(null);
  };

  const handleTestService = async (providerId: string) => {
    setTestingProvider(providerId);
    try {
      await testEmailService(providerId);
    } finally {
      setTestingProvider(null);
    }
  };

  const getProviderIcon = (providerName: string) => {
    const icons: Record<string, string> = {
      sendgrid: '📧',
      mailgun: '🔫',
      ses: '☁️',
      postmark: '📮',
      brevo: '💌',
      resend: '🚀',
    };
    return icons[providerName] || '📨';
  };

  const getStatusColor = (provider: EmailServiceProvider) => {
    if (provider.is_active) return 'bg-green-500';
    const hasConfig = Object.keys(provider.configuration).some(key => 
      provider.configuration[key] && provider.configuration[key] !== ''
    );
    return hasConfig ? 'bg-yellow-500' : 'bg-gray-500';
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">Loading email service providers...</span>
      </div>
    );
  }

  console.log('📧 EmailServiceSettings render:', { 
    providersCount: providers.length, 
    providers: providers.map(p => ({ name: p.name, display_name: p.display_name })),
    activeProvider: activeProvider?.display_name 
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Email Service Settings</h2>
          <p className="text-muted-foreground">
            Configure and manage your email service providers for optimal deliverability
          </p>
        </div>
        {activeProvider && (
          <Badge variant="outline" className="text-lg px-4 py-2">
            <span className="mr-2">{getProviderIcon(activeProvider.name)}</span>
            Active: {activeProvider.display_name}
          </Badge>
        )}
      </div>

      <Tabs defaultValue="providers" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="providers" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            Providers
          </TabsTrigger>
          <TabsTrigger value="delivery" className="flex items-center gap-2">
            <Send className="h-4 w-4" />
            Delivery
          </TabsTrigger>
          <TabsTrigger value="analytics" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            Analytics
          </TabsTrigger>
        </TabsList>

        <TabsContent value="providers" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {providers.map((provider) => (
              <Card key={provider.id} className="relative">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">{getProviderIcon(provider.name)}</span>
                      <div>
                        <CardTitle className="text-lg">{provider.display_name}</CardTitle>
                        <div className="flex items-center gap-2 mt-1">
                          <div 
                            className={`w-2 h-2 rounded-full ${getStatusColor(provider)}`}
                          />
                          <span className="text-xs text-muted-foreground">
                            {provider.is_active ? 'Active' : 'Inactive'}
                          </span>
                        </div>
                      </div>
                    </div>
                    <Switch
                      checked={provider.is_active}
                      onCheckedChange={() => setActiveEmailProvider(provider.id)}
                    />
                  </div>
                  <CardDescription className="text-sm">
                    {provider.description}
                  </CardDescription>
                </CardHeader>

                <CardContent className="space-y-4">
                  {/* Rate Limits */}
                  <div className="text-xs space-y-1">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Daily:</span>
                      <span>{provider.rate_limits?.daily_limit?.toLocaleString() || 'N/A'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Hourly:</span>
                      <span>{provider.rate_limits?.hourly_limit?.toLocaleString() || 'N/A'}</span>
                    </div>
                  </div>

                  {/* Features */}
                  <div className="flex flex-wrap gap-1">
                    {Object.entries(provider.features || {}).map(([feature, enabled]) => (
                      enabled && (
                        <Badge key={feature} variant="secondary" className="text-xs">
                          {feature}
                        </Badge>
                      )
                    ))}
                  </div>

                  {/* Configuration */}
                  {editingProvider === provider.id ? (
                    <div className="space-y-3">
                      {getProviderConfigFields(provider.name).map((field) => (
                        <div key={field.name}>
                          <Label htmlFor={`${provider.id}-${field.name}`} className="text-xs">
                            {field.label} {field.required && <span className="text-red-500">*</span>}
                          </Label>
                          <Input
                            id={`${provider.id}-${field.name}`}
                            type={field.type}
                            placeholder={field.placeholder || `Enter ${field.label.toLowerCase()}`}
                            value={
                              configData[provider.id]?.[field.name] || 
                              provider.configuration[field.name] || 
                              field.default || 
                              ''
                            }
                            onChange={(e) => handleConfigChange(provider.id, field.name, e.target.value)}
                            className="h-8 text-xs"
                          />
                        </div>
                      ))}
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          onClick={() => handleSaveConfig(provider)}
                          className="h-8"
                        >
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Save
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setEditingProvider(null)}
                          className="h-8"
                        >
                          Cancel
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          setEditingProvider(provider.id);
                          setConfigData({
                            ...configData,
                            [provider.id]: { ...provider.configuration }
                          });
                        }}
                        className="h-8"
                      >
                        <Settings className="h-3 w-3 mr-1" />
                        Configure
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleTestService(provider.id)}
                        disabled={testingProvider === provider.id}
                        className="h-8"
                      >
                        {testingProvider === provider.id ? (
                          <Loader2 className="h-3 w-3 animate-spin mr-1" />
                        ) : (
                          <Send className="h-3 w-3 mr-1" />
                        )}
                        Test
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>

          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              <strong>Anti-Spam Best Practices:</strong><br />
              • Configure SPF, DKIM, and DMARC records for your domain<br />
              • Use double opt-in for newsletter subscriptions<br />
              • Maintain clean email lists and handle bounces promptly<br />
              • Monitor your sender reputation regularly
            </AlertDescription>
          </Alert>
        </TabsContent>

        <TabsContent value="delivery" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Delivery Settings</CardTitle>
              <CardDescription>
                Configure delivery options and anti-spam measures
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Delivery configuration content will be added here */}
              <p className="text-muted-foreground">Delivery configuration options coming soon...</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <EmailAnalyticsDashboard />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default EmailServiceSettings;
