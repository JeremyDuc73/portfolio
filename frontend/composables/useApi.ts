export const useApi = () => {
  const config = useRuntimeConfig()
  const baseURL = config.public.apiUrl

  const fetchApi = async <T>(endpoint: string, options?: any): Promise<T> => {
    const { data, error } = await useFetch<T>(`${baseURL}${endpoint}`, {
      ...options,
    })

    if (error.value) {
      throw new Error(error.value.message || 'API Error')
    }

    return data.value as T
  }

  return { fetchApi, baseURL }
}
