const express = require('express');
const cors = require('cors');
const OpenAI = require('openai');
require('dotenv').config();

const path = require('path');
const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// OpenAI setup
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// POST route for AI chat
app.post('/api/ask', async (req, res) => {
  const { message } = req.body;

  try {
    const chat = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: 'You are Flōra, a calm, kind life assistant.',
        },
        {
          role: 'user',
          content: message,
        },
      ],
    });

    const reply = chat.choices[0].message.content;
    res.json({ reply });
  } catch (err) {
    console.error('OpenAI error:', err);
    res.status(500).send('Error talking to OpenAI');
  }
});

// ✅ Simple root route for testing
app.get('/', (req, res) => {
  res.send('✅ Flōra backend is working');
});

app.listen(port, () => {
  console.log(`✅ Flōra server running on port ${port}`);
});

