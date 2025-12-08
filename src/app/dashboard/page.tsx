import { getDashboardStats } from "@/server/subscription/stats";
import { DashboardView } from "@/components/dashboard/DashboardView";
import { AddSubscriptionDialog } from "@/components/dashboard/AddSubscriptionDialog"; // Import here

export default async function DashboardPage() {
    const stats = await getDashboardStats();

    return (
        <div className="space-y-8">
            {/* Header Section */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-foreground">
                        Dashboard
                    </h1>
                    <p className="text-muted-foreground">
                        Overview of your subscription expenses
                    </p>
                </div>

                {/* The Action Button */}
                <AddSubscriptionDialog />
            </div>

            <DashboardView stats={stats} />
        </div>
    );
}