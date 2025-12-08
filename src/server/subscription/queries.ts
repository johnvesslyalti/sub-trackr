// src/server/subscription/queries.ts
import 'server-only';

import { BillingCycle, SubscriptionStatus, Prisma } from "@/generated/prisma";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { headers } from "next/headers";
import { cache } from "react";
import { z } from "zod";

// --- Validation Schemas ---

const subscriptionQuerySchema = z.object({
    page: z.coerce.number().min(1).default(1),
    pageSize: z.coerce.number().min(1).max(100).default(10),
    status: z.nativeEnum(SubscriptionStatus).optional(),
    billingCycle: z.nativeEnum(BillingCycle).optional(),
    platform: z.string().optional(),
    search: z.string().optional(),
    sortBy: z.enum(["nextBillingDate", "amount", "createdAt"]).default("nextBillingDate"),
    sortOrder: z.enum(["asc", "desc"]).default("asc"),
});

export type GetSubscriptionsInput = z.infer<typeof subscriptionQuerySchema>;

// --- Helper Functions ---

async function getUserIdOrThrow() {
    const session = await auth.api.getSession({
        headers: await headers(),
    });
    if (!session || !session.user) throw new Error("Unauthorized");
    return session.user.id;
}

// --- Queries ---

// 1. Get List of Subscriptions
export const getSubscriptions = cache(async (input: GetSubscriptionsInput) => {
    const userId = await getUserIdOrThrow();

    const {
        page, pageSize, status, billingCycle, platform, search, sortBy, sortOrder
    } = subscriptionQuerySchema.parse(input);

    const where: Prisma.SubscriptionWhereInput = {
        userId,
        ...(status && { status }),
        ...(billingCycle && { billingCycle }),
        ...(platform && { platform: { contains: platform, mode: 'insensitive' } }),
        ...(search && {
            OR: [
                { name: { contains: search, mode: "insensitive" } },
                { platform: { contains: search, mode: "insensitive" } },
            ],
        }),
    };

    try {
        const [items, total] = await Promise.all([
            prisma.subscription.findMany({
                where,
                orderBy: { [sortBy]: sortOrder },
                skip: (page - 1) * pageSize,
                take: pageSize,
            }),
            prisma.subscription.count({ where }),
        ]);

        const serializedItems = items.map((item) => ({
            ...item,
            amount: item.amount.toNumber()
        }));

        return {
            items: serializedItems,
            total,
            page,
            pageSize,
            totalPages: Math.ceil(total / pageSize),
        };
    } catch (err) {
        console.error("Error fetching subscriptions:", err);
        throw new Error("Failed to load subscriptions");
    }
});

// 2. Get Dashboard Statistics (FIXED LOGIC)
export const getDashboardStats = cache(async () => {
    const userId = await getUserIdOrThrow();

    const [activeCount, canceledCount, spendRaw, upcomingRaw] = await Promise.all([
        prisma.subscription.count({
            where: { userId, status: SubscriptionStatus.ACTIVE }
        }),

        prisma.subscription.count({
            where: { userId, status: SubscriptionStatus.CANCELED }
        }),

        // GROUP BY NAME (Because your 'platform' column is empty)
        prisma.subscription.groupBy({
            by: ['name'],
            where: {
                userId,
                status: SubscriptionStatus.ACTIVE
            },
            _sum: { amount: true },
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

    // --- CRITICAL FIX HERE ---
    const allItems = spendRaw.map((item) => ({
        // We grouped by 'name', so we MUST use 'item.name'.
        // If we use 'item.platform', it will be undefined -> "Other".
        platform: item.name || "Other",
        amount: item._sum.amount ? item._sum.amount.toNumber() : 0,
    })).sort((a, b) => b.amount - a.amount);

    // --- Top 4 + Others Logic ---
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
        activeCount,
        canceledCount,
        estimatedMonthlySpend,
        spendByPlatform,
        upcoming
    };
});