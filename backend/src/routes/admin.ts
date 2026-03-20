import { Hono } from 'hono'
import { db } from '../db/index.js'
import { adminAuth, hashPassword } from '../middleware/auth.js'

export const adminRoutes = new Hono()

// Login — returns token (hashed password) if correct
adminRoutes.post('/login', async (c) => {
  const { password } = await c.req.json<{ password: string }>()
  if (!password) return c.json({ error: 'Mot de passe requis' }, 400)

  const hash = hashPassword(password)
  const admin = db.prepare('SELECT password_hash FROM admin WHERE id = 1').get() as { password_hash: string } | undefined

  if (!admin || hash !== admin.password_hash) {
    return c.json({ error: 'Mot de passe incorrect' }, 401)
  }

  return c.json({ token: hash })
})

// Change password
adminRoutes.post('/password', adminAuth, async (c) => {
  const { newPassword } = await c.req.json<{ newPassword: string }>()
  if (!newPassword || newPassword.length < 4) {
    return c.json({ error: 'Mot de passe trop court (min 4 caractères)' }, 400)
  }
  const hash = hashPassword(newPassword)
  db.prepare('UPDATE admin SET password_hash = ? WHERE id = 1').run(hash)
  return c.json({ success: true, token: hash })
})

// ─── ABOUT ───────────────────────────────────────────────
adminRoutes.get('/about', adminAuth, (c) => {
  const about = db.prepare('SELECT * FROM about WHERE id = 1').get()
  return c.json(about)
})

adminRoutes.put('/about', adminAuth, async (c) => {
  const data = await c.req.json()
  db.prepare(`UPDATE about SET name=?, title=?, bio=?, location=?, email=?, github=?, linkedin=? WHERE id=1`)
    .run(data.name, data.title, data.bio, data.location, data.email, data.github || '', data.linkedin || '')
  return c.json({ success: true })
})

// ─── SKILLS ──────────────────────────────────────────────
adminRoutes.get('/skills', adminAuth, (c) => {
  const skills = db.prepare('SELECT * FROM skills ORDER BY sort_order').all()
  return c.json(skills)
})

adminRoutes.post('/skills', adminAuth, async (c) => {
  const data = await c.req.json()
  const result = db.prepare('INSERT INTO skills (name, level, category, description, sort_order) VALUES (?, ?, ?, ?, ?)')
    .run(data.name, data.level ?? 50, data.category, data.description || '', data.sort_order || 0)
  return c.json({ success: true, id: result.lastInsertRowid })
})

adminRoutes.put('/skills/:id', adminAuth, async (c) => {
  const id = c.req.param('id')
  const data = await c.req.json()
  db.prepare('UPDATE skills SET name=?, level=?, category=?, description=?, sort_order=? WHERE id=?')
    .run(data.name, data.level ?? 50, data.category, data.description || '', data.sort_order || 0, id)
  return c.json({ success: true })
})

adminRoutes.delete('/skills/:id', adminAuth, (c) => {
  const id = c.req.param('id')
  db.prepare('DELETE FROM skills WHERE id=?').run(id)
  return c.json({ success: true })
})

// ─── EXPERIENCE ──────────────────────────────────────────
adminRoutes.get('/experience', adminAuth, (c) => {
  return c.json(db.prepare('SELECT * FROM experience ORDER BY sort_order').all())
})

adminRoutes.post('/experience', adminAuth, async (c) => {
  const data = await c.req.json()
  const result = db.prepare('INSERT INTO experience (role, company, period, description, sort_order) VALUES (?, ?, ?, ?, ?)')
    .run(data.role, data.company, data.period, data.description, data.sort_order || 0)
  return c.json({ success: true, id: result.lastInsertRowid })
})

adminRoutes.put('/experience/:id', adminAuth, async (c) => {
  const id = c.req.param('id')
  const data = await c.req.json()
  db.prepare('UPDATE experience SET role=?, company=?, period=?, description=?, sort_order=? WHERE id=?')
    .run(data.role, data.company, data.period, data.description, data.sort_order || 0, id)
  return c.json({ success: true })
})

adminRoutes.delete('/experience/:id', adminAuth, (c) => {
  db.prepare('DELETE FROM experience WHERE id=?').run(c.req.param('id'))
  return c.json({ success: true })
})

// ─── PROJECTS ────────────────────────────────────────────
function enrichProject(row: any) {
  const skillIds = (db.prepare('SELECT skill_id FROM project_skills WHERE project_id = ?').all(row.id) as any[]).map((r: any) => r.skill_id)
  const images = db.prepare('SELECT * FROM project_images WHERE project_id = ? ORDER BY sort_order').all(row.id) as any[]
  return { ...row, tags: JSON.parse(row.tags || '[]'), featured: !!row.featured, skill_ids: skillIds, images }
}

adminRoutes.get('/projects', adminAuth, (c) => {
  const rows = db.prepare('SELECT * FROM projects ORDER BY sort_order').all() as any[]
  return c.json(rows.map(enrichProject))
})

