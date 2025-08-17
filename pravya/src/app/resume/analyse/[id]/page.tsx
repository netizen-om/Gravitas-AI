"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import {
  ZoomIn,
  ZoomOut,
  Maximize2,
  ArrowLeft,
  CheckCircle,
  MessageSquare,
  Upload,
  Sparkles,
  Code,
  Database,
  Wrench,
} from "lucide-react"
import { cn } from "@/lib/utils"

// Mock resume analysis data
const mockAnalysisData = {
  status: "completed",
  resumeUrl: "https://res.cloudinary.com/demo/image/upload/sample.pdf",
  analysis: {
    languages: [
      { name: "JavaScript", confidence: 95 },
      { name: "TypeScript", confidence: 90 },
      { name: "Python", confidence: 85 },
      { name: "Java", confidence: 80 },
      { name: "SQL", confidence: 75 },
    ],
    databases: [
      { name: "PostgreSQL", confidence: 90 },
      { name: "MongoDB", confidence: 85 },
      { name: "Redis", confidence: 70 },
      { name: "MySQL", confidence: 65 },
    ],
    frameworks: [
      { name: "React", confidence: 95 },
      { name: "Next.js", confidence: 90 },
      { name: "Node.js", confidence: 88 },
      { name: "Express", confidence: 85 },
      { name: "Django", confidence: 75 },
      { name: "Spring Boot", confidence: 70 },
    ],
    tools: [
      { name: "Git", confidence: 95 },
      { name: "Docker", confidence: 85 },
      { name: "AWS", confidence: 80 },
      { name: "Kubernetes", confidence: 70 },
      { name: "Jenkins", confidence: 65 },
    ],
  },
}

const loadingMessages = [
  "Extracting Skills...",
  "Analyzing Frameworks...",
  "Processing Languages...",
  "Identifying Tools...",
  "Finalizing Analysis...",
]

const SkillBadge = ({
  skill,
  icon: Icon,
}: { skill: { name: string; confidence: number }; icon: React.ElementType }) => {
  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 90) return "from-green-500/20 to-emerald-500/20 border-green-500/30 text-green-400"
    if (confidence >= 80) return "from-blue-500/20 to-cyan-500/20 border-blue-500/30 text-blue-400"
    if (confidence >= 70) return "from-yellow-500/20 to-orange-500/20 border-yellow-500/30 text-yellow-400"
    return "from-gray-500/20 to-slate-500/20 border-gray-500/30 text-gray-400"
  }

  return (
    <div className="group relative">
      <Badge
        variant="secondary"
        className={cn(
          "bg-gradient-to-r transition-all duration-300 hover:scale-105 cursor-pointer",
          getConfidenceColor(skill.confidence),
        )}
      >
        <Icon className="w-3 h-3 mr-1" />
        {skill.name}
      </Badge>

      {/* Tooltip */}
      <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-popover text-popover-foreground text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-10">
        Identified in Resume ({skill.confidence}% confidence)
      </div>
    </div>
  )
}

const ShimmerLoader = ({ message }: { message: string }) => (
  <div className="space-y-3">
    <div className="flex items-center space-x-2">
      <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
      <span className="text-sm text-muted-foreground animate-pulse">{message}</span>
    </div>
    <div className="grid grid-cols-2 gap-2">
      <Skeleton className="h-8 w-full" />
      <Skeleton className="h-8 w-full" />
    </div>
  </div>
)

