import { Card, CardContent } from "@/components/ui/card"
import { BadgeDollarSign } from "lucide-react"

const subs = [
  { name: "Netflix", plan: "Premium", cost: "₹649/mo" },
  { name: "ChatGPT Plus", plan: "Monthly", cost: "₹1,999/mo" },
]

export default function SubscriptionList() {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold flex items-center gap-2 mb-1">
        <BadgeDollarSign className="w-5 h-5 text-primary" />
        Active Subscriptions
      </h2>

      {subs.map((sub) => (
        <Card
          key={sub.name}
          className="hover:shadow-sm transition-shadow rounded-xl border"
        >
          <CardContent className="p-5 flex justify-between items-center">
            <div>
              <p className="text-base font-semibold">{sub.name}</p>
              <p className="text-sm text-muted-foreground">{sub.plan} Plan</p>
            </div>
            <p className="text-lg font-bold text-primary">{sub.cost}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
