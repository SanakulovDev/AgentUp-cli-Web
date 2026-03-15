import { onRequest } from 'firebase-functions/v2/https';
import { defineString } from 'firebase-functions/params';

const groqApiKey = defineString('GROQ_API_KEY');
const groqApiUrl = defineString('GROQ_API_URL');
const groqModel = defineString('GROQ_MODEL', { default: 'llama-3.3-70b-versatile' });

export const generate = onRequest(
  { cors: true, region: 'us-central1' },
  async (req, res) => {
    if (req.method !== 'POST') {
      res.status(405).json({ error: 'Method not allowed' });
      return;
    }

    const { messages, max_tokens = 4096 } = req.body;

    if (!messages || !Array.isArray(messages)) {
      res.status(400).json({ error: 'messages array is required' });
      return;
    }

    try {
      const response = await fetch(groqApiUrl.value(), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${groqApiKey.value()}`
        },
        body: JSON.stringify({
          model: groqModel.value(),
          messages,
          temperature: 0.7,
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
    } catch (e) {
      res.status(500).json({ error: 'Internal server error' });
    }
  }
);

export const analyze = onRequest(
  { cors: true, region: 'us-central1' },
  async (req, res) => {
    if (req.method !== 'POST') {
      res.status(405).json({ error: 'Method not allowed' });
      return;
    }

    const { messages, max_tokens = 16384 } = req.body;

    if (!messages || !Array.isArray(messages)) {
      res.status(400).json({ error: 'messages array is required' });
      return;
    }

    try {
      const response = await fetch(groqApiUrl.value(), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${groqApiKey.value()}`
        },
        body: JSON.stringify({
          model: groqModel.value(),
          messages,
          temperature: 0.5,
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
    } catch (e) {
      res.status(500).json({ error: 'Internal server error' });
    }
  }
);
