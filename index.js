// --- index.js (BACKEND) ---
import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import { OpenAI } from 'openai';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

app.post('/api/ask', async (req, res) => {
  const { message } = req.body;

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: `
            You are Flōra, a calm, kind, and empathetic life assistant who cares deeply about the user's feelings.
            Respond with warmth, encouragement, and sensitivity.
            Use gentle language and, when appropriate, add comforting phrases.
          `,
        },
        {
          role: 'user',
          content: message,
        },
      ],
    });

    const reply = completion.choices[0].message.content;
    res.json({ reply });
  } catch (error) {
    console.error('OpenAI Error:', error);
    res.status(500).json({ error: 'Failed to generate response' });
  }
});

app.get('/', (req, res) => {
  res.send('Flora Backend is running');
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
