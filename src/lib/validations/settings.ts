import * as z from "zod";

export const notificationsSettingsSchema = z.object({
    reminderDaysBefore: z.coerce.number().min(0).max(30),
    emailReminders: z.boolean(),
});

export type NotificationSettings = z.infer<typeof notificationsSettingsSchema>;
