'use client'

import { useState } from 'react'
import { QuestionIcon } from '@/assets/icons'
import { useTranslations } from 'next-intl'
import { Button, Link } from '@/ui'

export function ContactButton() {
  const [isVisible, setIsVisible] = useState(false)
  const t = useTranslations('Contact')

  return (
    <>
      {/* 固定按钮 */}
      <Button
        onClick={() => setIsVisible(!isVisible)}
        type="primary"
        size="lg"
        rounded
        className="fixed bottom-24 right-6 z-50 w-14 h-14 shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center group p-0!"
        aria-label={t('contactButton')}
      >
        <QuestionIcon 
          size={24} 
          className="text-white group-hover:scale-110 transition-transform duration-200" 
        />
      </Button>

      {/* 弹出内容 */}
      {isVisible && (
        <>     
          {/* 背景遮罩 */}
          <div 
            className="fixed inset-0 z-100 bg-opacity-100 w-screen h-screen"
            onClick={() => setIsVisible(false)}
          />
          {/* 弹出卡片 */}
          <div className="fixed bottom-32 right-20 z-50 bg-white rounded-lg shadow-xl border border-gray-200 p-4 max-w-xs animate-in slide-in-from-bottom-2 duration-200 pt-10">
            <Link href="/about" className="text-center hover:underline">
              <p className="text-sm">
                {t('title')}
                {t('description')}
              </p>
            </Link>
            
            {/* 关闭按钮 */}
            <Button
              onClick={() => setIsVisible(false)}
              type="ghost"
              size="sm"
              className="absolute top-2 right-2 text-gray-400 hover:text-gray-600 transition-colors duration-200 p-1"
              aria-label={t('close')}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </Button>
          </div>
        </>
      )}
    </>
  )
}
