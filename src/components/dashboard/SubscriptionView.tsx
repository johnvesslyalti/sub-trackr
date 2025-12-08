"use client";

import { useState, useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { format } from "date-fns";
import { Search, Filter, MoreHorizontal, Trash2, Edit } from "lucide-react";
import { useDebouncedCallback } from "use-debounce";

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { SubscriptionStatus, BillingCycle } from "@/generated/prisma";
import { toast } from "sonner";
import { deleteSubscription } from "@/server/subscription/actions";

// Define the shape of the sanitized data
type SubscriptionItem = {
    id: string;
    name: string;
    amount: number;
    currency: string;
    status: SubscriptionStatus;
    billingCycle: BillingCycle;
    nextBillingDate: Date | null;
    // The 'platform' field has been REMOVED from the type definition here.
};

type SubscriptionsViewProps = {
    initialData: {
        items: SubscriptionItem[];
        total: number;
        page: number;
        pageSize: number;
        totalPages: number;
    };
};

export function SubscriptionsView({ initialData }: SubscriptionsViewProps) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [isPending, startTransition] = useTransition();

    // Handle Search 
    const handleSearch = useDebouncedCallback((term: string) => {
        const params = new URLSearchParams(searchParams);
        if (term) {
            params.set("search", term);
        } else {
            params.delete("search");
        }
        params.set("page", "1"); // Reset to page 1
        router.replace(`?${params.toString()}`);
    }, 300);

    // Handle Status Filter
    const handleStatusChange = (status: string) => {
        const params = new URLSearchParams(searchParams);
        if (status && status !== "ALL") {
            params.set("status", status);
        } else {
            params.delete("status");
        }
        params.set("page", "1");
        router.replace(`?${params.toString()}`);
    };

    // Handle Delete
    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure? This will archive the subscription.")) return;

        startTransition(async () => {
            const result = await deleteSubscription(id);
            if (result.success) {
                toast.success("Subscription deleted");
                router.refresh();
            } else {
                toast.error("Failed to delete");
            }
        });
    }

    return (
        <div className="space-y-20">
            {/* --- Filters Toolbar --- */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                <div className="relative flex-1">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Search subscriptions..."
                        className="pl-9 bg-background"
                        defaultValue={searchParams.get("search")?.toString()}
                        onChange={(e) => handleSearch(e.target.value)}
                    />
                </div>

                <Select
                    defaultValue={searchParams.get("status") || "ALL"}
                    onValueChange={handleStatusChange}
                >
                    <SelectTrigger className="w-full sm:w-[180px]">
                        <div className="flex items-center gap-2">
                            <Filter className="h-4 w-4 text-muted-foreground" />
                            <SelectValue placeholder="Status" />
                        </div>
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="ALL">All Status</SelectItem>
                        <SelectItem value={SubscriptionStatus.ACTIVE}>Active</SelectItem>
                        <SelectItem value={SubscriptionStatus.CANCELED}>Canceled</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            {/* --- Data Table --- */}
            <div className="rounded-md border border-border bg-card">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Name</TableHead>
                            <TableHead>Price</TableHead>
                            <TableHead className="hidden sm:table-cell">Status</TableHead>
                            <TableHead className="hidden md:table-cell">Cycle</TableHead>
                            <TableHead className="hidden md:table-cell">Next Bill</TableHead>
                            <TableHead className="w-[50px]"></TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {initialData.items.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
                                    No subscriptions found.
                                </TableCell>
                            </TableRow>
                        ) : (
                            initialData.items.map((sub) => (
                                <TableRow key={sub.id}>
                                    <TableCell className="font-medium">
                                        <div className="flex flex-col">
                                            <span className="text-foreground">{sub.name}</span>
                                            {/* **REMOVED** the 'platform' display block */}
                                            {/* {sub.platform && (
                                                <span className="text-xs text-muted-foreground">{sub.platform}</span>
                                            )} */}
                                        </div>
                                    </TableCell>

                                    <TableCell>
                                        {new Intl.NumberFormat('en-US', {
                                            style: 'currency',
                                            currency: sub.currency
                                        }).format(sub.amount)}
                                    </TableCell>

                                    <TableCell className="hidden sm:table-cell">
                                        <StatusBadge status={sub.status} />
                                    </TableCell>

                                    <TableCell className="hidden md:table-cell text-muted-foreground lowercase">
                                        {sub.billingCycle}
                                    </TableCell>

                                    <TableCell className="hidden md:table-cell text-muted-foreground">
                                        {sub.nextBillingDate
                                            ? format(new Date(sub.nextBillingDate), "MMM d, yyyy")
                                            : "-"}
                                    </TableCell>

                                    <TableCell>
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" size="icon" className="h-8 w-8">
                                                    <MoreHorizontal className="h-4 w-4" />
                                                    <span className="sr-only">Menu</span>
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                                <DropdownMenuItem onClick={() => toast.info("Edit feature coming soon!")}>
                                                    <Edit className="mr-2 h-4 w-4" /> Edit
                                                </DropdownMenuItem>
                                                <DropdownMenuItem
                                                    className="text-destructive focus:text-destructive"
                                                    onClick={() => handleDelete(sub.id)}
                                                >
                                                    <Trash2 className="mr-2 h-4 w-4" /> Delete
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>

            {/* Pagination Footer */}
            <div className="flex items-center justify-end space-x-2 py-4">
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                        const params = new URLSearchParams(searchParams);
                        params.set("page", (initialData.page - 1).toString());
                        router.push(`?${params.toString()}`);
                    }}
                    disabled={initialData.page <= 1}
                >
                    Previous
                </Button>
                <span className="text-sm text-muted-foreground">
                    Page {initialData.page} of {initialData.totalPages || 1}
                </span>
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                        const params = new URLSearchParams(searchParams);
                        params.set("page", (initialData.page + 1).toString());
                        router.push(`?${params.toString()}`);
                    }}
                    disabled={initialData.page >= initialData.totalPages}
                >
                    Next
                </Button>
            </div>
        </div>
    );
}

function StatusBadge({ status }: { status: SubscriptionStatus }) {
    if (status === "ACTIVE") {
        return (
            <Badge variant="default" className="bg-emerald-500/15 text-emerald-600 hover:bg-emerald-500/25 border-emerald-500/20">
                Active
            </Badge>
        );
    }
    return <Badge variant="secondary">Canceled</Badge>;
}