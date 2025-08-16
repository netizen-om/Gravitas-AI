
import { z } from "zod";

export const AnalysisSchema = z.object({
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