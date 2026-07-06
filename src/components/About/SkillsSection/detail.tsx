'use client'

import { useMemo, useState } from 'react'
import { useTranslations } from 'next-intl'
import { StickySectionHeader } from '@/components/About/StickySectionHeader'
import { useSkillCategories } from '@/components/About/AboutDataProvider'

interface SkillsDetailProps {
  className?: string
}

interface TechTagProps {
  color?: string | null
  isSelected: boolean
  name: string
  onClick: () => void
}

function TechTag({ name, color, isSelected, onClick }: TechTagProps) {
  return (
    <button
      className={`px-3 py-1 bg-white rounded-full text-sm font-medium cursor-pointer transition-colors duration-200 hover:ring-1 hover:ring-[var(--site-action)] ${
        isSelected ? 'ring-2 ring-[var(--site-action)]' : ''
      }`}
      style={{ color: color || undefined }}
      onClick={onClick}
      type="button"
    >
      {name}
    </button>
  )
}

export default function SkillsDetail({ className }: SkillsDetailProps) {
  const skillsT = useTranslations('Skills')
  const categories = useSkillCategories()
  const [selectedSkillId, setSelectedSkillId] = useState<number | null>(null)
  const selectedSkill = useMemo(
    () => categories.flatMap((category) => category.items).find((item) => item.id === selectedSkillId),
    [categories, selectedSkillId]
  )

  return (
    <div className={className}>
      <StickySectionHeader>
        <div className="flex items-center">
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
      </StickySectionHeader>

      <div className="space-y-8" id="skills">
        {categories.map((category) => (
          <section key={category.id} className="border-b border-gray-100 pb-6 last:border-b-0">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">{category.name}</h3>
            <div className="flex flex-wrap gap-2">
              {category.items.map((item) => (
                <TechTag
                  key={item.id}
                  name={item.name}
                  color={category.textColor}
                  isSelected={selectedSkillId === item.id}
                  onClick={() => setSelectedSkillId(selectedSkillId === item.id ? null : item.id)}
                />
              ))}
            </div>
          </section>
        ))}

        {selectedSkill ? (
          <div className="p-6 bg-gray-50 rounded-xl border-l-4 border-gray-300">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{selectedSkill.name}</h3>
                <p className="text-gray-700 leading-relaxed">
                  {selectedSkill.description}
                </p>
              </div>
              <button
                onClick={() => setSelectedSkillId(null)}
                className="ml-4 p-1 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-full transition-colors"
                aria-label="关闭描述"
                type="button"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  )
}
