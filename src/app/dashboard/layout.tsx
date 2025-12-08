import { Sidebar } from "@/components/dashboard/Sidebar";
import Navbar from "@/components/Navbar";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export default async function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const session = await auth.api.getSession({
        headers: await headers()
    });

    if (!session) {
        redirect("/sign-in");
    }

    return (
        <div className="flex min-h-screen flex-col bg-background text-foreground">
            {/* 1. Global Navbar */}
            <Navbar />

            <div className="flex flex-1 overflow-hidden">
                {/* 2. Sidebar (Theme aware, hidden on mobile) */}
                <Sidebar />

                {/* 3. Main Content Area */}
                <main className="flex-1 overflow-y-auto">
                    <div className="container mx-auto p-4 sm:p-6 lg:p-8 max-w-7xl">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
}