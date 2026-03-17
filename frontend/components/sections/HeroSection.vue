<template>
  <section id="hero" class="relative min-h-screen flex items-center justify-center overflow-hidden">
    <!-- Interactive particle canvas -->
    <canvas ref="particleCanvas" class="absolute inset-0 w-full h-full" />

    <!-- Noise grain overlay -->
    <div class="absolute inset-0 pointer-events-none opacity-[0.03]" style="background-image: url('data:image/svg+xml,%3Csvg viewBox=%220 0 256 256%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22n%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.9%22 numOctaves=%224%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23n)%22/%3E%3C/svg%3E'); background-repeat: repeat; background-size: 256px;" />

    <!-- Grid pattern with perspective -->
    <div class="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.015)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.015)_1px,transparent_1px)] bg-[size:72px_72px]" style="mask-image: radial-gradient(ellipse 70% 50% at 50% 50%, black, transparent);" />

    <div class="relative container mx-auto px-6 text-center z-10">
      <!-- Scramble badge -->
      <div ref="badge" class="inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-8 opacity-0 translate-y-4">
        <span class="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
        <span ref="badgeText" class="text-sm text-dark-300 font-mono" />
      </div>

      <!-- Main heading with character split -->
      <h1 ref="heading" class="font-display font-bold text-5xl sm:text-6xl md:text-7xl lg:text-8xl text-white leading-tight mb-6">
        <span class="sr-only">Jérémy Duc</span>
        <span aria-hidden="true" class="inline-block overflow-hidden pb-3">
          <span ref="firstName" class="inline-block" />
        </span>
        <br class="sm:hidden" />
        <span aria-hidden="true" class="inline-block overflow-hidden pb-3">
          <span ref="lastName" class="inline-block gradient-text" />
        </span>
      </h1>

      <!-- Subtitle typed char by char -->
      <div ref="subtitle" class="text-xl sm:text-2xl md:text-3xl text-dark-400 font-light mb-4 h-10 opacity-0">
        <span class="font-mono text-primary-400">&lt;</span>
        <span ref="subtitleText" class="inline-block" />
        <span ref="cursor" class="inline-block w-[2px] h-[1em] bg-primary-400 ml-1 align-middle" />
        <span class="font-mono text-primary-400">/&gt;</span>
      </div>

      <!-- Description with staggered word reveal -->
      <p ref="description" class="text-dark-500 text-lg max-w-2xl mx-auto mb-12 opacity-0">
        <span v-for="(word, i) in descriptionWords" :key="i" ref="descWords" class="inline-block mr-[0.3em] translate-y-8 opacity-0">{{ word }}</span>
      </p>

      <!-- Magnetic CTA Buttons -->
      <div ref="ctas" class="flex flex-col sm:flex-row items-center justify-center gap-4 opacity-0">
        <a
          href="#projects"
          ref="ctaPrimary"
          class="magnetic group px-8 py-4 rounded-2xl bg-primary-600 hover:bg-primary-500 text-white font-medium transition-colors duration-300 hover:shadow-2xl hover:shadow-primary-500/25 flex items-center gap-2"
          @click.prevent="scrollTo('#projects')"
        >
          <span class="relative z-10">Voir mes projets</span>
          <svg class="w-4 h-4 relative z-10 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
          </svg>
        </a>
        <a
          href="#about"
          ref="ctaSecondary"
          class="magnetic px-8 py-4 rounded-2xl glass glass-hover text-white font-medium"
          @click.prevent="scrollTo('#about')"
        >
          <span class="relative z-10">En savoir plus</span>
        </a>
      </div>

    </div>

    <!-- Scroll indicator (outside content to avoid overlap) -->
    <div ref="scrollIndicator" class="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-0 z-10">
      <span class="text-dark-600 text-xs uppercase tracking-widest font-mono">Scroll</span>
      <div class="w-6 h-10 rounded-full border-2 border-dark-700 flex items-start justify-center p-1.5">
        <div class="w-1.5 h-1.5 rounded-full bg-primary-400 animate-bounce" />
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
const particleCanvas = ref<HTMLCanvasElement | null>(null)
const badge = ref<HTMLElement | null>(null)
const badgeText = ref<HTMLElement | null>(null)
const firstName = ref<HTMLElement | null>(null)
const lastName = ref<HTMLElement | null>(null)
const subtitle = ref<HTMLElement | null>(null)
const subtitleText = ref<HTMLElement | null>(null)
const cursor = ref<HTMLElement | null>(null)
const description = ref<HTMLElement | null>(null)
const descWords = ref<HTMLElement[]>([])
const ctas = ref<HTMLElement | null>(null)
const ctaPrimary = ref<HTMLElement | null>(null)
const ctaSecondary = ref<HTMLElement | null>(null)
const scrollIndicator = ref<HTMLElement | null>(null)

