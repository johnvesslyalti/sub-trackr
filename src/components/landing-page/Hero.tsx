"use client";

import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Image from "next/image";
import { FaGoogle, FaGithub, FaLinkedin, FaXTwitter } from "react-icons/fa6";
import { Button } from "../ui/button";
import { authClient } from "@/lib/auth-client";

export default function Hero() {
  const router = useRouter();

  // better-auth session hook
  const { data, isPending } = authClient.useSession();

  const user = data?.user;
  const isAuthenticated = Boolean(user);

  // redirect logged-in users
  useEffect(() => {
    if (isAuthenticated) {
      router.replace("/dashboard");
    }
  }, [isAuthenticated, router]);

  // show nothing until session state resolves
  if (isPending) return null;

  return (
    <section className="min-h-screen flex items-center justify-center px-6 py-24 bg-background">
      <div className="max-w-7xl w-full flex flex-col md:flex-row items-center justify-between gap-y-16 md:gap-x-20">

        {/* Left Section */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center md:text-left w-full md:max-w-md px-2"
        >
          {/* Logo + Name */}
          <div className="flex items-center justify-center md:justify-start gap-3 mb-4">
            <Image
              src="/subtrackr-icon.png"
              alt="Sub Trackr logo"
              width={48}
              height={48}
              className="rounded-sm"
              priority
            />

            <h1 className="text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
              Sub Trackr
            </h1>
          </div>

          {/* Description */}
          <p className="text-lg md:text-xl text-muted-foreground mb-8 leading-relaxed">
            Stay on top of your subscriptions. Track spending, get reminders,
            and never miss a renewal again.
          </p>

          {/* Google Login Button */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, duration: 0.4 }}
            className="flex justify-center md:justify-start"
          >
            <Button
              onClick={() =>
                authClient.signIn.social({
                  provider: "google",
                  callbackURL: "/dashboard",
                })
              }
              className="font-semibold px-6 py-3 rounded-full shadow-lg flex items-center gap-3"
            >
              <FaGoogle />
              <span>Login with Google</span>
            </Button>
          </motion.div>
        </motion.div>

        {/* Right Section */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="flex flex-col items-center w-full md:max-w-xl px-2"
        >
          {/* GIF Preview */}
          <div className="w-full aspect-video rounded-xl overflow-hidden bg-black shadow-md mb-8 p-5 flex items-center justify-center">
            <Image
              src="/1.jpeg"
              alt="Sub Trackr Preview"
              width={1280}
              height={720}
              className="w-full h-full object-contain"
              priority
            />
          </div>

          {/* Social Links */}
          <div className="flex gap-6 text-2xl">
            <a
              href="https://github.com/johnvesslyalti"
              target="_blank"
              className="hover:text-gray-400 transition"
            >
              <FaGithub />
            </a>

            <a
              href="https://linkedin.com/in/johnvesslyalti"
              target="_blank"
              className="hover:text-blue-400 transition"
            >
              <FaLinkedin />
            </a>

            <a
              href="https://x.com/johnveslyalti"
              target="_blank"
              className="hover:text-gray-400 transition"
            >
              <FaXTwitter />
            </a>
          </div>
        </motion.div>

      </div>
    </section>
  );
}
