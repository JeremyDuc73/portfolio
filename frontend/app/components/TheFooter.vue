<template>
  <footer class="relative border-t border-white/5 py-12">
    <div class="container mx-auto px-6">
      <div class="flex flex-col md:flex-row items-center justify-between gap-6">
        <div class="flex items-center gap-3">
          <div class="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center font-display font-bold text-white text-sm">
            {{ c('navbar_logo_initials', 'JD') }}
          </div>
          <span class="text-dark-400 text-sm">
            &copy; {{ new Date().getFullYear() }} {{ c('footer_copyright_name', 'Jérémy Duc') }}. Tous droits réservés.
          </span>
        </div>

        <div class="flex items-center gap-6">
          <a
            v-for="social in socials"
            :key="social.label"
            :href="social.url"
            target="_blank"
            rel="noopener noreferrer"
            class="text-dark-500 hover:text-primary-400 transition-colors duration-300"
            :aria-label="social.label"
          >
            <component :is="social.icon" :size="20" />
          </a>
        </div>

        <div class="flex items-center gap-1 text-dark-500 text-sm">
          <span>Développé par {{ c('footer_made_by', 'Jérémy Duc') }}</span>
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
import { Github, Linkedin, Mail } from 'lucide-vue-next'

const { aboutData, c } = usePortfolioData()

const socials = computed(() => [
  { label: 'GitHub', url: aboutData.value?.socials?.github || 'https://github.com/jeremyduc', icon: Github },
  { label: 'LinkedIn', url: aboutData.value?.socials?.linkedin || 'https://linkedin.com/in/jeremyduc', icon: Linkedin },
  { label: 'Email', url: `mailto:${aboutData.value?.email || 'contact@jeremyduc.dev'}`, icon: Mail },
])
</script>
