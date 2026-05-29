import { getTranslations } from 'next-intl/server'
import NotFoundContent from './not-found-content'

export default async function NotFound() {
  const t = await getTranslations('NotFound')

  return (
    <NotFoundContent
      title={t('title')}
      description={t('description')}
      goBack={t('goBack')}
      orGoHome={t('orGoHome')}
    />
  )
}
