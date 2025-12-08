// src/server/subscription/stats.ts
import 'server-only';

import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { BillingCycle, SubscriptionStatus } from "@/generated/prisma";
import { headers } from "next/headers";
import { cache } from "react";

// Helper for consistent rounding
const toFixedNumber = (num: number, digits: number = 2) => {
    const pow = Math.pow(10, digits);
    return Math.round(num * pow) / pow;
};

async function getUserIdOrThrow() {
    const session = await auth.api.getSession({
        headers: await headers(),
    });
    if (!session || !session.user) throw new Error("Unauthorized");
    return session.user.id;
}

export const getDashboardStats = cache(async () => {
    const userId = await getUserIdOrThrow();

    const [
        activeCount,
        canceledCount,
        upcomingRaw, // Rename this to 'Raw'
        spendByPlatform,
        subsForCalc
    ] = await Promise.all([
        // A. Simple counts
        prisma.subscription.count({
            where: { userId, status: SubscriptionStatus.ACTIVE },
        }),
        prisma.subscription.count({
            where: { userId, status: SubscriptionStatus.CANCELED },
        }),

        // B. Upcoming list
        prisma.subscription.findMany({
            where: { userId, status: SubscriptionStatus.ACTIVE },
            orderBy: { nextBillingDate: "asc" },
            take: 5,
        }),

        // C. Group by Platform
        prisma.subscription.groupBy({
            by: ["platform"],
            _sum: { amount: true },
            where: { userId, status: SubscriptionStatus.ACTIVE },
        }),

        // D. Optimized Fetch for Math
        prisma.subscription.findMany({
            where: { userId, status: SubscriptionStatus.ACTIVE },
            select: {
                amount: true,
                billingCycle: true,
                interval: true,
            },
        }),
    ]);

    // 2. Calculate Monthly Spend
    const estimatedMonthlySpend = subsForCalc.reduce((acc, sub) => {
        const amount = sub.amount.toNumber();
        const interval = sub.interval || 1;
        let monthly = 0;

        switch (sub.billingCycle) {
            case BillingCycle.MONTHLY: monthly = amount / interval; break;
            case BillingCycle.YEARLY: monthly = amount / (12 * interval); break;
            case BillingCycle.WEEKLY: monthly = (amount * 52) / (12 * interval); break;
            case BillingCycle.DAILY: monthly = (amount * 365) / (12 * interval); break;
            default: monthly = 0;
        }
        return acc + monthly;
    }, 0);

    return {
        activeCount,
        canceledCount,
        // --- FIX IS HERE ---
        // Convert Prisma objects (Decimal) to Plain objects (number)
        upcoming: upcomingRaw.map(sub => ({
            id: sub.id,
            name: sub.name,
            amount: sub.amount.toNumber(),
            nextBillingDate: sub.nextBillingDate,
        })),
        estimatedMonthlySpend: toFixedNumber(estimatedMonthlySpend),
        spendByPlatform: spendByPlatform.map((row) => ({
            platform: row.platform || "Other",
            amount: row._sum.amount?.toNumber() ?? 0,
        })),
    };
});