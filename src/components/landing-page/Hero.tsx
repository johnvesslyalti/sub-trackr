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
  const { data, isPending } = authClient.useSession();

  const user = data?.user;
  const isAuthenticated = Boolean(user);

  // Redirect logged-in users without blocking UI render
  useEffect(() => {
    if (isAuthenticated) {
      router.replace("/dashboard");
    }
  }, [isAuthenticated, router]);

  return (
    <section className="min-h-screen flex items-center justify-center px-6 py-24 bg-background">
      <div className="max-w-7xl w-full flex flex-col md:flex-row items-center justify-between gap-y-16 md:gap-x-20">

        {/* LEFT SECTION */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.45 }}
          className="text-center md:text-left w-full md:max-w-md px-2"
        >
          {/* Logo + Name */}
          <div className="flex items-center justify-center md:justify-start gap-3 mb-4">
            <Image
              src="/subtrackr-logo.svg"
              alt="Sub Trackr logo"
              width={48}
              height={48}
              className="rounded-sm"
              priority
              loading="eager"
            />

            <h1
              className="
                text-4xl md:text-5xl 
                font-extrabold 
                bg-gradient-to-r 
                from-purple-500 
                to-violet-500 
                bg-clip-text 
                text-transparent
              "
            >
              Sub Trackr
            </h1>

          </div>

          {/* Description */}
          <p className="text-lg md:text-xl text-muted-foreground mb-8 leading-relaxed">
            Stay on top of your subscriptions. Track spending, get reminders,
            and never miss a renewal again.
          </p>

          {/* Google Login Button / Skeleton */}
          <motion.div
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35 }}
            className="flex justify-center md:justify-start"
          >
            {isPending ? (
              // Skeleton while session loads
              <div className="h-12 w-52 bg-neutral-300 dark:bg-neutral-800 rounded-full animate-pulse" />
            ) : (
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
            )}
          </motion.div>
        </motion.div>

        {/* RIGHT SECTION */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.45, delay: 0.1 }}
          className="flex flex-col items-center w-full md:max-w-xl px-2"
        >
          {/* Image Preview */}
          <div className="w-full aspect-video rounded-xl overflow-hidden bg-black shadow-md mb-8 p-5 flex items-center justify-center">
            <Image
              src="/1.jpeg"
              alt="Sub Trackr Preview"
              width={1280}
              height={720}
              loading="eager"
              priority
              className="w-full h-full object-contain"
            />
          </div>

          {/* Social Links */}
          <div className="flex gap-6 text-2xl">
            <a href="https://github.com/johnvesslyalti" target="_blank" className="hover:text-gray-400 transition">
              <FaGithub />
            </a>
            <a href="https://linkedin.com/in/johnvesslyalti" target="_blank" className="hover:text-blue-400 transition">
              <FaLinkedin />
            </a>
            <a href="https://x.com/johnvesslyalti" target="_blank" className="hover:text-gray-400 transition">
              <FaXTwitter />
            </a>
          </div>
        </motion.div>

      </div>
    </section>
  );
}
