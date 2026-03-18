<template>
  <nav
    ref="navbar"
    class="fixed top-0 left-0 right-0 z-50 transition-all duration-500"
    :class="[
      scrolled ? 'py-3 glass border-b border-white/5' : 'py-6',
    ]"
  >
    <div class="container mx-auto px-6 flex items-center justify-between">
      <!-- Logo -->
      <NuxtLink to="/" class="group flex items-center gap-2">
        <div class="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center font-display font-bold text-white text-lg group-hover:scale-110 transition-transform duration-300">
          {{ c('navbar_logo_initials', 'JD') }}
        </div>
        <span class="font-display font-semibold text-white text-lg hidden sm:block">
          {{ c('navbar_logo_text', 'Jérémy') }}<span class="text-primary-400">{{ c('navbar_logo_suffix', '.dev') }}</span>
        </span>
      </NuxtLink>

      <!-- Desktop Menu -->
      <div class="hidden md:flex items-center gap-8">
        <a
          v-for="link in navLinks"
          :key="link.href"
          :href="link.href"
          class="text-sm transition-colors duration-300 line-decoration font-medium"
          :class="activeSection === link.href.slice(1) ? 'text-primary-400 nav-link-active' : 'text-dark-400 hover:text-white'"
          @click.prevent="scrollToSection(link.href)"
        >
          {{ link.label }}
        </a>
      </div>

      <!-- Mobile toggle -->
      <button
        class="md:hidden text-white p-2"
        @click="mobileMenuOpen = !mobileMenuOpen"
      >
        <div class="w-6 h-5 relative flex flex-col justify-between">
          <span
            class="w-full h-0.5 bg-white transition-all duration-300 origin-left"
            :class="{ 'rotate-45 w-[26px]': mobileMenuOpen }"
          />
          <span
            class="w-full h-0.5 bg-white transition-all duration-300"
            :class="{ 'opacity-0 translate-x-4': mobileMenuOpen }"
          />
          <span
            class="w-full h-0.5 bg-white transition-all duration-300 origin-left"
            :class="{ '-rotate-45 w-[26px]': mobileMenuOpen }"
          />
        </div>
      </button>
    </div>

    <!-- Mobile Menu -->
    <Transition
      enter-active-class="transition-all duration-300 ease-out"
      enter-from-class="opacity-0 -translate-y-4"
      enter-to-class="opacity-100 translate-y-0"
      leave-active-class="transition-all duration-200 ease-in"
      leave-from-class="opacity-100 translate-y-0"
      leave-to-class="opacity-0 -translate-y-4"
    >
      <div v-if="mobileMenuOpen" class="md:hidden glass mt-2 mx-4 rounded-2xl p-6">
        <div class="flex flex-col gap-4">
          <a
            v-for="link in navLinks"
            :key="link.href"
            :href="link.href"
            class="text-dark-300 hover:text-white transition-colors duration-300 text-lg font-medium"
            @click.prevent="scrollToSection(link.href); mobileMenuOpen = false"
          >
            {{ link.label }}
          </a>
        </div>
      </div>
    </Transition>
  </nav>
</template>

<script setup lang="ts">
const navbar = ref<HTMLElement | null>(null)
const scrolled = ref(false)
const mobileMenuOpen = ref(false)
const activeSection = ref('hero')

const { c } = usePortfolioData()

const navLinks = [
  { label: 'Accueil', href: '#hero' },
  { label: 'À propos', href: '#about' },
  { label: 'Compétences', href: '#skills' },
  { label: 'Expérience', href: '#experience' },
  { label: 'Projets', href: '#projects' },
]

const scrollToSection = (href: string) => {
  const el = document.querySelector(href)
  if (el) {
    el.scrollIntoView({ behavior: 'smooth' })
  }
}

onMounted(() => {
  window.addEventListener('scroll', () => {
    scrolled.value = window.scrollY > 50
  })

  const sections = document.querySelectorAll('section[id]')
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        activeSection.value = entry.target.id
      }
    })
  }, { rootMargin: '-30% 0px -60% 0px' })

  sections.forEach((section) => observer.observe(section))
})
</script>
