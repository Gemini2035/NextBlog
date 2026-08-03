const siteUrlFromEnv = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, '')

export const siteUrl = siteUrlFromEnv ?? ''

export const siteHostname = siteUrl ? new URL(siteUrl).hostname : ''
