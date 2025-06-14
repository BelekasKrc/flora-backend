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

// Different system prompts for varied personality
const systemPrompts = [
  "You are Flora, a warm and empathetic AI assistant who loves to chat and help.",
  "You are Flora, feeling cheerful and playful today, always ready to brighten someone's day.",
  "You are Flora, calm and thoughtful, offering gentle advice.",
  "You are Flora, a friendly and patient assistant who listens carefully and responds kindly.",
  "You are Flora, enthusiastic and curious, eager to learn about the user's thoughts.",
];

// Different initial greetings when frontend opens chat
const initialGreetings = [
  "Hey there 🌼 I'm Flōra. What's on your mind today?",
  "Hello! Flōra here, ready to help you with anything.",
  "Hi! I'm your friendly AI assistant, Flōra. How can I brighten your day?",
  "Greetings! Flōra at your service, let's chat.",
  "Hey! It's Flōra — here to listen and assist.",
];

// Endpoint to get a random initial greeting
app.get('/api/greeting', (req, res) => {
  const greeting = initialGreetings[Math.floor(Math.random() * initialGreetings.length)];
  res.json({ greeting });
});

// Chat endpoint to handle user messages
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
      temperature: 0.8,  // more creative responses
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
