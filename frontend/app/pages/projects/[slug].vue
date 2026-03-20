<template>
  <div class="min-h-screen bg-dark-950 pt-32 pb-20">
    <div class="container mx-auto px-6">
      <div v-if="project" class="max-w-4xl">
        <!-- Project header -->
        <div ref="headerEl" class="mb-10">
          <div class="flex items-center gap-3 mb-4">
            <span v-if="project.featured" class="px-3 py-1 rounded-full bg-primary-500/10 text-primary-400 text-xs font-medium">Featured</span>
          </div>
          <h1 class="font-display font-bold text-4xl md:text-5xl text-white mb-4">{{ project.title }}</h1>
          <p class="text-dark-400 text-lg leading-relaxed max-w-2xl">{{ project.description }}</p>

          <!-- Actions -->
          <div class="flex items-center gap-4 mt-8">
            <a
              v-if="project.demo"
              :href="project.demo"
              target="_blank"
              rel="noopener noreferrer"
              class="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-primary-600 hover:bg-primary-500 text-white font-medium transition-all duration-300 hover:shadow-lg hover:shadow-primary-500/25"
            >
              <ExternalLink :size="18" />
              Voir la démo
            </a>
            <a
              v-if="project.github"
              :href="project.github"
              target="_blank"
              rel="noopener noreferrer"
              class="inline-flex items-center gap-2 px-6 py-3 rounded-xl glass border border-white/10 text-white font-medium hover:border-primary-500/30 hover:text-primary-400 transition-all duration-300"
            >
              <Github :size="18" />
              Code source
            </a>
          </div>
        </div>

        <!-- Project image -->
        <div ref="imageEl" class="mb-12 rounded-2xl overflow-hidden">
          <div class="relative aspect-video bg-dark-900">
            <div class="absolute inset-0 bg-gradient-to-br from-primary-600/20 to-violet-600/20" />
            <img
              v-if="project.image"
              :src="project.image"
              :alt="project.title"
              class="absolute inset-0 w-full h-full object-cover"
              @error="($event.target as HTMLImageElement).style.display = 'none'"
            />
          </div>
        </div>

        <!-- Gallery images -->
        <div v-if="project.images?.length" ref="galleryEl" class="mb-12">
          <h2 class="font-display font-semibold text-xl text-white mb-4 flex items-center gap-3">
            <div class="h-px w-8 bg-primary-500" />
            Galerie
          </h2>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div
              v-for="img in project.images"
              :key="img.id"
              class="group rounded-2xl overflow-hidden bg-dark-900 cursor-pointer"
              @click="openLightbox(img.url)"
            >
              <div class="relative aspect-video">
                <img
                  :src="img.url"
                  :alt="img.caption || project.title"
                  class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  @error="($event.target as HTMLImageElement).style.display = 'none'"
                />
              </div>
              <p v-if="img.caption" class="px-4 py-2 text-dark-400 text-sm">{{ img.caption }}</p>
            </div>
          </div>
        </div>

        <!-- Linked skills -->
        <div v-if="project.skills?.length" ref="skillsEl" class="mb-12">
          <h2 class="font-display font-semibold text-xl text-white mb-4 flex items-center gap-3">
            <div class="h-px w-8 bg-primary-500" />
            Compétences utilisées
          </h2>
          <div class="flex flex-wrap gap-3">
            <NuxtLink
              v-for="skill in project.skills"
              :key="skill.id"
              :to="`/skills/${skill.id}`"
              class="px-4 py-2 rounded-xl glass border border-white/5 text-dark-300 text-sm font-medium hover:border-primary-500/30 hover:text-primary-400 transition-all duration-300"
            >
              {{ skill.name }}
            </NuxtLink>
          </div>
        </div>

        <!-- Technologies -->
        <div v-if="project.tags?.length" ref="techEl" class="mb-12">
          <h2 class="font-display font-semibold text-xl text-white mb-4 flex items-center gap-3">
            <div class="h-px w-8 bg-primary-500" />
            Technologies utilisées
          </h2>
          <div class="flex flex-wrap gap-3">
            <span
              v-for="tag in project.tags"
              :key="tag"
              class="px-4 py-2 rounded-xl glass border border-white/5 text-dark-300 text-sm font-medium hover:border-primary-500/30 hover:text-primary-400 transition-all duration-300"
            >
              {{ tag }}
            </span>
          </div>
        </div>

        <!-- Related projects -->
        <div v-if="relatedProjects.length" ref="relatedEl">
          <h2 class="font-display font-semibold text-xl text-white mb-6 flex items-center gap-3">
            <div class="h-px w-8 bg-primary-500" />
            Autres projets
          </h2>
          <div class="grid md:grid-cols-3 gap-4">
            <NuxtLink
              v-for="rp in relatedProjects"
              :key="rp.slug"
              :to="`/projects/${rp.slug}`"
              class="group p-5 rounded-2xl glass hover:border-primary-500/20 transition-all duration-500"
            >
              <h3 class="font-display font-semibold text-white mb-1 group-hover:text-primary-400 transition-colors">{{ rp.title }}</h3>
              <p class="text-dark-500 text-sm line-clamp-2">{{ rp.description }}</p>
              <div class="flex flex-wrap gap-1.5 mt-3">
                <span v-for="tag in rp.tags?.slice(0, 3)" :key="tag" class="px-2 py-0.5 rounded-md bg-white/5 text-dark-400 text-xs font-mono">{{ tag }}</span>
              </div>
            </NuxtLink>
          </div>
        </div>
      </div>

      <!-- Loading / 404 -->
      <div v-else class="text-center py-32">
        <h2 class="font-display font-bold text-2xl text-white mb-4">Projet introuvable</h2>
        <p class="text-dark-500 mb-6">Ce projet n'existe pas ou a été supprimé.</p>
        <NuxtLink to="/" class="inline-flex items-center gap-2 text-primary-400 hover:text-primary-300 transition-colors">
          &larr; Retour à l'accueil
        </NuxtLink>
      </div>
    </div>

    <!-- Lightbox -->
    <Teleport to="body">
      <Transition name="fade">
        <div v-if="lightboxUrl" class="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex items-center justify-center p-4 cursor-pointer" @click="lightboxUrl = null">
          <img :src="lightboxUrl" class="max-w-full max-h-[90vh] rounded-xl object-contain" @click.stop />
          <button class="absolute top-6 right-6 w-10 h-10 rounded-full bg-white/10 text-white flex items-center justify-center hover:bg-white/20 transition-all" @click="lightboxUrl = null">✕</button>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { Github, ExternalLink } from 'lucide-vue-next'
