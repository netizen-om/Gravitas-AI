import { Worker } from "bullmq";
import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import dotenv from "dotenv";
import fetch from "node-fetch";
import { Blob } from "buffer";
import { getVectorStore } from "./lib/vectorStore";

dotenv.config();

const worker = new Worker(
  "resume-processing",
  async (job) => {
    try {
      console.log("Job Data: ", job.data);
      const { fileUrl, userId, resumeId } = job.data;

      console.log("Downloading from Cloudinary:", fileUrl);
      const response = await fetch(fileUrl);
      if (!response.ok) throw new Error(`Failed to fetch file: ${response.statusText}`);
      const arrayBuffer = await response.arrayBuffer();

      // Load PDF from memory using a Blob
      const blob = new Blob([arrayBuffer], { type: "application/pdf" });
      // @ts-ignore
      const loader = new PDFLoader(blob);
      const docs = await loader.load();

      const docsWithMetadata = docs.map(doc => ({
        ...doc,
        metadata: {
          ...doc.metadata,
          userId,
          resumeId
        }
      }));

      console.log(`Loaded ${docsWithMetadata.length} chunks with metadata`);

      const store = await getVectorStore();

      await store.addDocuments(docsWithMetadata);
      console.log("All docs added to Qdrant with metadata");
    } catch (error) {
      console.error("ERROR:", error);
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
