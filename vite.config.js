import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// Dev-only plugin: mounts /api/chat.js as middleware so the bot works
// during `npm run dev`. In production (Vercel/Netlify), the same file
// is picked up as a serverless function automatically.
function apiRoutes() {
  return {
    name: 'api-routes',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        if (!req.url?.startsWith('/api/chat')) return next()
        if (req.method !== 'POST') return next()

        let raw = ''
        req.setEncoding('utf8')
        for await (const chunk of req) raw += chunk

        let body = {}
        try {
          body = raw ? JSON.parse(raw) : {}
        } catch {
          res.statusCode = 400
          res.setHeader('Content-Type', 'application/json')
          res.end(JSON.stringify({ error: 'Invalid JSON' }))
          return
        }

        const wrappedReq = Object.assign(req, { body })
        const wrappedRes = {
          statusCode: 200,
          status(code) {
            this.statusCode = code
            return this
          },
          json(data) {
            res.statusCode = this.statusCode
            res.setHeader('Content-Type', 'application/json')
            res.end(JSON.stringify(data))
            return this
          },
        }

        try {
          const module = await server.ssrLoadModule('/api/chat.js')
          await module.default(wrappedReq, wrappedRes)
        } catch (err) {
          res.statusCode = 500
          res.setHeader('Content-Type', 'application/json')
          res.end(JSON.stringify({ error: err?.message || 'Server error' }))
        }
      })
    },
  }
}

export default defineConfig(({ mode }) => {
  // Load .env.local (and friends) into process.env so api/chat.js can read it.
  const env = loadEnv(mode, process.cwd(), '')
  Object.assign(process.env, env)

  return {
    plugins: [react(), apiRoutes()],
  }
})
