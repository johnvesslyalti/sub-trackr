// src/lib/validations/settings.ts

import * as z from "zod";

export const notificationsSettingsSchema = z.object({
    // Use z.coerce.number() to explicitly convert the string input from the form 
    // into a number. This resolves the 'unknown' or 'string' type inference issue 
    // that causes the Resolver/TFieldValues conflict.
    reminderDaysBefore: z.coerce
        .number()
        .int("Reminder days must be a whole number.")
        .min(0, "Cannot be less than 0 days.")
        .max(30, "Cannot be more than 30 days."),

    emailReminders: z.boolean(),
});

// This type must infer correctly as { reminderDaysBefore: number; emailReminders: boolean; }
export type notificationSettingsInput = z.infer<typeof notificationsSettingsSchema>;