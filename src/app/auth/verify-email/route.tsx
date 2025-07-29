"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import axios from "axios";

export default function VerifyEmailPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token");

  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [message, setMessage] = useState("Verifying your email...");

  useEffect(() => {
    const verifyEmail = async () => {
      if (!token) {
        setStatus("error");
        setMessage("Missing verification token.");
        return;
      }

      try {
        const response = await axios.post("/api/verify-email", { token });

        if (response.status === 200) {
          setStatus("success");
          setMessage("✅ Email verified successfully! Redirecting to dashboard...");
          setTimeout(() => router.push("/dashboard"), 5000);
        } else {
          setStatus("error");
          setMessage(`❌ Verification failed: ${response.data.error || "Unknown error."}`);
        }
      } catch (error: any) {
        const errMsg =
          error.response?.data?.error || error.message || "Verification failed";
        setStatus("error");
        setMessage(`❌ Verification failed: ${errMsg}`);
      }
    };

    verifyEmail();
  }, [token, router]);

  return (
    <div className="flex flex-col items-center justify-center h-screen px-4 text-center">
      <h1 className="text-2xl font-semibold mb-4">Email Verification</h1>
      <p
        className={`text-lg ${
          status === "success"
            ? "text-green-600"
            : status === "error"
            ? "text-red-600"
            : "text-gray-600"
        }`}
      >
        {message}
      </p>
    </div>
  );
}
