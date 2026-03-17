<template>
  <section id="about" ref="sectionRef" class="relative py-32 overflow-hidden">
    <!-- Background decoration -->
    <div class="absolute top-0 right-0 w-[400px] h-[400px] bg-primary-600/5 rounded-full blur-[100px]" />

    <div class="container mx-auto px-6">
      <div class="grid lg:grid-cols-2 gap-16 items-center">
        <!-- Left: Visual card -->
        <div ref="imageCol" class="relative" style="clip-path: inset(100% 0 0 0);">
          <div class="relative aspect-square max-w-md mx-auto">
            <!-- Decorative frames with rotation -->
            <div ref="frame1" class="absolute inset-4 rounded-3xl border border-primary-500/20 rotate-3" />
            <div ref="frame2" class="absolute inset-4 rounded-3xl border border-primary-400/10 -rotate-2" />

            <!-- Main card -->
            <div class="relative h-full rounded-3xl glass overflow-hidden p-8 flex flex-col justify-between">
              <!-- Code decoration -->
              <div class="font-mono text-xs text-dark-600 space-y-1">
                <p><span class="text-primary-400">const</span> developer = {</p>
                <p class="pl-4"><span class="text-emerald-400">name</span>: <span class="text-amber-400">'Jérémy Duc'</span>,</p>
                <p class="pl-4"><span class="text-emerald-400">role</span>: <span class="text-amber-400">'Full-Stack Developer'</span>,</p>
                <p class="pl-4"><span class="text-emerald-400">passion</span>: <span class="text-amber-400">'Building elegant web apps'</span>,</p>
                <p class="pl-4"><span class="text-emerald-400">coffee</span>: <span class="text-amber-400">'always'</span>,</p>
                <p>};</p>
              </div>

              <!-- Stats with counter animation -->
              <div class="grid grid-cols-2 gap-4 mt-8">
                <div v-for="(stat, i) in stats" :key="stat.label" class="text-center p-4 rounded-2xl bg-white/5">
                  <div ref="statValues" class="text-3xl font-display font-bold gradient-text">{{ stat.value }}</div>
                  <div class="text-dark-500 text-sm mt-1">{{ stat.label }}</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Right: Content -->
        <div ref="contentCol" class="opacity-0 translate-y-12">
          <div class="flex items-center gap-3 mb-6">
            <div ref="line" class="h-px w-0 bg-primary-500" />
            <span class="text-primary-400 font-mono text-sm uppercase tracking-wider">À propos</span>
          </div>

          <h2 class="font-display font-bold text-4xl md:text-5xl text-white mb-6 leading-tight">
            Créer des expériences<br />
            <span class="gradient-text">qui marquent</span>
          </h2>

          <div ref="paragraphs" class="space-y-4 text-dark-400 leading-relaxed">
            <p>
              Passionné par le développement web depuis plus de 5 ans, je me spécialise dans la création d'applications web modernes et performantes. Mon approche allie rigueur technique et sens du design.
            </p>
            <p>
              Je maîtrise l'écosystème JavaScript de bout en bout — du frontend avec Vue.js et Nuxt au backend avec Node.js. Je porte une attention particulière à l'expérience utilisateur, aux animations fluides et à l'optimisation des performances.
            </p>
            <p>
              Toujours curieux et en veille technologique, j'aime explorer de nouvelles approches pour repousser les limites du web moderne.
            </p>
          </div>

          <!-- Tags with stagger -->
          <div class="flex flex-wrap gap-2 mt-8">
            <span
              v-for="tag in tags"
              :key="tag"
              ref="tagEls"
              class="px-3 py-1.5 rounded-lg glass text-sm text-dark-300 hover:text-primary-400 hover:border-primary-500/30 transition-all duration-300 opacity-0 translate-y-4"
            >
              {{ tag }}
            </span>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
const sectionRef = ref<HTMLElement | null>(null)
const imageCol = ref<HTMLElement | null>(null)
const contentCol = ref<HTMLElement | null>(null)
const frame1 = ref<HTMLElement | null>(null)
const frame2 = ref<HTMLElement | null>(null)
const line = ref<HTMLElement | null>(null)
const paragraphs = ref<HTMLElement | null>(null)
const statValues = ref<HTMLElement[]>([])
const tagEls = ref<HTMLElement[]>([])

const stats = [
  { value: '5+', label: "Années d'exp." },
  { value: '30+', label: 'Projets réalisés' },
  { value: '10+', label: 'Technologies' },
  { value: '100%', label: 'Passion' },
]

const tags = [
  'Vue.js', 'Nuxt', 'React', 'TypeScript', 'Node.js', 'Hono',
  'PostgreSQL', 'Docker', 'TailwindCSS', 'Git', 'CI/CD', 'REST API',
]

onMounted(() => {
  const { $gsap } = useNuxtApp()
  if (!$gsap) return
  const gsap = $gsap as any

  // Clip-path reveal for left column
  gsap.to(imageCol.value, {
    clipPath: 'inset(0% 0 0 0)',
    duration: 1.2,
    ease: 'power4.inOut',
    scrollTrigger: { trigger: sectionRef.value, start: 'top 70%' },
  })

  // Parallax on frames
  gsap.to(frame1.value, {
    rotation: 0, duration: 1.5, ease: 'power3.out',
    scrollTrigger: { trigger: sectionRef.value, start: 'top 70%' },
  })
  gsap.to(frame2.value, {
    rotation: 0, duration: 1.8, ease: 'power3.out',
    scrollTrigger: { trigger: sectionRef.value, start: 'top 70%' },
  })

  // Right column slide up
  gsap.to(contentCol.value, {
    opacity: 1, y: 0, duration: 1, ease: 'power3.out',
    scrollTrigger: { trigger: contentCol.value, start: 'top 80%' },
  })

  // Line width animation
  gsap.to(line.value, {
    width: 48, duration: 0.8, ease: 'power3.out',
    scrollTrigger: { trigger: contentCol.value, start: 'top 80%' },
  })

  // Paragraphs stagger
  if (paragraphs.value) {
    const ps = paragraphs.value.querySelectorAll('p')
    gsap.fromTo(ps,
      { opacity: 0, y: 20 },
      {
        opacity: 1, y: 0, duration: 0.8, stagger: 0.15, ease: 'power3.out',
        scrollTrigger: { trigger: paragraphs.value, start: 'top 80%' },
      }
    )
  }

  // Tags stagger
  if (tagEls.value?.length) {
    gsap.to(tagEls.value, {
      opacity: 1, y: 0, duration: 0.4, stagger: 0.04, ease: 'power3.out',
      scrollTrigger: { trigger: tagEls.value[0], start: 'top 90%' },
    })
  }
})
</script>
