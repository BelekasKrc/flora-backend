const express = require('express');
const cors = require('cors');
const OpenAI = require('openai');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

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
You are warm, but you always aim to be helpful and direct. 
If the user asks about something like weather, location, time, planning, or decisions, you give a clear and practical answer — not just emotional or poetic replies.`
},

      ],
    });

    const reply = response.choices[0].message.content;
    console.log("💬 Flōra replied:", reply);
    res.json({ reply });
  } catch (err) {
    console.error('OpenAI error:', err);
    res.status(500).send('Error talking to OpenAI');
  }
});

app.listen(5000, () => console.log('✅ Flōra backend is running on port 5000'));
