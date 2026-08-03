'use client'

import { Button } from '@/ui'

interface ClearButtonProps {
  onClear: () => void
  label: string
  disabled?: boolean
}

export function ClearButton({ onClear, label, disabled = false }: ClearButtonProps) {
  return (
    <Button
      type="outline"
      size="sm"
      onClick={onClear}
      disabled={disabled}
      className="w-full sm:w-auto shrink-0"
      rounded={true}
    >
      {label}
    </Button>
  )
}