const descriptionWords = 'Je conçois des expériences web modernes, performantes et élégantes. Chaque ligne de code est pensée pour impressionner.'.split(' ')

const scrollTo = (selector: string) => {
  document.querySelector(selector)?.scrollIntoView({ behavior: 'smooth' })
}

// Text scramble effect
function scrambleText(el: HTMLElement, finalText: string, duration = 800) {
  const chars = '!<>-_\\/[]{}—=+*^?#________'
  let frame = 0
  const totalFrames = Math.ceil(duration / 16)

  return new Promise<void>((resolve) => {
    const update = () => {
      const progress = frame / totalFrames
      let output = ''
      for (let i = 0; i < finalText.length; i++) {
        if (i < finalText.length * progress) {
          output += finalText[i]
        } else {
          output += chars[Math.floor(Math.random() * chars.length)]
        }
      }
      el.textContent = output
      frame++
      if (frame <= totalFrames) {
        requestAnimationFrame(update)
      } else {
        el.textContent = finalText
        resolve()
      }
    }
    update()
  })
}

// Typing effect
function typeText(el: HTMLElement, text: string, speed = 50) {
  let i = 0
  return new Promise<void>((resolve) => {
    const type = () => {
      if (i < text.length) {
        el.textContent = text.slice(0, i + 1)
        i++
        setTimeout(type, speed + Math.random() * 30)
      } else {
        resolve()
      }
    }
    type()
  })
}

// Particle system
function initParticles(canvas: HTMLCanvasElement) {
  const ctx = canvas.getContext('2d')!
  let width = canvas.width = window.innerWidth
  let height = canvas.height = window.innerHeight
  let mouseX = width / 2
  let mouseY = height / 2
  let animId: number

  const PARTICLE_COUNT = Math.min(120, Math.floor((width * height) / 12000))
  const CONNECTION_DIST = 150
  const MOUSE_RADIUS = 200

  interface Particle {
    x: number; y: number; vx: number; vy: number;
    baseX: number; baseY: number; size: number; alpha: number
  }

  const particles: Particle[] = []
  for (let i = 0; i < PARTICLE_COUNT; i++) {
    const x = Math.random() * width
    const y = Math.random() * height
    particles.push({
      x, y, baseX: x, baseY: y,
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.3,
      size: Math.random() * 1.5 + 0.5,
      alpha: Math.random() * 0.5 + 0.1,
    })
  }

  const draw = () => {
    ctx.clearRect(0, 0, width, height)

    for (let i = 0; i < particles.length; i++) {
      const p = particles[i]

      // Mouse repulsion
      const dx = mouseX - p.x
      const dy = mouseY - p.y
      const dist = Math.sqrt(dx * dx + dy * dy)

      if (dist < MOUSE_RADIUS) {
        const force = (MOUSE_RADIUS - dist) / MOUSE_RADIUS
        p.vx -= (dx / dist) * force * 0.8
        p.vy -= (dy / dist) * force * 0.8
      }

      // Drift back to base
      p.vx += (p.baseX - p.x) * 0.001
      p.vy += (p.baseY - p.y) * 0.001

      // Damping
      p.vx *= 0.98
      p.vy *= 0.98

      p.x += p.vx
      p.y += p.vy

      // Draw particle
      ctx.beginPath()
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
      ctx.fillStyle = `rgba(139, 92, 246, ${p.alpha})`
      ctx.fill()

      // Draw connections
      for (let j = i + 1; j < particles.length; j++) {
        const p2 = particles[j]
        const cdx = p.x - p2.x
        const cdy = p.y - p2.y
        const cdist = Math.sqrt(cdx * cdx + cdy * cdy)

        if (cdist < CONNECTION_DIST) {
          ctx.beginPath()
          ctx.moveTo(p.x, p.y)
          ctx.lineTo(p2.x, p2.y)
          const lineAlpha = (1 - cdist / CONNECTION_DIST) * 0.15
          ctx.strokeStyle = `rgba(139, 92, 246, ${lineAlpha})`
          ctx.lineWidth = 0.5
          ctx.stroke()
        }
      }
    }

    animId = requestAnimationFrame(draw)
  }

  const onMouseMove = (e: MouseEvent) => {
    mouseX = e.clientX
    mouseY = e.clientY
  }

  const onResize = () => {
    width = canvas.width = window.innerWidth
    height = canvas.height = window.innerHeight
  }

  window.addEventListener('mousemove', onMouseMove)
  window.addEventListener('resize', onResize)
  draw()

  return () => {
    cancelAnimationFrame(animId)
    window.removeEventListener('mousemove', onMouseMove)
    window.removeEventListener('resize', onResize)
  }
}

