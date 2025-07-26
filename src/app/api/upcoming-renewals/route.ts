import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = session.user.id;
  const now = new Date();
  const sevenDaysLater = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);

  const subscriptions = await db.subscription.findMany({
    where: {
      userId,
      nextBillingDate: {
        gte: now,
        lte: sevenDaysLater,
      },
    },
    orderBy: {
      nextBillingDate: "asc",
    },
  });

  return NextResponse.json(
    subscriptions.map((sub) => ({
      name: sub.name,
      renews: sub.nextBillingDate,
      amount: sub.amount,
    }))
  );
}
