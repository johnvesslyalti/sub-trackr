import { getDashboardStats } from "@/server/subscription/stats";
import { DashboardView } from "@/components/dashboard/DashboardView";
import { AddSubscriptionDialogClient } from "@/components/dashboard/AddSubscriptionDialogClient";

export default async function DashboardPage() {
    const stats = await getDashboardStats();

    return (
        <div className="space-y-6 p-8">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-foreground">
                        Dashboard
                    </h1>
                    <p className="text-muted-foreground">
                        Overview of your subscription expenses
                    </p>
                </div>

                <AddSubscriptionDialogClient />
            </div>

            <DashboardView stats={stats} />
        </div>
    );
}