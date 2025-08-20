"use client"

import type React from "react"

import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { DashboardSidebar } from "@/components/dashboard/dashboard-sidebar"
import { WelcomeSection } from "@/components/dashboard/welcome-section"
import { QuickStats } from "@/components/dashboard/quick-stats"
import { RecentActivity } from "@/components/dashboard/recent-activity"
import { PerformanceAnalytics } from "@/components/dashboard/performance-analytics"
import { InterviewSuggestions } from "@/components/dashboard/interview-suggestions"
import { ResumeInsights } from "@/components/dashboard/resume-insights"
import { LearningHubPreview } from "@/components/dashboard/learning-hub-preview"
import { Gamification } from "@/components/dashboard/gamification"
import { SidebarProvider } from "@/components/dashboard/sidebar-context"

// Mock session check - replace with actual NextAuth implementation
function getSession() {
  return {
    user: {
      name: "John Doe",
      email: "john@example.com",
      image: "/placeholder.svg?height=40&width=40",
    },
  }
}

export default function DashboardPage() {
  const session = getSession()

  if (!session) {
    // redirect("/auth/signin")
  }

  return (
    <SidebarProvider>
      <div
        className="min-h-screen bg-black text-white"
        style={
          {
            "--background": "0 0% 0%",
            "--foreground": "0 0% 100%",
            "--card": "0 0% 7%",
            "--card-foreground": "0 0% 100%",
            "--popover": "0 0% 7%",
            "--popover-foreground": "0 0% 100%",
            "--primary": "0 0% 100%",
            "--primary-foreground": "0 0% 0%",
            "--secondary": "0 0% 9%",
            "--secondary-foreground": "0 0% 100%",
            "--muted": "0 0% 9%",
            "--muted-foreground": "0 0% 60%",
            "--accent": "0 0% 9%",
            "--accent-foreground": "0 0% 100%",
            "--destructive": "0 62.8% 30.6%",
            "--destructive-foreground": "0 0% 100%",
            "--border": "0 0% 20%",
            "--input": "0 0% 20%",
            "--ring": "0 0% 100%",
            "--radius": "0.5rem",
          } as React.CSSProperties
        }
      >
        <DashboardHeader session={session} />
        <div className="flex">
          <DashboardSidebar />
          <main className="flex-1 transition-all duration-300 ease-in-out">
            <div className="mx-auto max-w-7xl px-6 md:px-8 py-8 space-y-10">
              <WelcomeSection session={session} />
              <QuickStats />
              <RecentActivity />
              <PerformanceAnalytics />
              <InterviewSuggestions />
              <ResumeInsights />
              <LearningHubPreview />
              <Gamification />
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  )
}
