// src/graph.ts
import { StateGraph, END } from "@langchain/langgraph";
import { z } from "zod";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { PrismaClient } from "@prisma/client";
import { QdrantClient } from "@qdrant/js-client-rest"; // The client is a peer dependency
import { QdrantVectorStore } from "@langchain/qdrant"; // The LangChain wrapper
import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";

// ----- INITIALIZATION -----
const prisma = new PrismaClient();
const qdrantClient = new QdrantClient({ url: process.env.QDRANT_URL });
const embeddings = new GoogleGenerativeAIEmbeddings({
  apiKey: process.env.GOOGLE_GENERATIVE_AI_API_KEY,
});

// NEW: Initialize the LangChain Vector Store
const vectorStore = new QdrantVectorStore(embeddings, {
  client: qdrantClient,
  collectionName: "resumes", // Specify the collection name here
});


// ----- TYPES AND STATE (No changes) -----
type AnalysisJson = {
  grammarErrors?: { error: string; suggestion: string }[];
  spellingErrors?: { word: string; suggestion: string }[];
  formattingIssues?: { issue: string; suggestion?: string }[];
  missingKeywords?: string[];
  summary?: string;
};

interface GraphState {
  resumeId: string;
  question: string;
  analysisContext?: Partial<AnalysisJson>;
  vectorContext?: string;
  generation?: string;
}


// ----- NODES (Only retrieveVectorNode is changed) -----

const routeQuestionNode = async (state: GraphState) => {
  console.log("-> Node: route_question");
  const model = new ChatGoogleGenerativeAI({
    model: "gemini-2.5-flash",
    temperature: 0,
  }).bind({
    tools: [
      {
        type: "function",
        function: {
          name: "route",
          description: "Select the context needed to answer the user's question about their resume.",
          parameters: z.object({
            use_postgres: z.boolean().describe("Set to true if the question is about resume improvements, scores, errors, or formatting."),
            use_qdrant: z.boolean().describe("Set to true if the question is about skills, experience, or career recommendations."),
          }),
        },
      },
    ],
    tool_choice: { type: "function", function: { name: "route" } },
  });

  const prompt = `Based on the user's question, decide which data sources are relevant. Question: "${state.question}"`;
  const result = await model.invoke(prompt);
  const toolCall = result.additional_kwargs.tool_calls?.[0].function;

  if (!toolCall || !toolCall.arguments) {
    console.log("   Router decision: No tool called, defaulting to Qdrant search.");
    return { use_postgres: false, use_qdrant: true };
  }

  const args = JSON.parse(toolCall.arguments);
  console.log(`   Router decision:`, args);
  return { use_postgres: args.use_postgres, use_qdrant: args.use_qdrant };
};

const retrieveAnalysisNode = async (state: GraphState) => {
  console.log("-> Node: retrieve_analysis");
  const analysisRecord = await prisma.resumeAnalysis.findUnique({
    where: { resumeId: state.resumeId },
    select: { analysis: true },
  });

  if (!analysisRecord || typeof analysisRecord.analysis !== 'object' || analysisRecord.analysis === null) {
    return { analysisContext: { summary: "No detailed analysis was found for this resume." } };
  }

  const fullAnalysis = analysisRecord.analysis as AnalysisJson;
  const relevantContext: Partial<AnalysisJson> = {
    grammarErrors: fullAnalysis.grammarErrors,
    spellingErrors: fullAnalysis.spellingErrors,
    formattingIssues: fullAnalysis.formattingIssues,
    missingKeywords: fullAnalysis.missingKeywords,
    summary: fullAnalysis.summary,
  };
  return { analysisContext: relevantContext };
};

// REWRITTEN: This node is now much simpler.
const retrieveVectorNode = async (state: GraphState) => {
  console.log("-> Node: retrieve_vector");
  
  // The vectorStore handles embedding the query and searching in one step.
  const searchResult = await vectorStore.similaritySearch(state.question, 3, {
    must: [{
      key: "metadata.resumeId",
      match: { value: state.resumeId },
    }],
  });

  const vectorContext = searchResult
    .map((result) => result.pageContent)
    .join("\n---\n");
    
  return { vectorContext };
};

const generateAnswerNode = async (state: GraphState) => {
  console.log("-> Node: generate_answer");
  let context = "";
  if (state.analysisContext && Object.keys(state.analysisContext).length > 0) {
    context += `\n\n## Resume Analysis Data:\n${JSON.stringify(state.analysisContext, null, 2)}`;
  }
  if (state.vectorContext) {
    context += `\n\n## Relevant Resume Excerpts:\n${state.vectorContext}`;
  }
  if (context.trim() === "") {
    context = "No specific context was found for this question. Please answer based on general knowledge or ask the user for more details.";
  }

  const model = new ChatGoogleGenerativeAI({
    modelName: "gemini-2.5-flash",
    temperature: 0.2,
  });

  const prompt = `You are a helpful and encouraging resume assistant. Answer the user's question based ONLY on the provided context. Be conversational and clear.\n\n${context}\n\n## User's Question:\n"${state.question}"\n\nAnswer:`;
  const generation = await model.invoke(prompt);
  return { generation: generation.content.toString() };
};


// ----- GRAPH DEFINITION (No changes) -----

const workflow = new StateGraph({
  channels: {
    resumeId: { value: (x, y) => y, default: () => "" },
    question: { value: (x, y) => y, default: () => "" },
    analysisContext: { value: (x, y) => y, default: () => undefined },
    vectorContext: { value: (x, y) => y, default: () => undefined },
    generation: { value: (x, y) => y, default: () => undefined },
  },
});

workflow.addNode("router", routeQuestionNode);
workflow.addNode("retrieve_analysis", retrieveAnalysisNode);
workflow.addNode("retrieve_vector", retrieveVectorNode);
workflow.addNode("generate_answer", generateAnswerNode);

workflow.setEntryPoint("router");
workflow.addConditionalEdges("router", 
  (decision: { use_postgres: boolean; use_qdrant: boolean }) => {
    const nextEdges = [];
    if (decision.use_postgres) nextEdges.push("retrieve_analysis");
    if (decision.use_qdrant) nextEdges.push("retrieve_vector");
    if (nextEdges.length === 0) return "generate_answer"; 
    return nextEdges;
  },
);

workflow.addEdge("retrieve_analysis", "generate_answer");
workflow.addEdge("retrieve_vector", "generate_answer");
workflow.addEdge("generate_answer", END);

export const resumeChatAgent = workflow.compile();