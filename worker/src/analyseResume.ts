import { Worker, Job } from "bullmq";
import dotenv from "dotenv";
import fetch from "node-fetch";
import pdfParse from "pdf-parse";
import { google } from "@ai-sdk/google";
import { generateObject } from "ai";
import { PrismaClient } from "@prisma/client";
import { z } from "zod"; // Keep this

dotenv.config();

const prisma = new PrismaClient();

// ----- Job Data Interface -----
interface ResumeAnalyseJobData {
  fileUrl: string;
  userId: string;
  resumeId: string;
}

// ----- Zod Schema for Analysis -----
const AnalysisSchema = z.object({
  atsScore: z.number().min(0).max(100).optional(),
  grammarErrors: z
    .array(
      z.object({
        error: z.string(),
        suggestion: z.string(),
      })
    )
    .default([]),
  spellingErrors: z
    .array(
      z.object({
        word: z.string(),
        suggestion: z.string(),
      })
    )
    .default([]),
  formattingIssues: z
    .array(
      z.object({
        issue: z.string(),
        suggestion: z.string().optional(),
      })
    )
    .default([]),
  impactWords: z.array(z.string()).default([]),
  missingKeywords: z.array(z.string()).default([]),
  matchingKeywords: z.array(z.string()).default([]),
  summary: z.string().optional(),
});

// ----- Inferred type -----
type ResumeAnalysisType = z.infer<typeof AnalysisSchema>;

// ----- Worker -----
const worker = new Worker<ResumeAnalyseJobData>(
  "resume-analyse",
  async (job: Job<ResumeAnalyseJobData>) => {
    try {
      console.log("Job Data: ", job.data);
      const { fileUrl, resumeId } = job.data;

      // 1) Download PDF
      console.log("Downloading from Cloudinary:", fileUrl);
      const response = await fetch(fileUrl);
      if (!response.ok) {
        throw new Error(`Failed to fetch file: ${response.statusText}`);
      }
      const arrayBuffer = await response.arrayBuffer();

      // 2) Extract text
      const buffer = Buffer.from(arrayBuffer);
      const pdfData = await pdfParse(buffer);
      const resumeText = pdfData.text.trim();

      console.log("RESUME TEXT : ", resumeText);
      

      if (!resumeText || resumeText.length < 50) {
        throw new Error("Resume text is too short or unreadable");
      }

      // 3) Call Gemini 2.5 Flash for structured analysis
      const { object } = await generateObject({
        model: google("gemini-2.5-flash"),
        schema: AnalysisSchema as any,
        messages: [
          {
            role: "system",
            content:
              "You are a resume analysis assistant. Return only JSON matching the schema. Be precise, concise, and actionable.",
          },
          {
            role: "user",
            content: `Analyze the following resume for grammar, spelling, formatting, impact words, and ATS keyword match:\n${resumeText}`,
          },
        ],
      });
      console.log("RESPONSE BEFORE VALIDATION : ", object);
      
      // 4) Parse again to be 100% type-safe at runtime
      const validatedAnalysis: ResumeAnalysisType =
        AnalysisSchema.parse(object);

      console.log("RESPONSE AFTER VALIDATION : ", validatedAnalysis);

      // 5) Save to Postgres (upsert)
      // await prisma.resumeAnalysis.upsert({
      //   where: { resumeId },
      //   create: {
      //     resumeId,
      //     atsScore: validatedAnalysis.atsScore ?? null,
      //     analysis: validatedAnalysis,
      //   },
      //   update: {
      //     atsScore: validatedAnalysis.atsScore ?? null,
      //     analysis: validatedAnalysis,
      //     updatedAt: new Date(),
      //   },
      // });

      console.log(`✅ Analysis saved for resume ${resumeId}`);
    } catch (error) {
      console.error("❌ ERROR:", error);
      throw error;
    }
  },
  {
    concurrency: 5,
    connection: {
      host: "localhost",
      port: 6379,
    },
  }
);