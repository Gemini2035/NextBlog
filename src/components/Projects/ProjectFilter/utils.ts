import Fuse from 'fuse.js'
import type { ProjectListItem } from '@/types/api'
import type { ProjectFilterState } from './types'

/**
 * 使用Fuse.js进行模糊搜索
 */
export function searchProjects(
  projects: ProjectListItem[],
  keyword: string
): ProjectListItem[] {
  if (!keyword.trim()) return projects

  const fuse = new Fuse(projects, {
    keys: [
      { name: 'name', weight: 0.4 },
      { name: 'description', weight: 0.3 },
      { name: 'topics', weight: 0.2 },
      { name: 'primaryLanguage.name', weight: 0.1 }
    ],
    threshold: 0.4,
    includeScore: true,
    ignoreLocation: true
  })

  const results = fuse.search(keyword)
  return results.map(result => result.item)
}

/**
 * 应用筛选条件
 */
export function applyFilters(
  projects: ProjectListItem[],
  filters: ProjectFilterState
): ProjectListItem[] {
  let result = [...projects]

  // 1. 关键词搜索（使用Fuse.js模糊搜索）
  if (filters.keyword.trim()) {
    result = searchProjects(result, filters.keyword)
  }

  // 2. 置顶项目筛选
  if (filters.showPinned !== null) {
    result = result.filter((project) => project.isPinned === filters.showPinned)
  }

  // 3. 我创建的项目筛选（非Fork项目）
  if (filters.showOwned !== null) {
    result = result.filter((project) => !project.isFork === filters.showOwned)
  }

  // 4. 我参与的项目筛选（Fork项目或有多个贡献者）
  if (filters.showContributed !== null) {
    result = result.filter((project) => {
      const isContributed = project.isFork || project.contributorCount > 1
      return isContributed === filters.showContributed
    })
  }

  // 5. Fork 项目筛选
  if (filters.showFork !== null) {
    result = result.filter((project) => project.isFork === filters.showFork)
  }

  // 6. 归档项目筛选
  if (filters.showArchived !== null) {
    result = result.filter(
      (project) => project.isArchived === filters.showArchived
    )
  }

  // 7. 排序（只应用一个排序，优先级从上到下）
  // 使用通用排序函数，始终保证置顶项目在前
  const sortWithPinned = (a: ProjectListItem, b: ProjectListItem, getValue: (item: ProjectListItem) => number, ascending: boolean) => {
    // 置顶项目始终排在前面
    if (a.isPinned && !b.isPinned) return -1
    if (!a.isPinned && b.isPinned) return 1
    
    // 都是置顶或都不是置顶，则按指定排序
    const diff = getValue(a) - getValue(b)
    return ascending ? diff : -diff
  }

  if (filters.starSort) {
    result.sort((a, b) => sortWithPinned(a, b, (item) => item.stars, filters.starSort === 'asc'))
  } else if (filters.forkSort) {
    result.sort((a, b) => sortWithPinned(a, b, (item) => item.forks, filters.forkSort === 'asc'))
  } else if (filters.weightSort) {
    result.sort((a, b) => sortWithPinned(a, b, (item) => item.weight || 0, filters.weightSort === 'asc'))
  } else if (filters.createTimeSort) {
    result.sort((a, b) => sortWithPinned(a, b, (item) => Date.parse(item.createdAt), filters.createTimeSort === 'asc'))
  } else if (filters.updateTimeSort) {
    result.sort((a, b) => sortWithPinned(a, b, (item) => Date.parse(item.updatedAt), filters.updateTimeSort === 'asc'))
  } else if (filters.pushTimeSort) {
    result.sort((a, b) => sortWithPinned(a, b, (item) => Date.parse(item.pushedAt), filters.pushTimeSort === 'asc'))
  } else {
    // 默认按权重降序排序（置顶项目优先）
    result.sort((a, b) => sortWithPinned(a, b, (item) => item.weight || 0, false))
  }

  return result
}
