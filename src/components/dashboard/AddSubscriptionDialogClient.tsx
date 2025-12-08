"use client";

import dynamic from "next/dynamic";
import { Plus } from "lucide-react";

import { Button } from "@/components/ui/button";

// Client-only wrapper for the dialog to keep SSR disabled.
const AddSubscriptionDialog = dynamic(
    () => import("./AddSubscriptionDialog").then((mod) => mod.AddSubscriptionDialog),
    {
        ssr: false,
        loading: () => (
            <Button className="gap-2">
                <Plus className="h-4 w-4" />
                Add Subscription
            </Button>
        ),
    }
);

export function AddSubscriptionDialogClient() {
    return <AddSubscriptionDialog />;
}

