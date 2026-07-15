import {
  motion,
  useReducedMotion,
} from "framer-motion";

function SectionReveal({
  children,
  className = "",
  delay = 0,
  direction = "up",
  amount = 0.12,
}) {
  const shouldReduceMotion = useReducedMotion();

  const positions = {
    up: {
      x: 0,
      y: 22,
    },

    down: {
      x: 0,
      y: -22,
    },

    left: {
      x: 22,
      y: 0,
    },

    right: {
      x: -22,
      y: 0,
    },
  };

  const position =
    positions[direction] || positions.up;

  return (
    <motion.div
      className={className}
      initial={
        shouldReduceMotion
          ? false
          : {
              opacity: 0,
              ...position,
            }
      }
      whileInView={{
        opacity: 1,
        x: 0,
        y: 0,
      }}
      viewport={{
        once: true,
        amount,
      }}
      transition={{
        duration: 0.48,
        delay,
        ease: [0.22, 1, 0.36, 1],
      }}
    >
      {children}
    </motion.div>
  );
}

export default SectionReveal;