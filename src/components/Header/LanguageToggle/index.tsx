'use client'

import { GlobeIcon } from '@/assets/icons'
interface LanguageToggleProps {
  onLanguageClick: () => void
}

export default function LanguageToggle({ onLanguageClick }: LanguageToggleProps) {
  const handleLanguageClick = () => {
    onLanguageClick()
  }

  return (
    <button
      onClick={handleLanguageClick}
      className="flex items-center p-2 rounded-lg text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
      aria-label="切换语言"
    >
      <GlobeIcon className="h-5 w-5" />
    </button>
  )
}
