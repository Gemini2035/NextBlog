import ServerComponent from '@/components/ServerComponent'
import AboutPageClient from '@/components/About'

export default function AboutPage() {
  
  const fetchAboutServerData = async () => {
    return {}
  }
  return <ServerComponent fetchServerData={fetchAboutServerData} ClientComponent={AboutPageClient} />
}
