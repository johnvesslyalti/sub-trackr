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

    const res = await fetch("/api/subscription", {
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
      router.push("/subscription"); // Redirect to subscription list
    } else {
      toast.error("Failed to add subscription.");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white dark:bg-zinc-900 rounded-xl shadow-md space-y-4">
      <h2 className="text-xl font-semibold text-center">Add Subscription</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label>Name</Label>
          <Input name="name" value={form.name} onChange={handleChange} required />
        </div>
        <div>
          <Label>Plan</Label>
          <Input name="plan" value={form.plan} onChange={handleChange} />
        </div>
        <div>
          <Label>Amount (₹)</Label>
          <Input
            name="amount"
            type="number"
            value={form.amount}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <Label>Billing Cycle</Label>
          <select
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
        <div>
          <Label>Next Billing Date</Label>
          <Input
            name="nextBillingDate"
            type="date"
            value={form.nextBillingDate}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <Label>Reminder Before (days)</Label>
          <Input
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
