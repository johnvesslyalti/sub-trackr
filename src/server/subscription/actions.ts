// src/server/subscription/actions.ts
"use server";

import { SubscriptionStatus, BillingCycle } from "@/generated/prisma";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import {
    createSubscriptionSchema,
    updateSubscriptionSchema,
} from "@/lib/validations/subscription";
import { headers } from "next/headers";

// --- Helper Functions ---

/**
 * Calculates the next billing date based on start date, interval, and cycle.
 */
function calculateNextBillingDate(startDate: Date, interval: number, cycle: BillingCycle): Date {
    const date = new Date(startDate);

    switch (cycle) {
        case "DAILY":
            date.setDate(date.getDate() + interval);
            break;
        case "WEEKLY":
            date.setDate(date.getDate() + (interval * 7));
            break;
        case "MONTHLY":
            date.setMonth(date.getMonth() + interval);
            break;
        case "YEARLY":
            date.setFullYear(date.getFullYear() + interval);
            break;
        case "CUSTOM":
            // Default logic for custom: assume monthly if not defined, 
            // or you can add specific custom logic here.
            date.setMonth(date.getMonth() + interval);
            break;
    }

    return date;
}

// --- Types ---

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

// --- Actions ---

export async function addSubscription(input: unknown): Promise<ActionResponse<any>> {
    try {
        const userId = await getUserIdOrThrow();

        const parsed = createSubscriptionSchema.safeParse(input);
        if (!parsed.success) {
            return { success: false, error: "Invalid input data" };
        }

        const { startDate, interval, billingCycle } = parsed.data;

        // FIX: Calculate the mandatory nextBillingDate
        // We cast billingCycle to the Prisma Enum type to satisfy TypeScript
        const nextBillingDate = calculateNextBillingDate(
            startDate,
            interval,
            billingCycle as BillingCycle
        );

        const subscription = await prisma.subscription.create({
            data: {
                ...parsed.data,
                userId,
                nextBillingDate // Pass the calculated date
            },
        });

        return { success: true, data: subscription };
    } catch (error) {
        console.error("Failed to add subscription:", error);
        return { success: false, error: "Failed to create subscription" };
    }
}

export async function updateSubscription(
    id: string,
    input: unknown
): Promise<ActionResponse<any>> {
    try {
        const userId = await getUserIdOrThrow();

        const parsed = updateSubscriptionSchema.safeParse(input);
        if (!parsed.success) {
            return { success: false, error: "Invalid input data" };
        }

        // 1. Verify ownership
        const existing = await prisma.subscription.findFirst({
            where: {
                id: id,
                userId: userId,
            },
        });

        if (!existing) {
            return { success: false, error: "Subscription not found" };
        }

        // 2. Perform Update
        // Note: If you allow updating the cycle/interval, you might need to recalculate nextBillingDate here too.
        const updated = await prisma.subscription.update({
            where: { id },
            data: parsed.data,
        });

        return { success: true, data: updated };
    } catch (error) {
        console.error("Update failed:", error);
        return { success: false, error: "Failed to update subscription" };
    }
}

export async function deleteSubscription(id: string): Promise<ActionResponse> {
    try {
        const userId = await getUserIdOrThrow();

        // 1. Verify ownership
        const sub = await prisma.subscription.findFirst({
            where: { id, userId },
        });

        if (!sub) {
            return { success: false, error: "Subscription not found" };
        }

        // 2. Transaction: Archive -> Delete
        await prisma.$transaction([
            prisma.subscriptionHistory.create({
                data: {
                    subscriptionId: sub.id, // Keep ID for reference if needed, or null if you want hard unlink
                    userId,
                    name: sub.name,
                    platform: sub.platform,
                    plan: sub.plan,
                    amount: sub.amount,
                    currency: sub.currency,
                    billingCycle: sub.billingCycle,
                    endedAt: new Date(),
                },
            }),
            prisma.subscription.delete({
                where: { id },
            }),
        ]);

        return { success: true };
    } catch (error) {
        console.error("Delete failed:", error);
        return { success: false, error: "Failed to delete subscription" };
    }
}

export async function cancelSubscription(id: string): Promise<ActionResponse<any>> {
    try {
        const userId = await getUserIdOrThrow();

        // 1. Verify ownership
        const sub = await prisma.subscription.findFirst({
            where: { id, userId },
        });

        if (!sub) {
            return { success: false, error: "Subscription not found" };
        }

        // 2. Transaction: Archive -> Update Status
        const [_, updatedSub] = await prisma.$transaction([
            prisma.subscriptionHistory.create({
                data: {
                    subscriptionId: sub.id,
                    userId,
                    name: sub.name,
                    platform: sub.platform,
                    plan: sub.plan,
                    amount: sub.amount,
                    currency: sub.currency,
                    billingCycle: sub.billingCycle,
                    endedAt: new Date(),
                },
            }),
            prisma.subscription.update({
                where: { id },
                data: {
                    status: SubscriptionStatus.CANCELED,
                },
            }),
        ]);

        return { success: true, data: updatedSub };
    } catch (error) {
        console.error("Cancel failed:", error);
        return { success: false, error: "Failed to cancel subscription" };
    }
}