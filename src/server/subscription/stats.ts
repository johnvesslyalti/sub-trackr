// src/server/subscription/stats.ts
import 'server-only';

import { SubscriptionStatus } from "@/generated/prisma";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { headers } from "next/headers";
import { cache } from "react";

async function getUserIdOrThrow() {
    const session = await auth.api.getSession({
        headers: await headers(),
    });
    if (!session || !session.user) throw new Error("Unauthorized");
    return session.user.id;
}

export const getDashboardStats = cache(async () => {
    const userId = await getUserIdOrThrow();

    const [activeSubs, canceledCount, upcomingRaw] = await Promise.all([
        // 1. Fetch RAW list (No groupBy, preventing the error)
        prisma.subscription.findMany({
            where: { userId, status: SubscriptionStatus.ACTIVE },
            select: { name: true, amount: true }
        }),

        prisma.subscription.count({
            where: { userId, status: SubscriptionStatus.CANCELED }
        }),

        prisma.subscription.findMany({
            where: {
                userId,
                status: SubscriptionStatus.ACTIVE,
                nextBillingDate: { gte: new Date() }
            },
            orderBy: { nextBillingDate: 'asc' },
            take: 5,
            select: { name: true, amount: true, nextBillingDate: true }
        })
    ]);

    // 2. Manual Aggregation by Name
    const spendMap = new Map<string, number>();

    for (const sub of activeSubs) {
        const label = sub.name || "Unknown";
        const amount = sub.amount.toNumber();
        const current = spendMap.get(label) || 0;
        spendMap.set(label, current + amount);
    }

    const allItems = Array.from(spendMap.entries())
        .map(([platform, amount]) => ({ platform, amount }))
        .sort((a, b) => b.amount - a.amount);

    const top4 = allItems.slice(0, 4);
    const rest = allItems.slice(4);
    const otherAmount = rest.reduce((sum, item) => sum + item.amount, 0);

    const spendByPlatform = [...top4];
    if (otherAmount > 0) {
        spendByPlatform.push({ platform: "Others", amount: otherAmount });
    }

    const estimatedMonthlySpend = spendByPlatform.reduce((acc, curr) => acc + curr.amount, 0);

    const upcoming = upcomingRaw.map((item) => ({
        name: item.name,
        amount: item.amount.toNumber(),
    }));

    return {
        activeCount: activeSubs.length,
        canceledCount,
        estimatedMonthlySpend,
        spendByPlatform,
        upcoming
    };
});