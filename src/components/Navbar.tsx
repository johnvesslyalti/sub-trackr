'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState, useEffect, useRef } from 'react'
import { signOut, useSession } from 'next-auth/react'
import { Menu, X } from 'lucide-react'
import Image from 'next/image'
import { cn } from '@/lib/utils'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

const links = [
  { href: '/', label: 'Home' },
  { href: '/subscriptions', label: 'Subscriptions' },
  { href: '/profile', label: 'Profile' },
]

export default function Navbar() {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const { data: session } = useSession()
  const dropdownRef = useRef<HTMLDivElement>(null)

  const toggleDropdown = () => setDropdownOpen(!dropdownOpen)
  const closeMobileMenu = () => setIsOpen(false)

  // Close avatar dropdown if clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <header className="w-full border-b bg-background text-foreground sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
        {/* Logo */}
        <Link href="/" aria-label="SubTrackr Home" className="text-xl font-bold text-primary">
          <div className="flex items-center gap-2">
            <Image src="/subtrackr-icon.png" alt="Logo" width={28} height={28} className="rounded-sm" />
            <span>SubTrackr</span>
          </div>
        </Link>

        {/* Desktop Menu */}
        <nav className="hidden md:flex items-center gap-6">
          {links.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className={cn(
                'text-sm font-medium transition hover:text-primary',
                pathname === href ? 'text-primary' : 'text-muted-foreground'
              )}
            >
              {label}
            </Link>
          ))}

          {/* Authenticated Dropdown */}
          {session?.user?.image && (
            <div ref={dropdownRef} className="relative">
              <button onClick={toggleDropdown} aria-label="Toggle profile dropdown">
                <Avatar className="cursor-pointer">
                  <AvatarImage src={session.user.image} alt="User profile image" />
                  <AvatarFallback>{session.user.name?.[0] ?? 'U'}</AvatarFallback>
                </Avatar>
              </button>

              {dropdownOpen && (
                <div className="absolute right-0 mt-3 w-40 bg-white dark:bg-zinc-900 rounded-md shadow-lg py-2 z-50">
                  <Link
                    href="/profile"
                    className="block px-4 py-2 text-sm hover:bg-zinc-100 dark:hover:bg-zinc-800"
                    onClick={() => setDropdownOpen(false)}
                  >
                    Profile
                  </Link>
                  <button
                    onClick={() => signOut({ callbackUrl: '/' })}
                    className="w-full text-left px-4 py-2 text-sm hover:bg-zinc-100 dark:hover:bg-zinc-800"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          )}
        </nav>

        {/* Mobile Hamburger Icon */}
        <button
          className="md:hidden text-muted-foreground focus:outline-none"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle mobile menu"
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <nav className="md:hidden px-4 pb-4 space-y-2">
          {links.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              onClick={closeMobileMenu}
              className={cn(
                'block text-sm font-medium transition-colors hover:text-primary',
                pathname === href ? 'text-primary' : 'text-muted-foreground'
              )}
            >
              {label}
            </Link>
          ))}

          {/* Mobile Dropdown */}
          {session?.user && (
            <div className="mt-4 border-t pt-4 space-y-2">
              <div className="flex items-center gap-2">
                <Avatar>
                  <AvatarImage src={session.user.image} alt="User profile image" />
                  <AvatarFallback>{session.user.name?.[0] ?? 'U'}</AvatarFallback>
                </Avatar>
                <span className="text-sm font-medium">{session.user.name}</span>
              </div>
              <Link
                href="/profile"
                onClick={closeMobileMenu}
                className="block text-sm text-muted-foreground hover:text-primary"
              >
                Profile
              </Link>
              <button
                onClick={() => {
                  closeMobileMenu()
                  signOut({ callbackUrl: '/' })
                }}
                className="text-left text-sm text-muted-foreground hover:text-primary"
              >
                Logout
              </button>
            </div>
          )}
        </nav>
      )}
    </header>
  )
}
