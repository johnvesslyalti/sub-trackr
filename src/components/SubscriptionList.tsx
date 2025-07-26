"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { BadgeDollarSign } from "lucide-react";

// Define the structure of a subscription item
type Subscription = {
  id?: string | number;
  name: string;
  plan?: string;
  amount: number;
  nextBillingDate?: string;
  reminderBefore?: number;
};

export default function SubscriptionList() {
  const [subs, setSubs] = useState<Subscription[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchSubscriptions = async () => {
    try {
      const res = await fetch("/api/subscriptions");
      if (res.ok) {
        const data = await res.json();
        setSubs(data);
      } else {
        console.error("Failed to fetch subscriptions");
      }
    } catch (err) {
      console.error("Error fetching subscriptions:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubscriptions();
  }, []);

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold flex items-center gap-2 mb-1">
        <BadgeDollarSign className="w-5 h-5 text-primary" />
        Active Subscriptions
      </h2>

      {loading ? (
        <p className="text-muted-foreground">Loading...</p>
      ) : subs.length === 0 ? (
        <p className="text-muted-foreground">No subscriptions found.</p>
      ) : (
        subs.map((sub, index) => (
          <Card
            key={sub.id ?? `${sub.name}-${index}`}
            className="hover:shadow-sm transition-shadow rounded-xl border"
          >
            <CardContent className="p-5 flex justify-between items-center">
              <div>
                <p className="text-base font-semibold">{sub.name}</p>
                <p className="text-sm text-muted-foreground">
                  {sub.plan || "—"} Plan
                </p>
              </div>
              <p className="text-lg font-bold text-primary">
                ₹{sub.amount.toFixed(2)}
              </p>
            </CardContent>
          </Card>
        ))
      )}
    </div>
  );
}
