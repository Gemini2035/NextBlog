import { ComponentType, Suspense } from 'react'
import { RouteLoadingMask } from '@/components/RouteLoadingMask'

interface ServerComponentProps<T extends object> {
  dataPromise: Promise<T>
  ClientComponent: ComponentType<T>
  metaData?: Record<string, string>
}

async function ServerDataComponent<T extends object>({
  dataPromise,
  ClientComponent,
}: ServerComponentProps<T>) {
  const props = await dataPromise
  return <ClientComponent {...props} />
}

export default function ServerComponent<T extends object>({
  dataPromise,
  ClientComponent,
}: ServerComponentProps<T>) {
  return (
    <Suspense fallback={<RouteLoadingMask />}>
      <ServerDataComponent dataPromise={dataPromise} ClientComponent={ClientComponent} />
    </Suspense>
  )
}
