"use client";

import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { Menu, X, LogOut, User, Settings, LayoutDashboard, CreditCard } from "lucide-react";
import Image from "next/image";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";

// Mobile only nav items
const navItems = [
    { name: "Overview", href: "/dashboard", icon: LayoutDashboard },
    { name: "Subscriptions", href: "/dashboard/subscriptions", icon: CreditCard },
    { name: "Settings", href: "/dashboard/settings", icon: Settings },
];

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const { data: session } = authClient.useSession();
    const dropdownRef = useRef<HTMLDivElement>(null);
    const router = useRouter();

    const toggleMenu = () => setIsOpen(!isOpen);
    const toggleDropdown = () => setDropdownOpen(!dropdownOpen);

    // Close dropdown on outside click
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
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

    return (
        <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="mx-auto flex h-14 max-w-full items-center justify-between px-4 sm:px-6">
                {/* Logo */}
                <Link
                    href={session ? "/dashboard" : "/"}
                    className="flex items-center gap-2 mr-8"
                >
                    <div className="relative h-8 w-8 overflow-hidden rounded-lg">
                        <Image
                            src="/subtrackr-icon.png"
                            alt="SubTrackr"
                            fill
                            className="object-cover"
                        />
                    </div>
                    <span className="text-lg font-bold tracking-tight text-foreground hidden sm:block">
                        SubTrackr
                    </span>
                </Link>

                {/* Desktop User Menu (No Nav Links here, they are in Sidebar) */}
                <div className="hidden md:flex items-center gap-4">
                    {session?.user && (
                        <div className="relative" ref={dropdownRef}>
                            <button
                                onClick={toggleDropdown}
                                className="flex items-center gap-2 rounded-full ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                            >
                                <Avatar className="h-8 w-8 border border-border">
                                    <AvatarImage src={session.user.image || ""} alt="Profile" />
                                    <AvatarFallback className="text-muted-foreground">
                                        {session.user.name?.[0]?.toUpperCase() ?? "U"}
                                    </AvatarFallback>
                                </Avatar>
                            </button>

                            {dropdownOpen && (
                                <div className="absolute right-0 mt-2 w-56 origin-top-right rounded-md border border-border bg-popover p-1 shadow-md text-popover-foreground animate-in fade-in-0 zoom-in-95">
                                    <div className="px-2 py-1.5 text-sm font-semibold">
                                        <p className="truncate">{session.user.name}</p>
                                        <p className="truncate text-xs text-muted-foreground font-normal">
                                            {session.user.email}
                                        </p>
                                    </div>
                                    <div className="h-px bg-border my-1" />
                                    <button onClick={goToProfile} className="relative flex w-full cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-accent hover:text-accent-foreground">
                                        <User className="mr-2 h-4 w-4" /> Profile
                                    </button>
                                    <button onClick={handleSignOut} className="relative flex w-full cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-destructive/10 hover:text-destructive">
                                        <LogOut className="mr-2 h-4 w-4" /> Sign out
                                    </button>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* Mobile Toggle */}
                <button
                    className="inline-flex items-center justify-center rounded-md p-2 text-muted-foreground hover:bg-accent hover:text-accent-foreground md:hidden"
                    onClick={toggleMenu}
                >
                    {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                </button>
            </div>

            {/* Mobile Nav Drawer */}
            {isOpen && (
                <div className="border-t border-border bg-background px-4 py-4 shadow-lg md:hidden animate-in slide-in-from-top-2">
                    {session?.user && (
                        <div className="space-y-4">
                            {/* Mobile Main Nav Links */}
                            <div className="space-y-1 pb-4 border-b border-border">
                                {navItems.map((item) => (
                                    <Link
                                        key={item.href}
                                        href={item.href}
                                        onClick={() => setIsOpen(false)}
                                        className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-foreground hover:bg-accent hover:text-accent-foreground"
                                    >
                                        <item.icon className="h-4 w-4" />
                                        {item.name}
                                    </Link>
                                ))}
                            </div>

                            {/* Mobile User Actions */}
                            <div className="space-y-1">
                                <button onClick={() => { setIsOpen(false); goToProfile(); }} className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-foreground hover:bg-accent hover:text-accent-foreground">
                                    <User className="h-4 w-4" /> Profile
                                </button>
                                <button onClick={() => { setIsOpen(false); handleSignOut(); }} className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-destructive hover:bg-destructive/10">
                                    <LogOut className="h-4 w-4" /> Logout
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </header>
    );
}