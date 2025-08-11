const nodemailer = require('nodemailer');
require('dotenv').config();

async function testEmail() {
  console.log('Testing email configuration...');
  console.log('Environment variables:');
  console.log('MAILTRAP_HOST:', process.env.MAILTRAP_HOST);
  console.log('MAILTRAP_PORT:', process.env.MAILTRAP_PORT);
  console.log('MAILTRAP_USER:', process.env.MAILTRAP_USER ? '***' : 'NOT SET');
  console.log('MAILTRAP_PASS:', process.env.MAILTRAP_PASS ? '***' : 'NOT SET');

  // Create transporter
  const transporter = nodemailer.createTransporter({
    host: process.env.MAILTRAP_HOST,
    port: parseInt(process.env.MAILTRAP_PORT) || 2525,
    secure: false,
    auth: {
      user: process.env.MAILTRAP_USER,
      pass: process.env.MAILTRAP_PASS,
    },
    tls: {
      rejectUnauthorized: false
    }
  });

  try {
    // Verify connection
    console.log('Verifying connection...');
    await transporter.verify();
    console.log('✅ Connection verified successfully!');

    // Send test email
    console.log('Sending test email...');
    const info = await transporter.sendMail({
      from: '"Test" <test@example.com>',
      to: 'test@example.com',
      subject: 'Test Email',
      text: 'This is a test email from your application.',
      html: '<p>This is a test email from your application.</p>'
    });

    console.log('✅ Test email sent successfully!');
    console.log('Message ID:', info.messageId);
    console.log('Preview URL:', nodemailer.getTestMessageUrl(info));

  } catch (error) {
    console.error('❌ Email test failed:', error);
  }
}

testEmail(); 