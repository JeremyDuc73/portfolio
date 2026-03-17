import { Hono } from 'hono'
import { db } from '../db/index.js'

export const contentRoutes = new Hono()

contentRoutes.get('/', (c) => {
  const rows = db.prepare('SELECT key, value FROM site_content').all() as { key: string; value: string }[]
  const content: Record<string, string> = {}
  for (const row of rows) {
    content[row.key] = row.value
  }
  return c.json(content)
})
