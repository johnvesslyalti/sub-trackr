"use client";

import { usePathname } from "next/navigation";
import { Sidebar } from "./Sidebar";

// Hide the sidebar on the marketing/landing page.
export function SidebarGuard() {
    const pathname = usePathname();

    if (pathname === "/") {
        return null;
    }

    return <Sidebar />;
}

