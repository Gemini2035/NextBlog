'use client'

import { useTranslations } from 'next-intl'

interface OpenSourceLibrariesDetailProps {
  className?: string
}

export default function OpenSourceLibrariesDetail({ className }: OpenSourceLibrariesDetailProps) {
  const t = useTranslations('AboutPage')

  return (
    <div className={className} id="open-source">
      <div className="flex items-center mb-8">
        <div className="w-16 h-16 bg-emerald-100 rounded-xl flex items-center justify-center mr-6">
          <span className="text-3xl">📚</span>
        </div>
        <div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            {t('openSourceLibraries')}
          </h2>
          <p className="text-lg text-gray-600">
            {t('openSourceLibrariesDescription')}
          </p>
        </div>
      </div>
      
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
          <div className="flex items-center mb-4">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
              <span className="text-blue-600 text-xl">⚛️</span>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">React</h3>
              <p className="text-sm text-gray-600">UI Library</p>
            </div>
          </div>
          <p className="text-gray-600 text-sm mb-3">
            {t('reactDescription')}
          </p>
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-500">v18.2.0+</span>
            <a href="https://reactjs.org" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 text-sm">
              {t('visit')} →
            </a>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
          <div className="flex items-center mb-4">
            <div className="w-10 h-10 bg-black rounded-lg flex items-center justify-center mr-3">
              <span className="text-white text-xl">▲</span>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Next.js</h3>
              <p className="text-sm text-gray-600">React Framework</p>
            </div>
          </div>
          <p className="text-gray-600 text-sm mb-3">
            {t('nextjsDescription')}
          </p>
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-500">v15.0.0+</span>
            <a href="https://nextjs.org" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 text-sm">
              {t('visit')} →
            </a>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
          <div className="flex items-center mb-4">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
              <span className="text-blue-600 text-xl">📝</span>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Contentlayer</h3>
              <p className="text-sm text-gray-600">Content Management</p>
            </div>
          </div>
          <p className="text-gray-600 text-sm mb-3">
            {t('contentlayerDescription')}
          </p>
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-500">v0.3.0+</span>
            <a href="https://contentlayer.dev" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 text-sm">
              {t('visit')} →
            </a>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
          <div className="flex items-center mb-4">
            <div className="w-10 h-10 bg-cyan-100 rounded-lg flex items-center justify-center mr-3">
              <span className="text-cyan-600 text-xl">🎨</span>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Tailwind CSS</h3>
              <p className="text-sm text-gray-600">CSS Framework</p>
            </div>
          </div>
          <p className="text-gray-600 text-sm mb-3">
            {t('tailwindDescription')}
          </p>
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-500">v3.4.0+</span>
            <a href="https://tailwindcss.com" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 text-sm">
              {t('visit')} →
            </a>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
          <div className="flex items-center mb-4">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
              <span className="text-blue-600 text-xl">🔷</span>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">TypeScript</h3>
              <p className="text-sm text-gray-600">Type System</p>
            </div>
          </div>
          <p className="text-gray-600 text-sm mb-3">
            {t('typescriptDescription')}
          </p>
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-500">v5.0.0+</span>
            <a href="https://typescriptlang.org" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 text-sm">
              {t('visit')} →
            </a>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
          <div className="flex items-center mb-4">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center mr-3">
              <span className="text-green-600 text-xl">🌐</span>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">next-intl</h3>
              <p className="text-sm text-gray-600">Internationalization</p>
            </div>
          </div>
          <p className="text-gray-600 text-sm mb-3">
            {t('nextIntlDescription')}
          </p>
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-500">v3.0.0+</span>
            <a href="https://next-intl-docs.vercel.app" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 text-sm">
              {t('visit')} →
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
