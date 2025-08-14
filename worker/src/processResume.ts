import { Worker } from "bullmq";
import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { QdrantVectorStore } from "@langchain/qdrant";
import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";
import dotenv from "dotenv";
import fetch from "node-fetch";
import { Blob } from "buffer";

dotenv.config();

const worker = new Worker(
  "resume-processing",
  async (job) => {
    try {
      console.log("Job Data: ", job.data);
      const { fileUrl, userId, resumeId } = job.data;

      // 1️⃣ Download PDF from Cloudinary
      console.log("Downloading from Cloudinary:", fileUrl);
      const response = await fetch(fileUrl);
      if (!response.ok) throw new Error(`Failed to fetch file: ${response.statusText}`);
      const arrayBuffer = await response.arrayBuffer();

      // 2️⃣ Load PDF from memory using a Blob
      const blob = new Blob([arrayBuffer], { type: "application/pdf" });
      // @ts-ignore - fs/pdf normally expects a path, but bypassing type check here
      const loader = new PDFLoader(blob);
      const docs = await loader.load();

      // 3️⃣ Attach metadata (userId & resumeId) to each chunk
      const docsWithMetadata = docs.map(doc => ({
        ...doc,
        metadata: {
          ...doc.metadata,
          userId,
          resumeId
        }
      }));

      console.log(`Loaded ${docsWithMetadata.length} chunks with metadata`);

      // 4️⃣ Create embeddings
      const embeddings = new GoogleGenerativeAIEmbeddings({
        model: "embedding-001",
        apiKey: process.env.GOOGLE_API_KEY,
      });

      // 5️⃣ Connect to Qdrant and upload
      const vectorStore = await QdrantVectorStore.fromExistingCollection(embeddings, {
        url: "http://localhost:6333",
        collectionName: "pravya-resume"
      });

      await vectorStore.addDocuments(docsWithMetadata);
      console.log("✅ All docs added to Qdrant with metadata");
    } catch (error) {
      console.error("❌ ERROR:", error);
    }
  },
  {
    concurrency: 100,
    connection: {
      host: "localhost",
      port: 6379,
    },
  }
);
