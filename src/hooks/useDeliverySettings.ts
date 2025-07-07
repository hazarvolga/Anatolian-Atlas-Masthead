import { useState, useEffect } from 'react';
import axios from 'axios';
import { useToast } from '@/hooks/use-toast';

export interface DeliverySettings {
  // Rate Limiting
  max_emails_per_hour: number;
  max_emails_per_day: number;
  burst_limit: number;
  
  // Anti-Spam
  enable_spam_filtering: boolean;
  spam_score_threshold: number;
  block_disposable_emails: boolean;
  block_role_based_emails: boolean;
  require_double_optin: boolean;
  
  // Content Filtering
  enable_content_filtering: boolean;
  blocked_words: string[];
  max_link_count: number;
  require_unsubscribe_link: boolean;
  
  // Delivery Optimization
  enable_send_time_optimization: boolean;
  preferred_send_hours: string;
  timezone: string;
  enable_engagement_tracking: boolean;
  
  // List Management
  auto_suppress_bounces: boolean;
  auto_suppress_complaints: boolean;
  engagement_threshold_days: number;
  
  // Reputation Management
  enable_reputation_monitoring: boolean;
  min_reputation_score: number;
  pause_on_high_bounce_rate: boolean;
  bounce_rate_threshold: number;
  
  // Backup Settings
  enable_backup_provider: boolean;
  backup_provider_id?: string;
  failover_threshold: number;
}

export interface EmailQuota {
  hourly_sent: number;
  daily_sent: number;
  hourly_reset_time: string;
  daily_reset_time: string;
}

export interface DeliveryStatus {
  is_paused: boolean;
  pause_reason?: string;
  current_reputation_score?: number;
  bounce_rate: number;
  complaint_rate: number;
}

const defaultSettings: DeliverySettings = {
  max_emails_per_hour: 1000,
  max_emails_per_day: 10000,
  burst_limit: 100,
  enable_spam_filtering: true,
  spam_score_threshold: 25,
  block_disposable_emails: true,
  block_role_based_emails: false,
  require_double_optin: true,
  enable_content_filtering: true,
  blocked_words: ['spam', 'urgent', 'limited time', 'act now'],
  max_link_count: 5,
  require_unsubscribe_link: true,
  enable_send_time_optimization: false,
  preferred_send_hours: '09:00-17:00',
  timezone: 'UTC',
  enable_engagement_tracking: true,
  auto_suppress_bounces: true,
  auto_suppress_complaints: true,
  engagement_threshold_days: 90,
  enable_reputation_monitoring: true,
  min_reputation_score: 70,
  pause_on_high_bounce_rate: true,
  bounce_rate_threshold: 5,
  enable_backup_provider: false,
  failover_threshold: 10
};

