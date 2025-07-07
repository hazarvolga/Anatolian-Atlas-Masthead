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

interface BookingCancellationEmailProps {
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

export default function BookingCancellationEmail({
  customerName,
  tourName,
  tourImage,
  tourDate,
  tourTime,
  participants,
  totalPrice,
  bookingReference,
  cancellationReason,
  refundAmount,
  refundMethod,
  refundTimeline,
  siteSettings,
  unsubscribeUrl,
}: BookingCancellationEmailProps) {
  const previewText = `Your booking for ${tourName} has been cancelled. Reference: ${bookingReference}`;

  return (
    <EmailLayout 
      siteSettings={siteSettings}
      previewText={previewText}
      headerTitle="Booking Cancelled"
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
        We're sorry to inform you that your tour booking has been cancelled. Below are the details of your cancelled booking.
      </Text>

      {/* Cancellation Alert */}
      <EmailAlert variant="warning" title="Booking Cancelled">
        Your booking has been successfully cancelled. {cancellationReason && `Reason: ${cancellationReason}`}
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

      {/* Refund Information */}
      {refundAmount && (
        <EmailCard title="Refund Information" backgroundColor="#e8f5e8">
          <Text style={{
            fontSize: '16px',
            color: '#155724',
            fontWeight: '600',
            margin: '0 0 12px 0',
          }}>
            💰 Refund Amount: {refundAmount}
          </Text>
          
          {refundMethod && (
            <Text style={{
              fontSize: '14px',
              color: '#495057',
              margin: '4px 0',
            }}>
              <strong>Refund Method:</strong> {refundMethod}
            </Text>
          )}
          
          {refundTimeline && (
            <Text style={{
              fontSize: '14px',
              color: '#495057',
              margin: '4px 0',
            }}>
              <strong>Processing Time:</strong> {refundTimeline}
            </Text>
          )}
          
          <Text style={{
            fontSize: '13px',
            color: '#6c757d',
            margin: '12px 0 0 0',
            lineHeight: '1.5',
          }}>
            The refund will be processed automatically. You'll receive a confirmation email once the refund is completed.
          </Text>
        </EmailCard>
      )}

      {/* What's Next */}
      <EmailCard title="What's Next?" backgroundColor="#f8f9fa">
        <Text style={{
          fontSize: '14px',
          color: '#495057',
          lineHeight: '1.6',
          margin: '0 0 16px 0',
        }}>
          We understand that plans can change, and we're here to help you find another amazing experience.
        </Text>
        
        <Text style={{
          fontSize: '14px',
          color: '#495057',
          lineHeight: '1.6',
          margin: '0',
        }}>
          • Browse our other available tours and experiences<br/>
          • Contact us if you'd like to reschedule for a different date<br/>
          • Sign up for our newsletter to get notified about special offers
        </Text>
      </EmailCard>

      {/* Action Buttons */}
      <div style={{
        textAlign: 'center',
        margin: '32px 0',
      }}>
        <EmailButton
          href={`${siteSettings.website}/tours`}
          variant="primary"
          size="lg"
        >
          Browse Other Tours
        </EmailButton>
      </div>

      <div style={{
        textAlign: 'center',
        margin: '16px 0 32px 0',
      }}>
        <EmailButton
          href={`${siteSettings.website}/contact`}
          variant="outline"
          size="md"
        >
          Contact Support
        </EmailButton>
      </div>

      {/* Special Offer */}
      <EmailAlert variant="info" title="Special Offer for You">
        As an apology for the inconvenience, we'd like to offer you a 10% discount on your next booking. 
        Use code <strong>SORRY10</strong> at checkout.
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
        We apologize for any inconvenience caused and hope to serve you again soon.
      </Text>

      <Text style={{
        fontSize: '14px',
        color: '#6c757d',
        lineHeight: '1.6',
        margin: '0 0 16px 0',
        textAlign: 'center',
      }}>
        Thank you for your understanding.
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