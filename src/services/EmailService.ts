import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001';

export interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  body: string;
  type: string;
  status: string;
  requires_consent: boolean;
  subscription_type: string;
}

export interface EmailSendOptions {
  to: string;
  templateId: string;
  variables?: Record<string, string>;
  checkConsent?: boolean;
  unsubscribeLink?: string;
}

interface SiteSettings {
  companyName: string;
  companyLogo: string;
  website: string;
  contactEmail: string;
  contactPhone: string;
  address: string;
  socialMedia: {
    facebook?: string;
    instagram?: string;
    twitter?: string;
    linkedin?: string;
    youtube?: string;
  };
  primaryColor: string;
  secondaryColor: string;
}

export class EmailService {
  private static instance: EmailService;
  private baseUrl: string;
  private siteSettings: SiteSettings | null = null;

  constructor() {
    this.baseUrl = API_BASE_URL;
  }

  static getInstance(): EmailService {
    if (!EmailService.instance) {
      EmailService.instance = new EmailService();
    }
    return EmailService.instance;
  }

  async checkEmailConsent(email: string, subscriptionType: string): Promise<boolean> {
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
      console.error('Error checking email consent:', error);
      return subscriptionType === 'transactional';
    }
  }

  async sendEmail(options: EmailSendOptions): Promise<{ success: boolean; messageId?: string; error?: string }> {
    try {
      if (options.checkConsent) {
        const template = await this.getTemplate(options.templateId);
        if (template?.requires_consent) {
          const hasConsent = await this.checkEmailConsent(options.to, template.subscription_type);
          if (!hasConsent) {
            return { success: false, error: 'User has not consented to receive this type of email' };
          }
        }
      }

      const response = await axios.post('/api/emails/send', {
        to: options.to,
        templateId: options.templateId,
        variables: options.variables,
        unsubscribeLink: options.unsubscribeLink
      });

      return { success: true, messageId: response.data.messageId };
    } catch (error) {
      console.error('Error sending email:', error);
      return { success: false, error: error.message };
    }
  }

  private async getTemplate(templateId: string): Promise<EmailTemplate | null> {
    try {
      const response = await axios.get(`/api/email-templates/${templateId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching template:', error);
      return null;
    }
  }

  async getSiteSettings(): Promise<SiteSettings | null> {
    if (this.siteSettings) {
      return this.siteSettings;
    }

    try {
      const response = await axios.get('/api/site-settings');
      this.siteSettings = response.data;
      return this.siteSettings;
    } catch (error) {
      console.error('Error fetching site settings:', error);
      return null;
    }
  }

  async sendWelcomeEmail(userEmail: string, userName: string): Promise<boolean> {
    try {
      const result = await this.sendEmail({
        to: userEmail,
        templateId: 'welcome',
        variables: {
          userName,
          userEmail,
        },
        checkConsent: true,
      });

      return result.success;
    } catch (error) {
      console.error('Error sending welcome email:', error);
      return false;
    }
  }

  async sendBookingConfirmation(userEmail: string, bookingDetails: any): Promise<boolean> {
    try {
      const result = await this.sendEmail({
        to: userEmail,
        templateId: 'booking-confirmation',
        variables: {
          bookingId: bookingDetails.id,
          tourName: bookingDetails.tour_name,
          bookingDate: bookingDetails.booking_date,
          totalAmount: bookingDetails.total_amount,
          userName: bookingDetails.user_name,
        },
        checkConsent: false,
      });

      return result.success;
    } catch (error) {
      console.error('Error sending booking confirmation:', error);
      return false;
    }
  }

  async sendPasswordReset(userEmail: string, resetToken: string): Promise<boolean> {
    try {
      const resetLink = `${this.baseUrl}/reset-password?token=${resetToken}`;
      
      const result = await this.sendEmail({
        to: userEmail,
        templateId: 'password-reset',
        variables: {
          resetLink,
          userEmail,
        },
        checkConsent: false,
      });

      return result.success;
    } catch (error) {
      console.error('Error sending password reset:', error);
      return false;
    }
  }
}

export const emailService = EmailService.getInstance();
