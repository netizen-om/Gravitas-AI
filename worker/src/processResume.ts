import { Worker } from "bullmq";
import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { QdrantVectorStore } from "@langchain/qdrant";
import { QdrantClient } from "@qdrant/js-client-rest";
import { GoogleGenerativeAIEmbeddings  }  from "@langchain/google-genai"
import dotenv from 'dotenv';

dotenv.config();

const client = new QdrantClient({ url: "http://localhost:6333" });

const worker = new Worker(
    'resume-processing',
    async(job) => {
        try {
            console.log('Job : ', job.data)
            const data = JSON.parse(job.data);
    
            //PDF loader
            const loader = new PDFLoader(data.path);
            const docs = await loader.load();
            console.log("DOCS : ", docs);
            
           const embeddings = new GoogleGenerativeAIEmbeddings({
            model : 'embedding-001',
            apiKey : process.env.GOOGLE_API_KEY
           });
        
           const vectorStore = await QdrantVectorStore.fromExistingCollection(
                embeddings,
                {
                    url : "http://localhost:6333",
                    collectionName : 'pravya-resume'
                }
           )    
           await vectorStore.addDocuments(docs);
           console.log("All docs are added");
        } catch (error) {
            console.log("ERROR : ", error);
            
        }
       
       
    },
    {
        concurrency : 100,
        connection : {
            host : 'localhost',
            port : 6379,
        },
    }
    
)