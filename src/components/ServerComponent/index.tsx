import { ComponentType, Suspense } from 'react'
import { getTranslations } from 'next-intl/server'
import { PageLoading } from '../PageLoading'

interface ServerComponentProps<T extends object> {
  fetchServerData: () => Promise<T>
  ClientComponent: ComponentType<T>
  metaData?: Record<string, string>
}

async function ServerDataComponent<T extends object>({
  fetchServerData,
  ClientComponent,
}: ServerComponentProps<T>) {
  const props = await fetchServerData()
  return <ClientComponent {...props} />
}

export default async function ServerComponent<T extends object>({
  fetchServerData,
  ClientComponent,
}: ServerComponentProps<T>) {
  const t = await getTranslations('Common')

  return (
    <Suspense fallback={<PageLoading text={t('loading')} />}>
      <ServerDataComponent fetchServerData={fetchServerData} ClientComponent={ClientComponent} />
    </Suspense>
  )
}
