'use client'

import { GlobeIcon } from '@/assets/icons'
import { LANGUAGES } from '@/constants'
import { useLanguage } from '@/hooks'

interface LanguageToggleProps {
  onLanguageClick: () => void
}

export default function LanguageToggle({ onLanguageClick }: LanguageToggleProps) {
  const { currentLang, changeLanguage } = useLanguage()

  const handleLanguageClick = () => {
    onLanguageClick()
  }

  const currentLanguage = LANGUAGES.find(lang => lang.code === currentLang) || LANGUAGES[0]

  return (
    <button
      onClick={handleLanguageClick}
      className="flex items-center p-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900"
      aria-label="切换语言"
    >
      <GlobeIcon className="h-5 w-5" />
    </button>
  )
}
