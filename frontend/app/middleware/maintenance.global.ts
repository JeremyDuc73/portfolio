export default defineNuxtRouteMiddleware(async (to) => {
  // Skip maintenance check for admin page
  if (to.path.startsWith('/admin')) return

  try {
    const config = useRuntimeConfig()
    // Server-side uses internal Docker URL, client uses public URL
    const apiUrl = import.meta.server
      ? (config.apiServerUrl || config.public.apiUrl)
      : config.public.apiUrl
    const res = await $fetch<{ maintenance_mode: number }>(`${apiUrl}/api/maintenance`)

    if (res.maintenance_mode && to.path !== '/maintenance') {
      return navigateTo('/maintenance')
    }
    if (!res.maintenance_mode && to.path === '/maintenance') {
      return navigateTo('/')
    }
  } catch {
    // If API is down, don't block navigation
  }
})
