import express from 'express';
import dotenv from 'dotenv';

dotenv.config({ path: '../.env' });

const app = express();
app.use(express.json());

const GROQ_API_URL = process.env.GROQ_API_URL!;
const GROQ_API_KEY = process.env.GROQ_API_KEY!;
const GROQ_MODEL = process.env.GROQ_MODEL;

if (!GROQ_API_URL || !GROQ_API_KEY) {
  console.error('GROQ_API_URL and GROQ_API_KEY must be set in .env');
  process.exit(1);
}

app.post('/api/generate', async (req, res) => {
  const { messages, max_tokens = 4096, temperature = 0.7 } = req.body;

  if (!messages || !Array.isArray(messages)) {
    res.status(400).json({ error: 'messages array is required' });
    return;
  }

  try {
    const response = await fetch(GROQ_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${GROQ_API_KEY}`
      },
      body: JSON.stringify({
        model: GROQ_MODEL,
        messages,
        temperature,
        max_tokens
      })
    });

    if (!response.ok) {
      const err = await response.text();
      res.status(response.status).json({ error: err });
      return;
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content || '';
    res.json({ content });
  } catch {
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/api/analyze', async (req, res) => {
  const { messages, max_tokens = 16384, temperature = 0.5 } = req.body;

  if (!messages || !Array.isArray(messages)) {
    res.status(400).json({ error: 'messages array is required' });
    return;
  }

  try {
    const response = await fetch(GROQ_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${GROQ_API_KEY}`
      },
      body: JSON.stringify({
        model: GROQ_MODEL,
        messages,
        temperature,
        max_tokens,
        response_format: { type: 'json_object' }
      })
    });

    if (!response.ok) {
      const err = await response.text();
      res.status(response.status).json({ error: err });
      return;
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content || '';
    res.json({ content });
  } catch {
    res.status(500).json({ error: 'Internal server error' });
  }
});

const PORT = process.env.API_PORT || 3001;
app.listen(PORT, () => {
  console.log(`API server running on http://localhost:${PORT}`);
});
