import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Wallet } from "lucide-react";

function Loader({ onFinish }) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);

          setTimeout(() => {
            onFinish();
          }, 400);

          return 100;
        }

        return prev + 2;
      });
    }, 35);

    return () => clearInterval(timer);
  }, [onFinish]);

  return (
    <AnimatePresence>
      <motion.div
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[9999] flex items-center justify-center bg-slate-950"
      >
        {/* Glow */}
        <div className="absolute h-96 w-96 rounded-full bg-cyan-500/20 blur-[140px]" />

        <div className="relative text-center">

          <motion.div
            animate={{
              rotate: [0, 8, -8, 0],
              scale: [1, 1.08, 1],
            }}
            transition={{
              repeat: Infinity,
              duration: 2,
            }}
            className="mx-auto mb-8 flex h-28 w-28 items-center justify-center rounded-full bg-cyan-500/20"
          >
            <Wallet
              size={58}
              className="text-cyan-400"
            />
          </motion.div>

          <motion.h1
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-5xl font-bold text-white"
          >
            FinTrack
          </motion.h1>

          <p className="mt-3 text-slate-400">
            Personal Finance Manager
          </p>

          <div className="mt-10 h-3 w-80 overflow-hidden rounded-full bg-slate-800">

            <motion.div
              animate={{
                width: `${progress}%`,
              }}
              className="h-full rounded-full bg-gradient-to-r from-cyan-500 via-blue-500 to-indigo-500"
            />

          </div>

          <motion.h2
            className="mt-5 text-xl font-semibold text-cyan-400"
          >
            {progress}%
          </motion.h2>

        </div>
      </motion.div>
    </AnimatePresence>
  );
}

export default Loader;