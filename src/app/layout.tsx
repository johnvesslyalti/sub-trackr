//app/layout.tsx
import './globals.css';
import type { Metadata } from 'next'; // 1. Import Metadata type
import { ThemeProvider } from "../components/ThemeProvider";
import Footer from '@/components/Footer';
import { SidebarGuard } from '@/components/dashboard/SidebarGuard';
import NavbarGuard from '@/components/NavbarGuard';

// 2. Define Metadata using the Next.js API
export const metadata: Metadata = {
    title: "SubTrackr",
    description: "Track your subscriptions efficiently", // Add a description
    viewport: "width=device-width, initial-scale=1",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        // 3. Add lang attribute
        <html lang="en" suppressHydrationWarning>
            <body>
                <ThemeProvider
                    attribute="class"
                    defaultTheme="system"
                    enableSystem={true}
                    disableTransitionOnChange={true}
                >
                    {/* H-screen ensures it takes exactly the browser height */}
                    <div className="flex h-screen flex-col bg-background text-foreground">
                        {/* 1. Global Navbar (Fixed at top) */}
                        <NavbarGuard />

                        {/* Flex container for Sidebar + Main Content */}
                        <div className="flex flex-1 overflow-hidden">
                            {/* 2. Sidebar (Fixed width) */}
                            <SidebarGuard />

                            {/* 3. Main Content Wrapper (Scrollable) */}
                            {/* We made this a flex-col so the footer sits at the bottom */}
                            <main className="flex flex-1 flex-col overflow-y-auto">

                                {/* Content Area - flex-1 pushes footer down if content is short */}
                                <div className="flex-1 container mx-auto p-4 sm:p-6 lg:p-8 max-w-7xl">
                                    {children}
                                </div>

                                {/* 4. Footer (Now inside the scrollable area) */}
                                <footer>
                                    <Footer />
                                </footer>
                            </main>
                        </div>
                    </div>
                </ThemeProvider>
            </body>
        </html>
    )
}