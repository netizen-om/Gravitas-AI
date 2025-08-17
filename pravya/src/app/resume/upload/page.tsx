"use client"

import type React from "react"

import { useState, useCallback, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Upload, X, FileText, ArrowLeft, Eye, RotateCcw, Trash2, CheckCircle, AlertCircle, Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"

interface UploadedFile {
  name: string
  size: number
  file: File
}

interface Resume {
  id: string
  filename: string
  uploadDate: string
  status: "uploading" | "analyzing" | "completed" | "error"
  size: string
}

const motivationalQuotes = [
  "Analyzing your unique skills and experience...",
  "AI tip: Quantify your achievements with specific numbers",
  "Discovering your career strengths...",
  "Pro tip: Use action verbs to make your resume stand out",
  "Evaluating your professional journey...",
  "Remember: Your resume is your personal brand story",
]

const StatusBadge = ({ status }: { status: Resume["status"] }) => {
  switch (status) {
    case "uploading":
      return (
        <Badge variant="secondary" className="bg-blue-500/20 text-blue-400 border-blue-500/30">
          <Loader2 className="w-3 h-3 mr-1 animate-spin" />
          Uploading
        </Badge>
      )
    case "analyzing":
      return (
        <Badge
          variant="secondary"
          className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 text-purple-400 border-purple-500/30 animate-pulse"
        >
          <div className="w-3 h-3 mr-1 relative">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full animate-ping opacity-75"></div>
            <div className="relative w-3 h-3 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full"></div>
          </div>
          Analyzing
        </Badge>
      )
    case "completed":
      return (
        <Badge variant="secondary" className="bg-green-500/20 text-green-400 border-green-500/30">
          <CheckCircle className="w-3 h-3 mr-1" />
          Completed
        </Badge>
      )
    case "error":
      return (
        <Badge variant="destructive" className="bg-red-500/20 text-red-400 border-red-500/30">
          <AlertCircle className="w-3 h-3 mr-1" />
          Error
        </Badge>
      )
  }
}

export default function ResumeUploadPage() {
  const [isDragOver, setIsDragOver] = useState(false)
  const [uploadedFile, setUploadedFile] = useState<UploadedFile | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [currentQuote, setCurrentQuote] = useState(0)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const [resumes, setResumes] = useState<Resume[]>([
    {
      id: "1",
      filename: "john_doe_resume.pdf",
      uploadDate: "2024-01-15",
      status: "completed",
      size: "245 KB",
    },
    {
      id: "2",
      filename: "software_engineer_cv.pdf",
      uploadDate: "2024-01-14",
      status: "analyzing",
      size: "312 KB",
    },
    {
      id: "3",
      filename: "marketing_resume_v2.pdf",
      uploadDate: "2024-01-13",
      status: "error",
      size: "189 KB",
    },
  ])

  useEffect(() => {
    if (isAnalyzing) {
      const interval = setInterval(() => {
        setCurrentQuote((prev) => (prev + 1) % motivationalQuotes.length)
      }, 3000)
      return () => clearInterval(interval)
    }
  }, [isAnalyzing])

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)

    const files = Array.from(e.dataTransfer.files)
    if (files.length > 0) {
      const file = files[0]
      
      // Clear any previous messages
      setErrorMessage(null)
      setSuccessMessage(null)
      
      // Validate file type
      if (file.type !== "application/pdf" && !file.name.endsWith(".pdf")) {
        setErrorMessage("Please drop a PDF file")
        setTimeout(() => setErrorMessage(null), 3000)
        return
      }
      
      // Validate file size (10MB limit)
      const maxSize = 10 * 1024 * 1024 // 10MB in bytes
      if (file.size > maxSize) {
        setErrorMessage("Please select a file smaller than 10MB")
        setTimeout(() => setErrorMessage(null), 3000)
        return
      }
      
      setUploadedFile({
        name: file.name,
        size: file.size,
        file: file,
      })
    }
  }, [])

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files && files.length > 0) {
      const file = files[0]
      
      // Clear any previous messages
      setErrorMessage(null)
      setSuccessMessage(null)
      
      // Validate file type
      if (file.type !== "application/pdf" && !file.name.endsWith(".pdf")) {
        setErrorMessage("Please select a PDF file")
        setTimeout(() => setErrorMessage(null), 3000)
        return
      }
      
      // Validate file size (10MB limit)
      const maxSize = 10 * 1024 * 1024 // 10MB in bytes
      if (file.size > maxSize) {
        setErrorMessage("Please select a file smaller than 10MB")
        setTimeout(() => setErrorMessage(null), 3000)
        return
      }
      
      setUploadedFile({
        name: file.name,
        size: file.size,
        file: file,
      })
    }
  }

  const removeFile = () => {
    setUploadedFile(null)
    setUploadProgress(0)
    setErrorMessage(null)
    setSuccessMessage(null)
  }

  const handleUpload = async () => {
    if (!uploadedFile) return

    // Clear any previous messages
    setErrorMessage(null)
    setSuccessMessage(null)
    
    setIsUploading(true)
    setUploadProgress(0)

    try {
      // Create FormData to send the file
      const formData = new FormData()
      formData.append('file', uploadedFile.file)

      // Simulate upload progress while making the actual API call
      const uploadInterval = setInterval(() => {
        setUploadProgress((prev) => {
          if (prev >= 90) {
            clearInterval(uploadInterval)
            return 90
          }
          return prev + 10
        })
      }, 200)

      // Make the actual API call
      const response = await fetch('/api/upload/resume-upload', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        throw new Error(`Upload failed: ${response.statusText}`)
      }

      const result = await response.json()
      
      // Complete the progress bar
      setUploadProgress(100)
      clearInterval(uploadInterval)
      
      setIsUploading(false)
      setIsAnalyzing(true)
      
      // Show success message
      setSuccessMessage("Resume uploaded successfully! Starting analysis...")
      setTimeout(() => setSuccessMessage(null), 5000)

      // Add new resume to list
      const newResume: Resume = {
        id: result.resume?.id || Date.now().toString(),
        filename: uploadedFile.name,
        uploadDate: new Date().toISOString().split("T")[0],
        status: "analyzing",
        size: formatFileSize(uploadedFile.size),
      }
      setResumes((prev) => [newResume, ...prev])

      // Simulate analysis completion (this would be replaced with real-time updates from the queue)
      setTimeout(() => {
        setIsAnalyzing(false)
        setResumes((prev) =>
          prev.map((resume) => (resume.id === newResume.id ? { ...resume, status: "completed" as const } : resume)),
        )
        setUploadedFile(null)
        setUploadProgress(0)
      }, 8000)

    } catch (error) {
      console.error('Upload error:', error)
      setIsUploading(false)
      setUploadProgress(0)
      
      // Add error resume to list
      const errorResume: Resume = {
        id: Date.now().toString(),
        filename: uploadedFile.name,
        uploadDate: new Date().toISOString().split("T")[0],
        status: "error",
        size: formatFileSize(uploadedFile.size),
      }
      setResumes((prev) => [errorResume, ...prev])
      
      // Set error message for user display
      setErrorMessage(`Upload failed: ${error instanceof Error ? error.message : 'Unknown error'}`)
      
      // Clear error message after 5 seconds
      setTimeout(() => setErrorMessage(null), 5000)
    }
  }

  const handleRetry = (id: string) => {
    setResumes((prev) =>
      prev.map((resume) => (resume.id === id ? { ...resume, status: "analyzing" as const } : resume)),
    )

    setTimeout(() => {
      setResumes((prev) =>
        prev.map((resume) => (resume.id === id ? { ...resume, status: "completed" as const } : resume)),
      )
    }, 3000)
  }

  const handleDelete = (id: string) => {
    setResumes((prev) => prev.filter((resume) => resume.id !== id))
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 p-4">
      <div className="max-w-4xl mx-auto space-y-8 py-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold tracking-tight text-foreground">Upload Your Resume</h1>
          <p className="text-xl text-muted-foreground">Boost your practice with AI-powered resume analysis.</p>
        </div>

        {/* Main Upload Card */}
        <Card className="relative overflow-hidden backdrop-blur-sm bg-card/80 border-border/50 shadow-2xl">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5" />
          <div className="relative p-8 space-y-6">
            {/* Drag and Drop Area */}
            <div
              className={cn(
                "relative border-2 border-dashed rounded-xl p-12 text-center transition-all duration-300 cursor-pointer group",
                isDragOver
                  ? "border-primary bg-primary/10 shadow-lg shadow-primary/20"
                  : "border-border hover:border-primary/50 hover:bg-gradient-to-br hover:from-background hover:to-muted/30",
                "hover:scale-[1.02] hover:shadow-xl",
              )}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => document.getElementById("file-input")?.click()}
            >
              <input id="file-input" type="file" accept=".pdf" onChange={handleFileSelect} className="hidden" />

              <div className="space-y-4">
                <div
                  className={cn(
                    "mx-auto w-16 h-16 rounded-full flex items-center justify-center transition-all duration-300",
                    isDragOver
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground group-hover:bg-primary/20 group-hover:text-primary",
                  )}
                >
                  <Upload className="w-8 h-8" />
                </div>

                <div className="space-y-2">
                  <p className="text-lg font-medium text-foreground">
                    {isDragOver ? "Drop your resume here" : "Drag & drop your resume"}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    or <span className="text-primary font-medium">browse files</span>
                  </p>
                  <p className="text-xs text-muted-foreground">PDF files only, up to 10MB</p>
                </div>
              </div>
            </div>

            {/* File Preview */}
            {uploadedFile && (
              <div className="bg-muted/50 rounded-lg p-4 flex items-center justify-between animate-in fade-in-0 slide-in-from-bottom-2 duration-300">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-primary/20 rounded-lg flex items-center justify-center">
                    <FileText className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium text-foreground">{uploadedFile.name}</p>
                    <p className="text-sm text-muted-foreground">{formatFileSize(uploadedFile.size)}</p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={removeFile}
                  className="text-muted-foreground hover:text-destructive"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            )}

            {/* Progress Bar */}
            {isUploading && (
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Uploading...</span>
                  <span className="text-foreground">{uploadProgress}%</span>
                </div>
                <Progress value={uploadProgress} className="h-2" />
              </div>
            )}

            {/* Error Message */}
            {errorMessage && (
              <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 text-center animate-in fade-in-0 slide-in-from-bottom-2 duration-300">
                <div className="flex items-center justify-center space-x-2 text-red-400">
                  <AlertCircle className="w-5 h-5" />
                  <p className="font-medium">{errorMessage}</p>
                </div>
              </div>
            )}

            {/* Success Message */}
            {successMessage && (
              <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4 text-center animate-in fade-in-0 slide-in-from-bottom-2 duration-300">
                <div className="flex items-center justify-center space-x-2 text-green-400">
                  <CheckCircle className="w-5 h-5" />
                  <p className="font-medium">{successMessage}</p>
                </div>
              </div>
            )}

            {/* Analysis Feedback */}
            {isAnalyzing && (
              <div className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-lg p-6 text-center space-y-4 border border-purple-500/20">
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                  <div className="w-2 h-2 bg-pink-400 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                  <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce"></div>
                </div>
                <p className="text-lg font-medium text-foreground animate-pulse">{motivationalQuotes[currentQuote]}</p>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 pt-4">
              <Button
                onClick={handleUpload}
                disabled={!uploadedFile || isUploading || isAnalyzing}
                className="flex-1 h-12 text-base font-semibold transition-all duration-300 hover:scale-[1.02] hover:shadow-lg"
              >
                {isUploading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Uploading...
                  </>
                ) : isAnalyzing ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  "Upload & Continue"
                )}
              </Button>

              <Button
                variant="ghost"
                className="h-12 text-base transition-all duration-300 hover:scale-[1.02] hover:bg-muted/80"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Dashboard
              </Button>
            </div>
          </div>
        </Card>

        {/* Resume List Section */}
        <Card className="backdrop-blur-sm bg-card/80 border-border/50 shadow-xl">
          <div className="p-6">
            <h2 className="text-2xl font-semibold text-foreground mb-6">Your Resumes</h2>

            <div className="space-y-4">
              {resumes.map((resume, index) => (
                <div
                  key={resume.id}
                  className="flex items-center justify-between p-4 bg-muted/30 rounded-lg border border-border/50 hover:bg-muted/50 transition-all duration-300 hover:scale-[1.01] animate-in fade-in-0 slide-in-from-bottom-2"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-primary/20 rounded-lg flex items-center justify-center">
                      <FileText className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium text-foreground">{resume.filename}</p>
                      <p className="text-sm text-muted-foreground">
                        {resume.uploadDate} • {resume.size}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <StatusBadge status={resume.status} />

                    <div className="flex space-x-1">
                      {resume.status === "completed" && (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0 hover:bg-primary/20 hover:text-primary transition-all duration-200 hover:scale-110"
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                      )}

                      {resume.status === "error" && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRetry(resume.id)}
                          className="h-8 w-8 p-0 hover:bg-blue-500/20 hover:text-blue-400 transition-all duration-200 hover:scale-110"
                        >
                          <RotateCcw className="w-4 h-4" />
                        </Button>
                      )}

                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(resume.id)}
                        className="h-8 w-8 p-0 hover:bg-destructive/20 hover:text-destructive transition-all duration-200 hover:scale-110"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Card>

        {/* Footer */}
        <div className="text-center space-x-6 text-sm text-muted-foreground">
          <a href="#" className="hover:text-foreground transition-colors">
            Privacy Policy
          </a>
          <a href="#" className="hover:text-foreground transition-colors">
            Terms of Service
          </a>
        </div>
      </div>
    </div>
  )
}
