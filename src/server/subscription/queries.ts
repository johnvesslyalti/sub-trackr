import 'server-only'; // 1. Prevents client-side accidental import

import { BillingCycle, SubscriptionStatus, Prisma } from "@/generated/prisma";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { headers } from "next/headers";
import { cache } from "react"; // 2. Request deduping
import { z } from "zod";

// 3. Define Zod schema for robust URL param parsing
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

async function getUserIdOrThrow() {
    const session = await auth.api.getSession({
        headers: await headers(),
    });
    if (!session || !session.user) throw new Error("Unauthorized");
    return session.user.id;
}

// 4. Wrap in cache() so multiple components can call this without multiple DB hits
export const getSubscriptions = cache(async (input: GetSubscriptionsInput) => {
    const userId = await getUserIdOrThrow();

    // 5. Parse and sanitize inputs (handles "10" string -> 10 number)
    const {
        page,
        pageSize,
        status,
        platform,
        billingCycle,
        search,
        sortBy,
        sortOrder
    } = subscriptionQuerySchema.parse(input);

    // 6. Type-safe Where Clause
    const where: Prisma.SubscriptionWhereInput = {
        userId,
        ...(status && { status }),
        ...(billingCycle && { billingCycle }),
        ...(platform && { platform: { contains: platform, mode: 'insensitive' } }), // Allow partial platform match?
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

        return {
            items,
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

// Helper: Get summary stats (optional but useful)
export const getSubscriptionStats = cache(async () => {
    const userId = await getUserIdOrThrow();

    const stats = await prisma.subscription.aggregate({
        where: { userId, status: 'ACTIVE' },
        _sum: { amount: true },
        _count: { id: true }
    });

    return {
        totalMonthlySpend: stats._sum.amount || 0,
        activeSubscriptions: stats._count.id
    };
});