import { motion } from "framer-motion"
import { HiCheckCircle } from "react-icons/hi"

type AlertProps = {
  message: string
}

export default function Alert({ message }: AlertProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="fixed top-6 left-1/2 -translate-x-1/2 z-50
                 flex items-center gap-3
                 bg-gradient-to-r from-emerald-600 via-emerald-500 to-emerald-600
                 text-white px-6 py-3 rounded-full shadow-2xl
                 border border-emerald-400 backdrop-blur-md
                 text-lg font-medium"
    >
      <HiCheckCircle className="w-6 h-6 text-white" />
      <span>{message}</span>
    </motion.div>
  )
}
