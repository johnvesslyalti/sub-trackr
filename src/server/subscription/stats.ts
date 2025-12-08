import 'server-only'; // Protects backend logic

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

    // 1. Parallelize all independent queries
    const [
        activeCount,
        canceledCount,
        upcoming,
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

        // B. Upcoming list (Fetch full objects here as they are for display)
        prisma.subscription.findMany({
            where: {
                userId,
                status: SubscriptionStatus.ACTIVE,
                // Optional: Filter out dates far in the past? 
                // nextBillingDate: { gte: new Date() } 
            },
            orderBy: { nextBillingDate: "asc" },
            take: 5,
        }),

        // C. Group by Platform (Database level aggregation)
        prisma.subscription.groupBy({
            by: ["platform"],
            _sum: { amount: true },
            where: { userId, status: SubscriptionStatus.ACTIVE },
        }),

        // D. Optimized Fetch for Math (Only fetch what we need)
        prisma.subscription.findMany({
            where: { userId, status: SubscriptionStatus.ACTIVE },
            select: {
                amount: true,
                billingCycle: true,
                interval: true, // Assuming your schema has this
                currency: true, // Useful if you want to support multi-currency later
            },
        }),
    ]);

    // 2. Calculate Monthly Spend in memory (Cheaper than complex SQL for mixed intervals)
    const estimatedMonthlySpend = subsForCalc.reduce((acc, sub) => {
        const amount = sub.amount.toNumber();
        // Default to 1 to prevent Division by Zero if interval is null/0
        const interval = sub.interval || 1;

        let monthly = 0;

        switch (sub.billingCycle) {
            case BillingCycle.MONTHLY:
                monthly = amount / interval;
                break;
            case BillingCycle.YEARLY:
                monthly = amount / (12 * interval);
                break;
            case BillingCycle.WEEKLY:
                // (Amount * 52 weeks) / 12 months
                monthly = (amount * 52) / (12 * interval);
                break;
            case BillingCycle.DAILY:
                // (Amount * 365 days) / 12 months
                monthly = (amount * 365) / (12 * interval);
                break;
            default:
                monthly = 0;
        }

        return acc + monthly;
    }, 0);

    return {
        activeCount,
        canceledCount,
        upcoming,
        // Return a clean 2-decimal number
        estimatedMonthlySpend: toFixedNumber(estimatedMonthlySpend),
        spendByPlatform: spendByPlatform.map((row) => ({
            platform: row.platform || "Other",
            amount: row._sum.amount?.toNumber() ?? 0,
        })),
    };
});