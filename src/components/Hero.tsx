"use client";

import { motion } from "framer-motion";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Image from "next/image";
import { FaGoogle, FaGithub, FaLinkedin, FaXTwitter } from "react-icons/fa6";

export default function Hero() {
  const { status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "authenticated") {
      router.replace("/dashboard");
    }
  }, [status, router]);

  if (status === "loading") return null;

  return (
    <section className="min-h-screen flex items-center justify-center px-6 py-24 bg-background">
      <div className="max-w-7xl w-full flex flex-col md:flex-row items-center justify-between gap-y-16 md:gap-x-20">
        {/* Left Side */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center md:text-left w-full md:max-w-md px-2"
        >
          <div className="flex items-center justify-center md:justify-start gap-3 mb-4">
            <Image
              src="/subtrackr-icon.png"
              alt="Sub Trackr logo"
              width={48}
              height={48}
              className="rounded-sm"
            />
            <h1 className="text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
              Sub Trackr
            </h1>
          </div>

          <p className="text-lg md:text-xl text-muted-foreground mb-8 leading-relaxed">
            Stay on top of your subscriptions. Track spending, get reminders,
            and never miss a renewal again.
          </p>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, duration: 0.4 }}
          >
            <button
              onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
              className="bg-white text-black font-semibold px-6 py-3 rounded-full shadow-lg flex items-center justify-center gap-3 hover:bg-gray-100 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400"
            >
              <FaGoogle />
              <span>Login with Google</span>
            </button>
          </motion.div>
        </motion.div>

        {/* Right Side */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="flex flex-col items-center w-full md:max-w-xl px-2"
        >
          {/* Video */}
          <div className="w-full aspect-video rounded-xl overflow-hidden bg-black shadow-md mb-8">
            <video
              autoPlay
              muted
              loop
              playsInline
              className="w-full h-full object-contain"
              poster="/preview-thumb.png"
            >
              <source src="/subtrackr.mp4" type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </div>

          {/* Social Links */}
          <div className="flex gap-6 text-2xl">
            <a
              href="https://github.com/yourusername"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub"
              className="hover:text-gray-400 transition"
            >
              <FaGithub />
            </a>
            <a
              href="https://linkedin.com/in/yourprofile"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn"
              className="hover:text-blue-400 transition"
            >
              <FaLinkedin />
            </a>
            <a
              href="https://x.com/yourhandle"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Twitter"
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
