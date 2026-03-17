import { createMiddleware } from 'hono/factory'
import { createHash } from 'node:crypto'
import { db } from '../db/index.js'

export const adminAuth = createMiddleware(async (c, next) => {
  const authHeader = c.req.header('Authorization')

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return c.json({ error: 'Token manquant' }, 401)
  }

  const token = authHeader.slice(7)

  // Token is sha256(password) — compare with stored hash
  const admin = db.prepare('SELECT password_hash FROM admin WHERE id = 1').get() as { password_hash: string } | undefined
  if (!admin || token !== admin.password_hash) {
    return c.json({ error: 'Token invalide' }, 401)
  }

  await next()
})

export function hashPassword(password: string): string {
  return createHash('sha256').update(password).digest('hex')
}
