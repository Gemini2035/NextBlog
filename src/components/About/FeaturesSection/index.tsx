'use client'

import { useTranslations } from 'next-intl'

interface FeaturesSectionProps {
  className?: string
}

export default function FeaturesSection({ className }: FeaturesSectionProps) {
  const t = useTranslations('AboutPage')

  return (
    <div className={className}>
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          {t('features')}
        </h2>
      </div>
      
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="flex items-start space-x-3">
          <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
            <span className="text-blue-600">📝</span>
          </div>
          <div>
            <p className="font-medium text-gray-900">{t('feature1')}</p>
          </div>
        </div>
        
        <div className="flex items-start space-x-3">
          <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
            <span className="text-blue-600">🎨</span>
          </div>
          <div>
            <p className="font-medium text-gray-900">{t('feature2')}</p>
          </div>
        </div>
        
        <div className="flex items-start space-x-3">
          <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
            <span className="text-blue-600">🔍</span>
          </div>
          <div>
            <p className="font-medium text-gray-900">{t('feature3')}</p>
          </div>
        </div>
        
        <div className="flex items-start space-x-3">
          <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
            <span className="text-blue-600">📱</span>
          </div>
          <div>
            <p className="font-medium text-gray-900">{t('feature4')}</p>
          </div>
        </div>
        
        <div className="flex items-start space-x-3">
          <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
            <span className="text-blue-600">⚡</span>
          </div>
          <div>
            <p className="font-medium text-gray-900">{t('feature5')}</p>
          </div>
        </div>
        
        <div className="flex items-start space-x-3">
          <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
            <span className="text-blue-600">🚀</span>
          </div>
          <div>
            <p className="font-medium text-gray-900">{t('feature6')}</p>
          </div>
        </div>
      </div>
    </div>
  )
}