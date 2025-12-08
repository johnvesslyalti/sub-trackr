import { getSubscriptions } from "@/server/subscription/queries";
import { SubscriptionsView } from "@/components/dashboard/SubscriptionView";
import { AddSubscriptionDialogClient } from "@/components/dashboard/AddSubscriptionDialogClient";

type PageProps = {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export default async function SubscriptionsPage(props: PageProps) {
    const searchParams = await props.searchParams;
    const data = await getSubscriptions(searchParams as any);

    const sanitizedItems = data.items.map((sub) => ({
        ...sub,
        amount: sub.amount.toNumber(),
    }));

    return (
        <div className="space-y-6 p-8">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-foreground">
                        Subscriptions
                    </h1>
                    <p className="text-muted-foreground">
                        Manage your active and canceled subscriptions.
                    </p>
                </div>
                <AddSubscriptionDialogClient />
            </div>

            <SubscriptionsView initialData={{ ...data, items: sanitizedItems }} />
        </div>
    );
}