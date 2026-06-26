const LOCAL_RESOURCE_PREFIX = '/resources/media'

const truthyValues = new Set(['1', 'true', 'yes', 'on'])

const isEnabled = (value: string | undefined) => truthyValues.has((value ?? '').trim().toLowerCase())

export const isLocalResourcesEnabled = () => isEnabled(process.env.NEXT_PUBLIC_RESOURCES_LOCAL)

const normalizeResourcePath = (url: string) => {
  if (!url) {
    return ''
  }

  if (url.startsWith('blob:') || url.startsWith('data:')) {
    return url
  }

  if (/^https?:\/\//i.test(url)) {
    return url
  }

  if (url.startsWith(LOCAL_RESOURCE_PREFIX)) {
    return url
  }

  const normalizedUrl = url.replace(/^\/+/, '')
  if (normalizedUrl.startsWith('resources/media/')) {
    return `/${normalizedUrl}`
  }

  return `${LOCAL_RESOURCE_PREFIX}/${normalizedUrl}`
}

export const resolveResourceUrl = (url: string | null | undefined) => {
  if (!url) {
    return ''
  }

  if (isLocalResourcesEnabled()) {
    return normalizeResourcePath(url)
  }

  if (/^https?:\/\//i.test(url) || url.startsWith('blob:') || url.startsWith('data:')) {
    return url
  }

  const resourceBaseUrl = process.env.NEXT_PUBLIC_RESOURCES_BASE_URL?.replace(/\/$/, '')
  if (resourceBaseUrl) {
    return `${resourceBaseUrl}/${url.replace(new RegExp(`^${LOCAL_RESOURCE_PREFIX}/?`), '').replace(/^\/+/, '')}`
  }

  return url
}
