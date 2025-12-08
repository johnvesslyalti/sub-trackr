//src/lib/validations/subscription.ts
import { z } from "zod";
import { BillingCycle } from "@/generated/prisma"; // Adjust path if needed

export const createSubscriptionSchema = z.object({
    name: z.string().min(1, "Name is required"),
    amount: z.coerce.number().min(0.01, "Amount must be greater than 0"),
    currency: z.string().default("USD"),
    billingCycle: z.nativeEnum(BillingCycle),
    platform: z.string().optional(),
    interval: z.coerce.number().default(1),
    startDate: z.date().optional().default(new Date()),
});

export type createSubscriptionInput = z.infer<typeof createSubscriptionSchema>;

// Just in case you need update schema later
export const updateSubscriptionSchema = createSubscriptionSchema.partial();
export type updateSubscriptionInput = z.infer<typeof updateSubscriptionSchema>;