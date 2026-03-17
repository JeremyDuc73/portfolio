<template>
  <div v-if="!isHidden" class="pointer-events-none fixed inset-0 z-[9999]">
    <div ref="cursorDot" class="cursor-dot" />
    <div ref="cursorOutline" class="cursor-outline" />
    <div ref="cursorLabel" class="cursor-label" />
  </div>
</template>

<script setup lang="ts">
const route = useRoute()
const cursorDot = ref<HTMLElement | null>(null)
const cursorOutline = ref<HTMLElement | null>(null)
const cursorLabel = ref<HTMLElement | null>(null)
const isHidden = ref(true)

onMounted(() => {
  const isMobile = window.innerWidth < 768 || !window.matchMedia('(hover: hover)').matches
  const isAdmin = route.path.startsWith('/admin')
  isHidden.value = isMobile || isAdmin
  if (isHidden.value) return

  const pos = { x: window.innerWidth / 2, y: window.innerHeight / 2 }
  const mouse = { x: pos.x, y: pos.y }
  const outlinePos = { x: pos.x, y: pos.y }
  let isHovering = false
  let isPressed = false
  let currentLabel = ''
  let animId: number

  const lerp = (a: number, b: number, t: number) => a + (b - a) * t

  const loop = () => {
    // Dot follows mouse instantly
    if (cursorDot.value) {
      cursorDot.value.style.transform = `translate(${mouse.x - 4}px, ${mouse.y - 4}px)`
    }

    // Outline trails behind with lerp
    outlinePos.x = lerp(outlinePos.x, mouse.x, 0.12)
    outlinePos.y = lerp(outlinePos.y, mouse.y, 0.12)

    if (cursorOutline.value) {
      const scale = isPressed ? 0.75 : isHovering ? 1.8 : 1
      cursorOutline.value.style.transform = `translate(${outlinePos.x - 20}px, ${outlinePos.y - 20}px) scale(${scale})`
    }

    if (cursorLabel.value) {
      cursorLabel.value.style.transform = `translate(${outlinePos.x + 24}px, ${outlinePos.y - 8}px)`
    }

    animId = requestAnimationFrame(loop)
  }

  document.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX
    mouse.y = e.clientY
  })

  document.addEventListener('mousedown', () => { isPressed = true })
  document.addEventListener('mouseup', () => { isPressed = false })

  // Watch for interactive elements with MutationObserver for dynamic content
  const setupInteractive = () => {
    document.querySelectorAll('a, button, .magnetic, [data-cursor]').forEach((el) => {
      if ((el as any).__cursorBound) return
      ;(el as any).__cursorBound = true

      el.addEventListener('mouseenter', () => {
        isHovering = true
        if (cursorOutline.value) {
          cursorOutline.value.style.borderColor = 'rgba(139, 92, 246, 0.6)'
          cursorOutline.value.style.background = 'rgba(139, 92, 246, 0.05)'
        }
        if (cursorDot.value) {
          cursorDot.value.style.opacity = '0'
        }
        const label = (el as HTMLElement).dataset.cursor || ''
        if (label && cursorLabel.value) {
          currentLabel = label
          cursorLabel.value.textContent = label
          cursorLabel.value.style.opacity = '1'
        }
      })

      el.addEventListener('mouseleave', () => {
        isHovering = false
        if (cursorOutline.value) {
          cursorOutline.value.style.borderColor = 'rgba(139, 92, 246, 0.4)'
          cursorOutline.value.style.background = 'transparent'
        }
        if (cursorDot.value) {
          cursorDot.value.style.opacity = '1'
        }
        if (cursorLabel.value) {
          currentLabel = ''
          cursorLabel.value.style.opacity = '0'
        }
      })
    })
  }

  setupInteractive()
  const observer = new MutationObserver(() => setupInteractive())
  observer.observe(document.body, { childList: true, subtree: true })

  loop()
})
</script>

<style>
.cursor-dot {
  position: fixed;
  top: 0;
  left: 0;
  width: 8px;
  height: 8px;
  background: rgb(139, 92, 246);
  border-radius: 50%;
  pointer-events: none;
  z-index: 99999;
  transition: opacity 0.2s;
  will-change: transform;
}

.cursor-outline {
  position: fixed;
  top: 0;
  left: 0;
  width: 40px;
  height: 40px;
  border: 1.5px solid rgba(139, 92, 246, 0.4);
  border-radius: 50%;
  pointer-events: none;
  z-index: 99998;
  transition: border-color 0.3s, background 0.3s, transform 0.15s cubic-bezier(0.33, 1, 0.68, 1);
  will-change: transform;
}

.cursor-label {
  position: fixed;
  top: 0;
  left: 0;
  font-size: 11px;
  font-family: monospace;
  color: rgba(139, 92, 246, 0.8);
  letter-spacing: 0.05em;
  text-transform: uppercase;
  pointer-events: none;
  z-index: 99999;
  opacity: 0;
  transition: opacity 0.2s;
  white-space: nowrap;
  will-change: transform;
}

/* Hide system cursor */
* {
  cursor: none !important;
}

@media (max-width: 767px), (hover: none) {
  * {
    cursor: auto !important;
  }
}
</style>
