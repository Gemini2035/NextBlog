'use client'

import { TagOption } from './types'

interface TagFilterProps {
  tags: TagOption[]
  selectedTags: string[]
  onChange: (selectedTags: string[]) => void
}

export function TagFilter({ tags, selectedTags, onChange }: TagFilterProps) {
  const handleTagToggle = (tagValue: string) => {
    if (selectedTags.includes(tagValue)) {
      onChange(selectedTags.filter(tag => tag !== tagValue))
    } else {
      onChange([...selectedTags, tagValue])
    }
  }

  return (
    <div className="space-y-2">
      {tags.length === 0 ? (
        <p className="text-sm text-gray-500">暂无标签</p>
      ) : (
        <div className="flex flex-wrap gap-2">
          {tags.map((tag) => (
            <button
              key={tag.value}
              onClick={() => handleTagToggle(tag.value)}
              className={`px-2 py-1 text-xs rounded-full border transition-colors cursor-pointer ${
                selectedTags.includes(tag.value)
                  ? 'bg-blue-500 text-white border-blue-500'
                  : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
              }`}
            >
              {tag.label} ({tag.count})
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
