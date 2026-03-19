export default defineNuxtRouteMiddleware(async (to) => {
  // Skip maintenance check for admin page and maintenance page itself
  if (to.path.startsWith('/admin') || to.path === '/maintenance') return

  try {
    const config = useRuntimeConfig()
    // Server-side uses internal Docker URL, client uses public URL
    const apiUrl = import.meta.server
      ? (config.apiServerUrl || config.public.apiUrl)
      : config.public.apiUrl
    const res = await $fetch<{ maintenance_mode: number }>(`${apiUrl}/api/maintenance`)

    if (res.maintenance_mode) {
      return navigateTo('/maintenance')
    }
  } catch {
    // If API is down, don't block navigation
  }
})
