import React from 'react';
import { Text } from '@react-email/components';
import EmailLayout from '../components/EmailLayout';
import { 
  EmailButton, 
  EmailCard, 
  TourInfo, 
  EmailAlert,
  ContactInfo 
} from '../components/EmailComponents';

interface TourUpdateEmailProps {
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

export default function TourUpdateEmail({
  customerName,
  tourName,
  tourImage,
  tourDate,
  tourTime,
  participants,
  totalPrice,
  bookingReference,
  updateType,
  updateTitle,
  updateMessage,
  oldValue,
  newValue,
  actionRequired = false,
  compensationOffered,
  newMeetingPoint,
  siteSettings,
  unsubscribeUrl,
}: TourUpdateEmailProps) {
  const previewText = `Important update for your ${tourName} booking`;

  const getAlertVariant = () => {
    switch (updateType) {
      case 'cancellation':
        return 'error';
      case 'time_change':
      case 'date_change':
      case 'location_change':
        return 'warning';
      default:
        return 'info';
    }
  };

  const getUpdateIcon = () => {
    switch (updateType) {
      case 'time_change':
        return '🕒';
      case 'date_change':
        return '📅';
      case 'location_change':
        return '📍';
      case 'cancellation':
        return '❌';
      default:
        return 'ℹ️';
    }
  };

  return (
    <EmailLayout 
      siteSettings={siteSettings}
      previewText={previewText}
      headerTitle="Tour Update"
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
        We have an important update regarding your upcoming tour booking. Please read the information below carefully.
      </Text>

      {/* Update Alert */}
      <EmailAlert variant={getAlertVariant()} title={`${getUpdateIcon()} ${updateTitle}`}>
        {updateMessage}
        {oldValue && newValue && (
          <>
            <br /><br />
            <strong>Changed from:</strong> {oldValue}<br />
            <strong>Changed to:</strong> {newValue}
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

      {/* New Meeting Point */}
      {newMeetingPoint && (
        <EmailCard title="📍 New Meeting Point" backgroundColor="#e3f2fd">
          <Text style={{
            fontSize: '16px',
            color: '#1565c0',
            fontWeight: '600',
            margin: '0 0 8px 0',
          }}>
            {newMeetingPoint}
          </Text>
          <Text style={{
            fontSize: '14px',
            color: '#495057',
            lineHeight: '1.5',
            margin: '0',
          }}>
            Please make note of this new meeting point. We recommend arriving 15 minutes early.
          </Text>
        </EmailCard>
      )}

      {/* Action Required */}
      {actionRequired && (
        <EmailAlert variant="warning" title="⚠️ Action Required">
          This update requires your attention. Please confirm your continued participation or contact us if you need to make changes to your booking.
        </EmailAlert>
      )}

      {/* Compensation Offered */}
      {compensationOffered && (
        <EmailCard title="💰 Compensation Offered" backgroundColor="#e8f5e8">
          <Text style={{
            fontSize: '16px',
            color: '#155724',
            fontWeight: '600',
            margin: '0 0 8px 0',
          }}>
            We Apologize for the Inconvenience
          </Text>
          <Text style={{
            fontSize: '14px',
            color: '#495057',
            lineHeight: '1.6',
            margin: '0',
          }}>
            {compensationOffered}
          </Text>
        </EmailCard>
      )}

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
          View Updated Booking
        </EmailButton>
      </div>

      <div style={{
        display: 'flex',
        justifyContent: 'center',
        gap: '16px',
        margin: '16px 0 32px 0',
        flexWrap: 'wrap',
      }}>
        {actionRequired && (
          <EmailButton
            href={`${siteSettings.website}/booking/${bookingReference}/confirm`}
            variant="outline"
            size="md"
          >
            ✅ Confirm Participation
          </EmailButton>
        )}
        
        <EmailButton
          href={`${siteSettings.website}/contact?booking=${bookingReference}`}
          variant="outline"
          size="md"
        >
          💬 Contact Support
        </EmailButton>
      </div>

      {/* What Happens Next */}
      <EmailCard title="What Happens Next?" backgroundColor="#f8f9fa">
        <Text style={{
          fontSize: '14px',
          color: '#495057',
          lineHeight: '1.6',
          margin: '0',
        }}>
          {updateType === 'cancellation' ? (
            <>
              • You will receive a full refund within 5-7 business days<br/>
              • We'll help you reschedule to another available date<br/>
              • Check out our other amazing tours and experiences<br/>
              • Contact us if you have any questions or concerns
            </>
          ) : (
            <>
              • Your booking remains valid with the updated information<br/>
              • Please save this email for your records<br/>
              • Arrive at the meeting point 15 minutes early<br/>
              • Contact us if you have any questions<br/>
              {actionRequired && '• Please confirm your participation if required above'}
            </>
          )}
        </Text>
      </EmailCard>

      {/* Cancellation Options */}
      {updateType !== 'cancellation' && (
        <EmailCard title="Need to Cancel?" backgroundColor="#fff3cd">
          <Text style={{
            fontSize: '14px',
            color: '#856404',
            lineHeight: '1.6',
            margin: '0',
          }}>
            If these changes don't work for you, we understand. Please contact us within 24 hours to discuss cancellation or rescheduling options. We'll do our best to accommodate your needs.
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
        We sincerely apologize for any inconvenience this update may cause and appreciate your understanding.
      </Text>

      <Text style={{
        fontSize: '14px',
        color: '#6c757d',
        lineHeight: '1.6',
        margin: '0 0 16px 0',
        textAlign: 'center',
      }}>
        We're committed to providing you with an excellent experience and will do everything we can to make it right.
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
