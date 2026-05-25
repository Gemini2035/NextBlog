'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'

interface SkillsDetailProps {
  className?: string
}

interface TechTagProps {
  name: string
  color: string
  isSelected: boolean
  onClick: () => void
}

function TechTag({ name, color, isSelected, onClick }: TechTagProps) {
  return (
    <span 
      className={`px-3 py-1 bg-white rounded-full text-sm font-medium cursor-pointer transition-all duration-200 hover:shadow-md ${
        isSelected 
          ? `ring-2 ring-blue-500 shadow-md ${color}` 
          : color
      }`}
      onClick={onClick}
    >
      {name}
    </span>
  )
}

export default function SkillsDetail({ className }: SkillsDetailProps) {
  const skillsT = useTranslations('Skills')
  const [selectedTech, setSelectedTech] = useState<string | null>(null)

  const handleTechClick = (techName: string) => {
    setSelectedTech(selectedTech === techName ? null : techName)
  }

  const getTechDescription = (techName: string) => {
    try {
      return skillsT(`techDescriptions.${techName}`)
    } catch {
      return ''
    }
  }

  return (
    <div className={className}>
      <div className="flex items-center mb-8">
        <div className="w-16 h-16 bg-blue-100 rounded-xl flex items-center justify-center mr-6 shrink-0">
          <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
          </svg>
        </div>
        <div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            {skillsT('title')}
          </h2>
          <p className="text-lg text-gray-600">
            {skillsT('subtitle')}
          </p>
        </div>
      </div>

      <div className="space-y-8" id="skills">
        {/* 核心技术栈 */}
        <div className="p-6 bg-gray-50 rounded-xl">
          <h3 className="text-xl font-semibold text-gray-900 mb-6">{skillsT('coreTechStack')}</h3>
          <div className="space-y-6">
            <div>
              <h4 className="font-medium text-gray-800 mb-3">{skillsT('frontendTech')}</h4>
              <div className="flex flex-wrap gap-2">
                <TechTag name="React" color="text-blue-800" isSelected={selectedTech === 'React'} onClick={() => handleTechClick('React')} />
                <TechTag name="Vue" color="text-blue-800" isSelected={selectedTech === 'Vue'} onClick={() => handleTechClick('Vue')} />
                <TechTag name="Next.js" color="text-blue-800" isSelected={selectedTech === 'NextJS'} onClick={() => handleTechClick('NextJS')} />
                <TechTag name="HTML5" color="text-blue-800" isSelected={selectedTech === 'HTML5'} onClick={() => handleTechClick('HTML5')} />
                <TechTag name="CSS3" color="text-blue-800" isSelected={selectedTech === 'CSS3'} onClick={() => handleTechClick('CSS3')} />
                <TechTag name="Vite" color="text-blue-800" isSelected={selectedTech === 'Vite'} onClick={() => handleTechClick('Vite')} />
                <TechTag name="Tailwind" color="text-blue-800" isSelected={selectedTech === 'Tailwind'} onClick={() => handleTechClick('Tailwind')} />
                <TechTag name="Magento" color="text-blue-800" isSelected={selectedTech === 'Magento'} onClick={() => handleTechClick('Magento')} />
                <TechTag name="Catalyst" color="text-blue-800" isSelected={selectedTech === 'Catalyst'} onClick={() => handleTechClick('Catalyst')} />
                <TechTag name="ES6" color="text-blue-800" isSelected={selectedTech === 'ES6'} onClick={() => handleTechClick('ES6')} />
                <TechTag name="JavaScript" color="text-blue-800" isSelected={selectedTech === 'JavaScript'} onClick={() => handleTechClick('JavaScript')} />
                <TechTag name="TypeScript" color="text-blue-800" isSelected={selectedTech === 'TypeScript'} onClick={() => handleTechClick('TypeScript')} />
              </div>
            </div>
            <div>
              <h4 className="font-medium text-gray-800 mb-3">{skillsT('backendTech')}</h4>
              <div className="flex flex-wrap gap-2">
                <TechTag name="Node.js" color="text-green-800" isSelected={selectedTech === 'NodeJS'} onClick={() => handleTechClick('NodeJS')} />
                <TechTag name="PostgreSQL" color="text-green-800" isSelected={selectedTech === 'PostgreSQL'} onClick={() => handleTechClick('PostgreSQL')} />
                <TechTag name="RESTful" color="text-green-800" isSelected={selectedTech === 'RESTful'} onClick={() => handleTechClick('RESTful')} />
              </div>
            </div>
            <div>
              <h4 className="font-medium text-gray-800 mb-3">{skillsT('devTools')}</h4>
              <div className="flex flex-wrap gap-2">
                <TechTag name="Git" color="text-purple-800" isSelected={selectedTech === 'Git'} onClick={() => handleTechClick('Git')} />
                <TechTag name="Docker" color="text-purple-800" isSelected={selectedTech === 'Docker'} onClick={() => handleTechClick('Docker')} />
                <TechTag name="VSCode" color="text-purple-800" isSelected={selectedTech === 'VSCode'} onClick={() => handleTechClick('VSCode')} />
                <TechTag name="Cursor" color="text-purple-800" isSelected={selectedTech === 'Cursor'} onClick={() => handleTechClick('Cursor')} />
                <TechTag name="ChatGPT" color="text-purple-800" isSelected={selectedTech === 'ChatGPT'} onClick={() => handleTechClick('ChatGPT')} />
                <TechTag name="Figma" color="text-purple-800" isSelected={selectedTech === 'Figma'} onClick={() => handleTechClick('Figma')} />
                <TechTag name="SF Symbol" color="text-purple-800" isSelected={selectedTech === 'SFSymbol'} onClick={() => handleTechClick('SFSymbol')} />
              </div>
            </div>
          </div>
        </div>

        {/* 技术描述显示区域 */}
        {selectedTech && (
          <div className="p-6 bg-gray-50 rounded-xl border-l-4 border-gray-300">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{selectedTech}</h3>
                <p className="text-gray-700 leading-relaxed">
                  {getTechDescription(selectedTech)}
                </p>
              </div>
              <button
                onClick={() => setSelectedTech(null)}
                className="ml-4 p-1 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-full transition-colors"
                aria-label="关闭描述"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        )}

        {/* 专业领域 */}
        <div className="p-6 bg-gray-50 rounded-xl">
          <h3 className="text-xl font-semibold text-gray-900 mb-6">{skillsT('specializedAreas')}</h3>
          <div className="space-y-6">
            <div>
              <h4 className="font-medium text-gray-800 mb-3">{skillsT('codeArchitecture')}</h4>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-gray-400 rounded-full mr-3"></div>
                  {skillsT('frontendArchitecture')}
                </li>
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-gray-400 rounded-full mr-3"></div>
                  {skillsT('microserviceArchitecture')}
                </li>
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-gray-400 rounded-full mr-3"></div>
                  {skillsT('performanceOptimization')}
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-gray-800 mb-3">{skillsT('teamCollaboration')}</h4>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-gray-400 rounded-full mr-3"></div>
                  {skillsT('agileDevelopment')}
                </li>
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-gray-400 rounded-full mr-3"></div>
                  {skillsT('codeReview')}
                </li>
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-gray-400 rounded-full mr-3"></div>
                  {skillsT('techSharing')}
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-gray-800 mb-3">{skillsT('projectManagement')}</h4>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-gray-400 rounded-full mr-3"></div>
                  {skillsT('projectPlanning')}
                </li>
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-gray-400 rounded-full mr-3"></div>
                  {skillsT('riskManagement')}
                </li>
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-gray-400 rounded-full mr-3"></div>
                  {skillsT('crossTeamCommunication')}
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

    </div>
  )
}
