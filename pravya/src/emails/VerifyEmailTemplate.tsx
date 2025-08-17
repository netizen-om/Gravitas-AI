// emails/VerifyEmailTemplate.tsx

import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Img,
  Link,
  Preview,
  Section,
  Text,
} from '@react-email/components';
import * as React from 'react';

// Define the props for our component
interface VerifyEmailProps {
  name?: string;
  verificationCode: string;
  verificationLink: string;
}

const baseUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : 'http://localhost:3000';

export default function VerifyEmailTemplate({
  name = 'there',
  verificationCode,
  verificationLink,
}: VerifyEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>Confirm your email address</Preview>
      <Body style={main}>
        <Container style={container}>
          <Section style={logoContainer}>
            {/* You can replace this with your own logo */}
            <Img
              src={`${baseUrl}/static/logo.png`} // Replace with your logo's path
              width="120"
              height="35"
              alt="Our Logo"
            />
          </Section>
          <Heading style={h1}>Verify Your Email Address</Heading>
          <Text style={text}>
            Hello {name},
          </Text>
          <Text style={text}>
            Thank you for signing up! To complete your registration, please
            verify your email by clicking the button below or by using the
            following verification code.
          </Text>
          <Section style={codeContainer}>
            <Text style={code}>{verificationCode}</Text>
          </Section>
          <Section style={buttonContainer}>
            <Button style={button} href={verificationLink}>
              Verify Email
            </Button>
          </Section>
          <Text style={text}>
            If the button above does not work, you can also copy and paste this
            link into your browser:
          </Text>
          <Link href={verificationLink} style={link}>
            {verificationLink}
          </Link>
          <Hr style={hr} />
          <Text style={footer}>
            This email was intended for <span style={span}>{name}</span>. If you did not sign up for this account, you can
            disregard this email.
          </Text>
        </Container>
      </Body>
    </Html>
  );
}

// Styles for the email
const main: React.CSSProperties = {
  backgroundColor: '#0f172a', // slate-900
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif',
};

const container: React.CSSProperties = {
  margin: '0 auto',
  padding: '20px 0 48px',
  width: '580px',
  backgroundColor: '#1e293b', // slate-800
  borderRadius: '8px',
};

const logoContainer: React.CSSProperties = {
  textAlign: 'center' as const,
  marginTop: '24px',
};

const h1: React.CSSProperties = {
  color: '#f8fafc', // slate-50
  fontSize: '24px',
  fontWeight: 'bold',
  textAlign: 'center' as const,
  margin: '24px 0',
};

const text: React.CSSProperties = {
  color: '#cbd5e1', // slate-300
  fontSize: '16px',
  lineHeight: '26px',
  padding: '0 40px',
};

const codeContainer: React.CSSProperties = {
  background: '#0f172a', // slate-900
  borderRadius: '4px',
  margin: '16px auto',
  padding: '16px',
  width: '280px',
  textAlign: 'center' as const,
};

const code: React.CSSProperties = {
  color: '#f8fafc', // slate-50
  fontFamily: 'monospace',
  fontSize: '28px',
  fontWeight: 'bold',
  letterSpacing: '0.5em',
};

const buttonContainer: React.CSSProperties = {
  textAlign: 'center' as const,
  marginTop: '24px',
};

const button: React.CSSProperties = {
  backgroundColor: '#2563eb', // blue-600
  borderRadius: '6px',
  color: '#fff',
  fontSize: '16px',
  fontWeight: 'bold',
  textDecoration: 'none',
  textAlign: 'center' as const,
  padding: '12px 24px',
};

const link: React.CSSProperties = {
  color: '#2563eb', // blue-600
  fontSize: '14px',
  wordBreak: 'break-all' as const,
  padding: '0 40px',
};

const hr: React.CSSProperties = {
  borderColor: '#334155', // slate-700
  margin: '20px 0',
};

const span: React.CSSProperties = {
  color: '#94a3b8' // slate-400
}

const footer: React.CSSProperties = {
  color: '#64748b', // slate-500
  fontSize: '12px',
  lineHeight: '24px',
  padding: '0 40px',
};