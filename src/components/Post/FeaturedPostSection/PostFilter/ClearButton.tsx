'use client'

interface ClearButtonProps {
  onClear: () => void
  label: string
}

export function ClearButton({ onClear, label }: ClearButtonProps) {
  return (
    <button
      onClick={onClear}
      className="w-full sm:w-auto px-3 py-2 text-xs text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50 hover:border-gray-400 transition-colors"
    >
      {label}
    </button>
  )
}
