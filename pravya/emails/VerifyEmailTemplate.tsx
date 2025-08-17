import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Img,
  Preview,
  Section,
  Text,
} from '@react-email/components';
import * as React from 'react';

// Renamed interface to match the component name
interface VerifyEmailTemplateProps {
  magicLink?: string;
}

const baseUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : 'http://localhost:3000';

export const VerifyEmailTemplate = ({
  magicLink,
}: VerifyEmailTemplateProps) => (
  <Html>
    <Head />
    <Preview>Verify Your Email for Pravya AI</Preview>
    <Body style={main}>
      <Container style={container}>
        <Section style={header}>
          <table cellPadding="0" cellSpacing="0" align="center">
            <tbody>
              <tr>
                <td style={{ verticalAlign: 'middle' }}>
                  <Img
                    src={`${baseUrl}/static/pravya-logo-dark.png`} // Replace with your dark logo path
                    width={36}
                    height={36}
                    alt="Pravya AI Logo"
                  />
                </td>
                <td style={{ verticalAlign: 'middle', paddingLeft: '12px' }}>
                  <Text style={brandText}>Pravya AI</Text>
                </td>
              </tr>
            </tbody>
          </table>
        </Section>
        <Heading style={heading}>Verify your email</Heading>
        <Section style={body}>
          <Text style={paragraph}>
            Click the button below to securely verify your account.
          </Text>
          <Button style={button} href={magicLink}>
            Verify Email
          </Button>
          <Text style={subtext}>
            If you didn’t request this, please ignore this email.
          </Text>
        </Section>
        <Hr style={hr} />
        <Section style={footer}>
          <Text style={footerText}>Pravya AI</Text>
          <Text style={footerText}>Your interview advantage, powered by AI.</Text>
        </Section>
      </Container>
    </Body>
  </Html>
);

// This is for previewing in the React Email dev server
VerifyEmailTemplate.PreviewProps = {
  magicLink: 'https://example.com', // Changed to a valid placeholder URL
} as VerifyEmailTemplateProps; // Correctly cast to the renamed interface

export default VerifyEmailTemplate;

const main = {
  backgroundColor: '#f6f9fc',
  fontFamily:
    '"Inter",-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif',
  // Add some padding to the body for spacing on smaller screens
  padding: '20px 0',
};

const container = {
  backgroundColor: '#ffffff',
  // Center the container horizontally
  margin: '0 auto',
  // Set a max-width for desktop clients, but allow it to be flexible
  maxWidth: '600px',
  width: '100%',
  padding: '48px',
  borderRadius: '12px',
  border: '1px solid #e6ebf1',
  // Removed boxShadow with rgba for Outlook compatibility
};

const header = {
  textAlign: 'center' as const,
  margin: '0 auto 24px auto',
};

const brandText = {
  color: '#1a202c', // Very dark gray
  fontSize: '20px',
  fontWeight: '600',
  margin: '0',
  padding: '0',
  lineHeight: '1',
};

const heading = {
  fontSize: '32px',
  fontWeight: '700',
  textAlign: 'center' as const,
  color: '#1a202c', // Very dark gray
  margin: '30px 0',
};

const body = {
  margin: '24px 0',
};

const paragraph = {
  fontSize: '16px',
  lineHeight: '26px',
  textAlign: 'center' as const,
  color: '#4a5568', // Medium gray
};

const button = {
  backgroundColor: '#000000',
  color: '#ffffff',
  fontSize: '16px',
  fontWeight: '600',
  textDecoration: 'none',
  textAlign: 'center' as const,
  display: 'block',
  padding: '14px 0',
  margin: '32px auto',
  borderRadius: '8px',
};

const subtext = {
  ...paragraph,
  fontSize: '14px',
  color: '#718096', // Soft gray
};

const hr = {
  borderColor: '#e6ebf1',
  margin: '48px 0',
};

const footer = {
  textAlign: 'center' as const,
};

const footerText = {
  color: '#a0aec0', // Light gray
  fontSize: '12px',
  lineHeight: '18px',
  margin: '0',
};
