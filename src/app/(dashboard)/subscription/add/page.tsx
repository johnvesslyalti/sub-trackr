"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

export default function AddSubscriptionPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    name: "",
    plan: "",
    amount: "",
    billingCycle: "Monthly",
    nextBillingDate: "",
    reminderBefore: "0",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const { name, amount, billingCycle, nextBillingDate } = form;

    if (!name || !amount || !billingCycle || !nextBillingDate) {
      toast.error("Please fill in all required fields.");
      return;
    }

    const res = await fetch("/api/subscriptions", {
      method: "POST",
      body: JSON.stringify({
        ...form,
        amount: Number(form.amount),
        reminderBefore: Number(form.reminderBefore),
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (res.ok) {
      toast.success("Subscription added!");
      router.push("/dashboard");
    } else {
      toast.error("Failed to add subscription.");
    }
  };

  return (
    <div className="max-w-4xl mx-auto mt-10 px-6 py-8 bg-white dark:bg-zinc-900 rounded-2xl shadow-md border border-zinc-200 dark:border-zinc-800">
      <h2 className="text-2xl font-bold text-center mb-8 text-zinc-900 dark:text-zinc-100">
        Add Subscription
      </h2>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Name */}
        <div className="space-y-2">
          <Label htmlFor="name" className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
            Name
          </Label>
          <Input
            id="name"
            name="name"
            type="text"
            value={form.name}
            onChange={handleChange}
            required
            className="rounded-lg border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 focus:ring-2 focus:ring-primary/50 transition"
          />
        </div>

        {/* Plan */}
        <div className="space-y-2">
          <Label htmlFor="plan" className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
            Plan
          </Label>
          <Input
            id="plan"
            name="plan"
            type="text"
            value={form.plan}
            onChange={handleChange}
            className="rounded-lg border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 focus:ring-2 focus:ring-primary/50 transition"
          />
        </div>

        {/* Amount */}
        <div className="space-y-2">
          <Label htmlFor="amount" className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
            Amount (₹)
          </Label>
          <Input
            id="amount"
            name="amount"
            type="number"
            value={form.amount}
            onChange={handleChange}
            required
            className="rounded-lg border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 focus:ring-2 focus:ring-primary/50 transition"
          />
        </div>

        {/* Billing Cycle */}
        <div className="space-y-2">
          <Label htmlFor="billingCycle" className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
            Billing Cycle
          </Label>
          <select
            id="billingCycle"
            name="billingCycle"
            value={form.billingCycle}
            onChange={handleChange}
            className="w-full px-3 py-2 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 focus:ring-2 focus:ring-primary/50 transition"
          >
            <option value="Monthly">Monthly</option>
            <option value="Yearly">Yearly</option>
            <option value="Weekly">Weekly</option>
          </select>
        </div>

        {/* Next Billing Date */}
        <div className="space-y-2">
          <Label htmlFor="nextBillingDate" className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
            Next Billing Date
          </Label>
          <Input
            id="nextBillingDate"
            name="nextBillingDate"
            type="date"
            value={form.nextBillingDate}
            onChange={handleChange}
            required
            className="rounded-lg border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 focus:ring-2 focus:ring-primary/50 transition"
          />
        </div>

        {/* Reminder Before */}
        <div className="space-y-2">
          <Label htmlFor="reminderBefore" className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
            Reminder Before (days)
          </Label>
          <Input
            id="reminderBefore"
            name="reminderBefore"
            type="number"
            value={form.reminderBefore}
            onChange={handleChange}
            className="rounded-lg border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 focus:ring-2 focus:ring-primary/50 transition"
          />
        </div>

        {/* Submit Button (full width across both columns) */}
        <div className="md:col-span-2">
          <Button
            type="submit"
            className="w-full bg-primary text-white hover:bg-primary/90 transition rounded-lg py-2 font-medium"
          >
            Add Subscription
          </Button>
        </div>
      </form>
    </div>
  );
}
