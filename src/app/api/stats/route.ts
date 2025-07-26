// app/api/stats/route.ts
import { db } from "@/lib/db";
import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";
import { startOfMonth, endOfMonth } from "date-fns";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = session.user.id;
  const now = new Date();
  const start = startOfMonth(now);
  const end = endOfMonth(now);

  // 1. Total Spent This Month (sum of amounts where billing is this month)
  const totalSpent = await db.subscription.aggregate({
    _sum: {
      amount: true,
    },
    where: {
      userId,
      nextBillingDate: {
        gte: start,
        lte: end,
      },
    },
  });

  // 2. Active Subscriptions = subscriptions with nextBillingDate in the future
  const activeCount = await db.subscription.count({
    where: {
      userId,
      nextBillingDate: {
        gte: now,
      },
    },
  });

  // 3. Upcoming Bills = subscriptions with billing in the next 7 days
  const upcomingCount = await db.subscription.count({
    where: {
      userId,
      nextBillingDate: {
        gte: now,
        lte: new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000), // next 7 days
      },
    },
  });

  return NextResponse.json([
    {
      name: "total-spent",
      label: "Total Spent This Month",
      value: totalSpent._sum?.amount ?? 0,
      icon: "CreditCard",
    },
    {
      name: "active-subscriptions",
      label: "Active Subscriptions",
      value: activeCount,
      icon: "BadgeCheck",
    },
    {
      name: "upcoming-bills",
      label: "Upcoming Bills",
      value: upcomingCount,
      icon: "Bell",
    },
  ]);
}
