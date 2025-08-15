// src/graph.ts
import { StateGraph, END, START } from "@langchain/langgraph";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { PrismaClient } from "@prisma/client";
import { QdrantClient } from "@qdrant/js-client-rest";
import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";
import { BaseMessage } from "@langchain/core/messages";

// ----- INITIALIZATION -----
const prisma = new PrismaClient();
const qdrantClient = new QdrantClient({ url: process.env.QDRANT_URL });
const embeddings = new GoogleGenerativeAIEmbeddings({
  apiKey: process.env.GOOGLE_GENERATIVE_AI_API_KEY,
});

// ----- TYPES AND STATE -----
type AnalysisJson = {
  grammarErrors?: { error: string; suggestion: string }[];
  spellingErrors?: { word: string; suggestion: string }[];
  formattingIssues?: { issue: string; suggestion?: string }[];
  missingKeywords?: string[];
  summary?: string;
};

// This interface defines the "memory" or state of our agent.
interface GraphState {
  resumeId: string;
  question: string;
  analysisContext: Partial<AnalysisJson>;
  vectorContext: string;
  generation?: string;
}

// ----- NODES (Actions the agent can take) -----

// Each node now returns a Partial<GraphState> to update the overall state.
const retrieveAnalysisNode = async (state: GraphState): Promise<Partial<GraphState>> => {
  console.log("-> Node: retrieve_analysis");
  const analysisRecord = await prisma.resumeAnalysis.findUnique({
    where: { resumeId: state.resumeId },
    select: { analysis: true },
  });

  if (!analysisRecord || typeof analysisRecord.analysis !== 'object' || analysisRecord.analysis === null) {
    return { analysisContext: {} };
  }
  const fullAnalysis = analysisRecord.analysis as AnalysisJson;
  return { analysisContext: fullAnalysis };
};

const retrieveVectorNode = async (state: GraphState): Promise<Partial<GraphState>> => {
  console.log("-> Node: retrieve_vector (using direct client)");
  try {
    const queryEmbedding = await embeddings.embedQuery(state.question);
    const searchResult = await qdrantClient.search("pravya-resume", {
      vector: queryEmbedding,
      limit: 3,
      filter: {
        must: [{
          key: "resumeId",
          match: { value: state.resumeId },
        }],
      },
      with_payload: true,
    });
    const vectorContext = searchResult
      .map((point) => point.payload?.pageContent as string)
      .filter(Boolean)
      .join("\n---\n");
    return { vectorContext };
  } catch (error) {
    console.error("   Error in retrieveVectorNode:", error);
    return { vectorContext: "Could not retrieve resume excerpts due to an error." };
  }
};

const generateAnswerNode = async (state: GraphState): Promise<Partial<GraphState>> => {
  console.log("-> Node: generate_answer");
  const { analysisContext, vectorContext, question } = state;
  const model = new ChatGoogleGenerativeAI({
    model: "gemini-2.5-flash", // Correct parameter is modelName
    temperature: 0.2,
  });
  const prompt = `You are a helpful and encouraging resume assistant. Answer the user's question based on the provided context.

If the question is about resume improvements, errors, or formatting, primarily use the "Resume Analysis Data".
If the question is about skills, experience, or career advice, primarily use the "Relevant Resume Excerpts".

## Resume Analysis Data:
${JSON.stringify(analysisContext, null, 2)}

## Relevant Resume Excerpts:
${vectorContext}

## User's Question:
"${question}"

Answer:`;
  const generation = await model.invoke(prompt);
  return { generation: generation.content.toString() };
};

// ----- GRAPH DEFINITION (REWRITTEN WITH LATEST SYNTAX) -----

// This defines how the state properties are updated. 'value: (x, y) => y'
// means that the new value from a node's output will always replace the old one.
const graphState = {
  resumeId: { value: (x: string, y: string) => y, default: () => "" },
  question: { value: (x: string, y: string) => y, default: () => "" },
  analysisContext: { value: (x: Partial<AnalysisJson>, y: Partial<AnalysisJson>) => y, default: () => ({}) },
  vectorContext: { value: (x: string, y: string) => y, default: () => "" },
  generation: { value: (x?: string, y?: string) => y, default: () => undefined },
};

// Initialize the graph with the state definition
const workflow = new StateGraph({
  channels: graphState,
});

// Add the nodes to the graph
workflow.addNode("retrieve_analysis", retrieveAnalysisNode);
workflow.addNode("retrieve_vector", retrieveVectorNode);
workflow.addNode("generate_answer", generateAnswerNode);

// Define the graph's flow
workflow.setEntryPoint(START); // The graph starts here

// From the start, branch to run both retrieval nodes in parallel
workflow.addConditionalEdges(START, 
  () => ["retrieve_analysis", "retrieve_vector"],
);

// After BOTH retrieval nodes are finished, they both lead to the final generation step.
// LangGraph automatically handles this as a "join" point, waiting for all incoming
// edges to complete before proceeding.
workflow.addEdge("retrieve_analysis", "generate_answer");
workflow.addEdge("retrieve_vector", "generate_answer");

// The graph ends after the answer is generated.
workflow.addEdge("generate_answer", END);

// Compile the graph into a runnable agent.
export const resumeChatAgent = workflow.compile();