import { serve } from '@hono/node-server'
import { app } from './app.js'

const port = parseInt(process.env.PORT || '3333', 10)
const host = process.env.HOST || '0.0.0.0'

console.log(`🚀 Portfolio API starting on http://${host}:${port}`)

serve({ fetch: app.fetch, port, hostname: host }, (info) => {
  console.log(`✅ Server running at http://${host}:${info.port}`)
})
