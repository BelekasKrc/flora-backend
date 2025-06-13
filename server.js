const express = require('express');
const path = require('path');
const cors = require('cors');
const OpenAI = require('openai');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Serve React build
app.use(express.static(path.join(__dirname, 'build')));

// OpenAI setup
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

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

// Catch-all for frontend
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

app.listen(port, () => {
  console.log(`✅ Flōra server running on port ${port}`);
});
