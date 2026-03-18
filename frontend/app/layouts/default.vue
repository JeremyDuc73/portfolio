<template>
  <div class="min-h-screen relative">
    <SnakeTrail v-if="isHome" />
    <TheNavbar v-if="isHome" />
    <TheDetailNavbar v-else />
    <main class="relative z-[2]">
      <slot />
    </main>
    <TheFooter class="relative z-[2]" />
  </div>
</template>

<script setup lang="ts">
const route = useRoute()
const isHome = computed(() => route.path === '/')
</script>
