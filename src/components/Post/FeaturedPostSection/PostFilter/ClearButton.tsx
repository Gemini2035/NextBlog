'use client'

interface ClearButtonProps {
  onClear: () => void
  label: string
  disabled?: boolean
}

export function ClearButton({ onClear, label, disabled = false }: ClearButtonProps) {
  return (
    <button
      onClick={onClear}
      disabled={disabled}
      className="w-full sm:w-auto px-3 py-2 text-xs text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50 hover:border-gray-400 transition-colors cursor-pointer disabled:cursor-default disabled:opacity-60"
    >
      {label}
    </button>
  )
}
