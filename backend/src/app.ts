import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { logger } from 'hono/logger'
import { initDB, db } from './db/index.js'
import { projectsRoutes } from './routes/projects.js'
// contact routes removed
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

// Public skill detail (with associated projects via join table)
app.get('/api/skills/:id', (c) => {
  const id = c.req.param('id')
  const skill = db.prepare('SELECT * FROM skills WHERE id = ?').get(id) as any
  if (!skill) return c.json({ error: 'Not found' }, 404)

  const related = db.prepare(`
    SELECT p.* FROM projects p
    INNER JOIN project_skills ps ON ps.project_id = p.id
    WHERE ps.skill_id = ?
    ORDER BY p.sort_order
  `).all(id) as any[]

  const projects = related.map((p: any) => {
    const sids = (db.prepare('SELECT skill_id FROM project_skills WHERE project_id = ?').all(p.id) as any[]).map((r: any) => r.skill_id)
    const skills = sids.length
      ? db.prepare(`SELECT id, name, category FROM skills WHERE id IN (${sids.map(() => '?').join(',')})`).all(...sids) as any[]
      : []
    return {
      ...p,
      tags: JSON.parse(p.tags || '[]'),
      featured: !!p.featured,
      skills,
      images: db.prepare('SELECT * FROM project_images WHERE project_id = ? ORDER BY sort_order').all(p.id),
    }
  })

  return c.json({ ...skill, projects })
})

// Serve uploaded files
app.get('/api/uploads/:filename', async (c) => {
  const filename = c.req.param('filename')
  if (filename.includes('..') || filename.includes('/')) {
    return c.json({ error: 'Invalid filename' }, 400)
  }
  const { join } = await import('node:path')
  const { readFileSync, existsSync } = await import('node:fs')
  const filepath = join(process.cwd(), 'data', 'uploads', filename)
  if (!existsSync(filepath)) return c.notFound()
  const ext = filename.split('.').pop()?.toLowerCase() || ''
  const mimeMap: Record<string, string> = {
    jpg: 'image/jpeg', jpeg: 'image/jpeg', png: 'image/png',
    gif: 'image/gif', webp: 'image/webp', svg: 'image/svg+xml',
  }
  const buffer = readFileSync(filepath)
  return new Response(buffer, {
    headers: {
      'Content-Type': mimeMap[ext] || 'application/octet-stream',
      'Cache-Control': 'public, max-age=31536000',
    },
  })
})

// API routes
app.route('/api/projects', projectsRoutes)
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
