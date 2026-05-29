import ServerComponent from '@/components/ServerComponent'
import AboutPageClient from '@/components/About'
import { getAboutInit } from '@/apis/about/server'

interface AboutPageProps {
  params: Promise<{
    locale: string
  }>
}

export default async function AboutPage({ params }: AboutPageProps) {
  const { locale } = await params
  const fetchAboutServerData = async () => {
    return {
      aboutInit: await getAboutInit(locale),
    }
  }
  return <ServerComponent fetchServerData={fetchAboutServerData} ClientComponent={AboutPageClient} />
}
