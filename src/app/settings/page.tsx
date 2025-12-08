"use client";

import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    notificationSettingsInput,
    notificationsSettingsSchema,
} from "@/lib/validations/settings";
import { upsertNotificationSettings } from "@/server/settings/actions";

type SettingsFormProps = {
    initialSettings: {
        reminderDaysBefore: number;
        emailReminders: boolean;
    };
};

export function SettingsForm({ initialSettings }: SettingsFormProps) {
    const [isPending, startTransition] = useTransition();

    const form = useForm<notificationSettingsInput>({
        // This line caused the initial type errors, which are fixed by updating the schema file
        resolver: zodResolver(notificationsSettingsSchema),
        defaultValues: initialSettings,
    });

    const onSubmit = (values: notificationSettingsInput) => {
        startTransition(async () => {
            // Note: Your usage of Number(values.reminderDaysBefore) here is redundant 
            // if you use z.coerce.number() in your schema, but it does no harm.
            const payload = {
                reminderDaysBefore: Number(values.reminderDaysBefore),
                emailReminders: values.emailReminders,
            };

            const result = await upsertNotificationSettings(payload);

            if (result.success) {
                toast.success("Settings saved");
            } else {
                toast.error(result.error ?? "Failed to save settings");
            }
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
                                            value={field.value}
                                            // This casting to Number here is what helps prevent transient string issues
                                            onChange={(e) => field.onChange(Number(e.target.value))}
                                        />
                                    </FormControl>
                                    <FormDescription>
                                        How many days before the next billing date to send reminders.
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="emailReminders"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Email reminders</FormLabel>
                                    <Select
                                        value={field.value ? "true" : "false"}
                                        onValueChange={(value) => field.onChange(value === "true")}
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
                                    <FormDescription>
                                        Turn renewal reminder emails on or off.
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </CardContent>
                </Card>

                <div className="flex justify-end">
                    <Button type="submit" disabled={isPending}>
                        {isPending ? "Saving..." : "Save settings"}
                    </Button>
                </div>
            </form>
        </Form>
    );
}