import {
  motion,
  useReducedMotion,
} from "framer-motion";

function PageTransition({
  children,
  className = "",
}) {
  const shouldReduceMotion = useReducedMotion();

  const animation = shouldReduceMotion
    ? {
        initial: false,
        animate: {
          opacity: 1,
        },
        exit: {
          opacity: 1,
        },
      }
    : {
        initial: {
          opacity: 0,
          y: 16,
          scale: 0.995,
        },

        animate: {
          opacity: 1,
          y: 0,
          scale: 1,
        },

        exit: {
          opacity: 0,
          y: -8,
          scale: 0.995,
        },
      };

  return (
    <motion.div
      className={`page-shell ${className}`}
      initial={animation.initial}
      animate={animation.animate}
      exit={animation.exit}
      transition={{
        duration: 0.38,
        ease: [0.22, 1, 0.36, 1],
      }}
    >
      {children}
    </motion.div>
  );
}

export default PageTransition;