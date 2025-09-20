import { useLocalStorage } from './useLocalStorage'

/**
 * 使用语言的 Hook
 */
export function useLanguage() {
  const [currentLang, setCurrentLang] = useLocalStorage('language', 'zh')

  const changeLanguage = (langCode: string) => {
    setCurrentLang(langCode)
    // TODO: 实现语言切换逻辑
    console.log('切换到语言:', langCode)
  }

  return { currentLang, changeLanguage }
}
