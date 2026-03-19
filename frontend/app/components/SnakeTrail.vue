<template>
  <div ref="snakeContainer" class="snake-container" aria-hidden="true" />
</template>

<script setup lang="ts">
import { createNoise2D } from 'simplex-noise'

const snakeContainer = ref<HTMLElement | null>(null)

onMounted(() => {
  const { $gsap } = useNuxtApp()
  if (!$gsap || !snakeContainer.value) return
  const gsap = $gsap as any

  const container = snakeContainer.value
  const noise2D = createNoise2D()
  const isMobile = window.innerWidth < 768
  const count = isMobile ? 2000 : 4000

  // Wait for full page render to get accurate height
  setTimeout(() => {
    const pageHeight = Math.max(
      document.documentElement.scrollHeight,
      document.body.scrollHeight
    )
    const totalHeight = pageHeight + window.innerHeight * 0.5
    const spacing = totalHeight / count
    const initialVisible = Math.round((window.innerHeight * 1.02) / spacing)

    const fragment = document.createDocumentFragment()

    for (let i = 0; i < count; i++) {
      const div = document.createElement('div')
      div.className = 'snake-circle'
      const n1 = noise2D(i * 0.003, i * 0.0033)
      const n2 = noise2D(i * 0.002, i * 0.001)

      const y = i * spacing
      const x = n2 * (isMobile ? 100 : 200)
      div.style.position = 'absolute'
      div.style.top = y + 'px'
      div.style.left = '50%'
      div.style.transform = `translate(${x}px, 0) rotate(${n2 * 270}deg) scale(${3 + n1 * 2}, ${3 + n2 * 2})`

      const hue = 240 + Math.abs(noise2D(i * 0.005, 0)) * 35
      div.style.boxShadow = `0 0 0 .2px hsla(${Math.floor(hue)}, 40%, 55%, .25)`

      fragment.appendChild(div)
    }

    container.appendChild(fragment)

    const allCircles = Array.from(container.querySelectorAll('.snake-circle'))

    // Intro animation: first 800 circles appear progressively on page load
    const introCircles = allCircles.slice(0, initialVisible)
    gsap.to(introCircles, {
      opacity: 0.6,
      stagger: {
        each: 0.003,
      },
      duration: 0.05,
      ease: 'none',
    })

    // Scroll-driven animation for the rest
    const hidden = allCircles.slice(initialVisible)
    const remaining = hidden.length

    gsap.to(hidden, {
      opacity: 0.6,
      stagger: {
        each: 1 / remaining,
      },
      duration: 1 / remaining,
      ease: 'none',
      scrollTrigger: {
        trigger: document.body,
        start: 'top top',
        end: 'bottom bottom',
        scrub: 2.5,
      },
    })

    // Recalculate on resize
    window.addEventListener('resize', () => {
      const newH = Math.max(
        document.documentElement.scrollHeight,
        document.body.scrollHeight
      )
      const newSpacing = newH / count
      const all = container.querySelectorAll('.snake-circle')
      all.forEach((c: HTMLElement, idx: number) => {
        c.style.top = (idx * newSpacing) + 'px'
      })
    })
  }, 1000)
})
</script>

<style>
.snake-container {
  position: absolute;
  top: -150px;
  left: 0;
  width: 100%;
  z-index: 1;
  pointer-events: none;
}

.snake-circle {
  width: 20px;
  height: 20px;
  border-radius: 40%;
  opacity: 0;
}
</style>
