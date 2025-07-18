"use client";

import { motion } from "framer-motion";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Image from "next/image";
import {
  FaGoogle,
  FaGithub,
  FaLinkedin,
  FaXTwitter
} from "react-icons/fa6";

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
    <section className="min-h-screen flex flex-col items-center justify-center text-center px-6 py-20 bg-background">
      {/* Logo & Heading */}
      <motion.div
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="mb-5"
      >
        <div className="flex items-center justify-center gap-3 mb-4">
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
        <p className="text-lg md:text-xl max-w-2xl mx-auto text-muted-foreground">
          Stay on top of your subscriptions. Track spending, get reminders, and never miss a renewal again.
        </p>
      </motion.div>

      {/* CTA Button */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.3, duration: 0.4 }}
        className="mt-6"
      >
        <button
          onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
          className="bg-white text-black font-semibold px-6 py-3 rounded-full shadow-lg flex items-center justify-center gap-3 hover:bg-gray-100 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400"
        >
          <FaGoogle />
          <span>Login with Google</span>
        </button>
      </motion.div>

      {/* Video + Social Section */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.6 }}
        className="mt-16 flex flex-col md:flex-row items-center gap-10 w-full max-w-6xl"
      >
        {/* Video */}
        <div className="w-full md:w-[640px] aspect-video border border-gray-700 rounded-xl overflow-hidden bg-black">
          <video
            controls
            className="w-full h-full object-cover"
            poster="/preview-thumb.png"
            aria-label="Demo video of Sub Trackr"
          >
            <source src="/demo-video.mp4" type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>

        {/* Social Icons */}
        <div className="flex md:flex-col gap-6 text-2xl text-white">
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
    </section>
  );
}
