'use client'

import { useLocalStorage } from './useLocalStorage'
import { useRouter, usePathname } from '@/i18n/navigation'
import { useLocale } from 'next-intl'

/**
 * 使用语言的 Hook
 */
export function useLanguage() {
  const locale = useLocale()
  const router = useRouter()
  const pathname = usePathname()
  const [, setCurrentLang] = useLocalStorage('language', locale)

  const changeLanguage = (langCode: string) => {
    setCurrentLang(langCode)
    // 使用next-intl的路由切换功能
    router.push(pathname, { locale: langCode })
  }

  return { currentLang: locale, changeLanguage }
}
