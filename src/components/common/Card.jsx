import { motion } from "framer-motion";

function Card({ children, className = "" }) {
  return (
    <motion.div
      whileHover={{
        y: -6,
        scale: 1.01,
      }}
      transition={{
        duration: 0.25,
      }}
      className={`
        rounded-3xl
        p-6
        border

        bg-white
        dark:bg-slate-900

        border-slate-200
        dark:border-slate-800

        shadow-lg
        dark:shadow-xl

        dark:shadow-cyan-500/5

        backdrop-blur-xl

        transition-all
        duration-300

        ${className}
      `}
    >
      {children}
    </motion.div>
  );
}

export default Card;