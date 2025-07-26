"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { CalendarClock } from "lucide-react";
import { format } from "date-fns";

interface Renewal {
  name: string;
  renews: string;
  amount: number;
}

export default function UpcomingRenewals() {
  const [upcoming, setUpcoming] = useState<Renewal[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRenewals = async () => {
      try {
        const res = await fetch("/api/upcoming-renewals");
        const data = await res.json();
        setUpcoming(data);
      } catch (err) {
        console.error("Error loading upcoming renewals:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchRenewals();
  }, []);

  return (
    <div className="mb-6">
      <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
        <CalendarClock className="w-5 h-5 text-primary" />
        Upcoming Renewals
      </h2>

      {loading ? (
        <p className="text-sm text-muted-foreground">Loading...</p>
      ) : upcoming.length === 0 ? (
        <p className="text-sm text-muted-foreground">No renewals in the next 7 days.</p>
      ) : (
        <div
          className={
            upcoming.length <= 2
              ? "grid gap-4 sm:grid-cols-2"
              : "flex gap-4 overflow-x-auto px-1 no-scrollbar"
          }
        >
          {upcoming.map((sub) => (
            <Card
              key={`${sub.name}-${sub.renews}`}
              className="min-w-[250px] sm:min-w-[280px] flex-shrink-0 hover:shadow-sm transition-shadow rounded-xl border"
            >
              <CardContent className="p-5 flex justify-between items-center">
                <div>
                  <p className="text-base font-semibold">{sub.name}</p>
                  <p className="text-sm text-muted-foreground">
                    Renews on {format(new Date(sub.renews), "MMM d")}
                  </p>
                </div>
                <p className="text-lg font-bold text-primary">
                  ₹{sub.amount.toLocaleString()}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
