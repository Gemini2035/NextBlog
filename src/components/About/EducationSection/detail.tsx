'use client'

import { useTranslations } from 'next-intl'

interface EducationDetailProps {
  className?: string
}

export default function EducationDetail({ className }: EducationDetailProps) {
  const eduT = useTranslations('Education')

  return (
    <div className={className}>
      <div className="flex items-center mb-8">
        <div className="w-16 h-16 bg-blue-100 rounded-xl flex items-center justify-center mr-6 shrink-0">
          <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
          </svg>
        </div>
        <div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2" id="education">
            {eduT('sectionTitle')}
          </h2>
          <p className="text-lg text-gray-600">{eduT('detailSummary')}</p>
        </div>
      </div>

      {/* 主要教育经历 */}
      <div className="mb-8">
        <h3 className="text-2xl font-semibold text-gray-900 mb-6">{eduT('mainEducationTitle')}</h3>
        <div className="space-y-6">
          <div className="border-l-4 border-purple-400 pl-6 py-4 bg-purple-50 rounded-r-xl">
            <div className="flex items-start justify-between mb-3">
              <div>
                <h4 className="text-xl font-semibold text-gray-900">{eduT('briefTitle')}</h4>
                <p className="text-purple-600 font-medium">{eduT('briefDegreeYears').replace(' | 2020 - 2024','')}</p>
              </div>
              <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm font-medium">
                2020 - 2024
              </span>
            </div>
            <p className="text-gray-700 leading-relaxed mb-4">{eduT('detailSummary')}</p>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <h5 className="font-medium text-gray-800 mb-2">{eduT('coreCoursesTitle')}</h5>
                <ul className="space-y-1 text-gray-600 text-sm">
                  <li>• {eduT('course1')}</li>
                  <li>• {eduT('course2')}</li>
                  <li>• {eduT('course3')}</li>
                  <li>• {eduT('course4')}</li>
                </ul>
              </div>
              <div>
                <h5 className="font-medium text-gray-800 mb-2">{eduT('projectsTitle')}</h5>
                <ul className="space-y-1 text-gray-600 text-sm">
                  <li>• {eduT('project1')}</li>
                  <li>• {eduT('project2')}</li>
                  <li>• {eduT('project3')}</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 学习成果 */}
      <div className="mb-8">
        <h3 className="text-2xl font-semibold text-gray-900 mb-6">{eduT('achievementsTitle')}</h3>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="p-6 bg-gray-50 rounded-xl">
            <h4 className="text-lg font-semibold text-gray-900 mb-4">{eduT('achievementsTitle')}</h4>
            <div className="space-y-3">
              <div className="flex items-center">
                <div className="w-2 h-2 bg-purple-500 rounded-full mr-3"></div>
                <span className="text-purple-800">{eduT('achievement1')}</span>
              </div>
              <div className="flex items-center">
                <div className="w-2 h-2 bg-purple-500 rounded-full mr-3"></div>
                <span className="text-purple-800">{eduT('achievement2')}</span>
              </div>
            </div>
          </div>
          
          <div className="p-6 bg-gray-50 rounded-xl">
            <h4 className="text-lg font-semibold text-gray-900 mb-4">{eduT('projectsTitle')}</h4>
            <div className="space-y-3">
              <div className="flex items-center">
                <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                <span className="text-blue-800">{eduT('project1')}</span>
              </div>
              <div className="flex items-center">
                <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                <span className="text-blue-800">{eduT('project2')}</span>
              </div>
              <div className="flex items-center">
                <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                <span className="text-blue-800">{eduT('project3')}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      
    </div>
  )
}
