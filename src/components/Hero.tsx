'use client';

import { motion } from 'framer-motion';

export default function Hero() {
  return (
    <section className="min-h-screen flex flex-col items-center justify-center px-6 text-center">
      {/* Logo / App Name */}
      <motion.h1
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-5xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent"
      >
        SubTrackr
      </motion.h1>

      {/* Subtext */}
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.6 }}
        className="text-lg md:text-xl text-gray-300 max-w-xl mb-8"
      >
        Stay on top of your subscriptions. Track spending, get reminders, and never miss a renewal again.
      </motion.p>

      {/* CTA Button */}
      <motion.button
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.4, duration: 0.5 }}
        className="bg-white text-black font-semibold px-6 py-3 rounded-full shadow-lg hover:bg-gray-200 transition"
      >
        Login with Google
      </motion.button>

      {/* Dashboard Preview Placeholder
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.7 }}
        className="mt-12 w-full max-w-4xl aspect-video bg-gray-900 border border-gray-700 rounded-2xl flex items-center justify-center text-gray-500"
      >
        Dashboard Preview Coming Soon
      </motion.div> */}
    </section>
  );
}