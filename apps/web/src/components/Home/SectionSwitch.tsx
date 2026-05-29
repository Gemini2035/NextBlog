"use client"
import BlogSection from './BlogSection/index'
import AboutSection from './AboutSection/index'
import ProjectsSection from './ProjectsSection/index'
import type { SiteNavigationItem } from '@/types/site'
import type { HomeInitPayload } from '@/types/home'

export interface SectionSwitchProps {
  item: SiteNavigationItem
  index: number
  homeInit: HomeInitPayload
}

export default function SectionSwitch({ item, index, homeInit }: SectionSwitchProps) {
  switch (item.key) {
    case 'blog':
      return <BlogSection index={index} item={item} posts={homeInit.posts} />
    case 'about':
      return <AboutSection index={index} item={item} />
    case 'projects':
      return <ProjectsSection index={index} item={item} />
    default:
      return null
  }
}
