import { Hono } from 'hono'
import { db } from '../db/index.js'

export const aboutRoutes = new Hono()

aboutRoutes.get('/', (c) => {
  const about = db.prepare('SELECT * FROM about WHERE id = 1').get() as any
  const skills = db.prepare('SELECT * FROM skills ORDER BY sort_order').all()
  const experience = db.prepare('SELECT * FROM experience ORDER BY sort_order').all()

  if (!about) return c.json({ error: 'About not found' }, 404)

  return c.json({
    name: about.name,
    title: about.title,
    bio: about.bio,
    location: about.location,
    email: about.email,
    socials: {
      github: about.github,
      linkedin: about.linkedin,
    },
    skills,
    experience,
  })
})
