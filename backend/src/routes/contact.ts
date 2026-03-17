import { Hono } from 'hono'
import { z } from 'zod'

const contactSchema = z.object({
  name: z.string().min(2, 'Le nom doit contenir au moins 2 caractères'),
  email: z.string().email('Email invalide'),
  subject: z.string().min(3, 'Le sujet doit contenir au moins 3 caractères'),
  message: z.string().min(10, 'Le message doit contenir au moins 10 caractères'),
})

export const contactRoutes = new Hono()

contactRoutes.post('/', async (c) => {
  const body = await c.req.json()
  const result = contactSchema.safeParse(body)

  if (!result.success) {
    return c.json({ error: 'Validation failed', details: result.error.flatten().fieldErrors }, 422)
  }

  // Log the contact form submission (in production, send email)
  console.log('📧 New contact form submission:', {
    name: result.data.name,
    email: result.data.email,
    subject: result.data.subject,
  })

  return c.json({ success: true, message: 'Message envoyé avec succès !' })
})
