// app/profile/page.tsx
"use client";

import { useSession } from "next-auth/react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function ProfilePage() {
  const { data: session } = useSession();

  const user = {
    name: session?.user?.name ?? "John Doe",
    email: session?.user?.email ?? "john@example.com",
    image: session?.user?.image ?? "/placeholder-avatar.png",
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-10 space-y-8">
      <h1 className="text-3xl font-bold">Profile Settings</h1>

      <Card>
        <CardHeader>
          <CardTitle>Basic Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center gap-4">
            <Avatar className="w-16 h-16">
              <AvatarImage src={user.image} alt={user.name} />
              <AvatarFallback>{user.name[0]}</AvatarFallback>
            </Avatar>
            <Button variant="outline">Change Avatar</Button>
          </div>

          <div className="space-y-4">
            <div>
              <Label htmlFor="name">Name</Label>
              <Input id="name" type="text" defaultValue={user.name} disabled />
            </div>

            <div>
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" defaultValue={user.email} disabled />
            </div>

            <div className="flex justify-end">
              <Button disabled>Save Changes</Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Notifications</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <span>Email Reminders</span>
            <Button variant="outline" disabled>Enabled</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
