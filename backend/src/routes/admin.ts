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
