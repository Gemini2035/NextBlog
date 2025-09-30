import { useTranslations } from 'next-intl'
import { useNavigation } from '@/hooks'
import SectionSwitch from '@/components/Home/SectionSwitch'
import HomeSectionSkeleton from '@/components/Home/HomeSectionSkeleton'

export default function Home() {
  const t = useTranslations('HomePage')
  const { navigationItems } = useNavigation()

  // 过滤掉非内容型导航（如搜索、语言）
  const contentNavs = navigationItems.filter(item => item.type !== '__search' && item.type !== '__language')
  const getNav = (type: string) => contentNavs.find(n => n.type === type)

  const sections = [
    getNav('__blog'),
    getNav('__about'),
    getNav('__projects'),
    getNav('__resources')
  ].filter(Boolean) as Array<{ type: '__blog' | '__about' | '__projects' | '__resources'; href: string }>

  return (
    <div className="py-10 sm:py-14 lg:py-16">
      {/* Hero（居中容器）*/}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <section className="text-center mb-10 sm:mb-16">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-gray-900">
            {t('welcome')}
          </h1>
          <p className="mt-4 sm:mt-6 text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto">
            {t('description')}
          </p>
        </section>
      </div>

      {/* Full-bleed Sections */}
      <div className="space-y-6 sm:space-y-8 lg:space-y-12">
        {sections.length === 0 ? (
          <HomeSectionSkeleton index={0} />
        ) : (
          sections.map((item, idx) => (
            <SectionSwitch key={item.type} item={item} index={idx} />
          ))
        )}
      </div>
    </div>
  )
}
