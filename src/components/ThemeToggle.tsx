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
          'px-3 text-sm rounded-l-md',
          theme === 'light' && 'bg-white text-black dark:bg-gray-200'
        )}
      >
        ☀️
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setTheme('dark')}
        className={cn(
          'px-3 text-sm',
          theme === 'dark' && 'bg-gray-900 text-white'
        )}
      >
        🌙 
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setTheme('system')}
        className={cn(
          'px-3 text-sm rounded-r-md',
          theme === 'system' && 'bg-muted-foreground text-background'
        )}
      >
        💻
      </Button>
    </div>
  )
}