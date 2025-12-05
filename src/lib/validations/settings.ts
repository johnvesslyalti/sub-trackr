import z from "zod";

export const notificationsSettingsSchema = z.object({
    reminderDaysBefore: z.number().int().min(0).max(30).default(3),
    emailReminders: z.boolean().default(true)
})

export type notificationSettingsInput = z.infer<typeof notificationsSettingsSchema>