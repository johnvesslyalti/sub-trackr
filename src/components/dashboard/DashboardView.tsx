// src/components/dashboard/DashboardView.tsx
"use client";

import React, { useMemo } from "react";
import ReactECharts from "echarts-for-react";

type DashboardProps = {
    stats: {
        activeCount: number;
        canceledCount: number;
        estimatedMonthlySpend: number;
        spendByPlatform: { platform: string; amount: number }[];
        upcoming: { name: string; amount: number }[];
    };
};

export function DashboardView({ stats }: DashboardProps) {
    // 1. Configuration for the Donut Chart
    const pieOption = useMemo(() => {
        return {
            tooltip: {
                trigger: "item",
                formatter: "{b}: ${c} ({d}%)",
                backgroundColor: "rgba(0,0,0,0.7)", // Neutral dark tooltip
                textStyle: { color: "#fff" },
                borderWidth: 0,
            },
            legend: {
                bottom: "0%",
                left: "center",
                icon: "circle",
                textStyle: { color: "#9ca3af" }, // Tailwind gray-400 (visible on dark/light)
            },
            series: [
                {
                    name: "Spend by Platform",
                    type: "pie",
                    radius: ["40%", "70%"],
                    avoidLabelOverlap: false,
                    itemStyle: {
                        borderRadius: 10,
                        borderColor: "transparent", // Removed white border to support dark mode
                        borderWidth: 2,
                    },
                    label: {
                        show: false,
                        position: "center",
                    },
                    emphasis: {
                        label: {
                            show: true,
                            fontSize: 20,
                            fontWeight: "bold",
                            color: "inherit", // Uses the series color
                        },
                    },
                    data: stats.spendByPlatform.map((item) => ({
                        value: item.amount,
                        name: item.platform,
                    })),
                },
            ],
        };
    }, [stats.spendByPlatform]);

    // 2. Configuration for Bar Chart
    const barOption = useMemo(() => {
        return {
            tooltip: {
                trigger: "axis",
                axisPointer: { type: "shadow" },
                backgroundColor: "rgba(0,0,0,0.7)",
                textStyle: { color: "#fff" },
                borderWidth: 0,
            },
            grid: { left: "3%", right: "4%", bottom: "3%", containLabel: true },
            xAxis: {
                type: "category",
                data: stats.upcoming.map((sub) => sub.name),
                axisTick: { alignWithLabel: true },
                axisLabel: { color: "#9ca3af" }, // Neutral gray
                axisLine: { lineStyle: { color: "#374151" } }, // Dark gray line
            },
            yAxis: {
                type: "value",
                axisLabel: { formatter: "${value}", color: "#9ca3af" },
                splitLine: { lineStyle: { color: "#374151", type: "dashed" } }, // Subtle grid lines
            },
            series: [
                {
                    name: "Amount",
                    type: "bar",
                    barWidth: "40%",
                    data: stats.upcoming.map((sub) => sub.amount),
                    itemStyle: {
                        color: "#6366f1", // Indigo-500 (Works well on both backgrounds)
                        borderRadius: [4, 4, 0, 0],
                    },
                },
            ],
        };
    }, [stats.upcoming]);

    return (
        <div className="space-y-6">
            {/* --- KPI Section --- */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <KpiCard
                    title="Monthly Spend"
                    value={`$${stats.estimatedMonthlySpend}`}
                    // Use 'text-primary' so it adapts to theme (usually black in light, white in dark)
                    valueClassName="text-primary"
                />
                <KpiCard
                    title="Active Subscriptions"
                    value={stats.activeCount}
                />
                <KpiCard
                    title="Canceled"
                    value={stats.canceledCount}
                    valueClassName="text-muted-foreground"
                />
            </div>

            {/* --- Charts Section --- */}
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                {/* Spend Distribution */}
                <div className="rounded-xl border border-border bg-card p-6 shadow-sm text-card-foreground">
                    <h3 className="mb-4 text-lg font-semibold tracking-tight">Spend by Platform</h3>
                    {stats.spendByPlatform.length > 0 ? (
                        <ReactECharts option={pieOption} style={{ height: 300 }} />
                    ) : (
                        <div className="flex h-[300px] items-center justify-center rounded-lg border-2 border-dashed border-border bg-accent/50 text-muted-foreground">
                            <p>No subscriptions yet</p>
                        </div>
                    )}
                </div>

                {/* Upcoming Payments */}
                <div className="rounded-xl border border-border bg-card p-6 shadow-sm text-card-foreground">
                    <h3 className="mb-4 text-lg font-semibold tracking-tight">Upcoming Bills</h3>
                    {stats.upcoming.length > 0 ? (
                        <ReactECharts option={barOption} style={{ height: 300 }} />
                    ) : (
                        <div className="flex h-[300px] items-center justify-center rounded-lg border-2 border-dashed border-border bg-accent/50 text-muted-foreground">
                            <p>No upcoming bills</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

// Reusable KPI Card with Theme variables
function KpiCard({
    title,
    value,
    valueClassName = "text-foreground",
}: {
    title: string;
    value: string | number;
    valueClassName?: string;
}) {
    return (
        <div className="rounded-xl border border-border bg-card p-6 shadow-sm transition-all hover:shadow-md">
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <p className={`mt-2 text-3xl font-bold ${valueClassName}`}>{value}</p>
        </div>
    );
}