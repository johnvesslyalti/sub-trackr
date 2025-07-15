'use client';

import { motion } from 'framer-motion';

export default function CTASection() {
  return (
    <section className="py-30 px-10">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 items-center gap-12">
        
        {/* Left: CTA Text */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Your subscriptions deserve attention.
          </h2>
          <p className="text-gray-400 mb-6">
            Take control of your recurring expenses with reminders, analytics, and clean organization.
          </p>
          <button className="bg-white/10 px-6 py-3 rounded-full font-semibold hover:bg-emerald-400 transition">
            Get Started for Free
          </button>
        </motion.div>

        {/* Right: Illustration or Preview Placeholder */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true, amount: 0.5 }}
          className="w-full h-64 bg-gradient-to-tr from-gray-800 via-[#1b1b1b] to-black rounded-2xl border border-gray-700 flex items-center justify-center text-gray-500"
        >
          Dashboard Preview Coming Soon
        </motion.div>
      </div>
    </section>
  );
}