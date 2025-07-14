'use client';

import { motion } from 'framer-motion';
import { Zap, Bell, PieChart, Mail } from 'lucide-react';

const features = [
  {
    icon: <Zap className="w-6 h-6 text-emerald-400" />,
    title: "Smart Tracking",
    description: "Automatically track your subscriptions and spending patterns in one place.",
  },
  {
    icon: <Bell className="w-6 h-6 text-yellow-400" />,
    title: "Timely Reminders",
    description: "Get notified before renewal dates so you never miss or overpay again.",
  },
  {
    icon: <PieChart className="w-6 h-6 text-cyan-400" />,
    title: "Visual Insights",
    description: "View your monthly and yearly expenses using beautiful charts.",
  },
  {
    icon: <Mail className="w-6 h-6 text-pink-400" />,
    title: "Import from Email",
    description: "Connect Gmail and auto-import subscriptions from your inbox.",
  },
];

export default function Features() {
  return (
    <section className="py-20 px-6">
      <div className="max-w-6xl mx-auto text-center">
        <motion.h2
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-3xl md:text-4xl font-bold mb-12"
        >
          Why Choose SubTrackr?
        </motion.h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 * index, duration: 0.5 }}
              className="bg-[#1b1b1b] p-6 rounded-xl shadow-lg hover:shadow-xl transition border border-gray-800"
            >
              <div className="flex items-center justify-center mb-4">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-gray-400 text-sm">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}