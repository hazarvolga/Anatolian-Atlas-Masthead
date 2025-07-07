import React from 'react';
import { Text } from '@react-email/components';
import EmailLayout from '../components/EmailLayout';
import { 
  EmailButton, 
  EmailCard, 
  EmailAlert,
  ContactInfo 
} from '../components/EmailComponents';

interface PasswordResetEmailProps {
  customerName: string;
  resetUrl: string;
  expirationTime: string;
  requestIP?: string;
  requestTime: string;
  siteSettings: {
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
  };
  unsubscribeUrl?: string;
}

export default function PasswordResetEmail({
  customerName,
  resetUrl,
  expirationTime,
  requestIP,
  requestTime,
  siteSettings,
  unsubscribeUrl,
}: PasswordResetEmailProps) {
  const previewText = `Reset your ${siteSettings.companyName} account password`;

  return (
    <EmailLayout 
      siteSettings={siteSettings}
      previewText={previewText}
      headerTitle="Password Reset Request"
    >
      {/* Welcome Message */}
      <Text style={{
        fontSize: '18px',
        color: '#212529',
        lineHeight: '1.6',
        margin: '0 0 24px 0',
      }}>
        Hello {customerName},
      </Text>

      <Text style={{
        fontSize: '16px',
        color: '#495057',
        lineHeight: '1.6',
        margin: '0 0 24px 0',
      }}>
        We received a request to reset the password for your {siteSettings.companyName} account. 
        If you made this request, click the button below to reset your password.
      </Text>

      {/* Security Alert */}
      <EmailAlert variant="info" title="🔒 Password Reset Request">
        A password reset was requested for your account on {requestTime}.
        {requestIP && (
          <>
            <br />
            <strong>Request from IP:</strong> {requestIP}
          </>
        )}
      </EmailAlert>

      {/* Reset Button */}
      <div style={{
        textAlign: 'center',
        margin: '32px 0',
      }}>
        <EmailButton
          href={resetUrl}
          variant="primary"
          size="lg"
        >
          🔑 Reset Your Password
        </EmailButton>
      </div>

      {/* Alternative Link */}
      <EmailCard title="Can't click the button?" backgroundColor="#f8f9fa">
        <Text style={{
          fontSize: '14px',
          color: '#495057',
          lineHeight: '1.6',
          margin: '0 0 12px 0',
        }}>
          If the button above doesn't work, copy and paste this link into your browser:
        </Text>
        
        <Text style={{
          fontSize: '13px',
          color: '#0066cc',
          wordBreak: 'break-all',
          margin: '0',
          padding: '12px',
          backgroundColor: '#f0f8ff',
          borderRadius: '4px',
          fontFamily: 'monospace',
        }}>
          {resetUrl}
        </Text>
      </EmailCard>

      {/* Expiration Warning */}
      <EmailAlert variant="warning" title="⏰ Time Sensitive">
        This password reset link will expire on <strong>{expirationTime}</strong>. 
        For security reasons, you'll need to request a new reset link after this time.
      </EmailAlert>

      {/* Security Information */}
      <EmailCard title="🛡️ Security Information" backgroundColor="#e8f5e8">
        <Text style={{
          fontSize: '14px',
          color: '#155724',
          lineHeight: '1.6',
          margin: '0 0 12px 0',
          fontWeight: '500',
        }}>
          Important Security Notes:
        </Text>
        
        <Text style={{
          fontSize: '14px',
          color: '#495057',
          lineHeight: '1.6',
          margin: '0',
        }}>
          • This link can only be used once<br/>
          • It will expire in 24 hours for your security<br/>
          • Only use this link if you requested the password reset<br/>
          • Never share this link with anyone<br/>
          • Choose a strong, unique password when resetting
        </Text>
      </EmailCard>

      {/* Didn't Request This? */}
      <EmailAlert variant="error" title="⚠️ Didn't Request This?">
        If you didn't request a password reset, please ignore this email and your password will remain unchanged. 
        Your account is still secure. However, you may want to review your account security and consider changing your password as a precaution.
      </EmailAlert>

      {/* Action Buttons for Security */}
      <div style={{
        textAlign: 'center',
        margin: '32px 0',
      }}>
        <EmailButton
          href={`${siteSettings.website}/account/security`}
          variant="outline"
          size="md"
        >
          🔐 Review Account Security
        </EmailButton>
      </div>

      {/* Password Tips */}
      <EmailCard title="💡 Password Security Tips" backgroundColor="#f0f8ff">
        <Text style={{
          fontSize: '14px',
          color: '#495057',
          lineHeight: '1.6',
          margin: '0',
        }}>
          When creating your new password, make sure it:<br/>
          • Is at least 8 characters long<br/>
          • Contains both uppercase and lowercase letters<br/>
          • Includes numbers and special characters<br/>
          • Is unique and not used on other websites<br/>
          • Is not easily guessable (avoid personal information)
        </Text>
      </EmailCard>

      {/* Contact Information */}
      <ContactInfo
        email={siteSettings.contactEmail}
        phone={siteSettings.contactPhone}
        address={siteSettings.address}
        website={siteSettings.website}
      />

      {/* Final Message */}
      <Text style={{
        fontSize: '16px',
        color: '#495057',
        lineHeight: '1.6',
        margin: '32px 0 16px 0',
        textAlign: 'center',
      }}>
        Need help? Our support team is here to assist you with any account-related questions.
      </Text>

      <Text style={{
        fontSize: '14px',
        color: '#6c757d',
        lineHeight: '1.6',
        margin: '0 0 16px 0',
        textAlign: 'center',
      }}>
        Thank you for keeping your account secure.
      </Text>

      {/* Unsubscribe Link */}
      {unsubscribeUrl && (
        <Text style={{
          fontSize: '12px',
          color: '#6c757d',
          textAlign: 'center',
          margin: '24px 0 0 0',
        }}>
          Don't want to receive these emails?{' '}
          <a href={unsubscribeUrl} style={{ color: '#6c757d' }}>
            Unsubscribe here
          </a>
        </Text>
      )}
    </EmailLayout>
  );
}