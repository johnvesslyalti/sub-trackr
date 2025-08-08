"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { BadgeDollarSign } from "lucide-react";
import clsx from "clsx";

type Subscription = {
  id?: string | number;
  name: string;
  plan?: string;
  amount: number;
  nextBillingDate?: string;
  reminderBefore?: number;
};

// Assign background and text colors based on the service name
const getServiceColor = (name: string) => {
  const lower = name.toLowerCase();
  if (lower.includes("netflix")) return "bg-red-600 text-white";
  if (lower.includes("prime")) return "bg-blue-600 text-white";
  if (lower.includes("spotify")) return "bg-green-500 text-white";
  if (lower.includes("youtube")) return "bg-red-500 text-white";
  if (lower.includes("notion")) return "bg-black text-white";
  if (lower.includes("google")) return "bg-yellow-500 text-black";
  if (lower.includes("gym")) return "bg-purple-600 text-white";
  return "bg-zinc-300 text-zinc-800 dark:bg-zinc-700 dark:text-white";
};

// Suggest category based on name
const getSuggestedCategory = (name: string) => {
  const lower = name.toLowerCase();
  if (lower.includes("netflix") || lower.includes("prime") || lower.includes("youtube") || lower.includes("spotify")) return "Entertainment";
  if (lower.includes("gym") || lower.includes("fit")) return "Fitness";
  if (lower.includes("notion") || lower.includes("google") || lower.includes("dropbox")) return "Productivity";
  return "General";
};

// Simulated expense warning
const shouldCancel = (amount: number) => amount > 500;

export default function SubscriptionList() {
  const [subs, setSubs] = useState<Subscription[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
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
        subs.map((sub, index) => {
          const category = getSuggestedCategory(sub.name);

          return (
            <Card
              key={sub.id ?? `${sub.name}-${index}`}
              className="hover:shadow-md transition-all duration-200 rounded-xl border bg-background"
            >
              <CardContent className="p-5 flex justify-between items-center gap-4">
                <div className="flex items-center gap-4">
                  {/* Big-letter avatar box */}
                  <div
                    className={clsx(
                      "w-10 h-10 rounded-md flex items-center justify-center text-lg font-bold uppercase",
                      getServiceColor(sub.name)
                    )}
                  >
                    {sub.name[0]}
                  </div>

                  <div>
                    <p className="text-base font-semibold">{sub.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {sub.plan || "—"} Plan ·{" "}
                      <span
                        className={clsx("px-2 py-0.5 rounded-full text-xs", {
                          "bg-yellow-100 text-yellow-700": category === "Entertainment",
                          "bg-green-100 text-green-700": category === "Fitness",
                          "bg-blue-100 text-blue-700": category === "Productivity",
                          "bg-zinc-200 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300":
                            category === "General",
                        })}
                      >
                        {category}
                      </span>
                    </p>
                    {shouldCancel(sub.amount) && (
                      <p className="text-xs text-red-500 mt-1">
                        ⚠️ This subscription is quite expensive.
                      </p>
                    )}
                  </div>
                </div>

                <p className="text-lg font-bold text-primary whitespace-nowrap">
                  ₹{sub.amount.toFixed(2)}
                </p>
              </CardContent>
            </Card>
          );
        })
      )}
    </div>
  );
}
