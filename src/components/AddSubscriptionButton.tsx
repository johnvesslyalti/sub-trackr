import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"

export default function AddSubscriptionButton() {
  return (
    <Button className="gap-2">
      <Plus size={18} />
      Add Subscription
    </Button>
  )
}
