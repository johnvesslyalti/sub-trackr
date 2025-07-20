"use client";

import { useRouter } from "next/navigation"; // ✅ Needed for useRouter
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export default function AddSubscriptionButton() {
  const router = useRouter();

  const handleClick = () => {
    router.push("/subscription/add");
  };

  return (
    <Button className="gap-2" onClick={handleClick}>
      <Plus size={18} />
      Add Subscription
    </Button>
  );
}
