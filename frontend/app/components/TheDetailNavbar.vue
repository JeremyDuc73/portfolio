<template>
  <nav
    class="fixed top-0 left-0 right-0 z-50 py-3 glass border-b border-white/5 transition-all duration-500"
  >
    <div class="container mx-auto px-6 flex items-center justify-between">
      <!-- Back to home -->
      <NuxtLink to="/" class="group flex items-center gap-3">
        <div class="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center font-display font-bold text-white text-lg group-hover:scale-110 transition-transform duration-300">
          {{ c('navbar_logo_initials', 'JD') }}
        </div>
        <span class="font-display font-semibold text-white text-lg hidden sm:block">
          {{ c('navbar_logo_text', 'Jérémy') }}<span class="text-primary-400">{{ c('navbar_logo_suffix', '.dev') }}</span>
        </span>
      </NuxtLink>

      <!-- Back link -->
      <NuxtLink to="/" class="flex items-center gap-2 text-dark-400 hover:text-primary-400 transition-colors group">
        <ArrowLeft :size="18" class="group-hover:-translate-x-1 transition-transform" />
        <span class="text-sm font-medium">Retour à l'accueil</span>
      </NuxtLink>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { ArrowLeft } from 'lucide-vue-next'

const { c } = usePortfolioData()
</script>
