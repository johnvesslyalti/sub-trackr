import "server-only";

import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { headers } from "next/headers";
import { cache } from "react";

type NotificationSettingsResult = {
    reminderDaysBefore: number;
    emailReminders: boolean;
};

async function getUserIdOrThrow() {
    const session = await auth.api.getSession({
        headers: await headers(),
    });
    if (!session || !session.user) throw new Error("Unauthorized");
    return session.user.id;
}

export const getNotificationSettings = cache(async (): Promise<NotificationSettingsResult> => {
    const userId = await getUserIdOrThrow();

    const settings = await prisma.notificationSettings.findUnique({
        where: { userId },
    });

    if (!settings) {
        // Fallback defaults match schema defaults
        return { reminderDaysBefore: 3, emailReminders: true };
    }

    return {
        reminderDaysBefore: settings.reminderDaysBefore,
        emailReminders: settings.emailReminders,
    };
});

