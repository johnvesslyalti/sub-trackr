'use server';

import { BillingCycle, SubscriptionStatus } from "@/generated/prisma";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { headers } from "next/headers";

type SortField = "nextBillingDate" | "amount" | "createdAt";
type SortOrder = "asc" | "desc"

export type SubscriptionFilters = {
    status?: SubscriptionStatus;
    platform?: string,
    billingCycle?: BillingCycle;
    search?: string;
}

export type PaginationParams = {
    page?: number;
    pageSize?: number;
};

export type SortParams = {
    sortBy?: SortField;
    sortOrder?: SortOrder;
}

async function getUserIdOrThrow() {
    const session = await auth.api.getSession({
        headers: await headers()
    });
    if (!session || !session.user) throw new Error("Unauthorized");
    return session.user.id
}

export async function getSubscriptions(
    filters: SubscriptionFilters = {},
    pagination: PaginationParams = {},
    sort: SortParams = {}
) {
    const userId = await getUserIdOrThrow();

    const { status, platform, billingCycle, search } = filters;

    const page = pagination.page && pagination.page > 0 ? pagination.page : 1;
    const pageSize = pagination.pageSize && pagination.pageSize > 0 ? pagination.pageSize : 10;

    const sortBy = sort.sortBy || "nextBillingDate";
    const sortOrder = sort.sortOrder || "asc";

    const where = {
        userId,
        ...(status && { status }),
        ...(platform && { platform }),
        ...(billingCycle && { billingCycle }),
        ...(search && {
            OR: [
                { name: { contains: search, mode: "insensitive" as const } },
                { platform: { contains: search, mode: "insensitive" as const } }
            ],
        }),
    };
    const [items, total] = await Promise.all([
        prisma.subscription.findMany({
            where,
            orderBy: { [sortBy]: sortOrder },
            skip: (page - 1) * pageSize,
            take: pageSize,
        }),
        prisma.subscription.count({ where })
    ]);

    return {
        items,
        total,
        page,
        pageSize,
        pages: Math.ceil(total / pageSize),
    }
}