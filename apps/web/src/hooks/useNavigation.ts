import { useSiteData } from '@/components/SiteDataProvider'

export function useNavigation() {
  const { navigation } = useSiteData()

  return {
    navigationItems: navigation,
  }
}
