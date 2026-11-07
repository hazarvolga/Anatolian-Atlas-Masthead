import { useState } from 'react';
import axios from 'axios';
import { useToast } from '@/hooks/use-toast';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001';

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
      const response = await axios.get(
        `${API_BASE_URL}/api/email-subscriptions/${encodeURIComponent(email)}`,
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
      const response = await axios.get(`${API_BASE_URL}/api/admin/email-subscriptions`, {
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
      await axios.put(
        `${API_BASE_URL}/api/email-subscriptions/${encodeURIComponent(email)}/${subscriptionType}`,
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

  const checkConsent = async (email: string, subscriptionType: string): Promise<boolean> => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/api/email-subscriptions/${encodeURIComponent(email)}/${subscriptionType}`
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
      const response = await axios.post(
        `${API_BASE_URL}/api/email-subscriptions/unsubscribe`,
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
      const response = await axios.post(
        `${API_BASE_URL}/api/email-subscriptions/confirm`,
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
    const response = await axios.post(
      `${API_BASE_URL}/api/email-subscriptions/${encodeURIComponent(email)}/token`,
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
    checkConsent,
    unsubscribeViaToken,
    confirmDoubleOptin,
    generateUnsubscribeToken,
  };
};
