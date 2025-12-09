'use client';

import { usePathname } from "next/navigation";
import Navbar from "./Navbar";

export default function NavbarGuard() {
    const pathName = usePathname();

    if (pathName != "/") return <Navbar />
}