<template>
  <footer class="relative border-t border-white/5 py-12">
    <div class="container mx-auto px-6">
      <div class="flex flex-col md:flex-row items-center justify-between gap-6">
        <div class="flex items-center gap-3">
          <div class="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center font-display font-bold text-white text-sm">
            JD
          </div>
          <span class="text-dark-400 text-sm">
            &copy; {{ new Date().getFullYear() }} Jérémy Duc. Tous droits réservés.
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
          <span>Fait avec</span>
          <svg class="w-4 h-4 text-red-500 animate-pulse" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clip-rule="evenodd" />
          </svg>
          <span>par Jérémy Duc</span>
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
import { Github, Linkedin, Mail } from 'lucide-vue-next'

const socials = [
  { label: 'GitHub', url: 'https://github.com/jeremyduc', icon: Github },
  { label: 'LinkedIn', url: 'https://linkedin.com/in/jeremyduc', icon: Linkedin },
  { label: 'Email', url: 'mailto:contact@jeremyduc.dev', icon: Mail },
]
</script>
