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
  const result = db.prepare('INSERT INTO skills (name, level, category, sort_order) VALUES (?, ?, ?, ?)')
    .run(data.name, data.level, data.category, data.sort_order || 0)
  return c.json({ success: true, id: result.lastInsertRowid })
})

adminRoutes.put('/skills/:id', adminAuth, async (c) => {
  const id = c.req.param('id')
  const data = await c.req.json()
  db.prepare('UPDATE skills SET name=?, level=?, category=?, sort_order=? WHERE id=?')
    .run(data.name, data.level, data.category, data.sort_order || 0, id)
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
adminRoutes.get('/projects', adminAuth, (c) => {
  const rows = db.prepare('SELECT * FROM projects ORDER BY sort_order').all() as any[]
  return c.json(rows.map((r) => ({ ...r, tags: JSON.parse(r.tags || '[]'), featured: !!r.featured })))
})

adminRoutes.post('/projects', adminAuth, async (c) => {
  const data = await c.req.json()
  const result = db.prepare('INSERT INTO projects (slug, title, description, tags, image, github, demo, featured, sort_order) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)')
    .run(data.slug, data.title, data.description, JSON.stringify(data.tags || []), data.image || '', data.github || '', data.demo || '', data.featured ? 1 : 0, data.sort_order || 0)
  return c.json({ success: true, id: result.lastInsertRowid })
})

adminRoutes.put('/projects/:id', adminAuth, async (c) => {
  const id = c.req.param('id')
  const data = await c.req.json()
  db.prepare('UPDATE projects SET slug=?, title=?, description=?, tags=?, image=?, github=?, demo=?, featured=?, sort_order=? WHERE id=?')
    .run(data.slug, data.title, data.description, JSON.stringify(data.tags || []), data.image || '', data.github || '', data.demo || '', data.featured ? 1 : 0, data.sort_order || 0, id)
  return c.json({ success: true })
})

adminRoutes.delete('/projects/:id', adminAuth, (c) => {
  db.prepare('DELETE FROM projects WHERE id=?').run(c.req.param('id'))
  return c.json({ success: true })
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
