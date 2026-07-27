import type { SiteNavigationItem } from '@/types/site'

type NavigationLocale = 'zh' | 'en' | 'ja' | string

const projectLabels: Record<'zh' | 'en' | 'ja', Array<{ label: string; description: string; href: string }>> = {
  zh: [
    { label: '置顶项目', description: '优先展示的代表项目', href: '/projects?pinned=true' },
    { label: '我的项目', description: '由我维护的项目', href: '/projects?owned=true' },
    { label: '协作项目', description: '参与贡献的开源项目', href: '/projects?contributed=true' },
    { label: 'Fork 项目', description: 'Fork 与二次开发项目', href: '/projects?fork=true' },
    { label: '归档项目', description: '已归档的历史项目', href: '/projects?archived=true' },
  ],
  en: [
    { label: 'Pinned', description: 'Representative projects shown first', href: '/projects?pinned=true' },
    { label: 'Owned', description: 'Projects maintained by me', href: '/projects?owned=true' },
    { label: 'Contributed', description: 'Open-source projects I contributed to', href: '/projects?contributed=true' },
    { label: 'Forks', description: 'Forked and extended projects', href: '/projects?fork=true' },
    { label: 'Archived', description: 'Historical archived projects', href: '/projects?archived=true' },
  ],
  ja: [
    { label: 'ピン留め', description: '優先表示する代表プロジェクト', href: '/projects?pinned=true' },
    { label: '自分のプロジェクト', description: '自分が保守しているプロジェクト', href: '/projects?owned=true' },
    { label: 'コントリビュート', description: '参加したオープンソースプロジェクト', href: '/projects?contributed=true' },
    { label: 'Fork', description: 'Fork と拡張プロジェクト', href: '/projects?fork=true' },
    { label: 'アーカイブ', description: 'アーカイブ済みの履歴プロジェクト', href: '/projects?archived=true' },
  ],
}

const projectGroupLabels: Record<'zh' | 'en' | 'ja', { label: string; description: string }> = {
  zh: { label: '项目目录', description: '按状态和参与方式浏览项目' },
  en: { label: 'Project directory', description: 'Browse by status and involvement' },
  ja: { label: 'プロジェクトディレクトリ', description: '状態と関わり方で閲覧' },
}

function getProjectLocale(locale: NavigationLocale): 'zh' | 'en' | 'ja' {
  if (locale === 'en' || locale === 'ja') return locale
  return 'zh'
}

function createProjectSubmenu(project: SiteNavigationItem, locale: NavigationLocale): SiteNavigationItem[] {
  const resolvedLocale = getProjectLocale(locale)
  const group = projectGroupLabels[resolvedLocale]

  return [
    {
      id: project.id * 1000 + 1,
      parentId: project.id,
      key: `${project.key}-directory`,
      label: group.label,
      description: group.description,
      href: project.href,
      icon: project.icon,
      target: project.target,
      dynamicDataKey: null,
      sortOrder: 0,
      items: projectLabels[resolvedLocale].map((item, index) => ({
        id: project.id * 1000 + index + 2,
        parentId: project.id * 1000 + 1,
        key: `${project.key}-${index}`,
        label: item.label,
        description: item.description,
        href: item.href,
        icon: project.icon,
        target: null,
        dynamicDataKey: null,
        sortOrder: index,
        items: [],
      })),
    },
  ]
}

export function withProjectSubmenu(
  navigationItems: SiteNavigationItem[],
  locale: NavigationLocale
): SiteNavigationItem[] {
  return navigationItems.map((item) => {
    if (item.key !== 'projects' || item.items.length > 0) {
      return item
    }

    return {
      ...item,
      items: createProjectSubmenu(item, locale),
    }
  })
}
