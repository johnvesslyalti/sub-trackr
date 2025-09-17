export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return new Response("Unauthorized", { status: 401 });
  }

  const { image } = await req.json();

  await prisma.user.update({
    where: { email: session.user?.email ?? "" },
    data: { image },
  });

  return new Response("Avatar updated", { status: 200 });
}
