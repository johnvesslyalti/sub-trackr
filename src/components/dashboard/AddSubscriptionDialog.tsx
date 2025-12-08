"use client";

import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, Loader2, CalendarIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { format } from "date-fns";
import * as z from "zod";

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
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

import { BillingCycle } from "@/generated/prisma";
import { addSubscription } from "@/server/subscription/actions";

// --- FIX: Simplified Schema (Removed .default() to fix type clash) ---
const formSchema = z.object({
    name: z.string().min(1, "Name is required"),
    amount: z.number().min(0, "Amount must be positive"),
    currency: z.string(), // Removed .default("USD") - handle in useForm
    billingCycle: z.nativeEnum(BillingCycle),
    platform: z.string().optional(),
    interval: z.number().int().min(1, "Interval must be at least 1"),
    startDate: z.date(),
});

type FormValues = z.infer<typeof formSchema>;

export function AddSubscriptionDialog() {
    const [open, setOpen] = useState(false);
    const [isPending, startTransition] = useTransition();
    const router = useRouter();

    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            amount: 0,
            currency: "USD", // Default value set here
            billingCycle: "MONTHLY" as BillingCycle,
            platform: "",
            interval: 1,
            startDate: new Date(),
        },
    });

    async function onSubmit(data: FormValues) {
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
                                        <Input placeholder="Netflix, Spotify..." {...field} />
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
                                                <Input
                                                    type="number"
                                                    step="0.01"
                                                    className="pl-7"
                                                    {...field}
                                                    onChange={(e) => {
                                                        const val = parseFloat(e.target.value);
                                                        field.onChange(isNaN(val) ? 0 : val);
                                                    }}
                                                />
                                            </div>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* Start Date */}
                            <FormField
                                control={form.control}
                                name="startDate"
                                render={({ field }) => (
                                    <FormItem className="flex flex-col mt-2">
                                        <FormLabel>Start Date</FormLabel>
                                        <Popover>
                                            <PopoverTrigger asChild>
                                                <FormControl>
                                                    <Button
                                                        variant={"outline"}
                                                        className={cn(
                                                            "w-full pl-3 text-left font-normal",
                                                            !field.value && "text-muted-foreground"
                                                        )}
                                                    >
                                                        {field.value ? (
                                                            format(field.value, "PPP")
                                                        ) : (
                                                            <span>Pick a date</span>
                                                        )}
                                                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                                    </Button>
                                                </FormControl>
                                            </PopoverTrigger>
                                            <PopoverContent className="w-auto p-0" align="start">
                                                <Calendar
                                                    mode="single"
                                                    selected={field.value}
                                                    onSelect={field.onChange}
                                                    disabled={(date: Date) =>
                                                        date > new Date() || date < new Date("1900-01-01")
                                                    }
                                                    initialFocus
                                                />
                                            </PopoverContent>
                                        </Popover>
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
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
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

                            {/* Interval */}
                            <FormField
                                control={form.control}
                                name="interval"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Interval</FormLabel>
                                        <FormControl>
                                            <Input
                                                type="number"
                                                min={1}
                                                {...field}
                                                onChange={(e) => {
                                                    const val = parseInt(e.target.value);
                                                    field.onChange(isNaN(val) ? 1 : val);
                                                }}
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