import { getDashboardStats } from "@/server/subscription/stats"

export default async function StatsCard() {
    const stats = await getDashboardStats()
    return (
        <div>
            <div>{stats.activeCount}</div>
            <div>{stats.canceledCount}</div>
            <div>{stats.estimatedMonthlySpend}</div>
        </div>
    )
}