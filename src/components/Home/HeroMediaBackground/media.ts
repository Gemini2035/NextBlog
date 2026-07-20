export const HERO_MEDIA_PATHS = {
  poster: '/chou-kaguya/video/poster.avif',
  video: '/chou-kaguya/video/master.m3u8',
} as const

export const resolveHeroMediaUrl = (cdnUrl: string | undefined, path: string) => {
  const normalizedCdnUrl = cdnUrl?.replace(/\/$/, '') ?? ''

  return `${normalizedCdnUrl}${path}`
}

export const getHeroPosterUrl = (cdnUrl: string | undefined) => {
  return resolveHeroMediaUrl(cdnUrl, HERO_MEDIA_PATHS.poster)
}

export const getHeroVideoUrl = (cdnUrl: string | undefined) => {
  return resolveHeroMediaUrl(cdnUrl, HERO_MEDIA_PATHS.video)
}

export const getUrlOrigin = (url: string) => {
  try {
    return new URL(url).origin
  } catch {
    return undefined
  }
}
