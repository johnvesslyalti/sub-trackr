"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";

const faqs = [
  {
    question: "Is SubTrackr free to use?",
    answer:
      "Yes! SubTrackr is completely free to start. In the future, we may introduce premium features like email integration and advanced analytics.",
  },
  {
    question: "Do you store my financial data securely?",
    answer:
      "Absolutely. All your data is stored securely in an encrypted database. We prioritize your privacy and never share your data with third parties.",
  },
  {
    question: "Can I import subscriptions from Gmail?",
    answer:
      "Gmail import is coming soon! You'll be able to auto-import subscriptions from receipts and confirmation emails.",
  },
  {
    question: "Will I get reminders before a subscription renews?",
    answer:
      "Yes. SubTrackr sends smart alerts before renewals, so you're always in control of your finances.",
  },
];

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="py-20 px-6">
      <div className="max-w-4xl mx-auto">
        <motion.h2
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-3xl md:text-4xl font-bold mb-12 text-center"
        >
          Frequently Asked Questions
        </motion.h2>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="bg-white/10 border border-gray-800 rounded-xl"
            >
              <button
                onClick={() => toggle(index)}
                className="w-full flex items-center justify-between px-6 py-4 focus:outline-none"
              >
                <span className="text-left font-medium">{faq.question}</span>
                <motion.span
                  animate={{ rotate: openIndex === index ? 180 : 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <ChevronDown className="w-5 h-5" />
                </motion.span>
              </button>
              <AnimatePresence>
                {openIndex === index && (
                  <motion.div
                    initial={{ opacity: 0, maxHeight: 0 }}
                    animate={{ opacity: 1, maxHeight: 500 }}
                    exit={{ opacity: 0, maxHeight: 0 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    className="px-6 pb-4 text-sm text-gray-400 overflow-hidden"
                  >
                    {faq.answer}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
