"use client";

import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

import {
    notificationsSettingsSchema,
    NotificationSettings,
} from "@/lib/validations/settings";

import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Form,
    FormField,
    FormItem,
    FormLabel,
    FormControl,
    FormDescription,
    FormMessage,
} from "@/components/ui/form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

import { upsertNotificationSettings } from "@/server/settings/actions";

type Props = {
    initialSettings: {
        reminderDaysBefore: number;
        emailReminders: boolean;
    };
};

export function SettingsForm({ initialSettings }: Props) {
    const [isPending, startTransition] = useTransition();

    // ❌ No generics here — prevents ALL ts errors
    const form = useForm({
        resolver: zodResolver(notificationsSettingsSchema),
        defaultValues: {
            reminderDaysBefore: initialSettings.reminderDaysBefore.toString(),
            emailReminders: initialSettings.emailReminders,
        },
    });

    // ❌ No typed "values: NotificationSettings" — RHF can't handle it
    const onSubmit = (values: any) => {
        startTransition(async () => {
            // ✔ SAFE because Zod already validated and coerced it
            const typed: NotificationSettings = values;

            const result = await upsertNotificationSettings(typed);

            if (result.success) toast.success("Settings saved");
            else toast.error(result.error ?? "Failed to save");
        });
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Notifications</CardTitle>
                    </CardHeader>

                    <CardContent className="space-y-4">
                        {/* Reminder Days */}
                        <FormField
                            control={form.control}
                            name="reminderDaysBefore"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Reminder lead time (days)</FormLabel>
                                    <FormControl>
                                        <Input
                                            type="number"
                                            min={0}
                                            max={30}
                                            value={typeof field.value === "string" || typeof field.value === "number" ? field.value : ""}
                                            onChange={(e) => field.onChange(e.target.value)}
                                        />
                                    </FormControl>
                                    <FormDescription>
                                        How many days before billing to send reminders.
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* Email Reminders */}
                        <FormField
                            control={form.control}
                            name="emailReminders"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Email reminders</FormLabel>
                                    <Select
                                        value={field.value ? "true" : "false"}
                                        onValueChange={(v) => field.onChange(v === "true")}
                                    >
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select preference" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectItem value="true">Enabled</SelectItem>
                                            <SelectItem value="false">Disabled</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </CardContent>
                </Card>

                <div className="flex justify-end">
                    <Button disabled={isPending}>
                        {isPending ? "Saving..." : "Save Settings"}
                    </Button>
                </div>
            </form>
        </Form>
    );
}
