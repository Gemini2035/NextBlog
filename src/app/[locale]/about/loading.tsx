'use client'

import { useTranslations } from 'next-intl'
import { PageLoading } from '@/components/PageLoading'

export default function Loading() {
  const t = useTranslations('EmptyState')

  return <PageLoading text={t('loading')} />
}