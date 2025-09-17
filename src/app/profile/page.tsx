// app/profile/page.tsx
"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import Image from "next/image";

const avatarOptions = [
  "/avatar1.png",
  "/avatar2.png",
  "/avatar3.png",
  "/avatar4.png",
  "/avatar5.png",
  "/avatar6.png",
  "/avatar7.png",
  "/avatar8.png"
];

export default function ProfilePage() {
  const { data: session } = useSession();
  const [selectedAvatar, setSelectedAvatar] = useState(
    session?.user?.image ?? "/placeholder-avatar.png"
  );

  const user = {
    name: session?.user?.name ?? "John Doe",
    email: session?.user?.email ?? "john@example.com",
    image: selectedAvatar,
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

            {/* Avatar Picker Modal */}
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline">Change Avatar</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Select an Avatar</DialogTitle>
                </DialogHeader>
                <div className="grid grid-cols-3 gap-4 mt-4">
                  {avatarOptions.map((avatar, idx) => (
                    <button
                      key={idx}
                      className={`rounded-full p-1 border-2 ${
                        selectedAvatar === avatar
                          ? "border-blue-500"
                          : "border-transparent"
                      }`}
                      onClick={() => setSelectedAvatar(avatar)}
                    >
                      <Image
                        src={avatar}
                        alt={`Avatar ${idx + 1}`}
                        className="w-16 h-16 rounded-full"
                        width={64}
                        height={64}
                      />
                    </button>
                  ))}
                </div>
              </DialogContent>
            </Dialog>
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
              <Button>Save Changes</Button>
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
            <Button variant="outline" disabled>
              Enabled
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
