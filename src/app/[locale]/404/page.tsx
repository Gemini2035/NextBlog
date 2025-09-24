'use client'

import { useTranslations } from 'next-intl'
import { Link, Button, Divider } from '@/ui'
import { useRouter } from '@/i18n/navigation'

export default function NotFound() {
  const t = useTranslations('NotFound')
  const router = useRouter()

  const handleGoBack = () => {
    if (window.history.length > 1) {
      router.back()
    } else {
      router.push('/')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full text-center">
        <div className="mb-8">
          <h1 className="text-9xl font-bold text-gray-900 mb-6">{t('title')}</h1>
          <p className="text-gray-600 mb-8 text-lg">
            {t('description')}
          </p>
        </div>
        
        <div className="flex items-center justify-center gap-4">
          <Button 
            type="text"
            onClick={handleGoBack}
            className="text-lg"
          >
            {t('goBack')}
          </Button>
          <Divider orientation="vertical" className="h-4 w-px bg-gray-300" />
          <Link href="/" className="text-sm text-gray-500 transition-colors">
            {t('orGoHome')}
          </Link>
        </div>
      </div>
    </div>
  )
}
