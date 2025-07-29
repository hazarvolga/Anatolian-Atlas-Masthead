import React from 'react';
import {
  Text,
  Section,
  Row,
  Column,
} from '@react-email/components';
import EmailLayout from '../components/EmailLayout';
import { EmailButton, EmailCard, EmailFeatureList, ContactInfo } from '../components/EmailComponents';

interface WelcomeEmailProps {
  customerName: string;
  companyName: string;
  supportEmail: string;
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
}

export default function WelcomeEmail({ 
  customerName, 
  companyName, 
  supportEmail,
  siteSettings 
}: WelcomeEmailProps) {
  return (
    <EmailLayout 
      siteSettings={siteSettings}
      previewText={`Welcome to ${companyName}! Start your adventure today.`}
      headerTitle="Welcome to Your Adventure!"
    >
      <Section>
        {/* Welcome Message */}
        <Text style={{
          fontSize: '20px',
          fontWeight: '600',
          color: '#212529',
          margin: '0 0 20px 0',
          lineHeight: '1.4',
        }}>
          Hello {customerName}! 🎉
        </Text>
        
        <Text style={{
          fontSize: '16px',
          color: '#495057',
          lineHeight: '1.6',
          margin: '0 0 24px 0',
        }}>
          We're absolutely thrilled to welcome you to the {companyName} family! 
          Your account has been successfully created, and you're now ready to embark 
          on incredible adventures with us.
        </Text>

        {/* Getting Started Card */}
        <EmailCard title="🚀 Getting Started">
          <Text style={{
            fontSize: '14px',
            color: '#495057',
            lineHeight: '1.6',
            margin: '0 0 16px 0',
          }}>
            Here's what you can do now:
          </Text>
          
          <EmailFeatureList items={[
            'Browse our amazing tour collection',
            'Discover popular destinations worldwide',
            'Read authentic reviews from fellow travelers',
            'Book your first adventure with exclusive member benefits',
            'Join our community of travel enthusiasts'
          ]} />

          <EmailButton 
            href={`${siteSettings.website}/tours`}
            variant="primary"
            size="lg"
          >
            Explore Tours Now
          </EmailButton>
        </EmailCard>

        {/* Special Welcome Offer */}
        <EmailCard 
          title="🎁 Welcome Gift" 
          backgroundColor="#fff3cd"
        >
          <Text style={{
            fontSize: '16px',
            color: '#856404',
            fontWeight: '600',
            margin: '0 0 12px 0',
          }}>
            Special 15% OFF on your first booking!
          </Text>
          
          <Text style={{
            fontSize: '14px',
            color: '#856404',
            lineHeight: '1.6',
            margin: '0 0 16px 0',
          }}>
            Use code <strong>WELCOME15</strong> at checkout and save on any tour. 
            Valid for the next 30 days!
          </Text>

          <EmailButton 
            href={`${siteSettings.website}/tours?promo=WELCOME15`}
            variant="outline"
          >
            Claim Your Discount
          </EmailButton>
        </EmailCard>

        {/* Popular Destinations */}
        <EmailCard title="🌍 Popular Destinations">
          <Text style={{
            fontSize: '14px',
            color: '#495057',
            lineHeight: '1.6',
            margin: '0 0 16px 0',
          }}>
            Discover some of our most loved destinations:
          </Text>

          <Row style={{ marginBottom: '12px' }}>
            <Column style={{ width: '50%' }}>
              <Text style={destinationStyle}>🏛️ Istanbul Historical Tours</Text>
              <Text style={destinationStyle}>🏔️ Cappadocia Adventures</Text>
              <Text style={destinationStyle}>🏖️ Mediterranean Coast</Text>
            </Column>
            <Column style={{ width: '50%' }}>
              <Text style={destinationStyle}>🌅 Pamukkale & Hierapolis</Text>
              <Text style={destinationStyle}>🏺 Ephesus Ancient City</Text>
              <Text style={destinationStyle}>🌊 Bosphorus Cruises</Text>
            </Column>
          </Row>

          <EmailButton 
            href={`${siteSettings.website}/destinations`}
            variant="secondary"
          >
            View All Destinations
          </EmailButton>
        </EmailCard>

        {/* Help & Support */}
        <Section style={{ marginTop: '32px' }}>
          <Text style={{
            fontSize: '16px',
            color: '#495057',
            lineHeight: '1.6',
            margin: '0 0 16px 0',
          }}>
            Need help getting started? Our friendly support team is here to assist you!
          </Text>

          <ContactInfo 
            email={supportEmail}
            phone={siteSettings.contactPhone}
            website={siteSettings.website}
          />
        </Section>

        {/* Closing */}
        <Section style={{ marginTop: '32px' }}>
          <Text style={{
            fontSize: '16px',
            color: '#495057',
            lineHeight: '1.6',
            margin: '0 0 16px 0',
          }}>
            Thank you for choosing {companyName}. We can't wait to help you create 
            unforgettable memories!
          </Text>
          
          <Text style={{
            fontSize: '16px',
            color: '#495057',
            lineHeight: '1.6',
            margin: '0',
            fontStyle: 'italic',
          }}>
            Happy travels! ✈️<br />
            The {companyName} Team
          </Text>
        </Section>
      </Section>
    </EmailLayout>
  );
}

// Helper Styles
const destinationStyle = {
  fontSize: '14px',
  color: '#495057',
  margin: '4px 0',
  lineHeight: '1.4',
};
