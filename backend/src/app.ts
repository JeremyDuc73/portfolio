import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { logger } from 'hono/logger'
import { initDB, db } from './db/index.js'
import { projectsRoutes } from './routes/projects.js'
import { contactRoutes } from './routes/contact.js'
import { aboutRoutes } from './routes/about.js'
import { contentRoutes } from './routes/content.js'
import { adminRoutes } from './routes/admin.js'

// Initialize database and seed defaults
initDB()

const app = new Hono()

// Middleware
app.use('*', logger())
app.use('*', cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:11500',
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  credentials: true,
}))

// Health check
app.get('/', (c) => c.json({ status: 'ok', name: 'Portfolio API - Jérémy Duc' }))

// Public maintenance status check (no auth)
app.get('/api/maintenance', (c) => {
  const settings = db.prepare('SELECT maintenance_mode, maintenance_message FROM settings WHERE id = 1').get()
  return c.json(settings || { maintenance_mode: 0, maintenance_message: '' })
})

// API routes
app.route('/api/projects', projectsRoutes)
app.route('/api/contact', contactRoutes)
app.route('/api/about', aboutRoutes)
app.route('/api/content', contentRoutes)
app.route('/api/admin', adminRoutes)

// 404 handler
app.notFound((c) => c.json({ error: 'Not Found' }, 404))

// Error handler
app.onError((err, c) => {
  console.error('Server error:', err.message)
  return c.json({ error: 'Internal Server Error' }, 500)
})

export { app }
