import { BillingCycle } from "@/generated/prisma";
import z from "zod";

export const historySchema = z.object({
    subscriptionId: z.string().optional(),
    name: z.string(),
    platform: z.string().nullable().optional(),
    plan: z.string().nullable().optional(),
    amount: z.number().nonnegative(),
    currency: z.string(),
    billingCycle: z.enum(BillingCycle),
    endedAt: z.date().default(new Date())
})