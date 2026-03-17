export default defineNuxtRouteMiddleware(async (to) => {
  // Skip maintenance check for admin page and maintenance page itself
  if (to.path.startsWith('/admin') || to.path === '/maintenance') return

  // Only check on client side
  if (import.meta.server) return

  try {
    const config = useRuntimeConfig()
    const apiUrl = config.public.apiBrowserUrl || 'http://localhost:11501'
    const res = await $fetch<{ maintenance_mode: number }>(`${apiUrl}/api/maintenance`)

    if (res.maintenance_mode) {
      return navigateTo('/maintenance')
    }
  } catch {
    // If API is down, don't block navigation
  }
})
