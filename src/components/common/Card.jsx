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
        border-white/10
        bg-white/5
        backdrop-blur-xl
        shadow-xl
        shadow-cyan-500/5
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