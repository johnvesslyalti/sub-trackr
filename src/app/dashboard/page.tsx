// src/app/(dashboard)/page.tsx
import { getDashboardStats } from "@/server/subscription/stats";
import { DashboardView } from "@/components/dashboard/DashboardView";

export default async function DashboardPage() {
    const stats = await getDashboardStats();

    return (
        <div className="p-8">
            <div className="mb-8">
                <h1 className="text-2xl font-bold tracking-tight text-gray-900">Dashboard</h1>
                <p className="text-gray-500">Overview of your subscription expenses</p>
            </div>

            <DashboardView stats={stats} />
        </div>
    );
}