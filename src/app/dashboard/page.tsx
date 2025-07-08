"use client"
import React from "react";
import InterviewCard from "@/components/InterviewCard";
import PastInterviewCard from "@/components/PastInterviewCard";
import { signIn, signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

const pastInterviews = [
  {
    title: "Frontend Dev Interview",
    type: "Technical",
    icon: <span>🟪</span>,
    date: "Feb 28, 2025",
    score: 12,
    description: "This interview does not reflect serious interest or engagement from the candidate. Their responses are dismissive...",
  },
  {
    title: "Behavioral Interview",
    type: "Non-Technical",
    icon: <span>🔵</span>,
    date: "Feb 23, 2025",
    score: 54,
    description: "This interview does not reflect serious interest or engagement from the candidate. Their responses are dismissive...",
  },
  {
    title: "Backend Dev Interview",
    type: "Technical",
    icon: <span>🔴</span>,
    date: "Feb 21, 2025",
    score: 94,
    description: "This interview does not reflect serious interest or engagement from the candidate. Their responses are dismissive...",
  },
];

const interviewTypes = [
  { title: "Full-Stack Dev Interview", type: "Technical", icon: <span>🟣</span> },
  { title: "DevOps & Cloud Interview", type: "Technical", icon: <span>🟠</span> },
  { title: "HR Screening Interview", type: "Non-Technical", icon: <span>🔷</span> },
  { title: "System Design Interview", type: "Technical", icon: <span>🔵</span> },
  { title: "Business Analyst Interview", type: "Non-Technical", icon: <span>🟢</span> },
  { title: "Mobile App Dev Interview", type: "Technical", icon: <span>🔴</span> },
  { title: "Database & SQL Interview", type: "Technical", icon: <span>🔴</span> },
  { title: "Cybersecurity Interview", type: "Technical", icon: <span>🔵</span> },
  { title: "Sales & Marketing Interview", type: "Non-Technical", icon: <span>⚫</span> },
];

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gray-900 text-white px-4 py-6">
      {/* Header */}
      <header className="flex items-center justify-between mb-8">
        <div className="text-2xl font-bold flex items-center gap-2">
          <span role="img" aria-label="logo">💬 GravistasAi</span>
        </div>
        <div className="flex items-center gap-4">
          {status === "loading" ? null : !session?.user ? (
            <>
              <button
                className="bg-indigo-600 px-4 py-2 rounded hover:bg-indigo-700 text-white text-sm"
                onClick={() => signIn()}
              >
                Login
              </button>
              <button
                className="bg-gray-700 px-4 py-2 rounded hover:bg-gray-600 text-white text-sm"
                onClick={() => router.push("/signup")}
              >
                Signup
              </button>
            </>
          ) : (
            <>
              <img
                src={session.user.image || "https://randomuser.me/api/portraits/men/32.jpg"}
                alt="User"
                className="w-10 h-10 rounded-full border-2 border-gray-700"
              />
              <button
                className="bg-red-600 px-4 py-2 rounded hover:bg-red-700 text-white text-sm"
                onClick={() => signOut()}
              >
                Logout
              </button>
            </>
          )}
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-gray-800 to-gray-900 rounded-xl p-8 flex flex-col md:flex-row items-center justify-between mb-10">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold mb-2">Get Interview-Ready with AI-Powered Practice & Feedback</h1>
          <p className="text-gray-300 mb-4">Practice real interview questions & get instant feedback.</p>
          <button className="bg-indigo-600 text-white px-6 py-2 rounded hover:bg-indigo-700">Start an Interview</button>
        </div>
        <div className="mt-6 md:mt-0 md:ml-10">
          <span className="text-7xl">🤖</span>
        </div>
      </section>

      {/* Past Interviews */}
      <section className="mb-12">
        <h2 className="text-xl font-semibold mb-4">Your Past Interviews</h2>
        <div className="flex flex-wrap gap-6">
          {pastInterviews.map((item, idx) => (
            <PastInterviewCard
              key={idx}
              {...item}
              onView={() => alert(`Viewing: ${item.title}`)}
            />
          ))}
        </div>
      </section>

      {/* Pick Your Interview */}
      <section>
        <h2 className="text-xl font-semibold mb-4">Pick Your Interview</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {interviewTypes.map((item, idx) => (
            <InterviewCard
              key={idx}
              {...item}
              onClick={() => alert(`Starting: ${item.title}`)}
            />
          ))}
        </div>
      </section>
    </div>
  );
} 