adminRoutes.post('/projects', adminAuth, async (c) => {
  const data = await c.req.json()
  const result = db.prepare('INSERT INTO projects (slug, title, description, tags, image, github, demo, featured, sort_order) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)')
    .run(data.slug, data.title, data.description, JSON.stringify(data.tags || []), data.image || '', data.github || '', data.demo || '', data.featured ? 1 : 0, data.sort_order || 0)
  const projectId = result.lastInsertRowid
  // Sync skills
  if (Array.isArray(data.skill_ids)) {
    const ins = db.prepare('INSERT OR IGNORE INTO project_skills (project_id, skill_id) VALUES (?, ?)')
    for (const sid of data.skill_ids) ins.run(projectId, sid)
  }
  return c.json({ success: true, id: projectId })
})

adminRoutes.put('/projects/:id', adminAuth, async (c) => {
  const id = c.req.param('id')
  const data = await c.req.json()
  db.prepare('UPDATE projects SET slug=?, title=?, description=?, tags=?, image=?, github=?, demo=?, featured=?, sort_order=? WHERE id=?')
    .run(data.slug, data.title, data.description, JSON.stringify(data.tags || []), data.image || '', data.github || '', data.demo || '', data.featured ? 1 : 0, data.sort_order || 0, id)
  // Sync skills
  if (Array.isArray(data.skill_ids)) {
    db.prepare('DELETE FROM project_skills WHERE project_id = ?').run(id)
    const ins = db.prepare('INSERT OR IGNORE INTO project_skills (project_id, skill_id) VALUES (?, ?)')
    for (const sid of data.skill_ids) ins.run(id, sid)
  }
  return c.json({ success: true })
})

adminRoutes.delete('/projects/:id', adminAuth, (c) => {
  db.prepare('DELETE FROM projects WHERE id=?').run(c.req.param('id'))
  return c.json({ success: true })
})

// ─── PROJECT IMAGES ─────────────────────────────────────
adminRoutes.get('/projects/:id/images', adminAuth, (c) => {
  const id = c.req.param('id')
  const images = db.prepare('SELECT * FROM project_images WHERE project_id = ? ORDER BY sort_order').all(id)
  return c.json(images)
})

adminRoutes.post('/projects/:id/images', adminAuth, async (c) => {
  const projectId = c.req.param('id')
  const data = await c.req.json()
  const maxOrder = (db.prepare('SELECT MAX(sort_order) as m FROM project_images WHERE project_id = ?').get(projectId) as any)?.m || 0
  const result = db.prepare('INSERT INTO project_images (project_id, url, caption, sort_order) VALUES (?, ?, ?, ?)')
    .run(projectId, data.url, data.caption || '', maxOrder + 1)
  return c.json({ success: true, id: result.lastInsertRowid })
})

adminRoutes.delete('/projects/:id/images/:imageId', adminAuth, (c) => {
  db.prepare('DELETE FROM project_images WHERE id = ? AND project_id = ?').run(c.req.param('imageId'), c.req.param('id'))
  return c.json({ success: true })
})

// ─── SITE CONTENT ──────────────────────────────
adminRoutes.get('/content', adminAuth, (c) => {
  const rows = db.prepare('SELECT key, value FROM site_content').all() as { key: string; value: string }[]
  const content: Record<string, string> = {}
  for (const row of rows) {
    content[row.key] = row.value
  }
  return c.json(content)
})

adminRoutes.put('/content', adminAuth, async (c) => {
  const data = await c.req.json<Record<string, string>>()
  const upsert = db.prepare('INSERT INTO site_content (key, value) VALUES (?, ?) ON CONFLICT(key) DO UPDATE SET value = excluded.value')
  const updateMany = db.transaction((entries: [string, string][]) => {
    for (const [k, v] of entries) upsert.run(k, v)
  })
  updateMany(Object.entries(data))
  return c.json({ success: true })
})

// ─── IMAGE UPLOAD ───────────────────────────────────────
adminRoutes.post('/upload', adminAuth, async (c) => {
  const body = await c.req.parseBody()
  const file = body['file']
  if (!file || typeof file === 'string') {
    return c.json({ error: 'Fichier manquant' }, 400)
  }
  const f = file as File
  const ext = f.name.split('.').pop()?.toLowerCase() || 'png'
  const allowed = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg']
  if (!allowed.includes(ext)) {
    return c.json({ error: 'Format non supporté (jpg, png, gif, webp, svg)' }, 400)
  }
  const { mkdirSync, writeFileSync } = await import('node:fs')
  const { join } = await import('node:path')
  const uploadDir = join(process.cwd(), 'data', 'uploads')
  mkdirSync(uploadDir, { recursive: true })
  const filename = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`
  const buffer = Buffer.from(await f.arrayBuffer())
  writeFileSync(join(uploadDir, filename), buffer)
  return c.json({ success: true, url: `/api/uploads/${filename}` })
})

// ─── SETTINGS / MAINTENANCE ─────────────────────────────
adminRoutes.get('/settings', adminAuth, (c) => {
  const settings = db.prepare('SELECT * FROM settings WHERE id = 1').get()
  return c.json(settings)
})

adminRoutes.put('/settings', adminAuth, async (c) => {
  const data = await c.req.json()
  db.prepare('UPDATE settings SET maintenance_mode=?, maintenance_message=? WHERE id=1')
    .run(data.maintenance_mode ? 1 : 0, data.maintenance_message || 'Site en maintenance. Revenez bientôt.')
  return c.json({ success: true })
})
