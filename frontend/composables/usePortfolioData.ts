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
}

export type SiteContent = Record<string, string>

export const usePortfolioData = () => {
  const config = useRuntimeConfig()
  const apiUrl = config.public.apiUrl

  const { data: aboutData } = useFetch<AboutData | null>(
    `${apiUrl}/api/about`,
    {
      key: 'portfolio-about',
      default: () => null,
    }
  )

  const { data: projectsData } = useFetch<Project[]>(
    `${apiUrl}/api/projects`,
    {
      key: 'portfolio-projects',
      default: () => [],
    }
  )

  const { data: contentData } = useFetch<SiteContent>(
    `${apiUrl}/api/content`,
    {
      key: 'portfolio-content',
      default: () => ({}),
    }
  )

  const c = (key: string, fallback: string = '') => {
    return contentData.value?.[key] || fallback
  }

  return { aboutData, projectsData, contentData, c }
}
