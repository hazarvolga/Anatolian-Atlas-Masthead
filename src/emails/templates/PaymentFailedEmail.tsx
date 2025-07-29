import React from 'react';
import { Text } from '@react-email/components';
import EmailLayout from '../components/EmailLayout';
import { 
  EmailButton, 
  EmailCard, 
  TourInfo, 
  EmailAlert,
  EmailFeatureList,
  ContactInfo 
} from '../components/EmailComponents';

interface PaymentFailedEmailProps {
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

export default function PaymentFailedEmail({
  customerName,
  tourName,
  tourImage,
  tourDate,
  tourTime,
  participants,
  totalPrice,
  bookingReference,
  failureReason,
  paymentMethod,
  attemptDate,
  siteSettings,
  unsubscribeUrl,
}: PaymentFailedEmailProps) {
  const previewText = `Payment failed for your booking: ${tourName}. Please retry payment.`;

  const troubleshootingSteps = [
    'Check that your card details are correct',
    'Ensure your card has sufficient funds',
    'Verify that your card is not expired',
    'Contact your bank if the issue persists',
    'Try using a different payment method'
  ];

  return (
    <EmailLayout 
      siteSettings={siteSettings}
      previewText={previewText}
      headerTitle="Payment Failed"
    >
      {/* Welcome Message */}
      <Text style={{
        fontSize: '18px',
        color: '#212529',
        lineHeight: '1.6',
        margin: '0 0 24px 0',
      }}>
        Dear {customerName},
      </Text>

      <Text style={{
        fontSize: '16px',
        color: '#495057',
        lineHeight: '1.6',
        margin: '0 0 24px 0',
      }}>
        We encountered an issue while processing your payment for the tour booking. Don't worry - your reservation is temporarily held and you can easily retry the payment.
      </Text>

      {/* Payment Failed Alert */}
      <EmailAlert variant="error" title="Payment Failed">
        Your payment could not be processed. {failureReason && `Reason: ${failureReason}`}
        <br />
        <strong>Attempted on:</strong> {attemptDate}
        {paymentMethod && (
          <>
            <br />
            <strong>Payment Method:</strong> {paymentMethod}
          </>
        )}
      </EmailAlert>

      {/* Tour Information */}
      <TourInfo
        tourName={tourName}
        tourImage={tourImage}
        tourDate={tourDate}
        tourTime={tourTime}
        participants={participants}
        price={totalPrice}
        bookingReference={bookingReference}
      />

      {/* Urgent Action Required */}
      <EmailCard title="⏰ Action Required" backgroundColor="#fff3cd">
        <Text style={{
          fontSize: '14px',
          color: '#856404',
          lineHeight: '1.6',
          margin: '0 0 12px 0',
          fontWeight: '600',
        }}>
          Your booking is temporarily reserved for 24 hours.
        </Text>
        
        <Text style={{
          fontSize: '14px',
          color: '#856404',
          lineHeight: '1.6',
          margin: '0',
        }}>
          Please complete your payment within 24 hours to secure your spot. After this time, your reservation may be released to other customers.
        </Text>
      </EmailCard>

      {/* Action Buttons */}
      <div style={{
        textAlign: 'center',
        margin: '32px 0',
      }}>
        <EmailButton
          href={`${siteSettings.website}/booking/${bookingReference}/payment`}
          variant="primary"
          size="lg"
        >
          💳 Retry Payment Now
        </EmailButton>
      </div>

      <div style={{
        textAlign: 'center',
        margin: '16px 0 32px 0',
      }}>
        <EmailButton
          href={`${siteSettings.website}/booking/${bookingReference}`}
          variant="outline"
          size="md"
        >
          View Booking Details
        </EmailButton>
      </div>

      {/* Troubleshooting Steps */}
      <EmailFeatureList
        title="💡 Troubleshooting Tips"
        items={troubleshootingSteps}
      />

      {/* Alternative Payment Methods */}
      <EmailCard title="Alternative Payment Options" backgroundColor="#e3f2fd">
        <Text style={{
          fontSize: '14px',
          color: '#495057',
          lineHeight: '1.6',
          margin: '0 0 12px 0',
        }}>
          If you continue to experience issues with your payment method, you can try:
        </Text>
        
        <Text style={{
          fontSize: '14px',
          color: '#495057',
          lineHeight: '1.6',
          margin: '0',
        }}>
          • Different credit/debit card<br/>
          • PayPal (if available)<br/>
          • Bank transfer<br/>
          • Contact us for manual payment processing
        </Text>
      </EmailCard>

      {/* Security Notice */}
      <EmailAlert variant="info" title="🔒 Your Security Matters">
        We use industry-standard encryption to protect your payment information. Your card details are never stored on our servers and are processed securely through our payment partners.
      </EmailAlert>

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
        Need help? Our customer support team is ready to assist you with your payment.
      </Text>

      <Text style={{
        fontSize: '14px',
        color: '#6c757d',
        lineHeight: '1.6',
        margin: '0 0 16px 0',
        textAlign: 'center',
      }}>
        We apologize for any inconvenience and look forward to welcoming you on this amazing tour!
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