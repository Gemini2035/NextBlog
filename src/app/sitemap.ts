import type { MetadataRoute } from 'next'
import { routing } from '@/i18n/routing'
import { siteUrl } from '@/config/site'

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
