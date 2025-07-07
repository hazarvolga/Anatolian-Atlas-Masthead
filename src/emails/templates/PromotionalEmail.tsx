import React from 'react';
import { Text } from '@react-email/components';
import EmailLayout from '../components/EmailLayout';
import { 
  EmailButton, 
  EmailCard, 
  EmailAlert,
  EmailFeatureList,
  ContactInfo 
} from '../components/EmailComponents';

interface PromotionalEmailProps {
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

export default function PromotionalEmail({
  customerName,
  campaignTitle,
  campaignDescription,
  offerDetails,
  discountCode,
  discountPercentage,
  validUntil,
  featuredTours = [],
  callToAction,
  actionUrl,
  siteSettings,
  unsubscribeUrl,
}: PromotionalEmailProps) {
  const previewText = `${campaignTitle} - Special offer from ${siteSettings.companyName}`;

  const benefits = [
    'Exclusive discounts on premium tours',
    'Priority booking for limited spots',
    'Access to special seasonal tours',
    'Personalized tour recommendations',
    'Flexible cancellation policies'
  ];

  return (
    <EmailLayout 
      siteSettings={siteSettings}
      previewText={previewText}
      headerTitle={campaignTitle}
      unsubscribeUrl={unsubscribeUrl}
    >
      {/* Welcome Message */}
      <Text style={{
        fontSize: '18px',
        color: '#212529',
        lineHeight: '1.6',
        margin: '0 0 24px 0',
      }}>
        {customerName ? `Dear ${customerName},` : 'Hello Adventure Seeker!'}
      </Text>

      <Text style={{
        fontSize: '16px',
        color: '#495057',
        lineHeight: '1.6',
        margin: '0 0 24px 0',
      }}>
        {campaignDescription}
      </Text>

      {/* Special Offer Alert */}
      <EmailAlert variant="success" title="🎉 Special Offer Available">
        {offerDetails}
        {discountPercentage && (
          <>
            <br /><br />
            <strong>Save {discountPercentage}% on your next adventure!</strong>
          </>
        )}
      </EmailAlert>

      {/* Discount Code */}
      {discountCode && (
        <EmailCard title="🎫 Your Exclusive Discount Code" backgroundColor="#e8f5e8">
          <Text style={{
            fontSize: '24px',
            color: '#155724',
            fontWeight: '700',
            textAlign: 'center',
            margin: '0 0 12px 0',
            padding: '16px',
            backgroundColor: '#d4edda',
            borderRadius: '8px',
            border: '2px dashed #155724',
            letterSpacing: '3px',
            fontFamily: 'monospace',
          }}>
            {discountCode}
          </Text>
          
          <Text style={{
            fontSize: '14px',
            color: '#495057',
            textAlign: 'center',
            margin: '0',
          }}>
            Copy this code and use it at checkout
          </Text>
        </EmailCard>
      )}

      {/* Main Call to Action */}
      <div style={{
        textAlign: 'center',
        margin: '40px 0',
      }}>
        <EmailButton
          href={actionUrl}
          variant="primary"
          size="lg"
        >
          {callToAction}
        </EmailButton>
      </div>

      {/* Why Choose Us */}
      <EmailFeatureList
        title="🎯 Why Choose Our Tours?"
        items={benefits}
      />

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
        Thank you for being part of our community of adventurers!
      </Text>

    </EmailLayout>
  );
}
