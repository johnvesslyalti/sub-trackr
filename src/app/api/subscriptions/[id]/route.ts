
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";

interface Params {
  params: { id: string };
}

// Get one subscription
export async function GET(_: Request, { params }: Params) {
  const session = await auth();
  if (!session?.user) return new NextResponse("Unauthorized", { status: 401 });

  const sub = await db.subscription.findUnique({
    where: { id: params.id, userId: session.user.id },
  });

  if (!sub) return new NextResponse("Not Found", { status: 404 });
  return NextResponse.json(sub);
}

// Update a subscription
export async function PUT(req: Request, { params }: Params) {
  const session = await auth();
  if (!session?.user) return new NextResponse("Unauthorized", { status: 401 });

  const data = await req.json();

  const updated = await db.subscription.update({
    where: { id: params.id, userId: session.user.id },
    data: {
      ...data,
      nextBillingDate: data.nextBillingDate ? new Date(data.nextBillingDate) : undefined,
    },
  });

  return NextResponse.json(updated);
}

// Delete a subscription
export async function DELETE(_: Request, { params }: Params) {
  const session = await auth();
  if (!session?.user) return new NextResponse("Unauthorized", { status: 401 });

  await db.subscription.delete({
    where: { id: params.id, userId: session.user.id },
  });

  return new NextResponse(null, { status: 204 });
}
