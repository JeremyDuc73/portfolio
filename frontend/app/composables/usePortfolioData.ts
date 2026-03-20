export interface Skill {
  id: number
  name: string
  level: number
  category: string
  sort_order: number
}

export interface Experience {
  id: number
  role: string
  company: string
  period: string
  description: string
  sort_order: number
}

export interface AboutData {
  name: string
  title: string
  bio: string
  location: string
  email: string
  socials: { github: string; linkedin: string }
  skills: Skill[]
  experience: Experience[]
}

export interface ProjectImage {
  id: number
  url: string
  caption: string
  sort_order: number
}

export interface ProjectSkill {
  id: number
  name: string
  category: string
}

export interface Project {
  id: number
  slug: string
  title: string
  description: string
  tags: string[]
  image: string
  github: string
  demo: string
  featured: boolean
  sort_order: number
  skill_ids?: number[]
  skills?: ProjectSkill[]
  images?: ProjectImage[]
}

export type SiteContent = Record<string, string>

const getApiUrl = () => {
  const config = useRuntimeConfig()
  return import.meta.server
    ? (config.apiServerUrl || config.public.apiUrl)
    : config.public.apiUrl
}

export const usePortfolioData = () => {
  const { data: aboutData } = useAsyncData<AboutData | null>(
    'portfolio-about',
    () => $fetch(`${getApiUrl()}/api/about`),
    { default: () => null }
  )

  const { data: projectsData } = useAsyncData<Project[]>(
    'portfolio-projects',
    () => $fetch(`${getApiUrl()}/api/projects`),
    { default: () => [] }
  )

  const { data: contentData } = useAsyncData<SiteContent>(
    'portfolio-content',
    () => $fetch(`${getApiUrl()}/api/content`),
    { default: () => ({}) }
  )

  const c = (key: string, fallback: string = '') => {
    return contentData.value?.[key] || fallback
  }

  return { aboutData, projectsData, contentData, c }
}
