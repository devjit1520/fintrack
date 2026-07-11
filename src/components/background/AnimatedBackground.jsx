import { motion } from "framer-motion";

function AnimatedBackground() {
  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-slate-950">

      {/* Grid */}
      <div
        className="absolute inset-0 opacity-[0.05]"
        style={{
          backgroundImage:
            "linear-gradient(#ffffff22 1px, transparent 1px), linear-gradient(90deg,#ffffff22 1px,transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      {/* Blob 1 */}
      <motion.div
        animate={{
          x: [0, 250, 0],
          y: [0, -120, 0],
          scale: [1, 1.3, 1],
        }}
        transition={{
          duration: 18,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute left-10 top-20 h-80 w-80 rounded-full bg-cyan-500/20 blur-[120px]"
      />

      {/* Blob 2 */}
      <motion.div
        animate={{
          x: [0, -250, 0],
          y: [0, 160, 0],
          scale: [1.2, 1, 1.2],
        }}
        transition={{
          duration: 22,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute right-10 top-32 h-[420px] w-[420px] rounded-full bg-blue-600/20 blur-[150px]"
      />

      {/* Blob 3 */}
      <motion.div
        animate={{
          x: [0, 100, 0],
          y: [0, 180, 0],
          scale: [1, 1.4, 1],
        }}
        transition={{
          duration: 26,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute bottom-10 left-1/3 h-[340px] w-[340px] rounded-full bg-indigo-500/20 blur-[130px]"
      />

      {/* Aurora */}
      <motion.div
        animate={{
          opacity: [0.25, 0.45, 0.25],
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
        }}
        className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 via-transparent to-blue-500/5"
      />
    </div>
  );
}

export default AnimatedBackground;