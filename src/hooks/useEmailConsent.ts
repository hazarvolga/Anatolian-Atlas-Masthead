import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from './use-toast';

export interface EmailSubscription {
  id: string;
  user_id: string;
  email: string;
  subscription_type: string;
  is_subscribed: boolean;
  consent_given_at: string;
  consent_withdrawn_at?: string;
  double_optin_confirmed: boolean;
  double_optin_token?: string;
  double_optin_sent_at?: string;
  double_optin_confirmed_at?: string;
  source?: string;
  ip_address?: string;
  user_agent?: string;
  created_at: string;
  updated_at: string;
}

export interface ConsentOptions {
  email: string;
  subscriptionType: string;
  source?: string;
  requireDoubleOptin?: boolean;
}

export const useEmailConsent = () => {
  const [subscriptions, setSubscriptions] = useState<EmailSubscription[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  // Get user's email subscriptions
  const fetchSubscriptions = async (userId?: string) => {
    setLoading(true);
    try {
      let query = supabase
        .from('email_subscriptions')
        .select('*')
        .order('created_at', { ascending: false });

      if (userId) {
        query = query.eq('user_id', userId);
      }

      const { data, error } = await query;

      if (error) throw error;
      setSubscriptions(data || []);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to fetch email subscriptions',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  // Subscribe user to email type
  const subscribe = async (options: ConsentOptions) => {
    setLoading(true);
    try {
      const { data: user } = await supabase.auth.getUser();
      
      const subscriptionData: any = {
        user_id: user.user?.id,
        email: options.email,
        subscription_type: options.subscriptionType,
        is_subscribed: true,
        consent_given_at: new Date().toISOString(),
        double_optin_confirmed: !options.requireDoubleOptin,
        source: options.source || 'website',
        ip_address: await getClientIP(),
        user_agent: navigator.userAgent,
      };

      if (options.requireDoubleOptin) {
        subscriptionData.double_optin_token = generateToken();
        subscriptionData.double_optin_sent_at = new Date().toISOString();
      }

      const { data, error } = await supabase
        .from('email_subscriptions')
        .upsert(subscriptionData, {
          onConflict: 'user_id,subscription_type',
        })
        .select()
        .single();

      if (error) throw error;

      // Log consent action
      await logConsentAction({
        userId: user.user?.id,
        email: options.email,
        subscriptionType: options.subscriptionType,
        action: 'subscribe',
        consentGiven: true,
        source: options.source,
      });

      // Send double opt-in email if required
      if (options.requireDoubleOptin) {
        await sendDoubleOptinEmail(data);
      }

      toast({
        title: 'Success',
        description: options.requireDoubleOptin 
          ? 'Please check your email to confirm subscription'
          : 'Successfully subscribed to email notifications',
      });

      return data;
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to subscribe',
        variant: 'destructive',
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Unsubscribe user from email type
  const unsubscribe = async (email: string, subscriptionType: string, userId?: string) => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('email_subscriptions')
        .update({
          is_subscribed: false,
          consent_withdrawn_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .match({ 
          email, 
          subscription_type: subscriptionType,
          ...(userId && { user_id: userId })
        })
        .select()
        .single();

      if (error) throw error;

      // Log consent action
      await logConsentAction({
        userId: data.user_id,
        email,
        subscriptionType,
        action: 'unsubscribe',
        consentGiven: false,
      });

      toast({
        title: 'Success',
        description: 'Successfully unsubscribed',
      });

      return data;
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to unsubscribe',
        variant: 'destructive',
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Confirm double opt-in
  const confirmDoubleOptin = async (token: string) => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('email_subscriptions')
        .update({
          double_optin_confirmed: true,
          double_optin_confirmed_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .eq('double_optin_token', token)
        .select()
        .single();

      if (error) throw error;

      // Log consent action
      await logConsentAction({
        userId: data.user_id,
        email: data.email,
        subscriptionType: data.subscription_type,
        action: 'optin',
        consentGiven: true,
      });

      toast({
        title: 'Success',
        description: 'Email subscription confirmed!',
      });

      return data;
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Invalid or expired confirmation token',
        variant: 'destructive',
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Generate unsubscribe token
  const generateUnsubscribeToken = async (email: string, subscriptionType?: string) => {
    try {
      const { data: user } = await supabase.auth.getUser();
      const token = generateToken();

      const { data, error } = await supabase
        .from('email_unsubscribe_tokens')
        .insert({
          token,
          user_id: user.user?.id,
          email,
          subscription_type: subscriptionType,
        })
        .select()
        .single();

      if (error) throw error;
      return token;
    } catch (error) {
      console.error('Failed to generate unsubscribe token:', error);
      throw error;
    }
  };

  // Unsubscribe via token
  const unsubscribeViaToken = async (token: string) => {
    setLoading(true);
    try {
      const { data: tokenData, error: tokenError } = await supabase
        .from('email_unsubscribe_tokens')
        .select('*')
        .eq('token', token)
        .eq('used_at', null)
        .gt('expires_at', new Date().toISOString())
        .single();

      if (tokenError) throw new Error('Invalid or expired unsubscribe token');

      // Mark token as used
      await supabase
        .from('email_unsubscribe_tokens')
        .update({ used_at: new Date().toISOString() })
        .eq('id', tokenData.id);

      // Unsubscribe user
      if (tokenData.subscription_type) {
        await unsubscribe(tokenData.email, tokenData.subscription_type, tokenData.user_id);
      } else {
        // Unsubscribe from all marketing emails
        await supabase
          .from('email_subscriptions')
          .update({
            is_subscribed: false,
            consent_withdrawn_at: new Date().toISOString(),
          })
          .eq('email', tokenData.email)
          .neq('subscription_type', 'transactional');
      }

      return true;
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to unsubscribe',
        variant: 'destructive',
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Check if user has consent for email type
  const hasConsent = async (email: string, subscriptionType: string): Promise<boolean> => {
    try {
      const { data, error } = await supabase
        .from('email_subscriptions')
        .select('is_subscribed, double_optin_confirmed')
        .eq('email', email)
        .eq('subscription_type', subscriptionType)
        .single();

      if (error || !data) return false;
      
      return data.is_subscribed && (
        subscriptionType === 'transactional' || data.double_optin_confirmed
      );
    } catch (error) {
      return false;
    }
  };

  return {
    subscriptions,
    loading,
    fetchSubscriptions,
    subscribe,
    unsubscribe,
    confirmDoubleOptin,
    generateUnsubscribeToken,
    unsubscribeViaToken,
    hasConsent,
  };
};

// Helper functions
const logConsentAction = async (params: {
  userId?: string;
  email: string;
  subscriptionType: string;
  action: string;
  consentGiven: boolean;
  source?: string;
}) => {
  try {
    await supabase.from('email_consent_log').insert({
      user_id: params.userId,
      email: params.email,
      subscription_type: params.subscriptionType,
      action: params.action,
      consent_given: params.consentGiven,
      source: params.source || 'website',
      ip_address: await getClientIP(),
      user_agent: navigator.userAgent,
    });
  } catch (error) {
    console.error('Failed to log consent action:', error);
  }
};

const generateToken = (): string => {
  return Math.random().toString(36).substring(2, 15) + 
         Math.random().toString(36).substring(2, 15);
};

const getClientIP = async (): Promise<string | null> => {
  try {
    const response = await fetch('https://api.ipify.org?format=json');
    const data = await response.json();
    return data.ip;
  } catch (error) {
    return null;
  }
};

const sendDoubleOptinEmail = async (subscription: EmailSubscription) => {
  try {
    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001';
    // Call your email service to send double opt-in email
    const response = await axios.post(`${API_BASE_URL}/api/send-double-optin`, {
      email: subscription.email,
      token: subscription.double_optin_token,
      subscriptionType: subscription.subscription_type,
    }, {
      headers: { Authorization: `Bearer ${localStorage.getItem('authToken')}` }
    });

    if (response.status !== 200) throw new Error('Failed to send double opt-in email');
  } catch (error) {
    console.error('Failed to send double opt-in email:', error);
  }
};
