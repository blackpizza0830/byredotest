"use client";

import { motion } from "framer-motion";

interface ToastProps {
  message: string;
}

export function Toast({ message }: ToastProps): React.JSX.Element {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 bg-byredo-black text-byredo-white px-6 py-3 text-xs tracking-widest uppercase"
    >
      {message}
    </motion.div>
  );
}
