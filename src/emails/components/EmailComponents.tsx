import React from 'react';
import {
  Section,
  Row,
  Column,
  Text,
  Button,
  Img,
  Link,
  Hr,
} from '@react-email/components';

// Email Button Component
interface EmailButtonProps {
  href: string;
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
}

export function EmailButton({ 
  href, 
  children, 
  variant = 'primary',
  size = 'md' 
}: EmailButtonProps) {
  const baseStyle = {
    display: 'inline-block',
    textDecoration: 'none',
    borderRadius: '6px',
    textAlign: 'center' as const,
    fontWeight: '600',
    lineHeight: '1',
    border: '2px solid transparent',
  };

  const sizeStyles = {
    sm: { padding: '10px 16px', fontSize: '14px' },
    md: { padding: '14px 24px', fontSize: '16px' },
    lg: { padding: '18px 32px', fontSize: '18px' },
  };

  const variantStyles = {
    primary: {
      backgroundColor: '#0066cc',
      color: '#ffffff',
      borderColor: '#0066cc',
    },
    secondary: {
      backgroundColor: '#6c757d',
      color: '#ffffff',
      borderColor: '#6c757d',
    },
    outline: {
      backgroundColor: 'transparent',
      color: '#0066cc',
      borderColor: '#0066cc',
    },
  };

  return (
    <Button
      href={href}
      style={{
        ...baseStyle,
        ...sizeStyles[size],
        ...variantStyles[variant],
      }}
    >
      {children}
    </Button>
  );
}

// Email Card Component
interface EmailCardProps {
  title?: string;
  children: React.ReactNode;
  backgroundColor?: string;
  padding?: string;
}

export function EmailCard({ 
  title, 
  children, 
  backgroundColor = '#f8f9fa',
  padding = '24px' 
}: EmailCardProps) {
  return (
    <Section style={{
      backgroundColor,
      borderRadius: '8px',
      border: '1px solid #e9ecef',
      margin: '20px 0',
    }}>
      <Row>
        <Column style={{ padding }}>
          {title && (
            <Text style={{
              fontSize: '18px',
              fontWeight: '600',
              color: '#212529',
              margin: '0 0 16px 0',
            }}>
              {title}
            </Text>
          )}
          {children}
        </Column>
      </Row>
    </Section>
  );
}

// Tour/Booking Info Component
interface TourInfoProps {
  tourName: string;
  tourImage?: string;
  tourDate?: string;
  tourTime?: string;
  participants?: number;
  price?: string;
  bookingReference?: string;
}

export function TourInfo({
  tourName,
  tourImage,
  tourDate,
  tourTime,
  participants,
  price,
  bookingReference,
}: TourInfoProps) {
  return (
    <EmailCard title="Tour Details">
      <Row>
        {tourImage && (
          <Column style={{ width: '120px', paddingRight: '20px' }}>
            <Img
              src={tourImage}
              alt={tourName}
              width="120"
              height="80"
              style={{
                borderRadius: '6px',
                objectFit: 'cover',
              }}
            />
          </Column>
        )}
        <Column>
          <Text style={{
            fontSize: '18px',
            fontWeight: '600',
            color: '#212529',
            margin: '0 0 8px 0',
          }}>
            {tourName}
          </Text>
          
          {tourDate && (
            <Text style={infoTextStyle}>
              <strong>Date:</strong> {tourDate}
            </Text>
          )}
          
          {tourTime && (
            <Text style={infoTextStyle}>
              <strong>Time:</strong> {tourTime}
            </Text>
          )}
          
          {participants && (
            <Text style={infoTextStyle}>
              <strong>Participants:</strong> {participants}
            </Text>
          )}
          
          {price && (
            <Text style={infoTextStyle}>
              <strong>Total Price:</strong> {price}
            </Text>
          )}
          
          {bookingReference && (
            <Text style={infoTextStyle}>
              <strong>Booking Reference:</strong> {bookingReference}
            </Text>
          )}
        </Column>
      </Row>
    </EmailCard>
  );
}