import type { Project } from '~/composables/usePortfolioData'

const route = useRoute()
const config = useRuntimeConfig()

const { data: project } = await useAsyncData(`project-${route.params.slug}`, () => {
  const url = import.meta.server
    ? (config.apiServerUrl || config.public.apiUrl)
    : config.public.apiUrl
  return $fetch<Project | null>(`${url}/api/projects/${route.params.slug}`)
})

const { projectsData } = usePortfolioData()

const relatedProjects = computed(() => {
  if (!projectsData.value?.length || !project.value) return []
  return projectsData.value
    .filter(p => p.slug !== project.value?.slug)
    .slice(0, 3)
})

useHead({
  title: computed(() => project.value ? `${project.value.title} — Jérémy Duc` : 'Projet'),
})

const headerEl = ref<HTMLElement | null>(null)
const imageEl = ref<HTMLElement | null>(null)
const galleryEl = ref<HTMLElement | null>(null)
const skillsEl = ref<HTMLElement | null>(null)
const techEl = ref<HTMLElement | null>(null)
const relatedEl = ref<HTMLElement | null>(null)
const lightboxUrl = ref<string | null>(null)

function openLightbox(url: string) {
  lightboxUrl.value = url
}

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

    if (imageEl.value) {
      gsap.fromTo(imageEl.value,
        { opacity: 0, y: 20, scale: 0.98 },
        { opacity: 1, y: 0, scale: 1, duration: 0.9, ease: 'power3.out', delay: 0.15 }
      )
    }

    if (galleryEl.value) {
      gsap.fromTo(galleryEl.value,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out', delay: 0.25 }
      )
    }

    if (skillsEl.value) {
      gsap.fromTo(skillsEl.value,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out', delay: 0.3 }
      )
    }

    if (techEl.value) {
      gsap.fromTo(techEl.value,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out', delay: 0.35 }
      )
    }

    if (relatedEl.value) {
      gsap.fromTo(relatedEl.value,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out', delay: 0.45 }
      )
    }
  })
})
</script>
