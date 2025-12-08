import { getDashboardStats } from "@/server/subscription/stats";
import { DashboardView } from "@/components/dashboard/DashboardView";
// 1. Remove the direct import
// import { AddSubscriptionDialog } from "@/components/dashboard/AddSubscriptionDialog"; 

import dynamic from "next/dynamic";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

// 2. Dynamically import with SSR disabled
const AddSubscriptionDialog = dynamic(
    () => import("@/components/dashboard/AddSubscriptionDialog").then((mod) => mod.AddSubscriptionDialog),
    {
        ssr: false,
        // 3. Provide a loading fallback that looks EXACTLY like the real button
        // This prevents the button from "popping" in later (Layout Shift)
        loading: () => (
            <Button className="gap-2">
                <Plus className="h-4 w-4" />
                Add Subscription
            </Button>
        ),
    }
);

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

                {/* The component is now client-side only, avoiding the ID mismatch */}
                <AddSubscriptionDialog />
            </div>

            <DashboardView stats={stats} />
        </div>
    );
}