export type ProjectCategory =
  | 'featured'
  | 'active'
  | 'stable'
  | 'completed'
  | 'archived'
  | 'fork'
  | 'learning'

export function categorizeProject(project: {
  isArchived: boolean
  isFork: boolean
  updatedAt: string
  name: string
  description?: string | null
}): ProjectCategory {
  if (project.isArchived) {
    return 'archived'
  }

  if (project.isFork) {
    return 'fork'
  }

  const now = new Date()
  const updatedAt = new Date(project.updatedAt)
  const daysSinceUpdate = Math.floor((now.getTime() - updatedAt.getTime()) / (1000 * 60 * 60 * 24))
  const learningKeywords = ['learn', 'tutorial', 'practice', 'demo', 'example', 'study', 'exercise']
  const isLearning = learningKeywords.some(
    (keyword) =>
      project.name.toLowerCase().includes(keyword) ||
      (project.description?.toLowerCase() ?? '').includes(keyword)
  )

  if (isLearning) {
    return 'learning'
  }

  if (daysSinceUpdate <= 90) {
    return 'active'
  }

  if (daysSinceUpdate <= 180) {
    return 'stable'
  }

  return 'completed'
}
