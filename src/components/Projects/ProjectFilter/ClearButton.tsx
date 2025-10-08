'use client'

import { Button } from '@/ui'

interface ClearButtonProps {
  onClear: () => void
  label: string
}

export function ClearButton({ onClear, label }: ClearButtonProps) {
  return (
    <Button
      type="default"
      size="sm"
      onClick={onClear}
      className="w-full sm:w-auto"
    >
      {label}
    </Button>
  )
}

