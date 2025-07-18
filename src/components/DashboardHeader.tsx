interface DashboardHeaderProps {
  name?: string | null
}

export default function DashboardHeader({ name }: DashboardHeaderProps) {
  return (
    <div>
      <h1 className="text-2xl md:text-3xl font-bold">
        Welcome back, {name ?? "User"} 👋
      </h1>
      <p className="text-muted-foreground">Here&apos;s your subscription overview</p>
    </div>
  )
}