export const useDeliverySettings = () => {
  const [settings, setSettings] = useState<DeliverySettings>(defaultSettings);
  const [quota, setQuota] = useState<EmailQuota | null>(null);
  const [status, setStatus] = useState<DeliveryStatus | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();

  // Fetch delivery settings
  const fetchSettings = async () => {
    try {
      setIsLoading(true);
      
      const { data, error } = await supabase
        .from('site_settings')
        .select('value')
        .eq('key', 'email_delivery_settings')
        .single();

      if (data?.value) {
        const savedSettings = JSON.parse(data.value);
        setSettings({ ...defaultSettings, ...savedSettings });
      }
    } catch (error) {
      console.error('Error fetching delivery settings:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Save delivery settings
  const saveSettings = async (newSettings: Partial<DeliverySettings>) => {
    try {
      setIsSaving(true);
      
      const updatedSettings = { ...settings, ...newSettings };
      
      const { error } = await supabase
        .from('site_settings')
        .upsert({
          key: 'email_delivery_settings',
          value: JSON.stringify(updatedSettings),
          updated_at: new Date().toISOString()
        });

      if (error) throw error;

      setSettings(updatedSettings);
      
      toast({
        title: 'Success',
        description: 'Email delivery settings saved successfully',
      });

      return true;
    } catch (error) {
      console.error('Error saving delivery settings:', error);
      toast({
        title: 'Error',
        description: 'Failed to save delivery settings',
        variant: 'destructive',
      });
      return false;
    } finally {
      setIsSaving(false);
    }
  };

  // Fetch current email quota and usage
  const fetchQuota = async () => {
    try {
      const { data, error } = await supabase
        .from('site_settings')
        .select('value')
        .eq('key', 'email_quota')
        .single();

      if (data?.value) {
        setQuota(JSON.parse(data.value));
      }
    } catch (error) {
      console.error('Error fetching email quota:', error);
    }
  };

  // Fetch delivery status
  const fetchStatus = async () => {
    try {
      const { data, error } = await supabase
        .from('site_settings')
        .select('value')
        .eq('key', 'email_delivery_status')
        .single();

      if (data?.value) {
        setStatus(JSON.parse(data.value));
      }
    } catch (error) {
      console.error('Error fetching delivery status:', error);
    }
  };

  // Check if email sending is allowed
  const canSendEmail = (): { allowed: boolean; reason?: string } => {
    if (!quota || !status) {
      return { allowed: true }; // Allow if no quota/status data
    }

    if (status.is_paused) {
      return { allowed: false, reason: status.pause_reason || 'Email delivery is paused' };
    }

    if (quota.hourly_sent >= settings.max_emails_per_hour) {
      return { allowed: false, reason: 'Hourly rate limit exceeded' };
    }

    if (quota.daily_sent >= settings.max_emails_per_day) {
      return { allowed: false, reason: 'Daily rate limit exceeded' };
    }

    return { allowed: true };
  };

  // Reset email quota (admin function)
  const resetQuota = async (type: 'hourly' | 'daily' | 'both' = 'both') => {
    try {
      const now = new Date();
      const newQuota: EmailQuota = {
        hourly_sent: type === 'hourly' || type === 'both' ? 0 : quota?.hourly_sent || 0,
        daily_sent: type === 'daily' || type === 'both' ? 0 : quota?.daily_sent || 0,
        hourly_reset_time: type === 'hourly' || type === 'both' ? now.toISOString() : quota?.hourly_reset_time || now.toISOString(),
        daily_reset_time: type === 'daily' || type === 'both' ? now.toISOString() : quota?.daily_reset_time || now.toISOString(),
      };

      const { error } = await supabase
        .from('site_settings')
        .upsert({
          key: 'email_quota',
          value: JSON.stringify(newQuota),
          updated_at: now.toISOString()
        });

      if (error) throw error;

      setQuota(newQuota);
      
      toast({
        title: 'Success',
        description: `Email quota ${type} reset successfully`,
      });

      return true;
    } catch (error) {
      console.error('Error resetting quota:', error);
      toast({
        title: 'Error',
        description: 'Failed to reset quota',
        variant: 'destructive',
      });
      return false;
    }
  };

  // Pause/resume email delivery
  const toggleDeliveryStatus = async (paused: boolean, reason?: string) => {
    try {
      const newStatus: DeliveryStatus = {
        ...status,
        is_paused: paused,
        pause_reason: paused ? reason : undefined,
      };

      const response = await axios.put(`${API_BASE_URL}/api/admin/email-status/toggle`, newStatus);

      setStatus(response.data);
      
      toast({
        title: 'Success',
        description: `Email delivery ${paused ? 'paused' : 'resumed'} successfully`,
      });

      return true;
    } catch (error) {
      console.error('Error updating delivery status:', error);
      toast({
        title: 'Error',
        description: 'Failed to update delivery status',
        variant: 'destructive',
      });
      return false;
    }
  };

  // Test delivery settings validation
  const validateEmailContent = (content: string, subject: string): { valid: boolean; issues: string[] } => {
    const issues: string[] = [];

    if (settings.enable_content_filtering) {
      // Check blocked words
      const blockedWordsFound = settings.blocked_words.filter(word => 
        content.toLowerCase().includes(word) || subject.toLowerCase().includes(word)
      );
      if (blockedWordsFound.length > 0) {
        issues.push(`Contains blocked words: ${blockedWordsFound.join(', ')}`);
      }

      // Check link count
      const linkCount = (content.match(/<a\s+[^>]*href=/gi) || []).length;
      if (linkCount > settings.max_link_count) {
        issues.push(`Too many links: ${linkCount} (max: ${settings.max_link_count})`);
      }

      // Check unsubscribe link
      if (settings.require_unsubscribe_link && !content.toLowerCase().includes('unsubscribe')) {
        issues.push('Missing unsubscribe link');
      }
    }

    return {
      valid: issues.length === 0,
      issues
    };
  };

  useEffect(() => {
    fetchSettings();
    fetchQuota();
    fetchStatus();
  }, []);

  return {
    settings,
    quota,
    status,
    isLoading,
    isSaving,
    fetchSettings,
    saveSettings,
    fetchQuota,
    fetchStatus,
    canSendEmail,
    resetQuota,
    toggleDeliveryStatus,
    validateEmailContent,
  };
};
