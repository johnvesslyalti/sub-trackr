import { BillingCycle, SubscriptionStatus } from "@/generated/prisma";
import z from "zod";

export const createSubscriptionSchema = z.object({
    name: z.string().min(1, "Name is required"),
    platform: z.string().optional().nullable(),
    plan: z.string().optional().nullable(),

    amount: z.number().nonnegative("Amount must be a positive"),

    current: z.string().default("INR"),

    billingCycle: z.enum(BillingCycle),
    interval: z.coerce.number().int().min(1).default(1),

    nextBillingDate: z.coerce.date(),
    reminderBefore: z.coerce.number().int().min(0).default(3),

    status: z.enum(SubscriptionStatus).default("ACTIVE"),
})

export const updateSubscriptionSchema = createSubscriptionSchema.partial()

export type subscriptionInput = z.infer<typeof createSubscriptionSchema>;