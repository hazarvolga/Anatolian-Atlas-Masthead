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

interface BookingConfirmationEmailProps {
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

export default function BookingConfirmationEmail({
  customerName,
  tourName,
  tourImage,
  tourDate,
  tourTime,
  participants,
  totalPrice,
  bookingReference,
  tourDescription,
  meetingPoint,
  whatToExpected,
  cancellationPolicy,
  siteSettings,
  unsubscribeUrl,
}: BookingConfirmationEmailProps) {
  const previewText = `Your booking for ${tourName} has been confirmed! Reference: ${bookingReference}`;

  return (
    <EmailLayout 
      siteSettings={siteSettings}
      previewText={previewText}
      headerTitle="Booking Confirmed"
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
        Great news! Your tour booking has been confirmed. We're excited to have you join us for an amazing experience.
      </Text>

      {/* Success Alert */}
      <EmailAlert variant="success" title="Booking Confirmed">
        Your booking has been successfully processed and confirmed. Please save this email for your records.
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

      {/* Tour Description */}
      {tourDescription && (
        <EmailCard title="About This Tour">
          <Text style={{
            fontSize: '14px',
            color: '#495057',
            lineHeight: '1.6',
            margin: '0',
          }}>
            {tourDescription}
          </Text>
        </EmailCard>
      )}

      {/* What to Expect */}
      {whatToExpected && whatToExpected.length > 0 && (
        <EmailFeatureList
          title="What to Expect"
          items={whatToExpected}
        />
      )}

      {/* Meeting Point */}
      {meetingPoint && (
        <EmailCard title="Meeting Point" backgroundColor="#e3f2fd">
          <Text style={{
            fontSize: '14px',
            color: '#495057',
            lineHeight: '1.6',
            margin: '0',
            fontWeight: '500',
          }}>
            📍 {meetingPoint}
          </Text>
          <Text style={{
            fontSize: '13px',
            color: '#6c757d',
            lineHeight: '1.5',
            margin: '8px 0 0 0',
          }}>
            Please arrive 15 minutes before the scheduled time.
          </Text>
        </EmailCard>
      )}

      {/* Important Information */}
      <EmailAlert variant="info" title="Important Information">
        Please bring a valid ID and dress appropriately for the weather. If you need to cancel or reschedule, 
        please contact us at least 24 hours in advance.
      </EmailAlert>

      {/* Action Buttons */}
      <div style={{
        textAlign: 'center',
        margin: '32px 0',
      }}>
        <EmailButton
          href={`${siteSettings.website}/booking/${bookingReference}`}
          variant="primary"
          size="lg"
        >
          View Booking Details
        </EmailButton>
      </div>

      <div style={{
        textAlign: 'center',
        margin: '16px 0 32px 0',
      }}>
        <EmailButton
          href={`${siteSettings.website}/add-to-calendar?booking=${bookingReference}`}
          variant="outline"
          size="md"
        >
          📅 Add to Calendar
        </EmailButton>
      </div>

      {/* Cancellation Policy */}
      {cancellationPolicy && (
        <EmailCard title="Cancellation Policy" backgroundColor="#fff8e1">
          <Text style={{
            fontSize: '13px',
            color: '#495057',
            lineHeight: '1.5',
            margin: '0',
          }}>
            {cancellationPolicy}
          </Text>
        </EmailCard>
      )}

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
        Thank you for choosing {siteSettings.companyName}. We look forward to providing you with an unforgettable experience!
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