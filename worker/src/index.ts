// src/index.ts
import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import { resumeChatAgent } from './lib/chatGraph';
import { embedding } from './lib/embedding';
import { qdrantClient } from './lib/qdrant';


const app = express();

app.use(express.json());
app.use(express.urlencoded({extended : true}))

const PORT = 8000;

app.post('/chat/:resumeId', async (req, res) => {
  const { resumeId } = req.params;
  const { question } = req.body;

  if (!resumeId || !question) {
    return res.status(400).json({ error: 'resumeId and question are required.' });
  }

  try {

    const queryEmbedding = await embedding.embedQuery(question);
    console.log(queryEmbedding);
    
    const searchResult = await qdrantClient.search("pravya-resume", {
      vector: queryEmbedding,
      limit: 5,
      filter: {
        must: [{
          key: "resumeId",
          match: { value: resumeId },
        }],
      },
      with_payload: true,
    });

    res.status(200).json({ answer: searchResult });



    // // The final state will contain the generated answer
    // const finalState = await resumeChatAgent.invoke(initialState);
    
    // // The 'END' node is the last one with a value
    // const finalAnswer = finalState.generation;

    // if (!finalAnswer) {
    //   throw new Error("The agent failed to generate a response.");
    // }
    
    // res.status(200).json({ answer: finalAnswer });

  } catch (error) {
    console.error("Error during chat processing:", error);
    res.status(500).json({ error: "An internal error occurred." });
  }
});

app.listen(PORT, () => {
  console.log(`✨ Server is running on http://localhost:${PORT}`);
});