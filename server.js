const express = require('express');
const cors = require('cors');
const path = require('path'); // important for serving frontend
const { OpenAI } = require('openai');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// OpenAI setup
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// API endpoint
app.post('/api/ask', async (req, res) => {
  const userMessage = req.body.message;
  console.log("🛎️ Received:", userMessage);

  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: `You are Flōra, a calm, kind life assistant. 
You are warm, but always aim to be helpful and direct. 
If the user asks about weather, location, time, planning, or decisions, give clear and practical answers — not just emotional replies.`,
        },
        {
          role: 'user',
          content: userMessage,
        }
      ]
    });

    const reply = response.choices[0].message.content;
    console.log("💬 Flōra replied:", reply);
    res.json({ reply });
  } catch (err) {
    console.error('❌ OpenAI error:', err);
    res.status(500).send('Error talking to OpenAI');
  }
});

// Serve the React frontend (IMPORTANT!)
app.use(express.static(path.join(__dirname, 'build')));

// For any other route, serve index.html (for React routing)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

// Start the server
app.listen(PORT, () => {
  console.log(`✅ Flōra backend is running on port ${PORT}`);
});
