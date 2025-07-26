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
    <div className="max-w-md mx-auto mt-10 p-6 bg-white dark:bg-zinc-900 rounded-xl shadow-md space-y-4">
      <h2 className="text-xl font-semibold text-center">Add Subscription</h2>
      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="flex flex-col space-y-1">
          <Label htmlFor="name">Name</Label>
          <Input id="name" name="name" value={form.name} onChange={handleChange} required />
        </div>
        <div className="flex flex-col space-y-1">
          <Label htmlFor="plan">Plan</Label>
          <Input id="plan" name="plan" value={form.plan} onChange={handleChange} />
        </div>
        <div className="flex flex-col space-y-1">
          <Label htmlFor="amount">Amount (₹)</Label>
          <Input
            id="amount"
            name="amount"
            type="number"
            value={form.amount}
            onChange={handleChange}
            required
          />
        </div>
        <div className="flex flex-col space-y-1">
          <Label htmlFor="billingCycle">Billing Cycle</Label>
          <select
            id="billingCycle"
            name="billingCycle"
            value={form.billingCycle}
            onChange={handleChange}
            className="w-full border rounded-md px-3 py-2 dark:bg-zinc-800"
          >
            <option value="Monthly">Monthly</option>
            <option value="Yearly">Yearly</option>
            <option value="Weekly">Weekly</option>
          </select>
        </div>
        <div className="flex flex-col space-y-1">
          <Label htmlFor="nextBillingDate">Next Billing Date</Label>
          <Input
            id="nextBillingDate"
            name="nextBillingDate"
            type="date"
            value={form.nextBillingDate}
            onChange={handleChange}
            required
          />
        </div>
        <div className="flex flex-col space-y-1">
          <Label htmlFor="reminderBefore">Reminder Before (days)</Label>
          <Input
            id="reminderBefore"
            name="reminderBefore"
            type="number"
            value={form.reminderBefore}
            onChange={handleChange}
          />
        </div>
        <Button type="submit" className="w-full">
          Add Subscription
        </Button>
      </form>
    </div>
  );
}
