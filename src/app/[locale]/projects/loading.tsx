'use client'

import { useTranslations } from 'next-intl'
import { PageLoading } from '@/components/PageLoading'

export default function Loading() {
  const t = useTranslations('Common')

  return <PageLoading text={t('loading')} />
}