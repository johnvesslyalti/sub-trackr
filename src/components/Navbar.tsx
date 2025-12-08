"use client";

import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { Menu, X, LogOut, User, Settings } from "lucide-react"; // Added icons
import Image from "next/image";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";

export default function Navbar() {
  // --- LOGIC (Unchanged) ---
  const [isOpen, setIsOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const { data: session } = authClient.useSession();
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const toggleMenu = () => setIsOpen(!isOpen);
  const toggleDropdown = () => setDropdownOpen(!dropdownOpen);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const goToProfile = () => {
    setDropdownOpen(false);
    router.push("/profile");
  };

  const handleSignOut = async () => {
    await authClient.signOut();
    router.push("/");
  };
  // -------------------------

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-white/80 backdrop-blur-md dark:bg-black/80">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
        {/* Logo */}
        <Link 
          href={session ? "/dashboard" : "/"} 
          className="flex items-center gap-2 transition-opacity hover:opacity-90"
        >
          <div className="relative h-8 w-8 overflow-hidden rounded-lg border border-indigo-100 shadow-sm">
            <Image
              src="/subtrackr-icon.png"
              alt="SubTrackr"
              fill
              className="object-cover"
            />
          </div>
          <span className="text-lg font-bold tracking-tight text-gray-900 dark:text-white">
            SubTrackr
          </span>
        </Link>

        {/* Desktop Nav / User Menu */}
        <nav className="hidden items-center gap-6 md:flex">
          {session?.user && (
            <div className="relative" ref={dropdownRef}>
              <button 
                onClick={toggleDropdown} 
                className="flex items-center gap-2 rounded-full ring-offset-background transition-all hover:ring-2 hover:ring-indigo-500 hover:ring-offset-2 focus:outline-none"
              >
                <Avatar className="h-9 w-9 border border-gray-200 shadow-sm">
                  <AvatarImage src={session.user.image || ""} alt="Profile" />
                  <AvatarFallback className="bg-indigo-50 text-indigo-600 font-semibold">
                    {session.user.name?.[0]?.toUpperCase() ?? "U"}
                  </AvatarFallback>
                </Avatar>
              </button>

              {/* Refactored Dropdown */}
              {dropdownOpen && (
                <div className="absolute right-0 mt-3 w-56 origin-top-right rounded-xl border border-gray-100 bg-white p-1 shadow-lg ring-1 ring-black ring-opacity-5 animate-in fade-in zoom-in-95 duration-100 dark:bg-zinc-900 dark:border-zinc-800">
                  
                  {/* User Info Header */}
                  <div className="px-3 py-2.5 border-b border-gray-100 dark:border-zinc-800 mb-1">
                    <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                      {session.user.name}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                      {session.user.email}
                    </p>
                  </div>

                  <button
                    onClick={goToProfile}
                    className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-indigo-600 dark:text-gray-300 dark:hover:bg-zinc-800 transition-colors"
                  >
                    <User size={16} />
                    Profile
                  </button>
                  
                  {/* Optional Settings Link placeholder */}
                  <button className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-indigo-600 dark:text-gray-300 dark:hover:bg-zinc-800 transition-colors">
                     <Settings size={16} />
                     Settings
                  </button>

                  <div className="my-1 h-px bg-gray-100 dark:bg-zinc-800" />

                  <button
                    onClick={handleSignOut}
                    className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                  >
                    <LogOut size={16} />
                    Sign out
                  </button>
                </div>
              )}
            </div>
          )}
        </nav>

        {/* Mobile Nav Toggle */}
        <button
          className="rounded-md p-2 text-gray-500 hover:bg-gray-100 md:hidden dark:text-gray-400 dark:hover:bg-zinc-800"
          onClick={toggleMenu}
        >
          {isOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile Nav Drawer */}
      {isOpen && (
        <div className="border-t border-gray-100 bg-white px-4 py-4 shadow-lg md:hidden dark:bg-zinc-950 dark:border-zinc-800 animate-in slide-in-from-top-5">
          {session?.user && (
            <div className="space-y-4">
              <div className="flex items-center gap-3 px-2">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={session.user.image || ""} />
                  <AvatarFallback>{session.user.name?.[0] ?? "U"}</AvatarFallback>
                </Avatar>
                <div className="flex flex-col">
                    <span className="font-medium text-sm">{session.user.name}</span>
                    <span className="text-xs text-gray-500">{session.user.email}</span>
                </div>
              </div>
              
              <div className="space-y-1">
                <button
                  onClick={() => { setIsOpen(false); goToProfile(); }}
                  className="flex w-full items-center gap-2 rounded-md p-2 text-sm font-medium hover:bg-gray-100 dark:hover:bg-zinc-800"
                >
                  <User size={16} /> Profile
                </button>
                <button
                  onClick={() => { setIsOpen(false); handleSignOut(); }}
                  className="flex w-full items-center gap-2 rounded-md p-2 text-sm font-medium text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                >
                  <LogOut size={16} /> Logout
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </header>
  );
}