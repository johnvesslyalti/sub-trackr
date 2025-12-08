import { getDashboardStats } from "@/server/subscription/stats"
import { Activity, CreditCard, UserX } from "lucide-react"

export default async function StatsCard() {
    const stats = await getDashboardStats()

    // Helper to format currency (e.g., 1200 -> $1,200.00)
    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "USD",
        }).format(amount)
    }

    return (
        <div className="grid gap-4 md:grid-cols-3">
            {/* Active Subscriptions Card */}
            <Card
                title="Active Subscriptions"
                value={stats.activeCount}
                icon={<Activity className="h-4 w-4 text-emerald-500" />}
                description="Current active users"
            />

            {/* Canceled Subscriptions Card */}
            <Card
                title="Canceled"
                value={stats.canceledCount}
                icon={<UserX className="h-4 w-4 text-rose-500" />}
                description="Total cancellations"
            />

            {/* Monthly Spend Card */}
            <Card
                title="Est. Monthly Spend"
                value={formatCurrency(stats.estimatedMonthlySpend)}
                icon={<CreditCard className="h-4 w-4 text-blue-500" />}
                description=" projected recurring revenue"
            />
        </div>
    )
}

// Reusable Sub-component for consistency
function Card({
    title,
    value,
    icon,
    description,
}: {
    title: string
    value: string | number
    icon: React.ReactNode
    description?: string
}) {
    return (
        <div className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
            <div className="flex flex-row items-center justify-between space-y-0 pb-2">
                <h3 className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
                    {title}
                </h3>
                {icon}
            </div>
            <div className="mt-2">
                <div className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">
                    {value}
                </div>
                {description && (
                    <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
                        {description}
                    </p>
                )}
            </div>
        </div>
    )
}