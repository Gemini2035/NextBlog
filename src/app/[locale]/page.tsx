import ServerComponent from '@/components/ServerComponent'
import HomeClient from '@/components/Home'
import { getHomeInit } from '@/apis/home/server'

interface HomePageProps {
  params: Promise<{
    locale: string
  }>
}

async function getHomeServerData(params: HomePageProps['params']) {
  const { locale } = await params

  return {
    homeInit: await getHomeInit(locale),
  }
}

export default function Home({ params }: HomePageProps) {
  return <ServerComponent dataPromise={getHomeServerData(params)} ClientComponent={HomeClient} />
}
