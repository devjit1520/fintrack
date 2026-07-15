import {
  motion,
  useReducedMotion,
} from "framer-motion";

function PremiumGrid({
  children,
  className = "",
  size = "default",
}) {
  const shouldReduceMotion = useReducedMotion();

  const gridClasses = {
    small: "premium-grid-small",
    default: "premium-grid",
    large: "premium-grid-large",
  };

  return (
    <motion.div
      className={`${gridClasses[size] || gridClasses.default} ${className}`}
      initial={
        shouldReduceMotion
          ? false
          : {
              opacity: 0,
            }
      }
      animate={{
        opacity: 1,
      }}
      transition={{
        duration: 0.35,
      }}
    >
      {children}
    </motion.div>
  );
}

export default PremiumGrid;