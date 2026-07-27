'use client'

import { useTranslations } from 'next-intl'
import { StickySectionHeader } from '@/components/About/StickySectionHeader'
import { useEducationExperiences } from '@/components/About/AboutDataProvider'
import styles from '@/components/SanitizedHtml/SanitizedHtml.module.css'

interface EducationDetailProps {
  className?: string
}

const formatPeriod = (start?: string | null, end?: string | null) => [start, end].filter(Boolean).join(' - ')

export default function EducationDetail({ className }: EducationDetailProps) {
  const eduT = useTranslations('Education')
  const educations = useEducationExperiences()

  return (
    <div className={className}>
      <StickySectionHeader>
        <div className="flex items-start gap-4 sm:items-center sm:gap-6">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-blue-100 sm:h-16 sm:w-16">
            <svg className="w-7 h-7 text-blue-600 sm:w-8 sm:h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
            </svg>
          </div>
          <div className="min-w-0 flex-1">
            <h2 className="mb-2 text-2xl font-bold text-gray-900 sm:text-3xl" id="education">
              {eduT('sectionTitle')}
            </h2>
            <p className="text-base text-gray-600 sm:text-lg">{eduT('detailSummary')}</p>
          </div>
        </div>
      </StickySectionHeader>

      <div className="space-y-8">
        {educations.map((item) => (
          <article key={item.id} className="border-l-4 border-gray-200 pl-6 py-2">
            <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
              <div>
                <h3 className="text-xl font-semibold text-gray-900">{item.school}</h3>
                <p className="text-gray-600 font-medium">{[item.degree, item.major].filter(Boolean).join(' | ')}</p>
              </div>
              {formatPeriod(item.periodStart, item.periodEnd) ? (
                <span className="px-3 py-1 border border-gray-200 text-gray-700 rounded-full text-sm font-medium">
                  {formatPeriod(item.periodStart, item.periodEnd)}
                </span>
              ) : null}
            </div>
            <div
              className={`${styles.prose} max-w-none text-gray-700`}
              dangerouslySetInnerHTML={{ __html: item.description }}
            />
          </article>
        ))}
      </div>
    </div>
  )
}
