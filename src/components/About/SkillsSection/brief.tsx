'use client'

import { useTranslations } from 'next-intl'

interface SkillsBriefProps {
  className?: string
}

export default function SkillsBrief({ className }: SkillsBriefProps) {
  const navT = useTranslations('Navigation')

  return (
    <div className={className}>
      <div className="flex items-center mb-4">
        <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center mr-3">
          <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
          </svg>
        </div>
        <h2 className="text-xl font-bold text-gray-900">
          {navT('Skills & Expertise')}
        </h2>
      </div>

      <div className="space-y-4" id="skills">
        <div>
          <h4 className="font-medium text-gray-800 mb-2 text-sm">前端技术</h4>
          <div className="flex flex-wrap gap-1.5">
            <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">React</span>
            <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">Next.js</span>
            <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">TypeScript</span>
          </div>
        </div>
        <div>
          <h4 className="font-medium text-gray-800 mb-2 text-sm">后端技术</h4>
          <div className="flex flex-wrap gap-1.5">
            <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">Node.js</span>
            <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">Python</span>
            <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">PostgreSQL</span>
          </div>
        </div>
        <div>
          <h4 className="font-medium text-gray-800 mb-2 text-sm">工具平台</h4>
          <div className="flex flex-wrap gap-1.5">
            <span className="px-2 py-1 bg-purple-100 text-purple-800 rounded-full text-xs">Git</span>
            <span className="px-2 py-1 bg-purple-100 text-purple-800 rounded-full text-xs">Docker</span>
            <span className="px-2 py-1 bg-purple-100 text-purple-800 rounded-full text-xs">AWS</span>
          </div>
        </div>
      </div>
    </div>
  )
}
