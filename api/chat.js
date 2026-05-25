// Serverless API route for the "ask megana" chatbot.
// Runs as Vite middleware in local dev (see vite.config.js) and as a
// serverless function on Vercel/Netlify in production. The OpenAI key
// is read from process.env.OPENAI_API_KEY and never exposed to the client.

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' })
    return
  }

  const apiKey = process.env.OPENAI_API_KEY
  if (!apiKey) {
    console.error('[api/chat] OPENAI_API_KEY is not set')
    res.status(500).json({
      error: 'OPENAI_API_KEY is not set. Add it to .env.local and restart the dev server.',
    })
    return
  }
  // Helpful debug log — shows only the last 4 chars of the key so we can
  // confirm the dev server is using the key we expect.
  console.log(
    `[api/chat] using key ending in ...${apiKey.slice(-4)} (len=${apiKey.length})`,
  )

  try {
    const { system, messages } = req.body || {}
    if (!Array.isArray(messages)) {
      res.status(400).json({ error: 'messages must be an array' })
      return
    }

    const payload = {
      model: 'gpt-4o-mini',
      max_tokens: 1000,
      messages: [
        ...(system ? [{ role: 'system', content: system }] : []),
        ...messages.map(m => ({ role: m.role, content: m.content })),
      ],
    }

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify(payload),
    })

    const data = await response.json()

    if (!response.ok) {
      console.error('[api/chat] openai error', response.status, data)
      res.status(response.status).json({
        error: data?.error?.message || 'OpenAI request failed',
      })
      return
    }

    const reply = data.choices?.[0]?.message?.content || ''
    res.status(200).json({ reply })
  } catch (err) {
    res.status(500).json({ error: err?.message || 'Unknown error' })
  }
}
