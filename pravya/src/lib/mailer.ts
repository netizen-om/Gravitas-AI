import nodemailer from "nodemailer";

// Create a transporter using Mailtrap credentials
export const transporter = nodemailer.createTransport({
  service: 'gmail',
      auth: {
        user: process.env.EMAIL_SERVER_USER,
        pass: process.env.EMAIL_SERVER_PASSWORD,
      },
});

// Email sending function
export async function sendEmail({
  to,
  subject,
  text,
  html,
}: {
  to: string;
  subject: string;
  text?: string;
  html?: string;
}) {
  try {
    console.log("Attempting to send email to:", to);
    console.log("Mailtrap config:", {
      host: process.env.MAILTRAP_HOST,
      port: process.env.MAILTRAP_PORT || 587,
      user: process.env.MAILTRAP_USER ? "***" : "NOT SET",
      pass: process.env.MAILTRAP_PASS ? "***" : "NOT SET"
    });
    
    const info = await transporter.sendMail({
      from: process.env.EMAIL_SERVER_USER,
      to,
      subject,
      text,
      html,
    });

    console.log("Message sent successfully: %s", info.messageId);
    return info;
  } catch (error) {
    console.error("Email sending failed:", error);
    throw error;
  }
}
