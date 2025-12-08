"use server";

import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { notificationsSettingsSchema } from "@/lib/validations/settings";
import { headers } from "next/headers";

type ActionResponse<T = null> = {
    success: boolean;
    data?: T;
    error?: string;
};

async function getUserIdOrThrow() {
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if (!session || !session.user) {
        throw new Error("Unauthorized");
    }

    return session.user.id;
}

export async function upsertNotificationSettings(input: unknown): Promise<ActionResponse> {
    try {
        const userId = await getUserIdOrThrow();

        const parsed = notificationsSettingsSchema.safeParse(input);
        if (!parsed.success) {
            return { success: false, error: "Invalid input data" };
        }

        const settings = await prisma.notificationSettings.upsert({
            where: { userId },
            update: parsed.data,
            create: { userId, ...parsed.data },
        });

        return { success: true, data: settings };
    } catch (error) {
        console.error("Failed to save notification settings:", error);
        return { success: false, error: "Failed to save settings" };
    }
}

