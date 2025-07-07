import { useState, useEffect } from 'react';
import axios from 'axios';
import { useToast } from '@/hooks/use-toast';

export interface EmailServiceProvider {
  id: string;
  name: string;
  display_name: string;
  description: string;
  is_active: boolean;
  configuration: Record<string, any>;
  rate_limits: {
    daily_limit: number;
    hourly_limit: number;
    burst_limit: number;
  };
  features: Record<string, boolean>;
  created_at: string;
  updated_at: string;
}

export interface EmailServiceConfig {
  [key: string]: string | number | boolean;
}

export const useEmailServiceManager = () => {
  const [providers, setProviders] = useState<EmailServiceProvider[]>([]);
  const [activeProvider, setActiveProvider] = useState<EmailServiceProvider | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  // Fetch all email service providers
  const fetchProviders = async () => {
    try {
      setIsLoading(true);
      console.log('🔍 Fetching email service providers...');
      
      const { data, error } = await supabase
        .from('email_service_providers')
        .select('*')
        .order('display_name');

      console.log('📧 Email providers response:', { data, error });

      if (error) throw error;

      setProviders(data || []);
      const active = data?.find(p => p.is_active);
      setActiveProvider(active || null);
      
      console.log('✅ Email providers loaded:', data?.length || 0);
    } catch (error) {
      console.error('❌ Error fetching email providers:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch email service providers',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Update provider configuration
  const updateProviderConfig = async (
    providerId: string, 
    configuration: EmailServiceConfig
  ) => {
    try {
      const { error } = await supabase
        .from('email_service_providers')
        .update({ 
          configuration,
          updated_at: new Date().toISOString()
        })
        .eq('id', providerId);

      if (error) throw error;

      await fetchProviders();
      toast({
        title: 'Success',
        description: 'Email service configuration updated successfully',
      });
    } catch (error) {
      console.error('Error updating provider config:', error);
      toast({
        title: 'Error',
        description: 'Failed to update email service configuration',
        variant: 'destructive',
      });
    }
  };

  // Set active provider
  const setActiveEmailProvider = async (providerId: string) => {
    try {
      // First, deactivate all providers
      await supabase
        .from('email_service_providers')
        .update({ is_active: false });

      // Then activate the selected provider
      const { error } = await supabase
        .from('email_service_providers')
        .update({ 
          is_active: true,
          updated_at: new Date().toISOString()
        })
        .eq('id', providerId);

      if (error) throw error;

      await fetchProviders();
      toast({
        title: 'Success',
        description: 'Active email service provider updated successfully',
      });
    } catch (error) {
      console.error('Error setting active provider:', error);
      toast({
        title: 'Error',
        description: 'Failed to set active email service provider',
        variant: 'destructive',
      });
    }
  };

  // Test email service connection
  const testEmailService = async (providerId: string) => {
    try {
      const provider = providers.find(p => p.id === providerId);
      if (!provider) throw new Error('Provider not found');

      // Call Supabase function to test email service
      const { data, error } = await supabase.functions.invoke('test-email-service', {
        body: {
          provider: provider.name,
          configuration: provider.configuration,
        },
      });

      if (error) throw error;

      toast({
        title: 'Success',
        description: 'Email service connection test successful',
      });

      return data;
    } catch (error) {
      console.error('Error testing email service:', error);
      toast({
        title: 'Error',
        description: 'Email service connection test failed',
        variant: 'destructive',
      });
      throw error;
    }
  };

  // Get provider configuration fields
  const getProviderConfigFields = (providerName: string) => {
    const configFields: Record<string, any[]> = {
      sendgrid: [
        { name: 'api_key', label: 'API Key', type: 'password', required: true },
        { name: 'from_email', label: 'From Email', type: 'email', required: true },
        { name: 'from_name', label: 'From Name', type: 'text', required: true },
      ],
      mailgun: [
        { name: 'api_key', label: 'API Key', type: 'password', required: true },
        { name: 'domain', label: 'Domain', type: 'text', required: true },
        { name: 'from_email', label: 'From Email', type: 'email', required: true },
        { name: 'from_name', label: 'From Name', type: 'text', required: true },
      ],
      ses: [
        { name: 'access_key', label: 'Access Key', type: 'password', required: true },
        { name: 'secret_key', label: 'Secret Key', type: 'password', required: true },
        { name: 'region', label: 'Region', type: 'text', required: true, default: 'us-east-1' },
        { name: 'from_email', label: 'From Email', type: 'email', required: true },
        { name: 'from_name', label: 'From Name', type: 'text', required: true },
      ],
      postmark: [
        { name: 'server_token', label: 'Server Token', type: 'password', required: true },
        { name: 'from_email', label: 'From Email', type: 'email', required: true },
        { name: 'from_name', label: 'From Name', type: 'text', required: true },
      ],
      brevo: [
        { name: 'api_key', label: 'API Key', type: 'password', required: true },
        { name: 'from_email', label: 'From Email', type: 'email', required: true },
        { name: 'from_name', label: 'From Name', type: 'text', required: true },
      ],
      resend: [
        { name: 'api_key', label: 'API Key', type: 'password', required: true },
        { name: 'from_email', label: 'From Email', type: 'email', required: true },
        { name: 'from_name', label: 'From Name', type: 'text', required: true },
      ],
    };

    return configFields[providerName] || [];
  };

  useEffect(() => {
    fetchProviders();
  }, []);

  return {
    providers,
    activeProvider,
    isLoading,
    fetchProviders,
    updateProviderConfig,
    setActiveEmailProvider,
    testEmailService,
    getProviderConfigFields,
  };
};
