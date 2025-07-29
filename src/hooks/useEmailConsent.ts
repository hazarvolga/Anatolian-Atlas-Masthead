import { useState, useEffect } from 'react';
import axios from 'axios';
import { useToast } from '@/hooks/use-toast';

export interface EmailConsent {
  id: string;
  email: string;
  subscription_type: string;
  is_subscribed: boolean;
  double_optin_confirmed: boolean;
  consent_date: string;
  last_updated: string;
  ip_address?: string;
  user_agent?: string;
}

export const useEmailConsent = () => {
  const [consents, setConsents] = useState<EmailConsent[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const fetchUserConsents = async (email: string) => {
    try {
      setIsLoading(true);
      const response = await axios.get(`/api/email-subscriptions/${email}`);
      setConsents(response.data || []);
    } catch (error) {
      console.error('Error fetching user consents:', error);
      toast({
        title: "Error",
        description: "Failed to fetch email consents",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const updateConsent = async (
    email: string,
    subscriptionType: string,
    isSubscribed: boolean
  ): Promise<boolean> => {
    try {
      await axios.put(`/api/email-subscriptions/${email}/${subscriptionType}`, {
        is_subscribed: isSubscribed,
        last_updated: new Date().toISOString()
      });

      toast({
        title: "Success",
        description: "Email consent updated successfully",
      });

      await fetchUserConsents(email);
      return true;
    } catch (error) {
      console.error('Error updating consent:', error);
      toast({
        title: "Error",
        description: "Failed to update email consent",
        variant: "destructive",
      });
      return false;
    }
  };

  const checkConsent = async (email: string, subscriptionType: string): Promise<boolean> => {
    try {
      const response = await axios.get(`/api/email-subscriptions/${email}/${subscriptionType}`);
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

  return {
    consents,
    isLoading,
    fetchUserConsents,
    updateConsent,
    checkConsent,
  };
};
