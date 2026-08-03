import { siteHostname, siteUrl } from '@/config/site'

const webUrlPattern = /^(https?:)?\/\//i
const schemePattern = /^[a-z][a-z\d+.-]*:/i

const normalizeHostname = (hostname: string) => {
  return hostname.toLowerCase().replace(/^www\./, '')
}

export const isSiteHostname = (hostname: string) => {
  if (!siteHostname) {
    return false
  }

  const normalizedHostname = normalizeHostname(hostname)
  const normalizedSiteHostname = normalizeHostname(siteHostname)

  return (
    normalizedHostname === normalizedSiteHostname ||
    normalizedHostname.endsWith(`.${normalizedSiteHostname}`)
  )
}

export const isInternalSiteHref = (href?: string | null) => {
  const value = href?.trim()

  if (!value) {
    return false
  }

  if (value.startsWith('#')) {
    return true
  }

  if (!webUrlPattern.test(value)) {
    return !schemePattern.test(value)
  }

  try {
    return isSiteHostname(new URL(value, siteUrl || undefined).hostname)
  } catch {
    return false
  }
}

export const isExternalWebHref = (href?: string | null) => {
  const value = href?.trim()

  return Boolean(value && webUrlPattern.test(value) && !isInternalSiteHref(value))
}

export const mergeLinkRel = (rel: string | undefined, ...tokens: string[]) => {
  const values = new Set([
    ...(rel?.split(/\s+/).filter(Boolean) ?? []),
    ...tokens.filter(Boolean),
  ])

  return values.size > 0 ? Array.from(values).join(' ') : undefined
}
