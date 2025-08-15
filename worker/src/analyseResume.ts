import { Worker } from "bullmq";
import dotenv from "dotenv";
import fetch from "node-fetch";
import { Blob } from "buffer";
import pdfParse from "pdf-parse";
import { google } from "@ai-sdk/google";
import { generateObject } from "ai";
import { PrismaClient } from "@prisma/client";
import { z } from "zod";

dotenv.config();

const prisma = new PrismaClient();

// Define the JSON schema for Gemini output
const AnalysisSchema = z.object({
  atsScore: z.number().min(0).max(100).optional(),
  grammarErrors: z.array(z.object({
    error: z.string(),
    suggestion: z.string(),
  })).default([]),
  spellingErrors: z.array(z.object({
    word: z.string(),
    suggestion: z.string(),
  })).default([]),
  formattingIssues: z.array(z.object({
    issue: z.string(),
    suggestion: z.string().optional(),
  })).default([]),
  impactWords: z.array(z.string()).default([]),
  missingKeywords: z.array(z.string()).default([]),
  matchingKeywords: z.array(z.string()).default([]),
  summary: z.string().optional(),
});

const worker = new Worker(
  "resume-analyse",
  async (job) => {
    try {
      console.log("Job Data: ", job.data);
      const { fileUrl, userId, resumeId } = job.data;

      // 1) Download PDF
      console.log("Downloading from Cloudinary:", fileUrl);
      const response = await fetch(fileUrl);
      if (!response.ok) throw new Error(`Failed to fetch file: ${response.statusText}`);
      const arrayBuffer = await response.arrayBuffer();

      // 2) Extract text
      const buffer = Buffer.from(arrayBuffer);
      const pdfData = await pdfParse(buffer);
      const resumeText = pdfData.text.trim();
      if (!resumeText || resumeText.length < 50) {
        throw new Error("Resume text is too short or unreadable");
      }

      // 3) Call Gemini 2.5 Flash for analysis
      const { object } = await generateObject({
        model: google("gemini-2.5-flash"),
        schema: AnalysisSchema,
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

      // 4) Save to Postgres (upsert)
      const atsScore = object.atsScore ?? null;
      await prisma.resumeAnalysis.upsert({
        where: { resumeId },
        create: {
          resumeId,
          atsScore,
          analysis: object,
        },
        update: {
          atsScore,
          analysis: object,
          updatedAt: new Date(),
        },
      });

      console.log(`Analysis saved for resume ${resumeId}`);
    } catch (error) {
      console.error("ERROR:", error);
    }
  },
  {
    concurrency: 5, // 100 is risky for Gemini API limits
    connection: {
      host: "localhost",
      port: 6379,
    },
  }
);
