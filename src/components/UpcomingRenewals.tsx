import { Card, CardContent } from "@/components/ui/card"

const upcoming = [
  { name: "Spotify", renews: "Jul 20", amount: "₹129" },
  { name: "Notion", renews: "Jul 22", amount: "₹499" },
]

export default function UpcomingRenewals() {
  return (
    <div>
      <h2 className="text-lg font-semibold mb-2">Upcoming Renewals</h2>
      <div className="grid gap-2 sm:grid-cols-2">
        {upcoming.map((sub) => (
          <Card key={sub.name}>
            <CardContent className="p-4 flex justify-between items-center">
              <div>
                <p className="font-medium">{sub.name}</p>
                <p className="text-sm text-muted-foreground">Renews on {sub.renews}</p>
              </div>
              <p className="font-semibold">{sub.amount}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
