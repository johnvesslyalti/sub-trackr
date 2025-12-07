// src/lib/email.ts
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY!);

// Types for reminder email
export interface ReminderEmailPayload {
    to: string;
    subscriptions: {
        name: string;
        nextBillingDate: Date;
        amount: any; // Decimal type from Prisma
        currency: string;
    }[];
    reminderDaysBefore: number;
}

export async function sendReminderEmail(payload: ReminderEmailPayload) {
    const { to, subscriptions, reminderDaysBefore } = payload;

    const formattedItems = subscriptions
        .map((sub) => {
            const date = sub.nextBillingDate.toLocaleDateString();
            const price = `${sub.amount.toString()} ${sub.currency}`;
            return `• ${sub.name} — ${price} — renews on ${date}`;
        })
        .join("\n");

    const textBody = `
Hi there 👋,

This is a friendly reminder that the following subscriptions will renew in ${reminderDaysBefore} day(s):

${formattedItems}

Stay on top of your expenses with Sub Trakcr!
`;

    try {
        const data = await resend.emails.send({
            from: "SubTrakcr <onboarding@resend.dev>",
            to,
            subject: "Upcoming Subscription Renewal",
            text: textBody,
        });

        return { success: true, data };
    } catch (error) {
        console.error("Email send error:", error);
        return { success: false, error };
    }
}
