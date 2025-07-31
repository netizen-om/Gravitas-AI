// app/api/auth/send-verification-email/route.ts

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prismadb";
import { resend } from "@/lib/resend";
import jwt from "jsonwebtoken";
import { getCurrentUser } from "@/lib/auth";
import { sendEmail } from "@/lib/mailer";

const JWT_SECRET = process.env.JWT_SECRET!;

export async function POST(req: NextRequest) {
  try {
    
    const currentUser = await getCurrentUser();
    if(!currentUser) {
        return NextResponse.json(
        { error: "User not found" }, 
        { status: 500 }
      );
    }
    
    if (currentUser.emailVerified) {
      return NextResponse.json(
        { error: "Email already verified" }, 
        { status: 400 }
      );
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: currentUser.id, email: currentUser.email },
      JWT_SECRET,
      { expiresIn: "15m" }
    );

    const verifyUrl = `${process.env.NEXTAUTH_URL}/auth/verify-email?token=${token}`;

    // Send the email (uncomment this when ready)
    await sendEmail({
      to: currentUser.email!,
      subject: "Verify Your Email",
      html: `<p>Click <a href="${verifyUrl}">here</a> to verify your email. This link expires in 15 minutes.</p>`,
      text: `Visit this link to verify your email: ${verifyUrl}`,
    });

    return NextResponse.json({ 
      success: true,
      message: "Verification email sent successfully" 
    });
    
  } catch (error) {
    console.error("[SEND_VERIFICATION]", error);
    return NextResponse.json(
      { error: "Internal server error" }, 
      { status: 500 }
    );
  }
}