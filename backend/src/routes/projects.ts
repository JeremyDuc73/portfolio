import { Hono } from 'hono'
import { db } from '../db/index.js'

export const projectsRoutes = new Hono()

function enrichProject(row: any) {
  const skillIds = (db.prepare('SELECT skill_id FROM project_skills WHERE project_id = ?').all(row.id) as any[]).map((r: any) => r.skill_id)
  const images = db.prepare('SELECT * FROM project_images WHERE project_id = ? ORDER BY sort_order').all(row.id) as any[]
  const skills = skillIds.length
    ? db.prepare(`SELECT id, name, category FROM skills WHERE id IN (${skillIds.map(() => '?').join(',')})`).all(...skillIds) as any[]
    : []
  return { ...row, tags: JSON.parse(row.tags || '[]'), featured: !!row.featured, skill_ids: skillIds, skills, images }
}

projectsRoutes.get('/', (c) => {
  const rows = db.prepare('SELECT * FROM projects ORDER BY sort_order').all() as any[]
  return c.json(rows.map(enrichProject))
})

projectsRoutes.get('/:slug', (c) => {
  const slug = c.req.param('slug')
  const row = db.prepare('SELECT * FROM projects WHERE slug = ?').get(slug) as any

  if (!row) return c.json({ error: 'Project not found' }, 404)

  return c.json(enrichProject(row))
})
