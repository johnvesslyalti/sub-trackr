"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { Button } from "../ui/button";

export default function CTASection() {
  return (
    <section className="py-24 px-6 md:px-10 bg-background">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 items-center gap-12">
        {/* Left: CTA Text */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">
            Your subscriptions deserve attention.
          </h2>
          <p className="text-muted-foreground mb-6 text-base md:text-lg leading-relaxed">
            Take control of your recurring expenses with reminders, analytics,
            and clean organization.
          </p>
          <Button
            className="font-semibold px-6 py-3 rounded-full shadow-lg flex items-center justify-center gap-3 transition focus-visible:outline-none"
          >
            <span>Get started for free</span>
          </Button>
        </motion.div>

        {/* Right: Illustration */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true, amount: 0.5 }}
          className="w-full h-64 md:h-[360px] rounded-2xl overflow-hidden border border-gray-700 shadow-md p-5"
        >
          <Image
            src="/2.png"
            alt="Dashboard Preview"
            width={700}
            height={400}
            className="w-full h-full object-contain"
          />
        </motion.div>
      </div>
    </section>
  );
}
