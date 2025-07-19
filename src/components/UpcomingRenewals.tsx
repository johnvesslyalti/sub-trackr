import { Card, CardContent } from "@/components/ui/card"
import { CalendarClock } from "lucide-react"

const upcoming = [
  { name: "Spotify", renews: "Jul 20", amount: "₹129" },
  { name: "Notion", renews: "Jul 22", amount: "₹499" },
]

export default function UpcomingRenewals() {
  return (
    <div className="mb-6">
      <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
        <CalendarClock className="w-5 h-5 text-primary" />
        Upcoming Renewals
      </h2>

      <div className="grid gap-4 sm:grid-cols-2">
        {upcoming.map((sub) => (
          <Card
            key={sub.name}
            className="hover:shadow-sm transition-shadow rounded-xl border"
          >
            <CardContent className="p-5 flex justify-between items-center">
              <div>
                <p className="text-base font-semibold">{sub.name}</p>
                <p className="text-sm text-muted-foreground">Renews on {sub.renews}</p>
              </div>
              <p className="text-lg font-bold text-primary">{sub.amount}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
