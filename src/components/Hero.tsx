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
    <section className="min-h-screen flex flex-col items-center justify-center text-center p-5">
      {/* Logo / App Name */}
      <motion.h1
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-5xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent"
      >
        <div className="flex items-center gap-2 text-4xl font-bold">
          <Image src="/subtrackr-icon.png" alt="Sub Trackr Icon" width={40} height={40} className="rounded-sm" />
          <span>Sub Trackr</span>
        </div>
      </motion.h1>

      {/* Subtext */}
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.6 }}
        className="text-lg md:text-xl max-w-xl mb-8"
      >
        Stay on top of your subscriptions. Track spending, get reminders, and never miss a renewal again.
      </motion.p>

      {/* CTA Button */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.4, duration: 0.5 }}
      >
        <button
          onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
          className="bg-white text-black font-semibold px-6 py-3 rounded-full shadow-lg hover:bg-gray-200 transition"
        >
          <div className="flex items-center justify-center gap-2">
            <FaGoogle />
            <span>Login with Google</span>
          </div>
        </button>
      </motion.div>

      {/* Video + Social Icons */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.7 }}
        className="mt-12 flex flex-col md:flex-row items-center justify-center gap-8"
      >
        {/* Video Player */}
        <div className="w-full md:w-[640px] aspect-video bg-gray-900 border border-gray-700 rounded-2xl overflow-hidden">
          <video
            controls
            className="w-full h-full object-cover"
            poster="/preview-thumb.png"
          >
            <source src="/demo-video.mp4" type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>

        {/* Social Icons */}
        <div className="flex md:flex-col gap-6 text-white text-2xl">
          <a href="https://github.com/yourusername" target="_blank" className="hover:text-gray-400">
            <FaGithub />
          </a>
          <a href="https://linkedin.com/in/yourprofile" target="_blank" className="hover:text-blue-400">
            <FaLinkedin />
          </a>
          <a href="https://x.com/yourhandle" target="_blank" className="hover:text-gray-400">
            <FaXTwitter />
          </a>
        </div>
      </motion.div>
    </section>
  );
}
