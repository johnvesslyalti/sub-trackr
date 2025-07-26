"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { BadgeCheck, CreditCard, Bell, LucideIcon } from "lucide-react";

// Define icon mapping based on backend string
const iconMap: Record<string, LucideIcon> = {
  CreditCard,
  BadgeCheck,
  Bell,
};

interface Stat {
  name: string;
  label: string;
  value: number;
  icon: keyof typeof iconMap;
}

export default function StatsCards() {
  const [stats, setStats] = useState<Stat[] | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch("/api/stats");
        const data = await res.json();
        setStats(data);
      } catch (err) {
        console.error("Failed to fetch stats", err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
        {[...Array(3)].map((_, i) => (
          <Card key={i} className="animate-pulse h-24 border rounded-2xl" />
        ))}
      </div>
    );
  }

  if (!stats) {
    return <p className="text-muted-foreground">Failed to load stats.</p>;
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
      {stats.map((stat) => {
        const Icon = iconMap[stat.icon] || CreditCard;

        return (
          <Card
            key={stat.name}
            className="hover:shadow-md transition-shadow duration-200 border rounded-2xl"
          >
            <CardContent className="p-6 flex items-center space-x-4">
              <div className="bg-primary/10 text-primary p-3 rounded-full">
                <Icon className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
                <p className="text-2xl font-bold tracking-tight">
                  {stat.name === "total-spent"
                    ? `₹${stat.value.toLocaleString()}`
                    : stat.value}
                </p>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
