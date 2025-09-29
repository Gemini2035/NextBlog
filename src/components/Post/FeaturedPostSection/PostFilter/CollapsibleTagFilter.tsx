'use client'

import { useTranslations } from 'next-intl'
import { Collapse, CollapsePanel } from '@/ui'
import { cn } from '@/utils'
import { TagOption } from './types'

interface CollapsibleTagFilterProps {
  tags: TagOption[]
  selectedTags: string[]
  onChange: (selectedTags: string[]) => void
}

export function CollapsibleTagFilter({ tags, selectedTags, onChange }: CollapsibleTagFilterProps) {
  const t = useTranslations('PostFilter')
  
  const handleTagToggle = (tagValue: string) => {
    if (selectedTags.includes(tagValue)) {
      onChange(selectedTags.filter(tag => tag !== tagValue))
    } else {
      onChange([...selectedTags, tagValue])
    }
  }

  const selectedCount = selectedTags.length

  return (
    <Collapse variant="default" size="sm" className="bg-gray-50 rounded-md">
      <CollapsePanel
        key="tag-filter"
        header={
          <span className="text-sm font-medium text-gray-700">
            {t('tagFilter')} {selectedCount > 0 && `(${selectedCount})`}
          </span>
        }
        headerContainerClassName="p-0! border-0! rounded-0!"
        contentClassName="px-3 py-3"
        showArrow={true}
      >
        {tags.length === 0 ? (
          <p className="text-sm text-gray-500">{t('noTags')}</p>
        ) : (
          <div className="flex flex-wrap gap-2">
            {tags.map((tag) => (
              <button
                key={tag.value}
                onClick={() => handleTagToggle(tag.value)}
                className={cn(
                  "px-2 py-1 text-xs rounded-full border transition-colors",
                  selectedTags.includes(tag.value)
                    ? 'bg-blue-500 text-white border-blue-500'
                    : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                )}
              >
                {tag.label} ({tag.count})
              </button>
            ))}
          </div>
        )}
      </CollapsePanel>
    </Collapse>
  )
}
