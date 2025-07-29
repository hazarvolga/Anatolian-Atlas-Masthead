import { useEmailConsent } from '@/hooks/useEmailConsent';

export interface UnsubscribeOptions {
  email: string;
  subscriptionType?: string;
  baseUrl?: string;
}

export const useUnsubscribeLinks = () => {
  const { generateUnsubscribeToken } = useEmailConsent();

  // Generate unsubscribe link
  const generateUnsubscribeLink = async (options: UnsubscribeOptions): Promise<string> => {
    try {
      const token = await generateUnsubscribeToken(options.email, options.subscriptionType);
      const baseUrl = options.baseUrl || window.location.origin;
      return `${baseUrl}/unsubscribe?token=${token}`;
    } catch (error) {
      console.error('Failed to generate unsubscribe link:', error);
      return '#';
    }
  };

  // Add unsubscribe link to email template
  const addUnsubscribeLink = async (emailBody: string, options: UnsubscribeOptions): Promise<string> => {
    const unsubscribeLink = await generateUnsubscribeLink(options);
    
    const unsubscribeSection = `
<div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #eee; font-size: 12px; color: #666; text-align: center;">
  <p>
    If you no longer wish to receive these emails, you can 
    <a href="${unsubscribeLink}" style="color: #666; text-decoration: underline;">unsubscribe here</a>.
  </p>
  <p style="margin-top: 10px;">
    This email was sent to ${options.email}. 
    You received this because you subscribed to our ${options.subscriptionType || 'email'} notifications.
  </p>
</div>`;

    // Add unsubscribe section before closing body tag or at the end
    if (emailBody.includes('</body>')) {
      return emailBody.replace('</body>', unsubscribeSection + '</body>');
    } else {
      return emailBody + unsubscribeSection;
    }
  };

  // Check if email type requires unsubscribe link
  const requiresUnsubscribeLink = (subscriptionType: string): boolean => {
    return !['transactional', 'password_reset', 'booking_confirmation'].includes(subscriptionType);
  };

  return {
    generateUnsubscribeLink,
    addUnsubscribeLink,
    requiresUnsubscribeLink,
  };
};
