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
      const response = await axios.get('/api/email-service-providers');
      setProviders(response.data || []);
      
      // Find active provider
      const active = response.data?.find((p: EmailServiceProvider) => p.is_active);
      setActiveProvider(active || null);
    } catch (error) {
      console.error('Error fetching email service providers:', error);
      toast({
        title: "Error",
        description: "Failed to fetch email service providers",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Update provider configuration
  const updateProviderConfiguration = async (
    providerId: string,
    configuration: EmailServiceConfig
  ): Promise<boolean> => {
    try {
      await axios.put(`/api/email-service-providers/${providerId}`, {
        configuration,
        updated_at: new Date().toISOString()
      });

      toast({
        title: "Success",
        description: "Email service provider configuration updated successfully",
      });

      await fetchProviders(); // Refresh the list
      return true;
    } catch (error) {
      console.error('Error updating provider configuration:', error);
      toast({
        title: "Error",
        description: "Failed to update provider configuration",
        variant: "destructive",
      });
      return false;
    }
  };

  // Activate a specific provider (deactivates others)
  const activateProvider = async (providerId: string): Promise<boolean> => {
    try {
      // First deactivate all providers
      await axios.put('/api/email-service-providers/deactivate-all');

      // Then activate the selected provider
      await axios.put(`/api/email-service-providers/${providerId}`, {
        is_active: true,
        updated_at: new Date().toISOString()
      });

      toast({
        title: "Success",
        description: "Email service provider activated successfully",
      });

      await fetchProviders(); // Refresh the list
      return true;
    } catch (error) {
      console.error('Error activating provider:', error);
      toast({
        title: "Error",
        description: "Failed to activate email service provider",
        variant: "destructive",
      });
      return false;
    }
  };

  // Test email service provider connection
  const testProviderConnection = async (providerId: string): Promise<boolean> => {
    try {
      const response = await axios.post(`/api/email-service-providers/${providerId}/test`);
      
      if (response.data.success) {
        toast({
          title: "Success",
          description: "Email service provider connection test successful",
        });
        return true;
      } else {
        toast({
          title: "Error",
          description: response.data.error || "Connection test failed",
          variant: "destructive",
        });
        return false;
      }
    } catch (error) {
      console.error('Error testing provider connection:', error);
      toast({
        title: "Error",
        description: "Failed to test email service provider connection",
        variant: "destructive",
      });
      return false;
    }
  };

  // Get provider statistics
  const getProviderStatistics = async (providerId: string) => {
    try {
      const response = await axios.get(`/api/email-service-providers/${providerId}/stats`);
      return response.data;
    } catch (error) {
      console.error('Error fetching provider statistics:', error);
      return null;
    }
  };

  // Send test email
  const sendTestEmail = async (
    providerId: string,
    testEmail: {
      to: string;
      subject: string;
      content: string;
    }
  ): Promise<boolean> => {
    try {
      const response = await axios.post(`/api/email-service-providers/${providerId}/send-test`, testEmail);
      
      if (response.data.success) {
        toast({
          title: "Success",
          description: "Test email sent successfully",
        });
        return true;
      } else {
        toast({
          title: "Error",
          description: response.data.error || "Failed to send test email",
          variant: "destructive",
        });
        return false;
      }
    } catch (error) {
      console.error('Error sending test email:', error);
      toast({
        title: "Error",
        description: "Failed to send test email",
        variant: "destructive",
      });
      return false;
    }
  };

  // Create new email service provider
  const createProvider = async (providerData: Partial<EmailServiceProvider>): Promise<boolean> => {
    try {
      await axios.post('/api/email-service-providers', {
        ...providerData,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      });

      toast({
        title: "Success",
        description: "Email service provider created successfully",
      });

      await fetchProviders(); // Refresh the list
      return true;
    } catch (error) {
      console.error('Error creating provider:', error);
      toast({
        title: "Error",
        description: "Failed to create email service provider",
        variant: "destructive",
      });
      return false;
    }
  };

  // Delete email service provider
  const deleteProvider = async (providerId: string): Promise<boolean> => {
    try {
      await axios.delete(`/api/email-service-providers/${providerId}`);

      toast({
        title: "Success",
        description: "Email service provider deleted successfully",
      });

      await fetchProviders(); // Refresh the list
      return true;
    } catch (error) {
      console.error('Error deleting provider:', error);
      toast({
        title: "Error",
        description: "Failed to delete email service provider",
        variant: "destructive",
      });
      return false;
    }
  };

  // Get email delivery statistics
  const getDeliveryStatistics = async (timeRange: string = '24h') => {
    try {
      const response = await axios.get(`/api/email-logs/stats?range=${timeRange}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching delivery statistics:', error);
      return null;
    }
  };

  // Load providers on component mount
  useEffect(() => {
    fetchProviders();
  }, []);

  return {
    providers,
    activeProvider,
    isLoading,
    fetchProviders,
    updateProviderConfiguration,
    activateProvider,
    testProviderConnection,
    getProviderStatistics,
    sendTestEmail,
    createProvider,
    deleteProvider,
    getDeliveryStatistics,
  };
};
