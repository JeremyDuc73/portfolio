<template>
  <div class="min-h-screen relative">
    <SnakeTrail />
    <TheNavbar />
    <main class="relative z-[2]">
      <slot />
    </main>
    <TheFooter class="relative z-[2]" />
  </div>
</template>
