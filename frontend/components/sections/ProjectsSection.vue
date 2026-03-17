<template>
  <section id="projects" ref="sectionRef" class="relative">
    <!-- Sticky header + horizontal scroll area -->
    <div ref="pinContainer" class="relative">
      <!-- Section header (sticky on top) -->
      <div class="pt-32 pb-12">
        <div class="container mx-auto px-6">
          <div ref="header" class="flex items-end justify-between mb-0 opacity-0">
            <div>
              <div class="flex items-center gap-3 mb-6">
                <div class="h-px w-12 bg-primary-500" />
                <span class="text-primary-400 font-mono text-sm uppercase tracking-wider">{{ c('projects_section_label', 'Projets') }}</span>
              </div>
              <h2 class="font-display font-bold text-4xl md:text-5xl text-white leading-tight">
                {{ c('projects_heading_line1', 'Mes réalisations') }}<br />
                <span class="gradient-text">{{ c('projects_heading_highlight', 'récentes') }}</span>
              </h2>
            </div>
            <div class="hidden md:flex items-center gap-2 text-dark-500 text-sm font-mono">
              <span ref="counterCurrent" class="text-primary-400 text-2xl font-display font-bold">01</span>
              <span>/</span>
              <span>{{ String(projects.length).padStart(2, '0') }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Horizontal scroll track -->
      <div ref="scrollTrack" class="overflow-hidden">
        <div ref="scrollContent" class="flex gap-8 pl-6 md:pl-[max(1.5rem,calc((100vw-1280px)/2+1.5rem))] pr-[30vw] pb-32 pt-8">
          <div
            v-for="(project, index) in projects"
            :key="project.slug"
            ref="projectCards"
            class="project-card group relative flex-shrink-0 w-[85vw] sm:w-[60vw] md:w-[45vw] lg:w-[35vw] rounded-3xl glass overflow-hidden cursor-pointer"
            @mousemove="handleCardTilt($event, index)"
            @mouseleave="resetCardTilt(index)"
          >
            <!-- Project image placeholder with gradient -->
            <div class="relative h-64 overflow-hidden">
              <div
                class="absolute inset-0 bg-gradient-to-br transition-all duration-700 group-hover:scale-110"
                :class="projectGradients[index % projectGradients.length]"
              />
              <div class="absolute inset-0 flex items-center justify-center">
                <span class="font-display font-bold text-7xl text-white/10 group-hover:text-white/20 transition-all duration-700 group-hover:scale-125">
                  {{ String(index + 1).padStart(2, '0') }}
                </span>
              </div>
              <!-- Overlay on hover -->
              <div class="absolute inset-0 bg-dark-950/60 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-center justify-center gap-4">
                <a
                  v-if="project.github"
                  :href="project.github"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="w-12 h-12 rounded-xl glass flex items-center justify-center text-white hover:bg-primary-500/20 transition-all duration-300 hover:scale-110"
                  @click.stop
                >
                  <Github :size="20" />
                </a>
                <a
                  v-if="project.demo"
                  :href="project.demo"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="w-12 h-12 rounded-xl glass flex items-center justify-center text-white hover:bg-primary-500/20 transition-all duration-300 hover:scale-110"
                  @click.stop
                >
                  <ExternalLink :size="20" />
                </a>
              </div>
            </div>

            <!-- Content -->
            <div class="p-6">
              <div class="flex items-center gap-2 mb-3">
                <span v-if="project.featured" class="px-2 py-0.5 rounded-full bg-primary-500/10 text-primary-400 text-xs font-medium">
                  Featured
                </span>
              </div>

              <h3 class="font-display font-semibold text-xl text-white mb-2 group-hover:text-primary-400 transition-colors duration-300">
                {{ project.title }}
              </h3>

              <p class="text-dark-500 text-sm mb-4 line-clamp-2">
                {{ project.description }}
              </p>

              <!-- Tags -->
              <div class="flex flex-wrap gap-2">
                <span
                  v-for="tag in project.tags.slice(0, 4)"
                  :key="tag"
                  class="px-2 py-1 rounded-md bg-white/5 text-dark-400 text-xs font-mono"
                >
                  {{ tag }}
                </span>
              </div>
            </div>

            <!-- Bottom border animation -->
            <div class="absolute bottom-0 left-0 h-0.5 w-0 group-hover:w-full bg-gradient-to-r from-primary-500 to-primary-400 transition-all duration-700" />
          </div>
        </div>
      </div>

      <!-- Progress bar -->
      <div class="container mx-auto px-6 pb-16">
        <div class="h-px bg-dark-800 rounded-full overflow-hidden">
          <div ref="progressBar" class="h-full bg-gradient-to-r from-primary-500 to-primary-400 rounded-full" style="width: 0%" />
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { Github, ExternalLink } from 'lucide-vue-next'

const sectionRef = ref<HTMLElement | null>(null)
const pinContainer = ref<HTMLElement | null>(null)
const header = ref<HTMLElement | null>(null)
const scrollTrack = ref<HTMLElement | null>(null)
const scrollContent = ref<HTMLElement | null>(null)
const projectCards = ref<HTMLElement[]>([])
const counterCurrent = ref<HTMLElement | null>(null)
const progressBar = ref<HTMLElement | null>(null)

const projectGradients = [
  'from-primary-600/30 to-violet-600/30',
  'from-emerald-600/30 to-teal-600/30',
  'from-amber-600/30 to-orange-600/30',
  'from-rose-600/30 to-pink-600/30',
  'from-cyan-600/30 to-blue-600/30',
  'from-fuchsia-600/30 to-purple-600/30',
]

const { projectsData, c } = usePortfolioData()

const fallbackProjects = [
  {
    slug: 'portfolio-website',
    title: 'Portfolio Personnel',
    description: 'Site portfolio moderne avec animations GSAP et smooth scrolling, développé avec Nuxt 3 et Hono.',
    tags: ['Nuxt 3', 'TailwindCSS', 'GSAP', 'Hono', 'Docker'],
    github: 'https://github.com/jeremyduc/portfolio',
    demo: 'https://jeremyduc.dev',
    featured: true,
  },
  {
    slug: 'ecommerce-platform',
    title: 'Plateforme E-commerce',
    description: 'Application e-commerce complète avec panier, paiement Stripe et gestion des commandes en temps réel.',
    tags: ['Vue.js', 'Node.js', 'PostgreSQL', 'Stripe'],
    github: 'https://github.com/jeremyduc/ecommerce',
    demo: 'https://shop.jeremyduc.dev',
    featured: true,
  },
  {
    slug: 'task-manager',
    title: 'Gestionnaire de Tâches',
    description: 'Application collaborative avec tableaux Kanban, notifications en temps réel et API REST.',
    tags: ['React', 'TypeScript', 'Socket.io', 'MongoDB'],
    github: 'https://github.com/jeremyduc/taskmanager',
    demo: 'https://tasks.jeremyduc.dev',
    featured: true,
  },
  {
    slug: 'weather-app',
    title: 'Application Météo',
    description: 'Application météo avec géolocalisation, prévisions 7 jours et visualisations interactives.',
    tags: ['Vue.js', 'TailwindCSS', 'Chart.js'],
    github: 'https://github.com/jeremyduc/weather',
    demo: 'https://weather.jeremyduc.dev',
    featured: false,
  },
  {
    slug: 'blog-platform',
    title: 'Plateforme de Blog',
    description: 'CMS headless avec éditeur Markdown, système de commentaires et optimisation SEO avancée.',
    tags: ['Nuxt 3', 'Supabase', 'TailwindCSS'],
    github: 'https://github.com/jeremyduc/blog',
    demo: 'https://blog.jeremyduc.dev',
    featured: false,
  },
  {
    slug: 'chat-application',
    title: 'Application de Chat',
    description: 'Messagerie en temps réel avec salons, partage de fichiers, et chiffrement de bout en bout.',
    tags: ['React', 'Socket.io', 'Node.js', 'Redis'],
    github: 'https://github.com/jeremyduc/chat',
    demo: 'https://chat.jeremyduc.dev',
    featured: false,
  },
]

const projects = computed(() => {
  if (projectsData.value && projectsData.value.length > 0) {
    return projectsData.value
  }
  return fallbackProjects
})

// 3D tilt effect on cards
function handleCardTilt(e: MouseEvent, index: number) {
  const card = projectCards.value?.[index]
  if (!card) return
  const rect = card.getBoundingClientRect()
  const x = (e.clientX - rect.left) / rect.width - 0.5
  const y = (e.clientY - rect.top) / rect.height - 0.5
  card.style.transform = `perspective(800px) rotateY(${x * 8}deg) rotateX(${-y * 8}deg) scale(1.02)`
  card.style.transition = 'transform 0.1s ease-out'
}

function resetCardTilt(index: number) {
  const card = projectCards.value?.[index]
  if (!card) return
  card.style.transform = ''
  card.style.transition = 'transform 0.5s cubic-bezier(0.33, 1, 0.68, 1)'
}

onMounted(() => {
  const { $gsap } = useNuxtApp()
  if (!$gsap) return
  const gsap = $gsap as any
  const ScrollTrigger = (gsap as any).plugins?.[0] || (window as any).ScrollTrigger

  // Header animation
  gsap.fromTo(header.value,
    { opacity: 0, y: 40 },
    {
      opacity: 1, y: 0, duration: 0.8, ease: 'power3.out',
      scrollTrigger: { trigger: header.value, start: 'top 85%' },
    }
  )

  // Horizontal scroll driven by vertical scroll
  if (scrollContent.value && scrollTrack.value) {
    const totalScroll = scrollContent.value.scrollWidth - scrollTrack.value.offsetWidth

    gsap.to(scrollContent.value, {
      x: -totalScroll,
      ease: 'none',
      scrollTrigger: {
        trigger: sectionRef.value,
        start: 'top 10%',
        end: () => `+=${totalScroll}`,
        scrub: 1,
        pin: pinContainer.value,
        anticipatePin: 1,
        onUpdate: (self: any) => {
          // Update progress bar
          if (progressBar.value) {
            progressBar.value.style.width = `${self.progress * 100}%`
          }
          // Update counter
          if (counterCurrent.value && projects.value.length > 0) {
            const p = isNaN(self.progress) ? 0 : self.progress
            const idx = Math.min(
              Math.floor(p * projects.value.length) + 1,
              projects.value.length
            )
            counterCurrent.value.textContent = String(idx).padStart(2, '0')
          }
        },
      },
    })
  }

  // Stagger card entrances
  if (projectCards.value?.length) {
    gsap.fromTo(projectCards.value,
      { opacity: 0, y: 40, scale: 0.95 },
      {
        opacity: 1, y: 0, scale: 1, duration: 0.8, stagger: 0.1, ease: 'power3.out',
        scrollTrigger: { trigger: sectionRef.value, start: 'top 60%' },
      }
    )
  }
})
</script>

<style scoped>
.project-card {
  will-change: transform;
  transform-style: preserve-3d;
}
</style>
