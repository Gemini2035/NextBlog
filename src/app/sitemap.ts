import type { MetadataRoute } from 'next'
import { routing } from '@/i18n/routing'

const siteUrl = 'https://apodidae2035.com'

const localizedRoutes = ['', '/posts', '/projects', '/about', '/policies']

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date()

  return routing.locales.flatMap((locale) =>
    localizedRoutes.map((route) => ({
      url: `${siteUrl}/${locale}${route}/`,
      lastModified,
      changeFrequency: route === '' ? 'daily' : 'weekly',
      priority: route === '' ? 1 : 0.8,
    }))
  )
}
