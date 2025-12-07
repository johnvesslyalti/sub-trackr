// src/server/reminder/jobs.ts
"use server";

import { sendReminderEmail } from "@/lib/email";
import prisma from "@/lib/prisma";

export async function sendUpcomingRenewalReminders() {
    const today = new Date();
    const inNDays = (days: number) =>
        new Date(today.getTime() + days * 24 * 60 * 60 * 1000);

    // fetch all users with settings
    const usersWithSettings = await prisma.notificationSettings.findMany({
        include: { user: true },
    });

    for (const settings of usersWithSettings) {
        if (!settings.emailReminders || !settings.user?.email) continue;

        const { userId, reminderDaysBefore } = settings;
        const targetDate = inNDays(reminderDaysBefore);

        const upcomingSubs = await prisma.subscription.findMany({
            where: {
                userId,
                status: "ACTIVE",
                nextBillingDate: {
                    gte: new Date(targetDate.toDateString()),
                    lt: new Date(
                        new Date(targetDate).setDate(targetDate.getDate() + 1),
                    ),
                },
            },
        });

        if (!upcomingSubs.length) continue;

        await sendReminderEmail({
            to: settings.user.email,
            subscriptions: upcomingSubs,
            reminderDaysBefore,
        });

        // here you could log to a ReminderLog model if you add one
    }

    return { success: true as const };
}
