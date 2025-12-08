import * as z from "zod";
import { BillingCycle, SubscriptionStatus } from "@/generated/prisma";

export const createSubscriptionSchema = z.object({
    name: z.string().min(1, "Name is required"),
    plan: z.string().optional(),
    amount: z.number().min(0),
    currency: z.string().default("INR"),
    billingCycle: z.nativeEnum(BillingCycle),
    interval: z.number().min(1).default(1),
    startDate: z.date(),
});

export const updateSubscriptionSchema = createSubscriptionSchema.partial().extend({
    status: z.nativeEnum(SubscriptionStatus).optional(),
});

export type createSubscriptionInput = z.infer<typeof createSubscriptionSchema>;
export type updateSubscriptionInput = z.infer<typeof updateSubscriptionSchema>;