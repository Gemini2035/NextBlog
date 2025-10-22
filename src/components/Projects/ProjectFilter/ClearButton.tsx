'use client'

import { Button } from '@/ui'

interface ClearButtonProps {
  onClear: () => void
  label: string
}

export function ClearButton({ onClear, label }: ClearButtonProps) {
  return (
    <Button
      type="outline"
      size="sm"
      onClick={onClear}
      className="w-full sm:w-auto flex-shrink-0"
      rounded={true}
    >
      {label}
    </Button>
  )
}

