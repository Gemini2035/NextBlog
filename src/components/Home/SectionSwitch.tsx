"use client"
import BlogSection from './BlogSection/index'
import AboutSection from './AboutSection/index'
import ProjectsSection from './ProjectsSection/index'
import ResourcesSection from './ResourcesSection/index'
import type { NavigationItem } from '@/constants'

export interface SectionSwitchProps {
  item: Pick<NavigationItem, 'type' | 'href'>
  index: number
}

export default function SectionSwitch({ item, index }: SectionSwitchProps) {
  switch (item.type) {
    case '__blog':
      return <BlogSection index={index} href={item.href} />
    case '__about':
      return <AboutSection index={index} href={item.href} />
    case '__projects':
      return <ProjectsSection index={index} href={item.href} />
    case '__resources':
      return <ResourcesSection index={index} href={item.href} />
    default:
      return null
  }
}


