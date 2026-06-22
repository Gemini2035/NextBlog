import type { CSSProperties } from 'react'
import type { DevelopmentHistoryItem, DevelopmentHistoryTerm } from './types'

export const getTermStyle = (term: DevelopmentHistoryTerm): CSSProperties | undefined => {
  if (!term.textColor && !term.backgroundColor) return undefined

  return {
    backgroundColor: term.backgroundColor ?? undefined,
    borderColor: term.backgroundColor ?? undefined,
    color: term.textColor ?? undefined,
  }
}

const formatMonth = (value?: string | null) => {
  if (!value) return ''

  const match = value.match(/^(\d{4})-(\d{1,2})/)
  if (!match) return value

  return `${match[1]}.${Number(match[2])}`
}

export const formatPeriod = (item: DevelopmentHistoryItem, presentText: string) => {
  const start = formatMonth(item.periodStart)
  const end = item.isCurrent ? presentText : formatMonth(item.periodEnd)

  if (start && end) return `${start} - ${end}`
  return start || end
}

export const getDisplayVersion = (version?: string | null, isRoot = false) => {
  if (!version) return ''
  return isRoot ? `${version}.X` : version
}
