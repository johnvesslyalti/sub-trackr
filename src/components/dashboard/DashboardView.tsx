// src/components/dashboard/DashboardView.tsx
"use client";

import React, { useMemo } from "react";
import ReactECharts from "echarts-for-react";
import { format } from "date-fns"; // Assuming you have date-fns, or use native Intl

// Define types matching your server response
type DashboardProps = {
    stats: {
        activeCount: number;
        canceledCount: number;
        estimatedMonthlySpend: number;
        spendByPlatform: { platform: string; amount: number }[];
        upcoming: any[]; // Replace 'any' with your Subscription type
    };
};

export function DashboardView({ stats }: DashboardProps) {

    // 1. Configuration for the Donut Chart (Spend by Platform)
    const pieOption = useMemo(() => {
        return {
            tooltip: {
                trigger: "item",
                formatter: "{b}: ${c} ({d}%)", // Shows Name: $Value (Percent%)
            },
            legend: {
                bottom: "0%",
                left: "center",
                icon: "circle",
            },
            series: [
                {
                    name: "Spend by Platform",
                    type: "pie",
                    radius: ["40%", "70%"], // Makes it a Donut
                    avoidLabelOverlap: false,
                    itemStyle: {
                        borderRadius: 10,
                        borderColor: "#fff",
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

    // 2. Configuration for Bar Chart (Upcoming Payments)
    const barOption = useMemo(() => {
        return {
            tooltip: {
                trigger: "axis",
                axisPointer: { type: "shadow" },
            },
            grid: { left: "3%", right: "4%", bottom: "3%", containLabel: true },
            xAxis: {
                type: "category",
                data: stats.upcoming.map((sub) => sub.name),
                axisTick: { alignWithLabel: true },
            },
            yAxis: {
                type: "value",
                axisLabel: { formatter: "${value}" },
            },
            series: [
                {
                    name: "Amount",
                    type: "bar",
                    barWidth: "40%",
                    data: stats.upcoming.map((sub) => sub.amount),
                    itemStyle: {
                        color: "#6366f1", // Indigo-500
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
                    color="text-emerald-600"
                />
                <KpiCard
                    title="Active Subscriptions"
                    value={stats.activeCount}
                />
                <KpiCard
                    title="Canceled"
                    value={stats.canceledCount}
                    color="text-gray-500"
                />
            </div>

            {/* --- Charts Section --- */}
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                {/* Spend Distribution */}
                <div className="rounded-xl border bg-white p-6 shadow-sm">
                    <h3 className="mb-4 text-lg font-semibold text-gray-800">Spend by Platform</h3>
                    <ReactECharts option={pieOption} style={{ height: 300 }} />
                </div>

                {/* Upcoming Payments */}
                <div className="rounded-xl border bg-white p-6 shadow-sm">
                    <h3 className="mb-4 text-lg font-semibold text-gray-800">Upcoming Bills</h3>
                    <ReactECharts option={barOption} style={{ height: 300 }} />
                </div>
            </div>
        </div>
    );
}

// Simple internal component for consistent cards
function KpiCard({ title, value, color = "text-gray-900" }: { title: string; value: string | number; color?: string }) {
    return (
        <div className="rounded-xl border bg-white p-6 shadow-sm">
            <p className="text-sm font-medium text-gray-500">{title}</p>
            <p className={`mt-2 text-3xl font-bold ${color}`}>{value}</p>
        </div>
    );
}