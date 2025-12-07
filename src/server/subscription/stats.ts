// src/server/subscription/stats.ts
"use server";

import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { BillingCycle, SubscriptionStatus } from "@/generated/prisma";


async function getUserIdOrThrow() {
    const session = await auth.api.getSession()
    if (!session || !session.user) throw new Error("Unauthorized");
    return session.user.id;
}

export async function getDashboardStats() {
    const userId = await getUserIdOrThrow();

    const [activeCount, canceledCount, upcoming, byPlatform] = await Promise.all([
        prisma.subscription.count({
            where: { userId, status: SubscriptionStatus.ACTIVE },
        }),
        prisma.subscription.count({
            where: { userId, status: SubscriptionStatus.CANCELED },
        }),
        prisma.subscription.findMany({
            where: {
                userId,
                status: SubscriptionStatus.ACTIVE,
            },
            orderBy: { nextBillingDate: "asc" },
            take: 5,
        }),
        prisma.subscription.groupBy({
            by: ["platform"],
            _sum: { amount: true },
            where: { userId, status: SubscriptionStatus.ACTIVE },
        }),
    ]);

    // simple monthly estimation from billingCycle
    const subs = await prisma.subscription.findMany({
        where: { userId, status: SubscriptionStatus.ACTIVE },
    });

    const estimatedMonthlySpend = subs.reduce((acc, sub) => {
        let monthlyEquivalent = 0;
        if (sub.billingCycle === BillingCycle.MONTHLY) {
            monthlyEquivalent = sub.amount.toNumber() / sub.interval;
        } else if (sub.billingCycle === BillingCycle.YEARLY) {
            monthlyEquivalent = sub.amount.toNumber() / (12 * sub.interval);
        } else if (sub.billingCycle === BillingCycle.WEEKLY) {
            monthlyEquivalent = (sub.amount.toNumber() * 52) / (12 * sub.interval);
        } else {
            // CUSTOM - ignore or treat specially later
            monthlyEquivalent = 0;
        }
        return acc + monthlyEquivalent;
    }, 0);

    return {
        activeCount,
        canceledCount,
        upcoming,
        estimatedMonthlySpend,
        spendByPlatform: byPlatform.map((row) => ({
            platform: row.platform || "Unknown",
            amount: row._sum.amount?.toNumber() ?? 0,
        })),
    };
}
