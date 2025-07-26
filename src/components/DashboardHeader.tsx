// app/dashboard/_components/dashboard-header.tsx (or your actual path)
import { auth } from "@/lib/auth";

export default async function DashboardHeader() {
  const session = await auth(); // Pull session from NextAuth
  const name = session?.user?.name;

  return (
    <div className="mb-6 space-y-1">
      <h1 className="text-3xl md:text-4xl font-bold tracking-tight leading-snug">
        👋 Welcome back,
        <span className="text-primary ml-2">
          {name ?? "User"}
        </span>
      </h1>
      <p className="text-muted-foreground text-sm md:text-base">
        Here&apos;s your personalized subscription overview.
      </p>
    </div>
  );
}
