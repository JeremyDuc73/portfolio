<template>
  <section id="experience" ref="sectionRef" class="relative py-32 overflow-hidden">
    <!-- Background decoration -->
    <div class="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-primary-600/5 rounded-full blur-[120px]" />

    <div class="container mx-auto px-6 relative">
      <!-- Section header -->
      <div ref="header" class="text-center mb-20 opacity-0">
        <div class="flex items-center justify-center gap-3 mb-6">
          <div class="h-px w-12 bg-primary-500" />
          <span class="text-primary-400 font-mono text-sm uppercase tracking-wider">{{ c('experience_section_label', 'Expérience') }}</span>
          <div class="h-px w-12 bg-primary-500" />
        </div>
        <h2 class="font-display font-bold text-4xl md:text-5xl text-white mb-4">
          {{ c('experience_heading', 'Mon parcours') }}
          <span class="gradient-text">{{ c('experience_heading_highlight', 'professionnel') }}</span>
        </h2>
        <p class="text-dark-400 max-w-2xl mx-auto">
          {{ c('experience_subheading', 'Les étapes clés de mon parcours dans le développement web.') }}
        </p>
      </div>

      <!-- Timeline -->
      <div class="relative max-w-3xl mx-auto">
        <!-- Vertical line -->
        <div ref="timelineLine" class="absolute left-8 md:left-1/2 top-0 bottom-0 w-px bg-dark-800 -translate-x-1/2" />

        <div class="space-y-12">
          <div
            v-for="(exp, index) in experiences"
            :key="exp.id || index"
            ref="timelineItems"
            class="relative flex items-start gap-8 opacity-0"
            :class="index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'"
          >
            <!-- Dot -->
            <div class="absolute left-8 md:left-1/2 w-4 h-4 -translate-x-1/2 rounded-full border-2 border-primary-500 bg-dark-950 z-10" />

            <!-- Spacer (hidden on mobile) -->
            <div class="hidden md:block md:w-1/2" />

            <!-- Card -->
            <div class="ml-16 md:ml-0 md:w-1/2 group">
              <div class="p-6 rounded-2xl glass glass-hover transition-all duration-500">
                <!-- Period badge -->
                <div class="flex items-center gap-2 mb-3">
                  <span class="px-3 py-1 rounded-full bg-primary-500/10 text-primary-400 text-xs font-medium font-mono">
                    {{ exp.period }}
                  </span>
                </div>

                <h3 class="font-display font-semibold text-lg text-white mb-1 group-hover:text-primary-400 transition-colors duration-300">
                  {{ exp.role }}
                </h3>
                <p class="text-primary-400/70 text-sm font-medium mb-3">{{ exp.company }}</p>
                <p class="text-dark-400 text-sm leading-relaxed">{{ exp.description }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
const sectionRef = ref<HTMLElement | null>(null)
const header = ref<HTMLElement | null>(null)
const timelineLine = ref<HTMLElement | null>(null)
const timelineItems = ref<HTMLElement[]>([])

const { aboutData, c } = usePortfolioData()

const fallbackExperiences = [
  {
    id: 1,
    role: 'Développeur Web Full-Stack',
    company: 'Projets personnels & open source',
    period: '2022 - Présent',
    description: "Conception et développement d'applications web modernes avec les technologies les plus récentes.",
    sort_order: 1,
  },
]

const experiences = computed(() => {
  if (aboutData.value?.experience?.length) {
    return aboutData.value.experience
  }
  return fallbackExperiences
})

onMounted(() => {
  const { $gsap } = useNuxtApp()
  if (!$gsap) return
  const gsap = $gsap as any

  // Header
  gsap.fromTo(header.value,
    { opacity: 0, y: 40 },
    {
      opacity: 1, y: 0, duration: 0.8, ease: 'power3.out',
      scrollTrigger: { trigger: header.value, start: 'top 85%' },
    }
  )

  // Timeline line grow
  if (timelineLine.value) {
    gsap.fromTo(timelineLine.value,
      { scaleY: 0, transformOrigin: 'top' },
      {
        scaleY: 1, duration: 1.5, ease: 'power3.out',
        scrollTrigger: { trigger: timelineLine.value, start: 'top 85%' },
      }
    )
  }

  // Timeline items stagger
  if (timelineItems.value?.length) {
    gsap.fromTo(timelineItems.value,
      { opacity: 0, y: 50 },
      {
        opacity: 1, y: 0, duration: 0.8, stagger: 0.2, ease: 'power3.out',
        scrollTrigger: { trigger: timelineItems.value[0], start: 'top 85%' },
      }
    )
  }
})
</script>
