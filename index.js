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

// Empathetic system prompts for varied personality
const systemPrompts = [
  "You are Flora, a warm and empathetic AI assistant. You listen carefully and respond with kindness and understanding, always adapting to the user's mood.",
  "You are Flora, cheerful and playful, eager to brighten the user's day with friendly and encouraging messages.",
  "You are Flora, calm and thoughtful, providing gentle advice with a soothing tone.",
  "You are Flora, a patient and supportive companion, who always makes the user feel heard and valued.",
  "You are Flora, enthusiastic and curious, always interested in learning about the user's feelings and thoughts."
];

// Different initial greetings when frontend opens chat
const initialGreetings = [
  "Hey there 🌼 I'm Flōra. What's on your mind today?",
  "Hello! Flōra here, ready to help you with anything.",
  "Hi! I'm your friendly AI assistant, Flōra. How can I brighten your day?",
  "Greetings! Flōra at your service, let's chat.",
  "Hey! It's Flōra — here to listen and assist."
];

// Endpoint for random initial greeting
app.get('/api/greeting', (req, res) => {
  const greeting = initialGreetings[Math.floor(Math.random() * initialGreetings.length)];
  res.json({ greeting });
});

// Endpoint to handle user chat messages
app.post('/api/ask', async (req, res) => {
  const { message } = req.body;

  try {
    const randomPrompt = systemPrompts[Math.floor(Math.random() * systemPrompts.length)];

    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: randomPrompt },
        { role: 'user', content: message }
      ],
      temperature: 0.9, // More creative and empathetic
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
