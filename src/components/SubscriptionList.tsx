import { Card, CardContent } from "@/components/ui/card"

const subs = [
  { name: "Netflix", plan: "Premium", cost: "₹649/mo" },
  { name: "ChatGPT Plus", plan: "Monthly", cost: "₹1,999/mo" },
]

export default function SubscriptionList() {
  return (
    <div className="space-y-2">
      {subs.map((sub) => (
        <Card key={sub.name}>
          <CardContent className="p-4 flex justify-between items-center">
            <div>
              <p className="font-medium">{sub.name}</p>
              <p className="text-sm text-muted-foreground">{sub.plan}</p>
            </div>
            <p className="font-semibold">{sub.cost}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
