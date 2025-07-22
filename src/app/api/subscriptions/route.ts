import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";
import { BillingCycle } from "@prisma/client";

// Get all subscriptions for the current user
export async function GET() {
  const session = await auth();
  if (!session?.user) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const subs = await db.subscription.findMany({
    where: { userId: session.user.id },
    orderBy: { nextBillingDate: "asc" },
  });

  return NextResponse.json(subs);
}

// Create a new subscription
export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const body = await req.json();
  const {
    name,
    plan,
    amount,
    billingCycle,
    nextBillingDate,
    reminderBefore,
  } = body;

  // Validate required fields
  if (!name || !amount || !billingCycle || !nextBillingDate) {
    return new NextResponse("Missing required fields", { status: 400 });
  }

  // Ensure billingCycle is a valid enum value
  const billingCycleUpper = billingCycle.toUpperCase();
  if (!Object.values(BillingCycle).includes(billingCycleUpper as BillingCycle)) {
    return new NextResponse("Invalid billing cycle", { status: 400 });
  }

  const newSub = await db.subscription.create({
    data: {
      name,
      plan,
      amount,
      billingCycle: billingCycleUpper as BillingCycle,
      nextBillingDate: new Date(nextBillingDate),
      reminderBefore,
      userId: session.user.id,
    },
  });

  return NextResponse.json(newSub, { status: 201 });
}
