import DashboardHeader from '@/components/DashboardHeader'
import SubscriptionList from '@/components/SubscriptionList'
import AddSubscriptionButton from '@/components/AddSubscriptionButton'
import StatsCards from '@/components/StatsCard'
import UpcomingRenewals from '@/components/UpcomingRenewals'

export default function DashboardPage() {
  return (
    <main className="p-4 md:p-6 space-y-6">
      <DashboardHeader />
      <StatsCards />
      <UpcomingRenewals />
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Active Subscriptions</h2>
        <AddSubscriptionButton />
      </div>
      <SubscriptionList />
    </main>
  )
}
