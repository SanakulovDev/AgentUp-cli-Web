import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { messages, max_tokens = 4096, temperature = 0.7 } = req.body;

  if (!messages || !Array.isArray(messages)) {
    return res.status(400).json({ error: 'messages array is required' });
  }

  const apiUrl = process.env.GROQ_API_URL;
  const apiKey = process.env.GROQ_API_KEY;
  const model = process.env.GROQ_MODEL;

  if (!apiUrl || !apiKey) {
    return res.status(500).json({ error: 'Server configuration error' });
  }

  try {
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({ model, messages, temperature, max_tokens })
    });

    if (!response.ok) {
      const err = await response.text();
      return res.status(response.status).json({ error: err });
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content || '';
    return res.json({ content });
  } catch {
    return res.status(500).json({ error: 'Internal server error' });
  }
}
