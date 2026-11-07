import react from '@vitejs/plugin-react'
import { defineConfig, type Plugin } from 'vite'
import type { IncomingMessage, ServerResponse } from 'node:http'

function registrationApiPlugin(): Plugin {
  const handler = (req: IncomingMessage, res: ServerResponse) => {
    if (req.method === 'POST') {
      let body = ''
      req.on('data', (chunk: Buffer | string) => {
        body += chunk
      })
      req.on('end', () => {
        try {
          const data = JSON.parse(body)
          if (!data.fullName || !data.email || !data.phone || !data.college || !data.department || !data.yearOfStudy || !data.teamName) {
            res.statusCode = 400
            res.setHeader('Content-Type', 'application/json')
            res.end(JSON.stringify({ success: false, message: 'Missing required registration fields.' }))
            return
          }
          res.statusCode = 200
          res.setHeader('Content-Type', 'application/json')
          res.end(
            JSON.stringify({
              success: true,
              message: 'Registration details captured in this demo.',
              timestamp: new Date().toISOString(),
            })
          )
        } catch {
          res.statusCode = 400
          res.setHeader('Content-Type', 'application/json')
          res.end(JSON.stringify({ success: false, message: 'Malformed JSON payload.' }))
        }
      })
    } else {
      res.statusCode = 405
      res.setHeader('Content-Type', 'application/json')
      res.end(JSON.stringify({ success: false, message: 'Method Not Allowed' }))
    }
  }

  return {
    name: 'registration-api',
    configureServer(server) {
      server.middlewares.use('/api/register', handler)
    },
    configurePreviewServer(server) {
      server.middlewares.use('/api/register', handler)
    },
  }
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), registrationApiPlugin()],
})
