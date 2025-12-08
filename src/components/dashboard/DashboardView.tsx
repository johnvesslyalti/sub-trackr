// src/components/dashboard/DashboardView.tsx
"use client";

import React, { useMemo } from "react";
import ReactECharts from "echarts-for-react";
import * as echarts from "echarts"; // Import required for Gradients

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
    // 1. Configuration for the Donut Chart (Purple Theme)
    const pieOption = useMemo(() => {
        return {
            // A palette of purples ranging from dark to light
            color: [
                "#4c1d95", // violet-900
                "#5b21b6", // violet-800
                "#7c3aed", // violet-600
                "#8b5cf6", // violet-500
                "#a78bfa", // violet-400
                "#c4b5fd", // violet-300
            ],
            tooltip: {
                trigger: "item",
                formatter: "{b}: ${c} ({d}%)",
                backgroundColor: "rgba(17, 24, 39, 0.9)", // Dark background
                textStyle: { color: "#fff" },
                borderRadius: 8,
                borderWidth: 0,
            },
            legend: {
                bottom: "0%",
                left: "center",
                itemWidth: 10,
                itemHeight: 10,
                icon: "circle",
                textStyle: { color: "#9ca3af" },
            },
            series: [
                {
                    name: "Spend by Platform",
                    type: "pie",
                    radius: ["50%", "75%"], // Slightly thinner ring for modern look
                    avoidLabelOverlap: false,
                    itemStyle: {
                        borderRadius: 10,
                        borderColor: "var(--background)", // Matches theme background (simulated transparent)
                        borderWidth: 2,
                    },
                    label: {
                        show: false,
                        position: "center",
                    },
                    emphasis: {
                        label: {
                            show: true,
                            fontSize: 18,
                            fontWeight: "bold",
                            color: "inherit",
                        },
                        itemStyle: {
                            shadowBlur: 10,
                            shadowOffsetX: 0,
                            shadowColor: "rgba(0, 0, 0, 0.5)",
                        },
                    },
                    data: stats.spendByPlatform.map((item) => ({
                        value: item.amount,
                        // Fix: Fallback to "Other" if platform string is empty
                        name: item.platform || "Other",
                    })),
                },
            ],
        };
    }, [stats.spendByPlatform]);

    // 2. Configuration for Bar Chart (Purple Gradient)
    const barOption = useMemo(() => {
        return {
            tooltip: {
                trigger: "axis",
                axisPointer: { type: "shadow" },
                backgroundColor: "rgba(17, 24, 39, 0.9)",
                textStyle: { color: "#fff" },
                borderRadius: 8,
                borderWidth: 0,
            },
            grid: { left: "3%", right: "4%", bottom: "3%", containLabel: true },
            xAxis: {
                type: "category",
                data: stats.upcoming.map((sub) => sub.name),
                axisTick: { alignWithLabel: true },
                axisLabel: { color: "#9ca3af", fontSize: 11 },
                axisLine: { lineStyle: { color: "#374151" } },
            },
            yAxis: {
                type: "value",
                axisLabel: { formatter: "${value}", color: "#9ca3af" },
                splitLine: { lineStyle: { color: "#374151", type: "dashed", opacity: 0.5 } },
            },
            series: [
                {
                    name: "Amount",
                    type: "bar",
                    barWidth: "40%",
                    data: stats.upcoming.map((sub) => sub.amount),
                    itemStyle: {
                        borderRadius: [4, 4, 0, 0],
                        // Purple Linear Gradient
                        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                            { offset: 0, color: "#8b5cf6" }, // Top: Violet-500
                            { offset: 1, color: "#4c1d95" }, // Bottom: Violet-900
                        ]),
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
                    <h3 className="mb-6 text-lg font-semibold tracking-tight">Spend by Platform</h3>
                    {stats.spendByPlatform.length > 0 ? (
                        <ReactECharts option={pieOption} style={{ height: 320 }} />
                    ) : (
                        <div className="flex h-[320px] items-center justify-center rounded-lg border-2 border-dashed border-border bg-accent/50 text-muted-foreground">
                            <p>No subscriptions yet</p>
                        </div>
                    )}
                </div>

                {/* Upcoming Payments */}
                <div className="rounded-xl border border-border bg-card p-6 shadow-sm text-card-foreground">
                    <h3 className="mb-6 text-lg font-semibold tracking-tight">Upcoming Bills</h3>
                    {stats.upcoming.length > 0 ? (
                        <ReactECharts option={barOption} style={{ height: 320 }} />
                    ) : (
                        <div className="flex h-[320px] items-center justify-center rounded-lg border-2 border-dashed border-border bg-accent/50 text-muted-foreground">
                            <p>No upcoming bills</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

// Reusable KPI Card
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