import {
  motion,
  useReducedMotion,
} from "framer-motion";

function PremiumCard({
  children,
  className = "",
  hover = true,
  delay = 0,
  as = "section",
}) {
  const shouldReduceMotion = useReducedMotion();

  const MotionElement = motion[as] || motion.section;

  return (
    <MotionElement
      className={[
        "premium-card",
        hover ? "premium-card-interactive" : "",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      initial={
        shouldReduceMotion
          ? false
          : {
              opacity: 0,
              y: 18,
            }
      }
      whileInView={{
        opacity: 1,
        y: 0,
      }}
      whileHover={
        hover && !shouldReduceMotion
          ? {
              y: -4,
              scale: 1.004,
            }
          : undefined
      }
      viewport={{
        once: true,
        amount: 0.15,
      }}
      transition={{
        opacity: {
          duration: 0.4,
          delay,
        },

        y: {
          duration: 0.4,
          delay,
          ease: [0.22, 1, 0.36, 1],
        },

        scale: {
          duration: 0.25,
          ease: "easeOut",
        },
      }}
    >
      {children}
    </MotionElement>
  );
}

export default PremiumCard;