'use client'

import { useTranslations } from 'next-intl'
import { useEducationExperiences } from '@/components/About/AboutDataProvider'

interface EducationBriefProps {
  className?: string
}

const formatPeriod = (start?: string | null, end?: string | null) => [start, end].filter(Boolean).join(' - ')

export default function EducationBrief({ className }: EducationBriefProps) {
  const eduT = useTranslations('Education')
  const educations = useEducationExperiences()

  return (
    <div className={className}>
      <div className="flex items-center mb-4">
        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-3 shrink-0">
          <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
          </svg>
        </div>
        <h2 className="text-xl font-bold text-gray-900" id="education">
          {eduT('sectionTitle')}
        </h2>
      </div>
      <div className="space-y-3">
        {educations.map((item) => (
          <div key={item.id} className="border-l-3 border-gray-200 pl-3">
            <h4 className="font-medium text-gray-800 text-sm">{item.school}</h4>
            <p className="text-xs text-gray-600">{[item.degree, item.major, formatPeriod(item.periodStart, item.periodEnd)].filter(Boolean).join(' | ')}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
