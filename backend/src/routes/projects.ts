import { Hono } from 'hono'
import { db } from '../db/index.js'

export const projectsRoutes = new Hono()

function parseProject(row: any) {
  return { ...row, tags: JSON.parse(row.tags || '[]'), featured: !!row.featured }
}

projectsRoutes.get('/', (c) => {
  const rows = db.prepare('SELECT * FROM projects ORDER BY sort_order').all()
  return c.json(rows.map(parseProject))
})

projectsRoutes.get('/:slug', (c) => {
  const slug = c.req.param('slug')
  const row = db.prepare('SELECT * FROM projects WHERE slug = ?').get(slug) as any

  if (!row) return c.json({ error: 'Project not found' }, 404)

  return c.json(parseProject(row))
})
