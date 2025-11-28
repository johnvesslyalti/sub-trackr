import { auth } from "@/lib/auth";
import { db } from "@/lib/prisma";
import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

// Helper to extract ID from dynamic segment
const getIdFromUrl = (url: string): string | null => {
  const match = url.match(/\/subscriptions\/([^\/\?]+)/);
  return match ? match[1] : null;
};

// GET one subscription
export async function GET(request: NextRequest) {
  const id = getIdFromUrl(request.url);
  const session = await auth.api.getSession({ headers: await headers() })

  if (!id) return new NextResponse("Bad Request", { status: 400 });
  if (!session?.user) return new NextResponse("Unauthorized", { status: 401 });

  const sub = await db.subscription.findUnique({
    where: {
      id,
      userId: session.user.id,
    },
  });

  if (!sub) {
    return new NextResponse("Not Found", { status: 404 });
  }

  return NextResponse.json(sub);
}

// PUT update subscription
export async function PUT(request: NextRequest) {
  const id = getIdFromUrl(request.url);
  const session = await auth.api.getSession({ headers: await headers() });

  if (!id) return new NextResponse("Bad Request", { status: 400 });
  if (!session?.user) return new NextResponse("Unauthorized", { status: 401 });

  const data = await request.json();

  const updated = await db.subscription.update({
    where: {
      id,
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
export async function DELETE(request: NextRequest) {
  const id = getIdFromUrl(request.url);
  const session = await auth.api.getSession({ headers: await headers() });

  if (!id) return new NextResponse("Bad Request", { status: 400 });
  if (!session?.user) return new NextResponse("Unauthorized", { status: 401 });

  await db.subscription.delete({
    where: {
      id,
      userId: session.user.id,
    },
  });

  return new NextResponse(null, { status: 204 });
}
