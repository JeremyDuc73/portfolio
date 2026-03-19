import Database, { type Database as DatabaseType } from 'better-sqlite3'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { existsSync, mkdirSync } from 'node:fs'
import { createHash } from 'node:crypto'

const __dirname = dirname(fileURLToPath(import.meta.url))
const DB_DIR = resolve(__dirname, '../../data')
if (!existsSync(DB_DIR)) mkdirSync(DB_DIR, { recursive: true })

const DB_PATH = resolve(DB_DIR, 'portfolio.db')
const db: DatabaseType = new Database(DB_PATH)

// Enable WAL mode for better concurrent read performance
db.pragma('journal_mode = WAL')

export function initDB() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS about (
      id INTEGER PRIMARY KEY CHECK (id = 1),
      name TEXT NOT NULL,
      title TEXT NOT NULL,
      bio TEXT NOT NULL,
      location TEXT NOT NULL,
      email TEXT NOT NULL,
      github TEXT DEFAULT '',
      linkedin TEXT DEFAULT ''
    );

    CREATE TABLE IF NOT EXISTS skills (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      level INTEGER NOT NULL DEFAULT 50,
      category TEXT NOT NULL,
      description TEXT NOT NULL DEFAULT '',
      sort_order INTEGER NOT NULL DEFAULT 0
    );

    CREATE TABLE IF NOT EXISTS experience (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      role TEXT NOT NULL,
      company TEXT NOT NULL,
      period TEXT NOT NULL,
      description TEXT NOT NULL,
      sort_order INTEGER NOT NULL DEFAULT 0
    );

    CREATE TABLE IF NOT EXISTS projects (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      slug TEXT NOT NULL UNIQUE,
      title TEXT NOT NULL,
      description TEXT NOT NULL,
      tags TEXT NOT NULL DEFAULT '[]',
      image TEXT DEFAULT '',
      github TEXT DEFAULT '',
      demo TEXT DEFAULT '',
      featured INTEGER NOT NULL DEFAULT 0,
      sort_order INTEGER NOT NULL DEFAULT 0
    );

    CREATE TABLE IF NOT EXISTS admin (
      id INTEGER PRIMARY KEY CHECK (id = 1),
      password_hash TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS settings (
      id INTEGER PRIMARY KEY CHECK (id = 1),
      maintenance_mode INTEGER NOT NULL DEFAULT 0,
      maintenance_message TEXT NOT NULL DEFAULT 'Site en maintenance. Revenez bientôt.'
    );

    CREATE TABLE IF NOT EXISTS site_content (
      key TEXT PRIMARY KEY,
      value TEXT NOT NULL DEFAULT ''
    );
  `)

  // Seed default settings
  const settingsCount = db.prepare('SELECT COUNT(*) as c FROM settings').get() as { c: number }
  if (settingsCount.c === 0) {
    db.prepare("INSERT INTO settings (id, maintenance_mode, maintenance_message) VALUES (1, 0, 'Site en maintenance. Revenez bientôt.')").run()
  }

  // Seed default data if tables are empty
  const aboutCount = db.prepare('SELECT COUNT(*) as c FROM about').get() as { c: number }
  if (aboutCount.c === 0) {
    db.prepare(`INSERT INTO about (id, name, title, bio, location, email, github, linkedin) VALUES (1, ?, ?, ?, ?, ?, ?, ?)`)
      .run(
        'Jérémy Duc',
        'Développeur Web Full-Stack',
        "Passionné par le développement web moderne, je conçois des applications performantes et élégantes. Mon approche combine créativité technique et attention aux détails pour créer des expériences utilisateur exceptionnelles.",
        'France',
        'contact@jeremyduc.dev',
        'https://github.com/jeremyduc',
        'https://linkedin.com/in/jeremyduc'
      )
  }

  const skillsCount = db.prepare('SELECT COUNT(*) as c FROM skills').get() as { c: number }
  if (skillsCount.c === 0) {
    const insert = db.prepare('INSERT INTO skills (name, level, category, sort_order) VALUES (?, ?, ?, ?)')
    const skills = [
      ['Vue.js / Nuxt', 95, 'Frontend', 1],
      ['React / Next.js', 85, 'Frontend', 2],
      ['TypeScript', 90, 'Frontend', 3],
      ['TailwindCSS', 95, 'Frontend', 4],
      ['Node.js / Hono', 90, 'Backend', 5],
      ['PostgreSQL', 80, 'Backend', 6],
      ['REST / GraphQL', 85, 'Backend', 7],
      ['Redis / Queue', 75, 'Backend', 8],
      ['Docker', 85, 'DevOps', 9],
      ['CI/CD (GitHub Actions)', 85, 'DevOps', 10],
      ['Linux / Nginx', 80, 'DevOps', 11],
      ['Git', 90, 'DevOps', 12],
    ]
    const insertMany = db.transaction((rows: any[]) => {
      for (const row of rows) insert.run(...row)
    })
    insertMany(skills)
  }

  const expCount = db.prepare('SELECT COUNT(*) as c FROM experience').get() as { c: number }
  if (expCount.c === 0) {
    db.prepare('INSERT INTO experience (role, company, period, description, sort_order) VALUES (?, ?, ?, ?, ?)')
      .run(
        'Développeur Web Full-Stack',
        'Projets personnels & open source',
        '2022 - Présent',
        "Conception et développement d'applications web modernes avec les technologies les plus récentes.",
        1
      )
  }

  const projCount = db.prepare('SELECT COUNT(*) as c FROM projects').get() as { c: number }
  if (projCount.c === 0) {
    const insert = db.prepare('INSERT INTO projects (slug, title, description, tags, image, github, demo, featured, sort_order) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)')
    const projects = [
      ['portfolio-website', 'Portfolio Personnel', 'Site portfolio moderne avec animations GSAP et smooth scrolling, développé avec Nuxt 3 et Hono.', '["Nuxt 3","TailwindCSS","GSAP","Hono","Docker"]', '', 'https://github.com/jeremyduc/portfolio', 'https://jeremyduc.dev', 1, 1],
      ['ecommerce-platform', 'Plateforme E-commerce', 'Application e-commerce complète avec panier, paiement Stripe et gestion des commandes en temps réel.', '["Vue.js","Node.js","PostgreSQL","Stripe","Redis"]', '', 'https://github.com/jeremyduc/ecommerce', 'https://shop.jeremyduc.dev', 1, 2],
      ['task-manager', 'Gestionnaire de Tâches', 'Application collaborative de gestion de projet avec tableaux Kanban, notifications en temps réel et API REST.', '["React","TypeScript","Node.js","Socket.io","MongoDB"]', '', 'https://github.com/jeremyduc/taskmanager', 'https://tasks.jeremyduc.dev', 1, 3],
      ['weather-app', 'Application Météo', 'Application météo élégante avec géolocalisation, prévisions 7 jours et visualisations interactives.', '["Vue.js","TailwindCSS","OpenWeather API","Chart.js"]', '', 'https://github.com/jeremyduc/weather', 'https://weather.jeremyduc.dev', 0, 4],
      ['blog-platform', 'Plateforme de Blog', 'CMS headless avec éditeur Markdown, système de commentaires et optimisation SEO avancée.', '["Nuxt 3","Supabase","TailwindCSS","Markdown"]', '', 'https://github.com/jeremyduc/blog', 'https://blog.jeremyduc.dev', 0, 5],
      ['chat-application', 'Application de Chat', 'Messagerie en temps réel avec salons, partage de fichiers, et chiffrement de bout en bout.', '["React","Socket.io","Node.js","Redis","Docker"]', '', 'https://github.com/jeremyduc/chat', 'https://chat.jeremyduc.dev', 0, 6],
    ]
    const insertMany = db.transaction((rows: any[]) => {
      for (const row of rows) insert.run(...row)
    })
    insertMany(projects)
  }

  // Seed default site content
  const contentCount = db.prepare('SELECT COUNT(*) as c FROM site_content').get() as { c: number }
  if (contentCount.c === 0) {
    const insert = db.prepare('INSERT INTO site_content (key, value) VALUES (?, ?)')
    const defaults: [string, string][] = [
      // Hero
      ['hero_badge_text', 'Développeur Web Full-Stack'],
      ['hero_first_name', 'Jérémy'],
      ['hero_last_name', 'Duc'],
      ['hero_subtitle', 'Développeur Web Full-Stack'],
      ['hero_description', 'Je conçois des expériences web modernes, performantes et élégantes. Chaque ligne de code est pensée pour impressionner.'],
      ['hero_cta_primary', 'Voir mes projets'],
      ['hero_cta_secondary', 'En savoir plus'],
      // About
      ['about_section_label', 'À propos'],
      ['about_heading_line1', 'Créer des expériences'],
      ['about_heading_highlight', 'qui marquent'],
      ['about_code_name', 'Jérémy Duc'],
      ['about_code_role', 'Full-Stack Developer'],
      ['about_code_passion', 'Building elegant web apps'],
      ['about_code_coffee', 'always'],
      ['about_stats', JSON.stringify([
        { value: '5+', label: "Années d\'exp." },
        { value: '30+', label: 'Projets réalisés' },
        { value: '10+', label: 'Technologies' },
        { value: '100%', label: 'Passion' },
      ])],
      // Skills
      ['skills_section_label', 'Compétences'],
      ['skills_heading', 'Mon arsenal'],
      ['skills_heading_highlight', 'technique'],
      ['skills_subheading', 'Les technologies que je maîtrise au quotidien pour créer des applications web modernes.'],
      // Projects
      ['projects_section_label', 'Projets'],
      ['projects_heading_line1', 'Mes réalisations'],
      ['projects_heading_highlight', 'récentes'],
      // Contact
      ['contact_section_label', 'Contact'],
      ['contact_heading', 'Restons en'],
      ['contact_heading_highlight', 'contact'],
      ['contact_subheading', "Une question, une remarque ou simplement envie d\'échanger ? N\'hésitez pas à m\'écrire."],
      ['contact_button_text', 'Envoyer le message'],
      // Navbar
      ['navbar_logo_initials', 'JD'],
      ['navbar_logo_text', 'Jérémy'],
      ['navbar_logo_suffix', '.dev'],
      // Footer
      ['footer_copyright_name', 'Jérémy Duc'],
      ['footer_made_by', 'Jérémy Duc'],
    ]
    const insertMany = db.transaction((rows: [string, string][]) => {
      for (const [k, v] of rows) insert.run(k, v)
    })
    insertMany(defaults)
  }

  // Seed default admin password: "admin" (hashed simply — change in production)
  const adminCount = db.prepare('SELECT COUNT(*) as c FROM admin').get() as { c: number }
  if (adminCount.c === 0) {
    // Simple hash for default password "admin" - user should change this
    const hash = createHash('sha256').update('admin').digest('hex')
    db.prepare('INSERT INTO admin (id, password_hash) VALUES (1, ?)').run(hash)
  }

  // Migration: add description column to skills if missing
  try {
    db.prepare("SELECT description FROM skills LIMIT 1").get()
  } catch {
    db.prepare("ALTER TABLE skills ADD COLUMN description TEXT NOT NULL DEFAULT ''").run()
  }

  console.log('✅ Database initialized')
}

export { db }
