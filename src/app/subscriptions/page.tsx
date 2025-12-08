import { getSubscriptions } from "@/server/subscription/queries";

import { AddSubscriptionDialog } from "@/components/dashboard/AddSubscriptionDialog";
import { SubscriptionsView } from "@/components/dashboard/SubscriptionView";

export default async function SubscriptionsPage({
    searchParams,
}: {
    searchParams: { [key: string]: string | string[] | undefined };
}) {
    // 1. Fetch data using the query we built earlier
    // searchParams are passed directly; the query's Zod schema handles parsing
    const data = await getSubscriptions(searchParams as any);

    // 2. Serialization: Convert Prisma 'Decimal' to simple 'number'
    // This prevents "Error: Only plain objects can be passed to Client Components"
    const sanitizedItems = data.items.map((sub) => ({
        ...sub,
        amount: sub.amount.toNumber(),
    }));

    return (
        <div className="space-y-6">
            {/* Page Header */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-foreground">
                        Subscriptions
                    </h1>
                    <p className="text-muted-foreground">
                        Manage your active and canceled subscriptions.
                    </p>
                </div>
                <AddSubscriptionDialog />
            </div>

            {/* Main Content (Filters & Table) */}
            <SubscriptionsView
                initialData={{ ...data, items: sanitizedItems }}
            />
        </div>
    );
}