import ServerComponent from '@/components/ServerComponent'
import HomeClient from '@/components/Home'

export default async function Home() {
  const fetchHomeServerData = async () => {
    return {}
  }

  return <ServerComponent fetchServerData={fetchHomeServerData} ClientComponent={HomeClient} />
}
