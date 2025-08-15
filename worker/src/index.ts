// src/index.ts
import express from 'express';
import dotenv from 'dotenv';
import { resumeChatAgent } from './graph';

dotenv.config();

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 8000;

app.post('/chat/:resumeId', async (req, res) => {
  const { resumeId } = req.params;
  const { question } = req.body;

  if (!resumeId || !question) {
    return res.status(400).json({ error: 'resumeId and question are required.' });
  }

  try {
    const initialState: { resumeId: string; question: string } = {
      resumeId,
      question,
    };

    // The final state will contain the generated answer
    const finalState = await resumeChatAgent.invoke(initialState);
    
    // The 'END' node is the last one with a value
    const finalAnswer = finalState.generation;

    if (!finalAnswer) {
      throw new Error("The agent failed to generate a response.");
    }
    
    res.status(200).json({ answer: finalAnswer });

  } catch (error) {
    console.error("Error during chat processing:", error);
    res.status(500).json({ error: "An internal error occurred." });
  }
});

app.listen(PORT, () => {
  console.log(`✨ Server is running on http://localhost:${PORT}`);
});