export default function ResumeAnalysisPage() {
  const [isLoading, setIsLoading] = useState(true)
  const [currentLoadingMessage, setCurrentLoadingMessage] = useState(0)
  const [zoomLevel, setZoomLevel] = useState(100)
  const [isFullscreen, setIsFullscreen] = useState(false)

  useEffect(() => {
    // Simulate loading process
    const loadingInterval = setInterval(() => {
      setCurrentLoadingMessage((prev) => {
        if (prev >= loadingMessages.length - 1) {
          clearInterval(loadingInterval)
          setTimeout(() => setIsLoading(false), 1000)
          return prev
        }
        return prev + 1
      })
    }, 1500)

    return () => clearInterval(loadingInterval)
  }, [])

  const handleZoomIn = () => setZoomLevel((prev) => Math.min(prev + 25, 200))
  const handleZoomOut = () => setZoomLevel((prev) => Math.max(prev - 25, 50))
  const toggleFullscreen = () => setIsFullscreen(!isFullscreen)

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      {/* Header */}
      <div className="border-b border-border/50 bg-card/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm" className="hover:bg-muted/80">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Upload
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-foreground">Resume Analysis</h1>
                <p className="text-sm text-muted-foreground">john_doe_resume.pdf</p>
              </div>
            </div>

            {!isLoading && (
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-5 h-5 text-green-400" />
                <span className="text-sm font-medium text-green-400 animate-pulse">Analysis Completed</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto p-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-[calc(100vh-200px)]">
          {/* Left Panel - Resume Viewer */}
          <Card className="relative overflow-hidden backdrop-blur-sm bg-card/80 border-border/50 shadow-xl">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5" />

            {/* Viewer Controls */}
            <div className="relative border-b border-border/50 p-4">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-foreground">Resume Preview</h3>
                <div className="flex items-center space-x-2">
                  <Button variant="ghost" size="sm" onClick={handleZoomOut} disabled={zoomLevel <= 50}>
                    <ZoomOut className="w-4 h-4" />
                  </Button>
                  <span className="text-sm text-muted-foreground min-w-[60px] text-center">{zoomLevel}%</span>
                  <Button variant="ghost" size="sm" onClick={handleZoomIn} disabled={zoomLevel >= 200}>
                    <ZoomIn className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="sm" onClick={toggleFullscreen}>
                    <Maximize2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Resume Content */}
            <div className="relative flex-1 p-4 overflow-auto">
              {isLoading ? (
                <div className="space-y-4">
                  <Skeleton className="h-8 w-3/4" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-5/6" />
                  <div className="space-y-2 mt-6">
                    <Skeleton className="h-6 w-1/2" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-4/5" />
                    <Skeleton className="h-4 w-3/4" />
                  </div>
                </div>
              ) : (
                <div
                  className="bg-white rounded-lg shadow-lg p-8 text-black transition-transform duration-300"
                  style={{ transform: `scale(${zoomLevel / 100})`, transformOrigin: "top left" }}
                >
                  {/* Mock Resume Content */}
                  <div className="space-y-6">
                    <div className="text-center border-b pb-4">
                      <h1 className="text-3xl font-bold">John Doe</h1>
                      <p className="text-lg text-gray-600">Senior Software Engineer</p>
                      <p className="text-sm text-gray-500">john.doe@email.com | (555) 123-4567</p>
                    </div>

                    <div>
                      <h2 className="text-xl font-semibold mb-2">Experience</h2>
                      <div className="space-y-3">
                        <div>
                          <h3 className="font-medium">Senior Software Engineer - Tech Corp</h3>
                          <p className="text-sm text-gray-600">2021 - Present</p>
                          <ul className="text-sm mt-1 space-y-1">
                            <li>• Developed React applications with TypeScript</li>
                            <li>• Built scalable Node.js APIs with PostgreSQL</li>
                            <li>• Implemented CI/CD pipelines using Docker and AWS</li>
                          </ul>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h2 className="text-xl font-semibold mb-2">Skills</h2>
                      <p className="text-sm">
                        JavaScript, TypeScript, React, Node.js, Python, PostgreSQL, MongoDB, AWS, Docker
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </Card>

          {/* Right Panel - AI Analysis */}
          <div className="space-y-6">
            {/* Header Card */}
            <Card className="backdrop-blur-sm bg-card/80 border-border/50 shadow-xl">
              <div className="p-6">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-10 h-10 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-lg flex items-center justify-center">
                    <Sparkles className="w-5 h-5 text-purple-400" />
                  </div>
                  <h2 className="text-2xl font-bold text-foreground">AI Resume Insights</h2>
                </div>

                {!isLoading && (
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                    <span className="text-sm text-green-400 font-medium">Analysis Completed</span>
                  </div>
                )}
              </div>
            </Card>

            {/* Analysis Sections */}
            <div className="space-y-4 max-h-[600px] overflow-y-auto">
              {/* Languages */}
              <Card className="backdrop-blur-sm bg-card/80 border-border/50 shadow-lg">
                <div className="p-6">
                  <div className="flex items-center space-x-2 mb-4">
                    <Code className="w-5 h-5 text-blue-400" />
                    <h3 className="text-lg font-semibold text-foreground">Programming Languages</h3>
                  </div>

                  {isLoading ? (
                    <ShimmerLoader message={loadingMessages[Math.min(currentLoadingMessage, 0)]} />
                  ) : (
                    <div className="flex flex-wrap gap-2">
                      {mockAnalysisData.analysis.languages.map((lang) => (
                        <SkillBadge key={lang.name} skill={lang} icon={Code} />
                      ))}
                    </div>
                  )}
                </div>
              </Card>

              {/* Databases */}
              <Card className="backdrop-blur-sm bg-card/80 border-border/50 shadow-lg">
                <div className="p-6">
                  <div className="flex items-center space-x-2 mb-4">
                    <Database className="w-5 h-5 text-green-400" />
                    <h3 className="text-lg font-semibold text-foreground">Databases</h3>
                  </div>

                  {isLoading ? (
                    <ShimmerLoader message={loadingMessages[Math.min(currentLoadingMessage, 1)]} />
                  ) : (
                    <div className="grid grid-cols-2 gap-2">
                      {mockAnalysisData.analysis.databases.map((db) => (
                        <SkillBadge key={db.name} skill={db} icon={Database} />
                      ))}
                    </div>
                  )}
                </div>
              </Card>

              {/* Frameworks */}
              <Card className="backdrop-blur-sm bg-card/80 border-border/50 shadow-lg">
                <div className="p-6">
                  <div className="flex items-center space-x-2 mb-4">
                    <Wrench className="w-5 h-5 text-purple-400" />
                    <h3 className="text-lg font-semibold text-foreground">Frameworks & Libraries</h3>
                  </div>

                  {isLoading ? (
                    <ShimmerLoader message={loadingMessages[Math.min(currentLoadingMessage, 2)]} />
                  ) : (
                    <div className="grid grid-cols-2 gap-2">
                      {mockAnalysisData.analysis.frameworks.map((framework) => (
                        <SkillBadge key={framework.name} skill={framework} icon={Wrench} />
                      ))}
                    </div>
                  )}
                </div>
              </Card>

              {/* Tools */}
              <Card className="backdrop-blur-sm bg-card/80 border-border/50 shadow-lg">
                <div className="p-6">
                  <div className="flex items-center space-x-2 mb-4">
                    <Wrench className="w-5 h-5 text-orange-400" />
                    <h3 className="text-lg font-semibold text-foreground">Tools & Platforms</h3>
                  </div>

                  {isLoading ? (
                    <ShimmerLoader message={loadingMessages[Math.min(currentLoadingMessage, 3)]} />
                  ) : (
                    <div className="space-y-2">
                      {mockAnalysisData.analysis.tools.map((tool) => (
                        <div
                          key={tool.name}
                          className="flex items-center justify-between p-2 bg-muted/30 rounded-lg hover:bg-muted/50 transition-colors"
                        >
                          <span className="text-sm font-medium text-foreground">{tool.name}</span>
                          <Badge variant="outline" className="text-xs">
                            {tool.confidence}%
                          </Badge>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </Card>
            </div>

            {/* CTA Buttons */}
            {!isLoading && (
              <div className="space-y-3">
                <Button
                  className="w-full h-14 text-lg font-semibold bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 transition-all duration-300 hover:scale-[1.02] hover:shadow-lg animate-pulse"
                  onClick={() => (window.location.href = "/chatbot")}
                >
                  <MessageSquare className="w-5 h-5 mr-2" />
                  Chat With Your Resume
                </Button>

                <Button
                  variant="ghost"
                  className="w-full h-12 transition-all duration-300 hover:scale-[1.02] hover:bg-muted/80"
                >
                  <Upload className="w-4 h-4 mr-2" />
                  Upload New Resume
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
