'use client';

import { motion } from 'framer-motion';
import { LogIn, ListChecks, BellRing } from 'lucide-react';

const steps = [
  {
    icon: <LogIn className="w-8 h-8 text-cyan-400" />,
    title: "Login Securely",
    description: "Sign in with Google in one click. No passwords, no hassle.",
  },
  {
    icon: <ListChecks className="w-8 h-8 text-emerald-400" />,
    title: "Add Subscriptions",
    description: "Manually add or auto-import your active subscriptions.",
  },
  {
    icon: <BellRing className="w-8 h-8 text-yellow-400" />,
    title: "Get Smart Alerts",
    description: "Receive reminders and view insights on your upcoming bills.",
  },
];

export default function HowItWorks() {
  return (
    <section className="py-25 px-6">
      <div className="max-w-5xl mx-auto text-center">
        <motion.h2
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-3xl md:text-4xl font-bold mb-12"
        >
          How It Works
        </motion.h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 * index, duration: 0.5 }}
              className="bg-[#1b1b1b] border border-gray-800 rounded-xl p-6 shadow-md hover:shadow-lg transition"
            >
              <div className="flex items-center justify-center mb-4">
                {step.icon}
              </div>
              <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
              <p className="text-gray-400 text-sm">{step.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
