'use client'

import { useTranslations } from 'next-intl'
import { ClockIcon } from '@/assets/icons'
import { FC, Fragment } from 'react'
import { cn } from '@/utils'
import { useAboutList } from '@/components/About/AboutDataProvider'
import { StickySectionHeader } from '@/components/About/StickySectionHeader'
import type { DevelopmentHistoryItem } from './types'
import { formatPeriod, getDisplayVersion, getTermStyle } from './utils'

interface DevelopmentHistoryDetailProps {
  className?: string
}

interface HistoryChildNodesProps {
  items: DevelopmentHistoryItem[]
  level?: number
  presentText: string
  planningText: string
}

function HistoryChildNodes({ items, level = 1, planningText, presentText }: HistoryChildNodesProps) {
  if (!items.length) return null

  const nestedOffsetClass = level === 1 ? 'ml-6 sm:ml-12' : 'ml-4 sm:ml-8'

  return (
    <div className={cn(nestedOffsetClass, 'space-y-4 sm:space-y-6')}>
      {items.map((item) => {
        const statusStyle = getTermStyle(item.status)
        const period = formatPeriod(item, presentText)
        const displayVersion = getDisplayVersion(item.version)
        const hasChildren = Boolean(item.children?.length)

        return (
          <div className="relative" key={item.id}>
            <div className="relative flex flex-col gap-3 sm:flex-row sm:items-start sm:gap-4">
              <div
                className="shrink-0 w-6 h-6 sm:w-8 sm:h-8 rounded-full border border-gray-200 bg-white text-gray-900 flex items-center justify-center mx-auto sm:mx-0"
                style={statusStyle}
              >
                <span className="text-xs font-bold">{displayVersion}</span>
              </div>
              <div className="flex-1 bg-white p-4 sm:p-6 rounded-xl shadow-md border border-gray-200">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-3 space-y-2 sm:space-y-0">
                  <h4 className={cn('font-semibold text-gray-900', level === 1 ? 'text-base sm:text-lg' : 'text-sm sm:text-base')}>
                    {item.title}
                  </h4>
                  <span
                    className="px-2 py-1 sm:px-3 sm:py-1 border border-gray-200 bg-white text-gray-900 rounded-full text-xs sm:text-sm font-medium text-center sm:text-left"
                    style={statusStyle}
                  >
                    {item.status.key === 'planning' ? planningText : period}
                  </span>
                </div>
                {item.description ? (
                  <div
                    className="development-history-html mb-4 text-sm sm:text-base text-gray-600"
                    dangerouslySetInnerHTML={{ __html: item.description }}
                  />
                ) : item.summary ? (
                  <p className="mb-4 text-sm sm:text-base text-gray-600">{item.summary}</p>
                ) : null}
                {!!item.tags.length && (
                  <div className="flex flex-wrap gap-1 sm:gap-2">
                    {item.tags.map((tag) => (
                      <span
                        className="px-2 py-1 rounded-full border border-gray-200 bg-white text-gray-900 text-xs"
                        style={getTermStyle(tag)}
                        key={tag.key}
                      >
                        {tag.name}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {hasChildren ? (
              <div className="relative mt-4 sm:mt-6">
                <div className="absolute left-3 sm:left-4 top-0 bottom-0 w-px bg-gray-200" style={statusStyle} />
                <HistoryChildNodes
                  items={item.children ?? []}
                  level={level + 1}
                  planningText={planningText}
                  presentText={presentText}
                />
              </div>
            ) : null}
          </div>
        )
      })}
    </div>
  )
}

const DevelopmentHistoryDetail: FC<DevelopmentHistoryDetailProps> = ({ className }) => {
  const t = useTranslations('AboutPage')
  const developmentHistory = useAboutList<DevelopmentHistoryItem>('development_history')
  const presentText = t('DevelopmentHistory.present')
  const planningText = t('DevelopmentHistory.planning')

  return (
    <div className={className} id="development-history">
      <StickySectionHeader>
        <div className="flex flex-col sm:flex-row sm:items-center">
          <div className="w-12 h-12 sm:w-16 sm:h-16 bg-blue-100 rounded-xl flex items-center justify-center mr-4 sm:mr-6 mb-3 sm:mb-0">
            <ClockIcon className="w-6 h-6 sm:w-8 sm:h-8 text-blue-600" />
          </div>
          <div className="flex-1">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
              {t('DevelopmentHistory.title')}
            </h2>
            <p className="text-base sm:text-lg text-gray-600">
              {t('DevelopmentHistory.description')}
            </p>
          </div>
        </div>
      </StickySectionHeader>

      <div className="space-y-12">
        {developmentHistory.map((item) => {
          const statusStyle = getTermStyle(item.status)
          const period = formatPeriod(item, presentText)
          const displayVersion = getDisplayVersion(item.version, true)

          return (
          <Fragment key={item.id}>
            {/* 粗轴 */}
            <div className="relative">
              <div
                className="absolute left-4 sm:left-8 top-0 bottom-0 w-0.5 sm:w-1 rounded-full bg-gray-300"
                style={statusStyle}
              />

              <div className="space-y-6 sm:space-y-8">
                {/* 粗轴标题 */}
                <div className="relative flex flex-col sm:flex-row sm:items-start space-y-4 sm:space-y-0 sm:space-x-6">
                  <div
                    className="shrink-0 w-12 h-12 sm:w-16 sm:h-16 rounded-full border border-gray-200 bg-white text-gray-900 flex items-center justify-center shadow-lg mx-auto sm:mx-0"
                    style={statusStyle}
                  >
                    <span className="text-lg sm:text-xl font-bold">{displayVersion}</span>
                  </div>
                  <div className={
                    cn(
                      "flex-1 p-4 sm:p-8 rounded-2xl shadow-lg",
                      item.status.key === "archived" && "bg-gradient-to-r from-gray-50 to-gray-100"
                    )
                  }>
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 space-y-2 sm:space-y-0">
                      <h3 className={
                        cn(
                          "text-2xl sm:text-3xl font-bold text-gray-900"
                        )
                      }>
                        {item.title}
                      </h3>
                      <span
                        className="px-4 py-2 sm:px-6 sm:py-3 rounded-full border border-gray-200 bg-white text-gray-900 text-sm sm:text-lg font-semibold text-center sm:text-left"
                        style={statusStyle}
                      >
                        {period}
                      </span>
                    </div>
                    <div
                      className="development-history-html text-sm sm:text-base text-gray-600"
                      dangerouslySetInnerHTML={{ __html: item.description ?? '' }}
                    />
                  </div>
                </div>

                {!!item.children?.length && (
                  <HistoryChildNodes
                    items={item.children}
                    planningText={planningText}
                    presentText={presentText}
                  />
                )}
              </div>
            </div>
          </Fragment>
          )
        })}
      </div>

      <style jsx global>{`
        #development-history .development-history-html {
          overflow-wrap: anywhere;
          line-height: 1.75;
        }

        #development-history .development-history-html > :first-child {
          margin-top: 0;
        }

        #development-history .development-history-html > :last-child {
          margin-bottom: 0;
        }

        #development-history .development-history-html p {
          margin: 0.75rem 0;
        }

        #development-history .development-history-html h1,
        #development-history .development-history-html h2,
        #development-history .development-history-html h3 {
          margin: 1rem 0 0.5rem;
          color: #111827;
          font-weight: 700;
          line-height: 1.25;
        }

        #development-history .development-history-html h1 {
          font-size: 1.5rem;
        }

        #development-history .development-history-html h2 {
          font-size: 1.25rem;
        }

        #development-history .development-history-html h3 {
          font-size: 1.125rem;
        }

        #development-history .development-history-html ul,
        #development-history .development-history-html ol {
          margin: 0.75rem 0;
          padding-left: 1.5rem;
        }

        #development-history .development-history-html ul {
          list-style: disc;
        }

        #development-history .development-history-html ol {
          list-style: decimal;
        }

        #development-history .development-history-html li {
          margin: 0.25rem 0;
        }

        #development-history .development-history-html blockquote {
          margin: 0.75rem 0;
          border-left: 3px solid #d1d5db;
          padding-left: 1rem;
          color: #4b5563;
        }

        #development-history .development-history-html code {
          border-radius: 0.25rem;
          background: #e5e7eb;
          padding: 0.125rem 0.25rem;
          font-size: 0.875em;
        }

        #development-history .development-history-html pre {
          margin: 0.75rem 0;
          overflow-x: auto;
          border-radius: 0.5rem;
          background: #f3f4f6;
          padding: 0.875rem 1rem;
        }

        #development-history .development-history-html pre code {
          background: transparent;
          padding: 0;
        }

        #development-history .development-history-html a {
          color: #2563eb;
          text-decoration: underline;
        }
      `}</style>
    </div>
  )
}

export default DevelopmentHistoryDetail
