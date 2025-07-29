import React from 'react';
import {
  Html,
  Head,
  Body,
  Container,
  Section,
  Row,
  Column,
  Img,
  Text,
  Link,
  Hr,
  Button,
} from '@react-email/components';

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

interface EmailLayoutProps {
  children: React.ReactNode;
  siteSettings: SiteSettings;
  previewText?: string;
  headerTitle?: string;
  unsubscribeUrl?: string;
}

export default function EmailLayout({ 
  children, 
  siteSettings, 
  previewText = '',
  headerTitle,
  unsubscribeUrl
}: EmailLayoutProps) {
  const {
    companyName,
    companyLogo,
    website,
    contactEmail,
    contactPhone,
    address,
    socialMedia,
    primaryColor = '#0066cc',
    secondaryColor = '#f8f9fa'
  } = siteSettings;

  return (
    <Html>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="x-apple-disable-message-reformatting" />
        <title>{headerTitle || companyName}</title>
      </Head>
      <Body style={bodyStyle}>
        {previewText && (
          <div style={previewTextStyle}>
            {previewText}
          </div>
        )}
        
        <Container style={containerStyle}>
          {/* Header */}
          <Section style={headerStyle}>
            <Row>
              <Column>
                <Img
                  src={companyLogo}
                  alt={companyName}
                  width="150"
                  height="auto"
                  style={logoStyle}
                />
              </Column>
              <Column align="right">
                <Link
                  href={website}
                  style={{
                    ...linkStyle,
                    color: primaryColor,
                    fontSize: '14px',
                    fontWeight: '500'
                  }}
                >
                  {website.replace('https://', '').replace('http://', '')}
                </Link>
              </Column>
            </Row>
            {headerTitle && (
              <Row>
                <Column>
                  <Text style={{
                    ...headingStyle,
                    color: primaryColor,
                    fontSize: '24px',
                    marginTop: '20px',
                    marginBottom: '0',
                  }}>
                    {headerTitle}
                  </Text>
                </Column>
              </Row>
            )}
          </Section>

          <Hr style={dividerStyle} />

          {/* Main Content */}
          <Section style={contentStyle}>
            {children}
          </Section>

          <Hr style={dividerStyle} />

          {/* Footer */}
          <Section style={footerStyle}>
            {/* Company Info */}
            <Row>
              <Column>
                <Text style={footerHeadingStyle}>
                  {companyName}
                </Text>
                <Text style={footerTextStyle}>
                  {address}
                </Text>
                <Text style={footerTextStyle}>
                  Email: <Link href={`mailto:${contactEmail}`} style={footerLinkStyle}>
                    {contactEmail}
                  </Link>
                </Text>
                {contactPhone && (
                  <Text style={footerTextStyle}>
                    Phone: <Link href={`tel:${contactPhone}`} style={footerLinkStyle}>
                      {contactPhone}
                    </Link>
                  </Text>
                )}
              </Column>
            </Row>

            {/* Social Media Links */}
            {Object.keys(socialMedia).length > 0 && (
              <Row style={{ marginTop: '20px' }}>
                <Column>
                  <Text style={footerHeadingStyle}>
                    Follow Us
                  </Text>
                  <div style={socialLinksStyle}>
                    {socialMedia.facebook && (
                      <Link href={socialMedia.facebook} style={socialLinkStyle}>
                        Facebook
                      </Link>
                    )}
                    {socialMedia.instagram && (
                      <Link href={socialMedia.instagram} style={socialLinkStyle}>
                        Instagram
                      </Link>
                    )}
                    {socialMedia.twitter && (
                      <Link href={socialMedia.twitter} style={socialLinkStyle}>
                        Twitter
                      </Link>
                    )}
                    {socialMedia.linkedin && (
                      <Link href={socialMedia.linkedin} style={socialLinkStyle}>
                        LinkedIn
                      </Link>
                    )}
                    {socialMedia.youtube && (
                      <Link href={socialMedia.youtube} style={socialLinkStyle}>
                        YouTube
                      </Link>
                    )}
                  </div>
                </Column>
              </Row>
            )}

            {/* Legal Footer */}
            <Row style={{ marginTop: '30px' }}>
              <Column>
                <Text style={legalTextStyle}>
                  © {new Date().getFullYear()} {companyName}. All rights reserved.
                </Text>
                <Text style={legalTextStyle}>
                  This email was sent to you because you subscribed to our updates.
                </Text>
                {unsubscribeUrl && (
                  <Text style={legalTextStyle}>
                    Don't want to receive these emails?{' '}
                    <Link href={unsubscribeUrl} style={{
                      color: '#6c757d',
                      textDecoration: 'underline'
                    }}>
                      Unsubscribe here
                    </Link>
                  </Text>
                )}
              </Column>
            </Row>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

// Styles
const bodyStyle = {
  backgroundColor: '#f6f6f6',
  fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  margin: '0',
  padding: '0',
};

const previewTextStyle = {
  display: 'none',
  fontSize: '1px',
  color: '#f6f6f6',
  lineHeight: '1px',
  maxHeight: '0px',
  maxWidth: '0px',
  opacity: 0,
  overflow: 'hidden',
};

const containerStyle = {
  backgroundColor: '#ffffff',
  margin: '0 auto',
  maxWidth: '600px',
  borderRadius: '8px',
  overflow: 'hidden',
  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
};

const headerStyle = {
  backgroundColor: '#ffffff',
  padding: '30px 30px 20px 30px',
};

const logoStyle = {
  maxWidth: '150px',
  height: 'auto',
};

const contentStyle = {
  padding: '0 30px 60px 30px', // Alt padding 30px'den 60px'e artırıldı
};

const footerStyle = {
  backgroundColor: '#f8f9fa',
  padding: '30px',
  borderTop: '1px solid #e9ecef',
};

const dividerStyle = {
  borderColor: '#e9ecef',
  margin: '0',
};

const headingStyle = {
  fontSize: '20px',
  fontWeight: '600',
  lineHeight: '1.4',
  margin: '0 0 16px 0',
};

const linkStyle = {
  color: '#0066cc',
  textDecoration: 'none',
};

const footerHeadingStyle = {
  fontSize: '16px',
  fontWeight: '600',
  color: '#212529',
  margin: '0 0 10px 0',
};

const footerTextStyle = {
  fontSize: '14px',
  color: '#6c757d',
  lineHeight: '1.5',
  margin: '5px 0',
};

const footerLinkStyle = {
  color: '#0066cc',
  textDecoration: 'none',
};

const socialLinksStyle = {
  display: 'flex',
  gap: '15px',
  flexWrap: 'wrap' as const,
};

const socialLinkStyle = {
  display: 'inline-block',
  padding: '8px 12px',
  backgroundColor: '#0066cc',
  color: '#ffffff',
  textDecoration: 'none',
  borderRadius: '4px',
  fontSize: '12px',
  fontWeight: '500',
};

const legalTextStyle = {
  fontSize: '12px',
  color: '#6c757d',
  lineHeight: '1.4',
  margin: '5px 0',
  textAlign: 'center' as const,
};
