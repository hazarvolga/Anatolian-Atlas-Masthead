"use client";

import { useState } from 'react';
import { api } from '@/lib/api/client';
import { useToast } from '@/hooks/use-toast';

const getAuthHeaders = () => ({
  Authorization: `Bearer ${localStorage.getItem('authToken')}`,
});

export interface EmailConsent {
  id: string;
  email: string;
  subscription_type: string;
  is_subscribed: boolean;
  double_optin_confirmed: boolean;
  consent_given_at: string;
  last_updated: string;
  source?: string | null;
  ip_address?: string | null;
  user_agent?: string | null;
}

export const useEmailConsent = () => {
  const [consents, setConsents] = useState<EmailConsent[]>([]);
  const [subscriptions, setSubscriptions] = useState<EmailConsent[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const fetchUserConsents = async (email: string) => {
    try {
      setLoading(true);
      const response = await api.get(
        `/api/email-subscriptions/${encodeURIComponent(email)}`,
        { headers: getAuthHeaders() }
      );
      setConsents(response.data || []);
      return response.data as EmailConsent[];
    } catch (error) {
      console.error('Error fetching user consents:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch email consents',
        variant: 'destructive',
      });
      return [] as EmailConsent[];
    } finally {
      setLoading(false);
    }
  };

  const fetchSubscriptions = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/api/admin/email-subscriptions`, {
        headers: getAuthHeaders(),
      });
      setSubscriptions(response.data || []);
      return response.data as EmailConsent[];
    } catch (error) {
      console.error('Error fetching email subscriptions:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch email subscriptions',
        variant: 'destructive',
      });
      return [] as EmailConsent[];
    } finally {
      setLoading(false);
    }
  };

  const updateConsent = async (
    email: string,
    subscriptionType: string,
    isSubscribed: boolean
  ): Promise<boolean> => {
    try {
      await api.put(
        `/api/email-subscriptions/${encodeURIComponent(email)}/${subscriptionType}`,
        { is_subscribed: isSubscribed },
        { headers: getAuthHeaders() }
      );

      toast({
        title: 'Success',
        description: 'Email consent updated successfully',
      });

      await fetchUserConsents(email);
      return true;
    } catch (error) {
      console.error('Error updating consent:', error);
      toast({
        title: 'Error',
        description: 'Failed to update email consent',
        variant: 'destructive',
      });
      return false;
    }
  };

  const unsubscribeTypes = async (email: string, subscriptionTypes: string[]): Promise<boolean> => {
    try {
      setLoading(true);
      await Promise.all(
        subscriptionTypes.map((type) =>
          api.put(
            `/api/email-subscriptions/${encodeURIComponent(email)}/${type}`,
            { is_subscribed: false },
            { headers: getAuthHeaders() }
          )
        )
      );

      toast({
        title: 'Success',
        description: 'Your email preferences were updated',
      });
      return true;
    } catch (error) {
      console.error('Error unsubscribing:', error);
      toast({
        title: 'Error',
        description: 'Failed to update email preferences',
        variant: 'destructive',
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  const checkConsent = async (email: string, subscriptionType: string): Promise<boolean> => {
    try {
      const response = await api.get(
        `/api/email-subscriptions/${encodeURIComponent(email)}/${subscriptionType}`
      );
      const data = response.data;

      if (!data) {
        return subscriptionType === 'transactional';
      }

      return data.is_subscribed && (
        subscriptionType === 'transactional' || data.double_optin_confirmed
      );
    } catch (error) {
      console.error('Error checking consent:', error);
      return subscriptionType === 'transactional';
    }
  };

  const unsubscribeViaToken = async (token: string) => {
    try {
      setLoading(true);
      const response = await api.post(
        `/api/email-subscriptions/unsubscribe`,
        { token }
      );
      return response.data;
    } finally {
      setLoading(false);
    }
  };

  const confirmDoubleOptin = async (token: string) => {
    try {
      setLoading(true);
      const response = await api.post(
        `/api/email-subscriptions/confirm`,
        { token }
      );
      return response.data as EmailConsent;
    } finally {
      setLoading(false);
    }
  };

  const generateUnsubscribeToken = async (
    email: string,
    subscriptionType?: string
  ): Promise<string> => {
    const response = await api.post(
      `/api/email-subscriptions/${encodeURIComponent(email)}/token`,
      { subscriptionType },
      { headers: getAuthHeaders() }
    );
    return response.data.token as string;
  };

  return {
    consents,
    subscriptions,
    loading,
    fetchUserConsents,
    fetchSubscriptions,
    updateConsent,
    unsubscribeTypes,
    checkConsent,
    unsubscribeViaToken,
    confirmDoubleOptin,
    generateUnsubscribeToken,
  };
};
