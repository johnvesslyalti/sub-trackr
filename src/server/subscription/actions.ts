// src/server/subscription/action.ts
"use server"; // Ensure this is marked as a server action

import { SubscriptionStatus } from "@/generated/prisma";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import {
    createSubscriptionInput,
    createSubscriptionSchema,
    updateSubscriptionInput,
    updateSubscriptionSchema,
} from "@/lib/validations/subscription";
import { headers } from "next/headers";

// Helper to standardise action responses
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

export async function addSubscription(input: unknown): Promise<ActionResponse<any>> {
    try {
        const userId = await getUserIdOrThrow();

        // Use safeParse to handle validation errors gracefully
        const parsed = createSubscriptionSchema.safeParse(input);
        if (!parsed.success) {
            return { success: false, error: "Invalid input data" };
        }

        const subscription = await prisma.subscription.create({
            data: { ...parsed.data, userId },
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

        // 1. Verify ownership BEFORE updating
        const existing = await prisma.subscription.findFirst({
            where: {
                id: id,
                userId: userId, // Ensure user owns this subscription
            },
        });

        if (!existing) {
            return { success: false, error: "Subscription not found" };
        }

        // 2. Perform Update
        const updated = await prisma.subscription.update({
            where: { id },
            data: parsed.data,
        });

        return { success: true, data: updated };
    } catch (error) {
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

        // 2. Use Transaction: Archive -> Delete ensures both happen or neither happens
        await prisma.$transaction([
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
            where: { id, userId }, // Fixed: Check matches ID AND UserId
        });

        if (!sub) {
            return { success: false, error: "Subscription not found" };
        }

        // 2. Use Transaction: Archive -> Update Status
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