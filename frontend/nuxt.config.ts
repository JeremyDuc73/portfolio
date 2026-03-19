import tailwindcss from '@tailwindcss/vite'

export default defineNuxtConfig({
  devtools: { enabled: process.env.NODE_ENV === 'development' },

  modules: [
    '@nuxtjs/color-mode',
    '@vueuse/nuxt',
    '@nuxt/fonts',
    '@nuxt/eslint',
  ],

  vite: {
    plugins: [
      tailwindcss(),
    ],
    optimizeDeps: {
      include: [
        'gsap',
        'gsap/ScrollTrigger',
        'lenis',
        'lucide-vue-next',
        'simplex-noise',
        '@vue/devtools-core',
        '@vue/devtools-kit',
      ],
    },
  },

  colorMode: {
    classSuffix: '',
    preference: 'dark',
    fallback: 'dark',
  },

  fonts: {
    families: [
      { name: 'Inter', provider: 'google', weights: [300, 400, 500, 600, 700, 800, 900] },
      { name: 'Space Grotesk', provider: 'google', weights: [300, 400, 500, 600, 700] },
      { name: 'JetBrains Mono', provider: 'google', weights: [400, 500, 600, 700] },
    ],
  },

  runtimeConfig: {
    apiServerUrl: process.env.NUXT_API_SERVER_URL || 'http://localhost:11501',
    public: {
      apiUrl: process.env.NUXT_PUBLIC_API_URL || 'http://localhost:11501',
    },
  },

  app: {
    head: {
      title: 'Jérémy Duc - Développeur Web Full-Stack',
      htmlAttrs: { lang: 'fr' },
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: 'Portfolio de Jérémy Duc, développeur web full-stack passionné par les technologies modernes et le design élégant.' },
        { name: 'theme-color', content: '#0a0a0a' },
        { property: 'og:title', content: 'Jérémy Duc - Développeur Web Full-Stack' },
        { property: 'og:description', content: 'Portfolio de Jérémy Duc, développeur web full-stack.' },
        { property: 'og:type', content: 'website' },
      ],
      link: [
        { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' },
      ],
    },
    pageTransition: { name: 'page', mode: 'out-in' },
  },

  css: ['~/assets/css/main.css'],

  compatibilityDate: '2025-07-15',
})
