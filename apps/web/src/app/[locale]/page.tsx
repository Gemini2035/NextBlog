import ServerComponent from '@/components/ServerComponent'
import HomeClient from '@/components/Home'
import { getHomeInit } from '@/apis/home/server'

interface HomePageProps {
  params: Promise<{
    locale: string
  }>
}

export default async function Home({ params }: HomePageProps) {
  const { locale } = await params
  const fetchHomeServerData = async () => {
    return {
      homeInit: await getHomeInit(locale),
    }
  }

  return <ServerComponent fetchServerData={fetchHomeServerData} ClientComponent={HomeClient} />
}
