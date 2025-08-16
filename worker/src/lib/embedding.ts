import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";

export const embedding = new GoogleGenerativeAIEmbeddings({
  model: "embedding-001",
  apiKey: process.env.GOOGLE_API_KEY,
});
