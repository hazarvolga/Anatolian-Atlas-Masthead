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

interface BookingReminderEmailProps {
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

export default function BookingReminderEmail({
  customerName,
  tourName,
  tourImage,
  tourDate,
  tourTime,
  participants,
  totalPrice,
  bookingReference,
  daysUntilTour,
  meetingPoint,
  whatToBring = [],
  weatherInfo,
  emergencyContact,
  tourGuide,
  siteSettings,
  unsubscribeUrl,
}: BookingReminderEmailProps) {
  const previewText = `Reminder: Your ${tourName} tour is in ${daysUntilTour} days!`;
  
  const getReminderTitle = () => {
    if (daysUntilTour === 1) return "Your Tour is Tomorrow!";
    if (daysUntilTour <= 3) return `${daysUntilTour} Days Until Your Tour!`;
    return `Upcoming Tour Reminder - ${daysUntilTour} Days to Go!`;
  };

  const defaultWhatToBring = [
    'Valid photo ID',
    'Comfortable walking shoes',
    'Weather-appropriate clothing',
    'Camera or smartphone',
    'Water bottle',
    'Small backpack or day bag'
  ];

  const itemsToBring = whatToBring.length > 0 ? whatToBring : defaultWhatToBring;

  return (
    <EmailLayout 
      siteSettings={siteSettings}
      previewText={previewText}
      headerTitle={getReminderTitle()}
      unsubscribeUrl={unsubscribeUrl}
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
        We're excited to remind you about your upcoming tour! Your adventure is just {daysUntilTour} day{daysUntilTour !== 1 ? 's' : ''} away.
      </Text>

      {/* Countdown Alert */}
      <EmailAlert 
        variant={daysUntilTour <= 1 ? 'warning' : 'info'} 
        title={`⏰ ${getReminderTitle()}`}
      >
        {daysUntilTour === 1 
          ? 'Your tour is tomorrow! Make sure you\'re prepared and ready for an amazing experience.' 
          : `Don't forget - your tour is coming up in ${daysUntilTour} days. We can't wait to show you an unforgettable time!`
        }
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

      {/* Meeting Point */}
      {meetingPoint && (
        <EmailCard title="📍 Meeting Point" backgroundColor="#e8f5e8">
          <Text style={{
            fontSize: '16px',
            color: '#155724',
            fontWeight: '600',
            margin: '0 0 8px 0',
          }}>
            {meetingPoint}
          </Text>
          <Text style={{
            fontSize: '14px',
            color: '#495057',
            lineHeight: '1.5',
            margin: '0',
          }}>
            Please arrive 15 minutes before the scheduled departure time. Look for our guide with a {siteSettings.companyName} sign or uniform.
          </Text>
        </EmailCard>
      )}

      {/* Tour Guide Information */}
      {tourGuide && (
        <EmailCard title="👋 Your Tour Guide" backgroundColor="#f0f8ff">
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            {tourGuide.photo && (
              <img 
                src={tourGuide.photo} 
                alt={tourGuide.name}
                style={{
                  width: '60px',
                  height: '60px',
                  borderRadius: '50%',
                  objectFit: 'cover',
                }}
              />
            )}
            <div>
              <Text style={{
                fontSize: '16px',
                fontWeight: '600',
                color: '#212529',
                margin: '0 0 4px 0',
              }}>
                {tourGuide.name}
              </Text>
              {tourGuide.phone && (
                <Text style={{
                  fontSize: '14px',
                  color: '#495057',
                  margin: '0',
                }}>
                  📞 {tourGuide.phone}
                </Text>
              )}
            </div>
          </div>
        </EmailCard>
      )}

      {/* What to Bring */}
      <EmailFeatureList
        title="🎒 What to Bring"
        items={itemsToBring}
      />

      {/* Weather Information */}
      {weatherInfo && (
        <EmailCard title="🌤️ Weather Information" backgroundColor="#fff3cd">
          <Text style={{
            fontSize: '14px',
            color: '#856404',
            lineHeight: '1.6',
            margin: '0',
          }}>
            {weatherInfo}
          </Text>
          <Text style={{
            fontSize: '13px',
            color: '#6c757d',
            lineHeight: '1.5',
            margin: '8px 0 0 0',
          }}>
            Please dress appropriately for the weather conditions.
          </Text>
        </EmailCard>
      )}

      {/* Quick Actions */}
      <div style={{
        textAlign: 'center',
        margin: '32px 0',
      }}>
        <EmailButton
          href={`${siteSettings.website}/booking/${bookingReference}`}
          variant="primary"
          size="lg"
        >
          View Full Details
        </EmailButton>
      </div>

      <div style={{
        display: 'flex',
        justifyContent: 'center',
        gap: '16px',
        margin: '16px 0 32px 0',
        flexWrap: 'wrap',
      }}>
        <EmailButton
          href={`${siteSettings.website}/add-to-calendar?booking=${bookingReference}`}
          variant="outline"
          size="md"
        >
          📅 Add to Calendar
        </EmailButton>
        
        <EmailButton
          href={`${siteSettings.website}/contact`}
          variant="outline"
          size="md"
        >
          💬 Contact Us
        </EmailButton>
      </div>

      {/* Emergency Contact */}
      {emergencyContact && (
        <EmailAlert variant="info" title="🚨 Emergency Contact">
          In case of any urgent issues on the day of your tour, please contact: <strong>{emergencyContact}</strong>
        </EmailAlert>
      )}

      {/* Important Reminders */}
      <EmailCard title="Important Reminders" backgroundColor="#f8f9fa">
        <Text style={{
          fontSize: '14px',
          color: '#495057',
          lineHeight: '1.6',
          margin: '0',
        }}>
          • Arrive 15 minutes early at the meeting point<br/>
          • Bring a valid photo ID<br/>
          • Wear comfortable walking shoes<br/>
          • Stay hydrated and bring water<br/>
          • Follow your guide's instructions for safety<br/>
          • Have fun and enjoy the experience!
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
        We're thrilled to have you join us and can't wait to share this amazing experience with you!
      </Text>

      <Text style={{
        fontSize: '14px',
        color: '#6c757d',
        lineHeight: '1.6',
        margin: '0 0 16px 0',
        textAlign: 'center',
        fontStyle: 'italic',
      }}>
        Get ready for an unforgettable adventure! 🌟
      </Text>

    </EmailLayout>
  );
}