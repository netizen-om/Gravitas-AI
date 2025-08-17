import dotenv from "dotenv";
dotenv.config();

import { Worker } from "bullmq";
import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import fetch from "node-fetch";
import { Blob } from "buffer";
import { getVectorStore } from "./lib/vectorStore";
import { prisma } from "./lib/prisma";

const worker = new Worker(
  "resume-processing",
  async (job) => {
    const { fileUrl, userId, resumeId } = job.data;
    
    try {
      console.log("Job Data: ", job.data);

      // Update status to parsing
      await prisma.resume.update({
        where: { id: resumeId },
        data: { status: "parsing" }
      });

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

      // Check if analysis is also complete before setting status
      // Since both workers run concurrently, we need to ensure both are done
      const resume = await prisma.resume.findUnique({
        where: { id: resumeId },
        select: { status: true }
      });

      if (resume && resume.status === "analyzing") {
        // Analysis is complete, set status to completed
        await prisma.resume.update({
          where: { id: resumeId },
          data: { status: "completed" }
        });
      } else if (resume && resume.status === "parsing") {
        // Analysis is still in progress, set status to "analyzing" to show parsing is complete
        await prisma.resume.update({
          where: { id: resumeId },
          data: { status: "analyzing" }
        });
      }

    } catch (error) {
      console.error("ERROR:", error);
      
      // Update status to error if something goes wrong
      await prisma.resume.update({
        where: { id: resumeId },
        data: { status: "error" }
      });
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
