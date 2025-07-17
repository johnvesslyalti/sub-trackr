// components/theme-toggle.tsx
'use client'

import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => setMounted(true), [])

  if (!mounted) return null

  return (
    <div className="inline-flex rounded-md border dark:border-gray-700 p-1 bg-muted">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setTheme('light')}
        className={cn(
          'rounded-l-md px-4 text-sm',
          theme === 'light' && 'bg-white text-black dark:bg-gray-200'
        )}
      >
        ☀️ Light
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setTheme('dark')}
        className={cn(
          'rounded-r-md px-4 text-sm',
          theme === 'dark' && 'bg-gray-900 text-white'
        )}
      >
        🌙 Dark
      </Button>
    </div>
  )
}