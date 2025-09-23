'use client'

import { GlobeIcon } from '@/assets/icons'
import { useLocale } from 'next-intl'
import { LANGUAGES } from '@/constants'

interface LanguageBarProps {
  onLanguageClick: () => void
}

export default function LanguageBar({ onLanguageClick }: LanguageBarProps) {
  const locale = useLocale()
  const currentLanguage = LANGUAGES.find(lang => lang.code === locale)
  
  const handleLanguageClick = () => {
    onLanguageClick()
  }

  return (
    <button
      onClick={handleLanguageClick}
      className="flex items-center p-2 rounded-lg text-gray-600 hover:bg-gray-100 hover:text-gray-800 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 cursor-pointer"
      aria-label="切换语言"
      title={`当前语言: ${currentLanguage?.nativeName || locale}`}
    >
      <GlobeIcon className="h-5 w-5" />
    </button>
  )
}
