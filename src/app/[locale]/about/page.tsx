import ServerComponent from '@/components/ServerComponent'
import AboutPageClient from '@/components/About'
import { getAboutInit } from '@/apis/about/server'

interface AboutPageProps {
  params: Promise<{
    locale: string
  }>
}

async function getAboutServerData(params: AboutPageProps['params']) {
  const { locale } = await params

  return {
    aboutInit: await getAboutInit(locale),
  }
}

export default function AboutPage({ params }: AboutPageProps) {
  return <ServerComponent dataPromise={getAboutServerData(params)} ClientComponent={AboutPageClient} />
}
