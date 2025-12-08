"use client";

import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import { createSubscriptionSchema, createSubscriptionInput } from "@/lib/validations/subscription";
import { BillingCycle } from "@/generated/prisma";
import { addSubscription } from "@/server/subscription/actions";

export function AddSubscriptionDialog() {
    const [open, setOpen] = useState(false);
    const [isPending, startTransition] = useTransition();
    const router = useRouter();

    const form = useForm({
        resolver: zodResolver(createSubscriptionSchema),
        defaultValues: {
            name: "",
            amount: 0,
            currency: "USD",
            billingCycle: BillingCycle.MONTHLY,
            platform: "",
            interval: 1,
            startDate: new Date(),
        },
    });

    async function onSubmit(data: createSubscriptionInput) {
        startTransition(async () => {
            try {
                const result = await addSubscription(data);

                if (result.success) {
                    toast.success("Subscription added");
                    setOpen(false);
                    form.reset();
                    router.refresh();
                } else {
                    toast.error(result.error || "Failed to add subscription");
                }
            } catch (error) {
                toast.error("Something went wrong");
            }
        });
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button className="gap-2">
                    <Plus className="h-4 w-4" />
                    Add Subscription
                </Button>
            </DialogTrigger>

            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>New Subscription</DialogTitle>
                    <DialogDescription>
                        Track a new recurring expense.
                    </DialogDescription>
                </DialogHeader>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">

                        {/* Name */}
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Name</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Netflix, Spotify..." {...field} value={field.value as string} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <div className="grid grid-cols-2 gap-4">
                            {/* Amount */}
                            <FormField
                                control={form.control}
                                name="amount"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Amount</FormLabel>
                                        <FormControl>
                                            <div className="relative">
                                                <span className="absolute left-3 top-2.5 text-muted-foreground">$</span>
                                                {/* FIX: Explicitly cast value to number */}
                                                <Input
                                                    type="number"
                                                    step="0.01"
                                                    className="pl-7"
                                                    {...field}
                                                    value={field.value as number}
                                                />
                                            </div>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* Platform (Optional) */}
                            <FormField
                                control={form.control}
                                name="platform"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Platform</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Web, iOS..." {...field} value={field.value as string} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            {/* Billing Cycle */}
                            <FormField
                                control={form.control}
                                name="billingCycle"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Cycle</FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value as string}>
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select cycle" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {Object.values(BillingCycle).map((cycle) => (
                                                    <SelectItem key={cycle} value={cycle}>
                                                        {cycle}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* Interval (Every X Months) */}
                            <FormField
                                control={form.control}
                                name="interval"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Interval</FormLabel>
                                        <FormControl>
                                            {/* FIX: Explicitly cast value to number */}
                                            <Input
                                                type="number"
                                                min={1}
                                                {...field}
                                                value={field.value as number}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <div className="flex justify-end gap-3 pt-4">
                            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                                Cancel
                            </Button>
                            <Button type="submit" disabled={isPending}>
                                {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                Save
                            </Button>
                        </div>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}