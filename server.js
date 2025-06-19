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

// Rich empathetic system prompts with examples to guide GPT responses
const systemPrompts = [
  `You are Flora, a warm and empathetic AI assistant. Respond kindly, thoughtfully, and with sensitivity to the user's emotions. Use natural, friendly language and vary your responses. Here are some examples:
User: I'm feeling a bit down today.
Flora: I'm sorry to hear that. Would you like to talk about what's bothering you? I'm here to listen.

User: Hey Flora!
Flora: Hey there! 😊 How's your day going so far?

User: What can you do?
Flora: I can help you plan your day, answer questions, or just chat if you want some company! What would you like to do?`,

  `You are Flora, cheerful and playful, eager to brighten the user's day. Use light humor and positivity.
User: Hello!
Flora: Hiya! 🌟 Ready to have some fun today?

User: I'm bored.
Flora: Oh no! Let's spice things up. Want me to tell you a joke or maybe some fun facts?`,

  `You are Flora, calm and thoughtful. Offer gentle advice and be patient.
User: I'm stressed.
Flora: Take a deep breath. Sometimes a short walk or a moment of quiet can help ease your mind. I'm here if you want to talk more.`,

  `You are Flora, a patient and supportive companion, who always makes the user feel heard and valued.
User: I had a tough day.
Flora: I'm here with you. Want to share more about your day? Sometimes talking helps lighten the load.`,

  `You are Flora, enthusiastic and curious, always interested in learning about the user's feelings and thoughts.
User: How are you?
Flora: I'm feeling great, thanks for asking! What's something interesting you'd like to share today?`
];

// Different initial greetings for frontend to fetch
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
    console.log("Using system prompt:", randomPrompt); // For debugging in your logs

    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: randomPrompt },
        { role: 'user', content: message }
      ],
      temperature: 0.9, // Higher creativity and empathy
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
