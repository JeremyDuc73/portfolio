<template>
  <section id="skills" class="relative py-32 overflow-hidden">
    <div class="absolute inset-0 bg-gradient-to-b from-transparent via-primary-950/5 to-transparent" />

    <div class="container mx-auto px-6 relative">
      <!-- Section header -->
      <div ref="header" class="text-center mb-20 opacity-0">
        <div class="flex items-center justify-center gap-3 mb-6">
          <div class="h-px w-12 bg-primary-500" />
          <span class="text-primary-400 font-mono text-sm uppercase tracking-wider">{{ c('skills_section_label', 'Compétences') }}</span>
          <div class="h-px w-12 bg-primary-500" />
        </div>
        <h2 class="font-display font-bold text-4xl md:text-5xl text-white mb-4">
          {{ c('skills_heading', 'Mon arsenal') }}
          <span class="gradient-text">{{ c('skills_heading_highlight', 'technique') }}</span>
        </h2>
        <p class="text-dark-400 max-w-xl mx-auto">
          {{ c('skills_subheading', 'Les technologies que je maîtrise au quotidien pour créer des applications web modernes.') }}
        </p>
      </div>

      <!-- Skills categories -->
      <div class="grid md:grid-cols-3 gap-8">
        <div
          v-for="(category, index) in categories"
          :key="category.name"
          ref="skillCards"
          class="skill-card group relative rounded-3xl glass p-8 opacity-0 overflow-hidden"
          @mousemove="handleGlow($event, index)"
          @mouseleave="clearGlow(index)"
        >
          <!-- Radial glow on hover -->
          <div ref="glowEls" class="absolute inset-0 opacity-0 transition-opacity duration-300 pointer-events-none" />

          <!-- Category icon -->
          <div class="relative w-14 h-14 rounded-2xl bg-gradient-to-br from-primary-500/20 to-primary-600/10 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500">
            <component :is="category.icon" :size="28" class="text-primary-400" />
          </div>

          <h3 class="relative font-display font-semibold text-xl text-white mb-2">{{ category.name }}</h3>
          <p class="relative text-dark-500 text-sm mb-8">{{ category.description }}</p>

          <!-- Skills list as tags -->
          <div class="relative flex flex-wrap gap-2">
            <NuxtLink
              v-for="skill in category.skills"
              :key="skill.name"
              :to="skill.id ? `/skills/${skill.id}` : '#'"
              ref="skillTags"
              class="px-3 py-1.5 rounded-lg bg-white/5 border border-white/5 text-dark-300 text-sm font-medium hover:border-primary-500/30 hover:text-primary-400 transition-all duration-300 opacity-0 translate-y-3 cursor-pointer"
            >
              {{ skill.name }}
            </NuxtLink>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { Monitor, Server, Container } from 'lucide-vue-next'

const header = ref<HTMLElement | null>(null)
const skillCards = ref<HTMLElement[]>([])
const skillTags = ref<HTMLElement[]>([])
const glowEls = ref<HTMLElement[]>([])

// Radial glow following cursor inside card
function handleGlow(e: MouseEvent, index: number) {
  const glow = glowEls.value?.[index]
  if (!glow) return
  const rect = (glow.parentElement as HTMLElement).getBoundingClientRect()
  const x = e.clientX - rect.left
  const y = e.clientY - rect.top
  glow.style.background = `radial-gradient(300px circle at ${x}px ${y}px, rgba(139,92,246,0.08), transparent 60%)`
  glow.style.opacity = '1'
}

function clearGlow(index: number) {
  const glow = glowEls.value?.[index]
  if (!glow) return
  glow.style.opacity = '0'
}

const { aboutData, c } = usePortfolioData()

const categoryMeta: Record<string, { description: string; icon: any }> = {
  'Frontend': { description: 'Interfaces modernes et réactives', icon: Monitor },
  'Backend': { description: 'APIs robustes et scalables', icon: Server },
  'DevOps': { description: 'Déploiement et automatisation', icon: Container },
}

const fallbackCategories = [
  {
    name: 'Frontend',
    description: 'Interfaces modernes et réactives',
    icon: Monitor,
    skills: [
      { name: 'Vue.js / Nuxt' },
      { name: 'React / Next.js' },
      { name: 'TypeScript' },
      { name: 'TailwindCSS' },
      { name: 'GSAP' },
      { name: 'HTML / CSS' },
    ],
  },
  {
    name: 'Backend',
    description: 'APIs robustes et scalables',
    icon: Server,
    skills: [
      { name: 'Node.js' },
      { name: 'Hono' },
      { name: 'PostgreSQL' },
      { name: 'SQLite' },
      { name: 'REST API' },
      { name: 'GraphQL' },
      { name: 'Redis' },
    ],
  },
  {
    name: 'DevOps',
    description: 'Déploiement et automatisation',
    icon: Container,
    skills: [
      { name: 'Docker' },
      { name: 'GitHub Actions' },
      { name: 'Linux / Nginx' },
      { name: 'Git' },
      { name: 'Vercel / Netlify' },
    ],
  },
]

const categories = computed(() => {
  if (aboutData.value?.skills?.length) {
    const grouped: Record<string, Array<{ name: string; id?: number }>> = {}
    for (const skill of aboutData.value.skills) {
      if (!grouped[skill.category]) grouped[skill.category] = []
      grouped[skill.category].push({ name: skill.name, id: skill.id })
    }
    return Object.entries(grouped).map(([name, skills]) => ({
      name,
      description: categoryMeta[name]?.description || name,
      icon: categoryMeta[name]?.icon || Monitor,
      skills,
    }))
  }
  return fallbackCategories
})

onMounted(() => {
  const { $gsap } = useNuxtApp()
  if (!$gsap) return
  const gsap = $gsap as any

  // Header animation
  gsap.fromTo(header.value,
    { opacity: 0, y: 40 },
    {
      opacity: 1, y: 0, duration: 0.8, ease: 'power3.out',
      scrollTrigger: { trigger: header.value, start: 'top 85%' },
    }
  )

  // Cards stagger with scale + rotation
  if (skillCards.value?.length) {
    gsap.fromTo(skillCards.value,
      { opacity: 0, y: 60, scale: 0.9, rotateX: 8 },
      {
        opacity: 1, y: 0, scale: 1, rotateX: 0,
        duration: 0.9, stagger: 0.2, ease: 'power3.out',
        scrollTrigger: { trigger: skillCards.value[0], start: 'top 85%' },
      }
    )
  }

  // Skill tags stagger animation
  if (skillTags.value?.length) {
    gsap.to(skillTags.value, {
      opacity: 1, y: 0, duration: 0.5, stagger: 0.04, ease: 'power3.out',
      scrollTrigger: { trigger: skillTags.value[0], start: 'top 90%' },
    })
  }
})
</script>

<style scoped>
.skill-card {
  transform-style: preserve-3d;
  perspective: 600px;
}
</style>
