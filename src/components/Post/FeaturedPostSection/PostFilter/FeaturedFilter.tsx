'use client'

interface FeaturedFilterProps {
  value: boolean | null
  onChange: (value: boolean | null) => void
  allLabel: string
  featuredLabel: string
  nonFeaturedLabel: string
}

export function FeaturedFilter({ 
  value, 
  onChange, 
  allLabel, 
  featuredLabel, 
  nonFeaturedLabel 
}: FeaturedFilterProps) {
  const options = [
    { value: null, label: allLabel },
    { value: true, label: featuredLabel },
    { value: false, label: nonFeaturedLabel }
  ]

  return (
    <div className="space-y-2">
      {options.map((option) => (
        <label key={option.value === null ? 'all' : option.value.toString()} className="flex items-center">
          <input
            type="radio"
            name="featured-filter"
            checked={value === option.value}
            onChange={() => onChange(option.value)}
            className="mr-2 text-blue-600 focus:ring-blue-500"
          />
          <span className="text-xs text-gray-700">{option.label}</span>
        </label>
      ))}
    </div>
  )
}
