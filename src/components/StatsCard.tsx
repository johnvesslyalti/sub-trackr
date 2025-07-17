import { Card, CardContent } from "@/components/ui/card"

const stats = [
  { label: "Total Spent This Month", value: "₹2,499" },
  { label: "Active Subscriptions", value: "8" },
  { label: "Upcoming Renewals", value: "3" },
]

export default function StatsCards() {
  return (
    <div className="grid gap-4 sm:grid-cols-3">
      {stats.map((stat) => (
        <Card key={stat.label}>
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">{stat.label}</p>
            <p className="text-xl font-semibold">{stat.value}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
