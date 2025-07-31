import nodemailer from "nodemailer";

// Create a transporter using Mailtrap credentials
export const transporter = nodemailer.createTransport({
  host: process.env.MAILTRAP_HOST as string,
  port: process.env.MAILTRAP_PORT as unknown as number,
  auth: {
    user: process.env.MAILTRAP_USER as string,
    pass: process.env.MAILTRAP_PASS as string,
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
  const info = await transporter.sendMail({
    from: '"Your App Name" <noreply@example.com>', // Can be anything
    to,
    subject,
    text,
    html,
  });

  console.log("Message sent: %s", info.messageId);
}
