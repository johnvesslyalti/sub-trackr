import { Card, CardContent } from "@/components/ui/card"
import { BadgeCheck, CreditCard, Bell } from "lucide-react"

const stats = [
  {
    label: "Total Spent This Month",
    value: "₹2,499",
    icon: CreditCard,
  },
  {
    label: "Active Subscriptions",
    value: "8",
    icon: BadgeCheck,
  },
  {
    label: "Upcoming Renewals",
    value: "3",
    icon: Bell,
  },
]

export default function StatsCards() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
      {stats.map((stat) => (
        <Card
          key={stat.label}
          className="hover:shadow-md transition-shadow duration-200 border rounded-2xl"
        >
          <CardContent className="p-6 flex items-center space-x-4">
            <div className="bg-primary/10 text-primary p-3 rounded-full">
              <stat.icon className="w-5 h-5" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">{stat.label}</p>
              <p className="text-2xl font-bold tracking-tight">{stat.value}</p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
