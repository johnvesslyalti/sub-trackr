import { SubscriptionStatus } from "@/generated/prisma";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { createSubscriptionInput, createSubscriptionSchema, updateSubscriptionInput, updateSubscriptionSchema } from "@/lib/validations/subscription";
import { headers } from "next/headers";

async function getUserIdOrThrow() {
    const session = await auth.api.getSession({
        headers: await headers()
    });

    if (!session || !session.user) {
        throw new Error("Unauthorized");
    }

    return session.user.id;
}

export async function addSubscription(input: unknown) {
    const userId = await getUserIdOrThrow()

    const data: createSubscriptionInput = createSubscriptionSchema.parse(input);

    const subscription = await prisma.subscription.create({
        data: { ...data, userId }
    });

    return { success: true as const, subscription }
}

export async function updateSubscription(id: string, input: unknown) {
    const userId = await getUserIdOrThrow()

    const data: updateSubscriptionInput = updateSubscriptionSchema.parse(input);

    const existing = await prisma.subscription.findFirst({
        where: { id: userId },
    });

    if (!existing) {
        throw new Error("Subscription not found");
    }

    const updated = await prisma.subscription.update({
        where: { id },
        data,
    });

    return { success: true as const, subscription: updated };
}

async function archiveToHistory(subscriptionId: string, userId: string) {
    const sub = await prisma.subscription.findFirst({
        where: { id: subscriptionId },
    });

    if (!sub) return;

    await prisma.subscriptionHistory.create({
        data: {
            subscriptionId: sub.id,
            userId,
            name: sub.name,
            platform: sub.platform,
            plan: sub.plan,
            amount: sub.amount,
            currency: sub.currency,
            billingCycle: sub.billingCycle,
            endedAt: new Date()
        }
    });
}

export async function deleteSubscription(id: string) {
    const userId = await getUserIdOrThrow()

    await archiveToHistory(id, userId);

    await prisma.subscription.delete({
        where: { id },
    });

    return { success: true as const }
}
export async function cancelSubscription(id: string) {
    const userId = await getUserIdOrThrow()

    const sub = await prisma.subscription.findFirst({
        where: { id: userId },
    })

    if (!sub) throw new Error("Subscription not found");

    await archiveToHistory(id, userId);

    const updated = await prisma.subscription.update({
        where: { id },
        data: {
            status: SubscriptionStatus.CANCELED,
        }
    });

    return { success: true as const, subscription: updated }
}
