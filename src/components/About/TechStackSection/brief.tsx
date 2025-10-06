'use client'

import { useTranslations } from 'next-intl'

interface TechStackBriefProps {
  className?: string
}

export default function TechStackBrief({ className }: TechStackBriefProps) {
  const t = useTranslations('AboutPage')

  return (
    <div className={className}>
      <div className="flex items-center mb-4">
        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-3 shrink-0">
          <svg className="w-5 h-5 text-blue-600" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <rect x="4" y="14" width="16" height="4" rx="1.5"/>
            <rect x="6" y="9" width="12" height="3" rx="1.5"/>
            <rect x="8" y="5" width="8" height="2" rx="1"/>
          </svg>
        </div>
        <h2 className="text-xl font-bold text-gray-900">
          {t('techStack')}
        </h2>
      </div>
      
      <div className="grid grid-cols-3 gap-3">
        <div className="text-center">
          <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center mx-auto mb-2">
            <svg className="w-5 h-5 text-gray-700" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <circle cx="12" cy="12" r="6"/>
              <line x1="9" y1="15" x2="15" y2="9"/>
            </svg>
          </div>
          <h3 className="font-medium text-gray-900 text-xs mb-1">Next.js</h3>
          <p className="text-xs text-gray-600">React 全栈（App Router）</p>
        </div>
        
        <div className="text-center">
          <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center mx-auto mb-2">
            <svg className="w-5 h-5 text-gray-700" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <rect x="6" y="7" width="12" height="8" rx="1"/>
              <rect x="8" y="11" width="8" height="4" rx="1"/>
            </svg>
          </div>
          <h3 className="font-medium text-gray-900 text-xs mb-1">Contentlayer</h3>
          <p className="text-xs text-gray-600">类型安全内容</p>
        </div>
        
        <div className="text-center">
          <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center mx-auto mb-2">
            <svg className="w-5 h-5 text-gray-700" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <polyline points="8,12 11,9 8,6"/>
              <polyline points="16,6 13,9 16,12"/>
              <line x1="12" y1="13" x2="12" y2="18"/>
            </svg>
          </div>
          <h3 className="font-medium text-gray-900 text-xs mb-1">MDX</h3>
          <p className="text-xs text-gray-600">Markdown + JSX</p>
        </div>
        
        <div className="text-center">
          <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center mx-auto mb-2">
            <svg className="w-5 h-5 text-gray-700" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <rect x="7" y="7" width="6" height="3" rx="1"/>
              <rect x="11" y="12" width="6" height="3" rx="1"/>
            </svg>
          </div>
          <h3 className="font-medium text-gray-900 text-xs mb-1">Tailwind</h3>
          <p className="text-xs text-gray-600">实用优先 CSS</p>
        </div>
        
        <div className="text-center">
          <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center mx-auto mb-2">
            <svg className="w-5 h-5 text-gray-700" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <rect x="7" y="6" width="10" height="10" rx="2"/>
              <line x1="12" y1="8" x2="12" y2="14"/>
              <line x1="9" y1="8" x2="15" y2="8"/>
            </svg>
          </div>
          <h3 className="font-medium text-gray-900 text-xs mb-1">TypeScript</h3>
          <p className="text-xs text-gray-600">类型安全（严格）</p>
        </div>
        
        <div className="text-center">
          <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center mx-auto mb-2">
            <svg className="w-5 h-5 text-gray-700" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <circle cx="7" cy="12" r="2"/>
              <circle cx="17" cy="7" r="2"/>
              <circle cx="17" cy="17" r="2"/>
              <line x1="9" y1="12" x2="15" y2="8"/>
              <line x1="9" y1="12" x2="15" y2="16"/>
            </svg>
          </div>
          <h3 className="font-medium text-gray-900 text-xs mb-1">GitHub Actions + Vercel</h3>
          <p className="text-xs text-gray-600">CI/CD 与部署</p>
        </div>
      </div>
    </div>
  )
}
