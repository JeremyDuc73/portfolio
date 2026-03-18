<template>
  <div class="min-h-screen bg-dark-950 pt-32 pb-20">
    <div class="container mx-auto px-6">
      <!-- Back link -->
      <NuxtLink to="/#skills" class="inline-flex items-center gap-2 text-dark-400 hover:text-primary-400 transition-colors mb-10 group">
        <ArrowLeft :size="18" class="group-hover:-translate-x-1 transition-transform" />
        <span class="text-sm">Retour aux compétences</span>
      </NuxtLink>

      <div v-if="skill" class="max-w-4xl">
        <!-- Skill header -->
        <div ref="headerEl" class="mb-12">
          <div class="flex items-center gap-4 mb-4">
            <div class="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary-500/20 to-violet-600/20 border border-primary-500/20 flex items-center justify-center">
              <component :is="categoryIcon" :size="28" class="text-primary-400" />
            </div>
            <div>
              <span class="text-primary-400 font-mono text-xs uppercase tracking-wider">{{ skill.category }}</span>
              <h1 class="font-display font-bold text-4xl md:text-5xl text-white">{{ skill.name }}</h1>
            </div>
          </div>

          <p v-if="skill.description" class="text-dark-400 text-lg leading-relaxed mt-6 max-w-2xl">
            {{ skill.description }}
          </p>
        </div>

        <!-- Related projects -->
        <div v-if="skill.projects?.length" ref="projectsEl">
          <h2 class="font-display font-semibold text-2xl text-white mb-6 flex items-center gap-3">
            <div class="h-px w-8 bg-primary-500" />
            Projets réalisés avec {{ skill.name }}
          </h2>

          <div class="grid md:grid-cols-2 gap-6">
            <NuxtLink
              v-for="project in skill.projects"
              :key="project.slug"
              :to="`/projects/${project.slug}`"
              ref="projectCards"
              class="group rounded-2xl glass overflow-hidden hover:border-primary-500/20 transition-all duration-500"
            >
              <!-- Project image -->
              <div class="relative h-44 overflow-hidden">
                <div class="absolute inset-0 bg-gradient-to-br from-primary-600/20 to-violet-600/20" />
                <img
                  v-if="project.image"
                  :src="project.image"
                  :alt="project.title"
                  class="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  @error="($event.target as HTMLImageElement).style.display = 'none'"
                />
                <div class="absolute inset-0 bg-dark-950/40" />
              </div>

              <!-- Content -->
              <div class="p-5">
                <h3 class="font-display font-semibold text-lg text-white mb-2 group-hover:text-primary-400 transition-colors">
                  {{ project.title }}
                </h3>
                <p class="text-dark-500 text-sm mb-3 line-clamp-2">{{ project.description }}</p>
                <div class="flex flex-wrap gap-1.5">
                  <span
                    v-for="tag in project.tags?.slice(0, 5)"
                    :key="tag"
                    class="px-2 py-0.5 rounded-md bg-white/5 text-dark-400 text-xs font-mono"
                  >
                    {{ tag }}
                  </span>
                </div>
              </div>
            </NuxtLink>
          </div>
        </div>

        <!-- No projects -->
        <div v-else-if="skill" class="text-center py-16">
          <p class="text-dark-500">Aucun projet associé pour le moment.</p>
        </div>
      </div>

      <!-- Loading / 404 -->
      <div v-else class="text-center py-32">
        <p class="text-dark-500">Chargement...</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Monitor, Server, Container, ArrowLeft } from 'lucide-vue-next'

const route = useRoute()
const config = useRuntimeConfig()
const apiUrl = config.public.apiUrl

const { data: skill } = await useFetch<any>(`${apiUrl}/api/skills/${route.params.id}`, {
  key: `skill-${route.params.id}`,
})

const categoryIcons: Record<string, any> = {
  Frontend: Monitor,
  Backend: Server,
  DevOps: Container,
}

const categoryIcon = computed(() => categoryIcons[skill.value?.category] || Monitor)

useHead({
  title: computed(() => skill.value ? `${skill.value.name} — Jérémy Duc` : 'Compétence'),
})

const headerEl = ref<HTMLElement | null>(null)
const projectsEl = ref<HTMLElement | null>(null)
const projectCards = ref<any[]>([])

onMounted(() => {
  const { $gsap } = useNuxtApp()
  if (!$gsap) return
  const gsap = $gsap as any

  nextTick(() => {
    if (headerEl.value) {
      gsap.fromTo(headerEl.value,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' }
      )
    }

    if (projectsEl.value) {
      gsap.fromTo(projectsEl.value,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out', delay: 0.2 }
      )
    }

    const cardEls = projectCards.value?.map((c: any) => c?.$el || c).filter(Boolean)
    if (cardEls?.length) {
      gsap.fromTo(cardEls,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.6, stagger: 0.1, ease: 'power3.out', delay: 0.4 }
      )
    }
  })
})
</script>
