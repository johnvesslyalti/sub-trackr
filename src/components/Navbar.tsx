"use client";

import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { signOut, useSession } from "next-auth/react";
import { Menu, X } from "lucide-react";
import Image from "next/image";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useRouter } from "next/navigation"; // ✅

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const { data: session } = useSession();
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter(); // ✅

  const toggleMenu = () => setIsOpen(!isOpen);
  const toggleDropdown = () => setDropdownOpen(!dropdownOpen);

  // Close dropdown if clicked outside
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

  return (
    <header className="w-full border-b bg-white dark:bg-black sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
        {/* Logo */}
        <Link href={session ? "/dashboard" : "/"} className="text-xl font-bold text-primary">
          <div className="flex items-center gap-2">
            <Image
              src="/subtrackr-icon.png"
              alt="SubTrackr"
              width={25}
              height={25}
              className="rounded-sm"
            />
            <span>SubTrackr</span>
          </div>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex gap-6 items-center">
          {session?.user?.image && (
            <div className="relative" ref={dropdownRef}>
              <button onClick={toggleDropdown}>
                <Avatar>
                  <AvatarImage src={session.user.image} alt="Profile" />
                  <AvatarFallback>
                    {session.user.name?.[0] ?? "U"}
                  </AvatarFallback>
                </Avatar>
              </button>

              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-40 bg-white dark:bg-zinc-900 shadow-md rounded-md py-2 z-50">
                  <button
                    onClick={goToProfile}
                    className="w-full text-left px-4 py-2 text-sm hover:bg-zinc-100 dark:hover:bg-zinc-800"
                  >
                    Profile
                  </button>
                  <button
                    onClick={() => signOut({ callbackUrl: "/" })}
                    className="w-full text-left px-4 py-2 text-sm hover:bg-zinc-100 dark:hover:bg-zinc-800"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          )}
        </nav>

        {/* Mobile Nav Toggle */}
        <button
          className="md:hidden text-muted-foreground"
          onClick={toggleMenu}
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Nav */}
      {isOpen && (
        <nav className="md:hidden px-4 pb-4 space-y-2">
          {session?.user?.image && (
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Avatar>
                  <AvatarImage src={session.user.image} alt="Profile" />
                  <AvatarFallback>
                    {session.user.name?.[0] ?? "U"}
                  </AvatarFallback>
                </Avatar>
                <span>{session.user.name}</span>
              </div>
              <button
                onClick={() => {
                  setIsOpen(false);
                  goToProfile();
                }}
                className="text-left text-sm text-muted-foreground hover:text-primary"
              >
                Profile
              </button>
              <button
                onClick={() => {
                  setIsOpen(false);
                  signOut({ callbackUrl: "/" });
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
  );
}