// Alert/Notice Component
interface EmailAlertProps {
  children: React.ReactNode;
  variant?: 'info' | 'success' | 'warning' | 'error';
  title?: string;
}

export function EmailAlert({ 
  children, 
  variant = 'info',
  title 
}: EmailAlertProps) {
  const variantStyles = {
    info: {
      backgroundColor: '#d1ecf1',
      borderColor: '#bee5eb',
      color: '#0c5460',
    },
    success: {
      backgroundColor: '#d4edda',
      borderColor: '#c3e6cb',
      color: '#155724',
    },
    warning: {
      backgroundColor: '#fff3cd',
      borderColor: '#ffeaa7',
      color: '#856404',
    },
    error: {
      backgroundColor: '#f8d7da',
      borderColor: '#f5c6cb',
      color: '#721c24',
    },
  };

  return (
    <Section style={{
      ...variantStyles[variant],
      border: `1px solid ${variantStyles[variant].borderColor}`,
      borderRadius: '6px',
      margin: '20px 0',
    }}>
      <Row>
        <Column style={{ padding: '16px' }}>
          {title && (
            <Text style={{
              fontSize: '16px',
              fontWeight: '600',
              color: variantStyles[variant].color,
              margin: '0 0 8px 0',
            }}>
              {title}
            </Text>
          )}
          <Text style={{
            fontSize: '14px',
            color: variantStyles[variant].color,
            margin: '0',
            lineHeight: '1.5',
          }}>
            {children}
          </Text>
        </Column>
      </Row>
    </Section>
  );
}

// Feature List Component
interface EmailFeatureListProps {
  items: string[];
  title?: string;
}

export function EmailFeatureList({ items, title }: EmailFeatureListProps) {
  return (
    <Section style={{ margin: '20px 0' }}>
      {title && (
        <Text style={{
          fontSize: '18px',
          fontWeight: '600',
          color: '#212529',
          margin: '0 0 16px 0',
        }}>
          {title}
        </Text>
      )}
      {items.map((item, index) => (
        <Row key={index}>
          <Column style={{ width: '20px' }}>
            <Text style={{
              fontSize: '16px',
              color: '#28a745',
              margin: '0',
              fontWeight: '600',
            }}>
              ✓
            </Text>
          </Column>
          <Column>
            <Text style={{
              fontSize: '14px',
              color: '#495057',
              margin: '0 0 8px 0',
              lineHeight: '1.5',
            }}>
              {item}
            </Text>
          </Column>
        </Row>
      ))}
    </Section>
  );
}

// Contact Info Component
interface ContactInfoProps {
  email?: string;
  phone?: string;
  address?: string;
  website?: string;
}

export function ContactInfo({ email, phone, address, website }: ContactInfoProps) {
  return (
    <EmailCard title="Contact Information" backgroundColor="#ffffff">
      {email && (
        <Text style={contactTextStyle}>
          <strong>Email:</strong>{' '}
          <Link href={`mailto:${email}`} style={contactLinkStyle}>
            {email}
          </Link>
        </Text>
      )}
      
      {phone && (
        <Text style={contactTextStyle}>
          <strong>Phone:</strong>{' '}
          <Link href={`tel:${phone}`} style={contactLinkStyle}>
            {phone}
          </Link>
        </Text>
      )}
      
      {address && (
        <Text style={contactTextStyle}>
          <strong>Address:</strong> {address}
        </Text>
      )}
      
      {website && (
        <Text style={contactTextStyle}>
          <strong>Website:</strong>{' '}
          <Link href={website} style={contactLinkStyle}>
            {website.replace('https://', '').replace('http://', '')}
          </Link>
        </Text>
      )}
    </EmailCard>
  );
}

// Helper Styles
const infoTextStyle = {
  fontSize: '14px',
  color: '#495057',
  margin: '4px 0',
  lineHeight: '1.5',
};

const contactTextStyle = {
  fontSize: '14px',
  color: '#495057',
  margin: '8px 0',
  lineHeight: '1.5',
};

const contactLinkStyle = {
  color: '#0066cc',
  textDecoration: 'none',
};
