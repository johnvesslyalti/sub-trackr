import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";

// GET one subscription
export async function GET(
  request: Request,
  context: { params: { id: string } }
) {
  const { params } = context;
  const session = await auth();

  if (!session?.user) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const sub = await db.subscription.findUnique({
    where: {
      id: params.id,
      userId: session.user.id,
    },
  });

  if (!sub) {
    return new NextResponse("Not Found", { status: 404 });
  }

  return NextResponse.json(sub);
}

// PUT update subscription
export async function PUT(
  request: Request,
  context: { params: { id: string } }
) {
  const { params } = context;
  const session = await auth();

  if (!session?.user) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const data = await request.json();

  const updated = await db.subscription.update({
    where: {
      id: params.id,
      userId: session.user.id,
    },
    data: {
      ...data,
      nextBillingDate: data.nextBillingDate
        ? new Date(data.nextBillingDate)
        : undefined,
    },
  });

  return NextResponse.json(updated);
}

// DELETE a subscription
export async function DELETE(
  request: Request,
  context: { params: { id: string } }
) {
  const { params } = context;
  const session = await auth();

  if (!session?.user) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  await db.subscription.delete({
    where: {
      id: params.id,
      userId: session.user.id,
    },
  });

  return new NextResponse(null, { status: 204 });
}
