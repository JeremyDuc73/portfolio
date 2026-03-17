<template>
  <section id="contact" class="relative py-32 overflow-hidden">
    <!-- Background -->
    <div class="absolute bottom-0 left-0 w-[500px] h-[500px] bg-primary-600/10 rounded-full blur-[120px]" />

    <div class="container mx-auto px-6 relative">
      <!-- Section header -->
      <div ref="header" class="text-center mb-16 opacity-0">
        <div class="flex items-center justify-center gap-3 mb-6">
          <div class="h-px w-12 bg-primary-500" />
          <span class="text-primary-400 font-mono text-sm uppercase tracking-wider">Contact</span>
          <div class="h-px w-12 bg-primary-500" />
        </div>
        <h2 class="font-display font-bold text-4xl md:text-5xl text-white mb-4">
          Restons en
          <span class="gradient-text">contact</span>
        </h2>
        <p class="text-dark-400 max-w-xl mx-auto">
          Une question, une remarque ou simplement envie d'échanger ? N'hésitez pas à m'écrire.
        </p>
      </div>

      <div class="grid lg:grid-cols-5 gap-12 max-w-5xl mx-auto">
        <!-- Contact info -->
        <div ref="infoCol" class="lg:col-span-2 space-y-6 opacity-0">
          <div
            v-for="info in contactInfos"
            :key="info.label"
            class="flex items-start gap-4 p-4 rounded-2xl glass glass-hover group"
          >
            <div class="w-12 h-12 rounded-xl bg-primary-500/10 flex items-center justify-center shrink-0 group-hover:bg-primary-500/20 transition-colors duration-300">
              <component :is="info.icon" :size="20" class="text-primary-400" />
            </div>
            <div>
              <p class="text-dark-500 text-sm">{{ info.label }}</p>
              <p class="text-white font-medium">{{ info.value }}</p>
            </div>
          </div>

          <!-- Social links -->
          <div class="flex gap-3 pt-4">
            <a
              v-for="social in socials"
              :key="social.label"
              :href="social.url"
              target="_blank"
              rel="noopener noreferrer"
              class="w-12 h-12 rounded-xl glass glass-hover flex items-center justify-center text-dark-400 hover:text-primary-400 transition-all duration-300"
            >
              <component :is="social.icon" :size="20" />
            </a>
          </div>
        </div>

        <!-- Contact form -->
        <div ref="formCol" class="lg:col-span-3 opacity-0">
          <form class="space-y-5" @submit.prevent="handleSubmit">
            <div class="grid sm:grid-cols-2 gap-5">
              <div>
                <label class="block text-dark-400 text-sm mb-2 font-medium">Nom</label>
                <input
                  v-model="form.name"
                  type="text"
                  placeholder="Votre nom"
                  class="w-full px-4 py-3 rounded-xl glass border border-white/10 bg-transparent text-white placeholder-dark-600 focus:border-primary-500/50 focus:outline-none focus:ring-1 focus:ring-primary-500/25 transition-all duration-300"
                  required
                />
              </div>
              <div>
                <label class="block text-dark-400 text-sm mb-2 font-medium">Email</label>
                <input
                  v-model="form.email"
                  type="email"
                  placeholder="votre@email.com"
                  class="w-full px-4 py-3 rounded-xl glass border border-white/10 bg-transparent text-white placeholder-dark-600 focus:border-primary-500/50 focus:outline-none focus:ring-1 focus:ring-primary-500/25 transition-all duration-300"
                  required
                />
              </div>
            </div>

            <div>
              <label class="block text-dark-400 text-sm mb-2 font-medium">Sujet</label>
              <input
                v-model="form.subject"
                type="text"
                placeholder="Sujet du message"
                class="w-full px-4 py-3 rounded-xl glass border border-white/10 bg-transparent text-white placeholder-dark-600 focus:border-primary-500/50 focus:outline-none focus:ring-1 focus:ring-primary-500/25 transition-all duration-300"
                required
              />
            </div>

            <div>
              <label class="block text-dark-400 text-sm mb-2 font-medium">Message</label>
              <textarea
                v-model="form.message"
                rows="5"
                placeholder="Votre message..."
                class="w-full px-4 py-3 rounded-xl glass border border-white/10 bg-transparent text-white placeholder-dark-600 focus:border-primary-500/50 focus:outline-none focus:ring-1 focus:ring-primary-500/25 transition-all duration-300 resize-none"
                required
              />
            </div>

            <!-- Status message -->
            <div v-if="statusMessage" class="p-4 rounded-xl" :class="statusSuccess ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'">
              {{ statusMessage }}
            </div>

            <button
              type="submit"
              :disabled="sending"
              class="w-full py-4 rounded-xl bg-primary-600 hover:bg-primary-500 text-white font-medium transition-all duration-300 hover:shadow-lg hover:shadow-primary-500/25 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              <Send :size="18" />
              <span>{{ sending ? 'Envoi en cours...' : 'Envoyer le message' }}</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { Mail, MapPin, Github, Linkedin, Send } from 'lucide-vue-next'

const header = ref<HTMLElement | null>(null)
const infoCol = ref<HTMLElement | null>(null)
const formCol = ref<HTMLElement | null>(null)
const sending = ref(false)
const statusMessage = ref('')
const statusSuccess = ref(false)

const form = reactive({
  name: '',
  email: '',
  subject: '',
  message: '',
})

const contactInfos = [
  { label: 'Email', value: 'contact@jeremyduc.dev', icon: Mail },
  { label: 'Localisation', value: 'France', icon: MapPin },
]

const socials = [
  { label: 'GitHub', url: 'https://github.com/jeremyduc', icon: Github },
  { label: 'LinkedIn', url: 'https://linkedin.com/in/jeremyduc', icon: Linkedin },
]

const handleSubmit = async () => {
  sending.value = true
  statusMessage.value = ''

  try {
    const config = useRuntimeConfig()
    const response = await $fetch<{ success: boolean; message: string }>(
      `${config.public.apiUrl}/api/contact`,
      {
        method: 'POST',
        body: form,
      }
    )
    statusMessage.value = response.message || 'Message envoyé avec succès !'
    statusSuccess.value = true
    form.name = ''
    form.email = ''
    form.subject = ''
    form.message = ''
  } catch (error: any) {
    statusMessage.value = 'Une erreur est survenue. Veuillez réessayer.'
    statusSuccess.value = false
  } finally {
    sending.value = false
  }
}

onMounted(() => {
  const { $gsap } = useNuxtApp()
  if (!$gsap) return
  const gsap = $gsap as any

  gsap.fromTo(header.value,
    { opacity: 0, y: 40 },
    {
      opacity: 1, y: 0, duration: 0.8, ease: 'power3.out',
      scrollTrigger: { trigger: header.value, start: 'top 85%' },
    }
  )

  gsap.fromTo(infoCol.value,
    { opacity: 0, x: -40 },
    {
      opacity: 1, x: 0, duration: 0.8, ease: 'power3.out',
      scrollTrigger: { trigger: infoCol.value, start: 'top 85%' },
    }
  )

  gsap.fromTo(formCol.value,
    { opacity: 0, x: 40 },
    {
      opacity: 1, x: 0, duration: 0.8, ease: 'power3.out',
      scrollTrigger: { trigger: formCol.value, start: 'top 85%' },
    }
  )
})
</script>