// Magnetic button effect
function initMagnetic(el: HTMLElement) {
  const onMove = (e: MouseEvent) => {
    const rect = el.getBoundingClientRect()
    const x = e.clientX - rect.left - rect.width / 2
    const y = e.clientY - rect.top - rect.height / 2
    el.style.transform = `translate(${x * 0.3}px, ${y * 0.3}px)`
  }
  const onLeave = () => {
    el.style.transform = 'translate(0, 0)'
    el.style.transition = 'transform 0.5s cubic-bezier(0.33, 1, 0.68, 1)'
    setTimeout(() => { el.style.transition = '' }, 500)
  }
  el.addEventListener('mousemove', onMove)
  el.addEventListener('mouseleave', onLeave)
}

onMounted(async () => {
  const { $gsap } = useNuxtApp()
  if (!$gsap) return
  const gsap = $gsap as any

  // Init particle canvas
  let cleanupParticles: (() => void) | null = null
  if (particleCanvas.value) {
    cleanupParticles = initParticles(particleCanvas.value)
  }

  // Init magnetic buttons
  if (ctaPrimary.value) initMagnetic(ctaPrimary.value)
  if (ctaSecondary.value) initMagnetic(ctaSecondary.value)

  // Blinking cursor
  if (cursor.value) {
    gsap.to(cursor.value, { opacity: 0, duration: 0.5, repeat: -1, yoyo: true, ease: 'steps(1)' })
  }

  // Staggered intro sequence
  await new Promise(r => setTimeout(r, 400))

  // Badge fade in + scramble
  if (badge.value) {
    gsap.to(badge.value, { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' })
  }
  if (badgeText.value) {
    await scrambleText(badgeText.value, 'Développeur Web Full-Stack', 600)
  }

  // Name reveal — slide up from below with clip
  if (firstName.value) {
    firstName.value.textContent = ''
    gsap.set(firstName.value, { y: 120 })
    firstName.value.textContent = 'Jérémy '
    gsap.to(firstName.value, { y: 0, duration: 1, ease: 'expo.out' })
  }

  await new Promise(r => setTimeout(r, 150))

  if (lastName.value) {
    lastName.value.textContent = ''
    gsap.set(lastName.value, { y: 120 })
    lastName.value.textContent = 'Duc'
    gsap.to(lastName.value, { y: 0, duration: 1, ease: 'expo.out' })
  }

  await new Promise(r => setTimeout(r, 400))

  // Subtitle typing
  if (subtitle.value) {
    gsap.to(subtitle.value, { opacity: 1, duration: 0.3 })
  }
  if (subtitleText.value) {
    await typeText(subtitleText.value, 'Développeur Web Full-Stack', 40)
  }

  // Description words stagger
  if (description.value) {
    gsap.to(description.value, { opacity: 1, duration: 0.3 })
  }
  if (descWords.value?.length) {
    gsap.to(descWords.value, {
      y: 0, opacity: 1, duration: 0.6, stagger: 0.03, ease: 'power3.out',
    })
  }

  await new Promise(r => setTimeout(r, 300))

  // CTAs
  if (ctas.value) {
    gsap.to(ctas.value, { opacity: 1, duration: 0.8, ease: 'power3.out' })
  }

  // Scroll indicator
  if (scrollIndicator.value) {
    gsap.to(scrollIndicator.value, { opacity: 1, duration: 1, delay: 0.5 })
  }
})
</script>
