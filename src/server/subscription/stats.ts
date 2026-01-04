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

    const [allSubs, upcomingRaw] = await Promise.all([
        prisma.subscription.findMany({
            where: { userId },
            select: {
                name: true,
                amount: true,
                status: true,
                billingCycle: true,
                interval: true,
                startDate: true,
                updatedAt: true,
            }
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

    // --- Process existing stats ---
    const activeSubs = allSubs.filter(s => s.status === SubscriptionStatus.ACTIVE);
    const canceledCount = allSubs.filter(s => s.status === SubscriptionStatus.CANCELED).length;

    // Monthly Estimate (Active Only)
    const monthlySpendMap = new Map<string, number>();
    for (const sub of activeSubs) {
        const label = sub.name || "Unknown";
        const amount = sub.amount.toNumber();
        const current = monthlySpendMap.get(label) || 0;
        monthlySpendMap.set(label, current + amount);
    }

    const monthlyItems = Array.from(monthlySpendMap.entries())
        .map(([platform, amount]) => ({ platform, amount }))
        .sort((a, b) => b.amount - a.amount);

    const top4Monthly = monthlyItems.slice(0, 4);
    const restMonthly = monthlyItems.slice(4);
    const otherAmountMonthly = restMonthly.reduce((sum, item) => sum + item.amount, 0);

    const spendByPlatform = [...top4Monthly];
    if (otherAmountMonthly > 0) {
        spendByPlatform.push({ platform: "Others", amount: otherAmountMonthly });
    }

    const estimatedMonthlySpend = spendByPlatform.reduce((acc, curr) => acc + curr.amount, 0);

    const upcoming = upcomingRaw.map((item) => ({
        name: item.name,
        amount: item.amount.toNumber(),
    }));


    // --- New: Total Lifetime Spend Calculation ---
    const lifetimeSpendMap = new Map<string, number>();
    const now = new Date();

    for (const sub of allSubs) {
        const endDate = sub.status === SubscriptionStatus.ACTIVE ? now : sub.updatedAt;
        if (sub.startDate > endDate) continue;

        const diffTime = Math.abs(endDate.getTime() - sub.startDate.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        const interval = sub.interval || 1;
        let cycles = 0;

        switch (sub.billingCycle) {
            case "DAILY": cycles = Math.floor(diffDays / interval); break;
            case "WEEKLY": cycles = Math.floor(diffDays / (7 * interval)); break;
            case "MONTHLY": cycles = Math.floor(diffDays / (30 * interval)); break;
            case "YEARLY": cycles = Math.floor(diffDays / (365 * interval)); break;
            default: cycles = 0; break;
        }

        const totalPayments = cycles + 1;
        const totalSpent = sub.amount.toNumber() * totalPayments;

        const label = sub.name || "Unknown";
        const current = lifetimeSpendMap.get(label) || 0;
        lifetimeSpendMap.set(label, current + totalSpent);
    }

    const totalSpendByPlatform = Array.from(lifetimeSpendMap.entries())
        .map(([platform, amount]) => ({ platform, amount }))
        .sort((a, b) => b.amount - a.amount);

    return {
        activeCount: activeSubs.length,
        canceledCount,
        estimatedMonthlySpend,
        spendByPlatform,
        upcoming,
        totalSpendByPlatform
    };
});