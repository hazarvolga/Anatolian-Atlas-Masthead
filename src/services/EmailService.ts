import axios from 'axios';
// import { render } from '@react-email/render'; // Temporarily disabled

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

// Add site settings interface
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
    this.baseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
  }

  static getInstance(): EmailService {
    if (!EmailService.instance) {
      EmailService.instance = new EmailService();
    }
    return EmailService.instance;
  }

  // Check if user has consent for email type
  async checkEmailConsent(email: string, subscriptionType: string): Promise<boolean> {
    try {
      const { data, error } = await supabase
        .from('email_subscriptions')
        .select('is_subscribed, double_optin_confirmed')
        .eq('email', email)
        .eq('subscription_type', subscriptionType)
        .single();

      if (error || !data) {
        // For transactional emails, assume consent if no record exists
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

  // Send email with consent checking
  async sendEmail(options: EmailSendOptions): Promise<boolean> {
    try {
      // Get template
      const template = await this.getTemplate(options.templateId);
      if (!template) {
        throw new Error('Template not found');
      }

      // Check consent if required
      if (options.checkConsent !== false && template.requires_consent) {
        const hasConsent = await this.checkEmailConsent(options.to, template.subscription_type);
        if (!hasConsent) {
          console.log(`Email not sent - no consent for ${options.to} on ${template.subscription_type}`);
          return false;
        }
      }

      // Replace variables in template
      let subject = template.subject;
      let body = template.body;

      if (options.variables) {
        Object.entries(options.variables).forEach(([key, value]) => {
          const placeholder = `{{${key}}}`;
          subject = subject.replace(new RegExp(placeholder, 'g'), value);
          body = body.replace(new RegExp(placeholder, 'g'), value);
        });
      }

      // Add unsubscribe link for marketing emails
      if (this.requiresUnsubscribeLink(template.subscription_type)) {
        body = await this.addUnsubscribeLink(body, options.to, template.subscription_type);
      }

      // Send via Supabase Edge Function
      const { data, error } = await supabase.functions.invoke('send-email', {
        body: {
          to: options.to,
          subject,
          html: body,
          templateId: template.id,
          subscriptionType: template.subscription_type,
        },
      });

      if (error) {
        throw error;
      }

      // Log email sent
      await this.logEmail({
        to: options.to,
        subject,
        templateId: template.id,
        status: 'sent',
        subscriptionType: template.subscription_type,
      });

      return true;
    } catch (error) {
      console.error('Error sending email:', error);
      
      // Log email error
      await this.logEmail({
        to: options.to,
        subject: options.templateId,
        templateId: options.templateId,
        status: 'failed',
        error: error instanceof Error ? error.message : 'Unknown error',
      });

      return false;
    }
  }

  // Get email template
  private async getTemplate(templateId: string): Promise<EmailTemplate | null> {
    try {
      const { data, error } = await supabase
        .from('email_templates')
        .select('*')
        .eq('id', templateId)
        .eq('status', 'active')
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching template:', error);
      return null;
    }
  }

  // Check if email type requires unsubscribe link
  private requiresUnsubscribeLink(subscriptionType: string): boolean {
    return !['transactional', 'password_reset', 'booking_confirmation'].includes(subscriptionType);
  }

  // Add unsubscribe link to email body
  private async addUnsubscribeLink(body: string, email: string, subscriptionType: string): Promise<string> {
    try {
      // Generate unsubscribe token
      const token = this.generateToken();
      
      // Save unsubscribe token
      await supabase.from('email_unsubscribe_tokens').insert({
        token,
        email,
        subscription_type: subscriptionType,
      });

      const unsubscribeUrl = `${window.location.origin}/unsubscribe?token=${token}`;
      
      const unsubscribeSection = `
<div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #eee; font-size: 12px; color: #666; text-align: center;">
  <p>
    If you no longer wish to receive these emails, you can 
    <a href="${unsubscribeUrl}" style="color: #666; text-decoration: underline;">unsubscribe here</a>.
  </p>
  <p style="margin-top: 10px;">
    This email was sent to ${email}. 
    You received this because you subscribed to our ${subscriptionType} notifications.
  </p>
</div>`;

      // Add unsubscribe section before closing body tag or at the end
      if (body.includes('</body>')) {
        return body.replace('</body>', unsubscribeSection + '</body>');
      } else {
        return body + unsubscribeSection;
      }
    } catch (error) {
      console.error('Error adding unsubscribe link:', error);
      return body;
    }
  }

  // Log email activity
  private async logEmail(logData: {
    to: string;
    subject: string;
    templateId: string;
    status: string;
    subscriptionType?: string;
    error?: string;
  }) {
    try {
      await supabase.from('email_logs').insert({
        recipient_email: logData.to,
        subject: logData.subject,
        template_id: logData.templateId,
        status: logData.status,
        subscription_type: logData.subscriptionType,
        error_message: logData.error,
        sent_at: new Date().toISOString(),
      });
    } catch (error) {
      console.error('Error logging email:', error);
    }
  }

  // Generate random token
  private generateToken(): string {
    return Math.random().toString(36).substring(2, 15) + 
           Math.random().toString(36).substring(2, 15);
  }

  // Get site settings for email templates
  private async getSiteSettings(): Promise<SiteSettings> {
    if (this.siteSettings) {
      return this.siteSettings;
    }

    try {
      const { data, error } = await supabase
        .from('site_settings')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      if (error || !data) {
        // Default settings if none found
        this.siteSettings = {
          companyName: 'Your Company',
          companyLogo: '/logo.png',
          website: 'https://yourcompany.com',
          contactEmail: 'info@yourcompany.com',
          contactPhone: '+1 (555) 123-4567',
          address: '123 Main St, City, State 12345',
          socialMedia: {},
          primaryColor: '#0066cc',
          secondaryColor: '#f8f9fa',
        };
      } else {
        // Map database fields to email template format
        this.siteSettings = {
          companyName: data.company_name || data.site_title || 'Your Company',
          companyLogo: data.site_logo_url || '/logo.png',
          website: data.website_url || 'https://yourcompany.com',
          contactEmail: data.contact_email || data.support_email || 'info@yourcompany.com',
          contactPhone: data.contact_phone || '+1 (555) 123-4567',
          address: data.address || '123 Main St, City, State 12345',
          socialMedia: this.parseSocialMedia(data.social_media_links),
          primaryColor: data.primary_color || '#0066cc',
          secondaryColor: data.secondary_color || '#f8f9fa',
        };
      }

      return this.siteSettings;
    } catch (error) {
      console.error('Error fetching site settings:', error);
      // Return default settings on error
      return {
        companyName: 'Your Company',
        companyLogo: '/logo.png',
        website: 'https://yourcompany.com',
        contactEmail: 'info@yourcompany.com',
        contactPhone: '+1 (555) 123-4567',
        address: '123 Main St, City, State 12345',
        socialMedia: {},
        primaryColor: '#0066cc',
        secondaryColor: '#f8f9fa',
      };
    }
  }

  // Parse social media links from database
  private parseSocialMedia(socialMediaData: any): SiteSettings['socialMedia'] {
    const socialMedia: SiteSettings['socialMedia'] = {};
    
    if (typeof socialMediaData === 'object' && socialMediaData !== null) {
      if (socialMediaData.facebook) socialMedia.facebook = socialMediaData.facebook;
      if (socialMediaData.instagram) socialMedia.instagram = socialMediaData.instagram;
      if (socialMediaData.twitter) socialMedia.twitter = socialMediaData.twitter;
      if (socialMediaData.linkedin) socialMedia.linkedin = socialMediaData.linkedin;
      if (socialMediaData.youtube) socialMedia.youtube = socialMediaData.youtube;
    }
    
    return socialMedia;
  }

  // Send email with React Email template
  async sendReactEmail(options: {
    to: string;
    templateName: string;
    templateProps: Record<string, any>;
    checkConsent?: boolean;
    subscriptionType?: string;
  }): Promise<boolean> {
    try {
      // Get site settings
      const siteSettings = await this.getSiteSettings();
      
      // Add site settings to template props
      const templatePropsWithSettings = {
        ...options.templateProps,
        siteSettings,
        unsubscribeUrl: options.subscriptionType && this.requiresUnsubscribeLink(options.subscriptionType) 
          ? await this.generateUnsubscribeUrl(options.to, options.subscriptionType)
          : undefined,
      };

      // Check consent if required
      if (options.checkConsent && options.subscriptionType) {
        const hasConsent = await this.checkEmailConsent(options.to, options.subscriptionType);
        if (!hasConsent) {
          console.log(`Email not sent - no consent for ${options.to} on ${options.subscriptionType}`);
          return false;
        }
      }

      // For now, just log the email instead of sending
      console.log('Email would be sent:', {
        to: options.to,
        templateName: options.templateName,
        props: templatePropsWithSettings
      });

      // Log email sent
      await this.logEmail({
        to: options.to,
        subject: `${options.templateName} email`,
        templateId: options.templateName,
        status: 'sent',
        subscriptionType: options.subscriptionType || 'transactional',
      });

      return true;
    } catch (error) {
      console.error('Error sending React email:', error);
      
      // Log email error
      await this.logEmail({
        to: options.to,
        subject: options.templateName,
        templateId: options.templateName,
        status: 'failed',
        error: error instanceof Error ? error.message : 'Unknown error',
        subscriptionType: options.subscriptionType || 'transactional',
      });

      return false;
    }
  }

  // Get React Email template and render it (temporarily disabled)
  /*
  private async getReactEmailTemplate(templateName: string, props: Record<string, any>): Promise<{ html: string; subject: string }> {
    // This method is temporarily disabled to fix white screen issue
    return { html: '<p>Email template</p>', subject: 'Test Email' };
  }
  */

  // Generate unsubscribe URL
  private async generateUnsubscribeUrl(email: string, subscriptionType: string): Promise<string> {
    try {
      const token = this.generateToken();
      
      await supabase.from('email_unsubscribe_tokens').insert({
        token,
        email,
        subscription_type: subscriptionType,
      });

      return `${window.location.origin}/unsubscribe?token=${token}`;
    } catch (error) {
      console.error('Error generating unsubscribe URL:', error);
      return `${window.location.origin}/unsubscribe`;
    }
  }

  // Send welcome email with double opt-in
  async sendWelcomeEmail(email: string, variables: Record<string, string>) {
    return this.sendEmail({
      to: email,
      templateId: '1', // Welcome email template
      variables,
      checkConsent: false, // Welcome emails don't need prior consent
    });
  }

  // Send booking confirmation
  async sendBookingConfirmation(email: string, variables: Record<string, string>) {
    return this.sendEmail({
      to: email,
      templateId: '2', // Booking confirmation template
      variables,
      checkConsent: false, // Transactional email
    });
  }

  // Send marketing email (requires consent)
  async sendMarketingEmail(email: string, templateId: string, variables: Record<string, string>) {
    return this.sendEmail({
      to: email,
      templateId,
      variables,
      checkConsent: true, // Marketing emails require consent
    });
  }

  // Send welcome email with React Email template
  async sendWelcomeEmailReact(email: string, customerName: string) {
    return this.sendReactEmail({
      to: email,
      templateName: 'welcome',
      templateProps: {
        customerName,
      },
      checkConsent: false,
      subscriptionType: 'transactional',
    });
  }

  // Send booking confirmation with React Email template
  async sendBookingConfirmationReact(email: string, bookingData: {
    customerName: string;
    tourName: string;
    tourImage?: string;
    tourDate: string;
    tourTime: string;
    participants: number;
    totalPrice: string;
    bookingReference: string;
    tourDescription?: string;
    meetingPoint?: string;
    whatToExpected?: string[];
    cancellationPolicy?: string;
  }) {
    return this.sendReactEmail({
      to: email,
      templateName: 'booking-confirmation',
      templateProps: bookingData,
      checkConsent: false,
      subscriptionType: 'transactional',
    });
  }

  // Send booking cancellation with React Email template
  async sendBookingCancellationReact(email: string, bookingData: {
    customerName: string;
    tourName: string;
    tourImage?: string;
    tourDate: string;
    tourTime: string;
    participants: number;
    totalPrice: string;
    bookingReference: string;
    cancellationReason?: string;
    refundAmount?: string;
    refundMethod?: string;
    refundTimeline?: string;
  }) {
    return this.sendReactEmail({
      to: email,
      templateName: 'booking-cancellation',
      templateProps: bookingData,
      checkConsent: false,
      subscriptionType: 'transactional',
    });
  }

  // Send payment failed email with React Email template
  async sendPaymentFailedReact(email: string, paymentData: {
    customerName: string;
    tourName: string;
    tourImage?: string;
    tourDate: string;
    tourTime: string;
    participants: number;
    totalPrice: string;
    bookingReference: string;
    failureReason?: string;
    paymentMethod?: string;
    attemptDate: string;
  }) {
    return this.sendReactEmail({
      to: email,
      templateName: 'payment-failed',
      templateProps: paymentData,
      checkConsent: false,
      subscriptionType: 'transactional',
    });
  }

  // Send booking reminder with React Email template
  async sendBookingReminderReact(email: string, reminderData: {
    customerName: string;
    tourName: string;
    tourImage?: string;
    tourDate: string;
    tourTime: string;
    participants: number;
    totalPrice: string;
    bookingReference: string;
    daysUntilTour: number;
    meetingPoint?: string;
    whatToBring?: string[];
    weatherInfo?: string;
    emergencyContact?: string;
    tourGuide?: {
      name: string;
      phone?: string;
      photo?: string;
    };
  }) {
    return this.sendReactEmail({
      to: email,
      templateName: 'booking-reminder',
      templateProps: reminderData,
      checkConsent: false,
      subscriptionType: 'transactional',
    });
  }

  // Send password reset with React Email template
  async sendPasswordResetReact(email: string, resetData: {
    customerName: string;
    resetUrl: string;
    expirationTime: string;
    requestIP?: string;
    requestTime: string;
  }) {
    return this.sendReactEmail({
      to: email,
      templateName: 'password-reset',
      templateProps: resetData,
      checkConsent: false,
      subscriptionType: 'transactional',
    });
  }

  // Send tour update with React Email template
  async sendTourUpdateReact(email: string, updateData: {
    customerName: string;
    tourName: string;
    tourImage?: string;
    tourDate: string;
    tourTime: string;
    participants: number;
    totalPrice: string;
    bookingReference: string;
    updateType: 'time_change' | 'date_change' | 'location_change' | 'cancellation' | 'general_update';
    updateTitle: string;
    updateMessage: string;
    oldValue?: string;
    newValue?: string;
    actionRequired?: boolean;
    compensationOffered?: string;
    newMeetingPoint?: string;
  }) {
    return this.sendReactEmail({
      to: email,
      templateName: 'tour-update',
      templateProps: updateData,
      checkConsent: false,
      subscriptionType: 'transactional',
    });
  }

  // Send promotional email with React Email template
  async sendPromotionalReact(email: string, promotionalData: {
    customerName?: string;
    campaignTitle: string;
    campaignDescription: string;
    offerDetails: string;
    discountCode?: string;
    discountPercentage?: number;
    validUntil: string;
    featuredTours?: {
      name: string;
      image?: string;
      originalPrice: string;
      discountedPrice: string;
      description: string;
      link: string;
    }[];
    callToAction: string;
    actionUrl: string;
  }) {
    return this.sendReactEmail({
      to: email,
      templateName: 'promotional',
      templateProps: promotionalData,
      checkConsent: true,
      subscriptionType: 'marketing',
    });
  }
}

export const emailService = EmailService.getInstance();
