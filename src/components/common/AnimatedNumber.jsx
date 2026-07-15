import {
  useEffect,
  useRef,
  useState,
} from "react";
import {
  motion,
  useInView,
  useReducedMotion,
} from "framer-motion";

function AnimatedNumber({
  value = 0,
  prefix = "",
  suffix = "",
  decimals = 0,
  duration = 900,
  locale = "en-IN",
  className = "",
}) {
  const elementRef = useRef(null);

  const isVisible = useInView(elementRef, {
    once: true,
    amount: 0.4,
  });

  const shouldReduceMotion = useReducedMotion();

  const numericValue = Number(value) || 0;

  const [displayValue, setDisplayValue] =
    useState(shouldReduceMotion ? numericValue : 0);

  useEffect(() => {
    if (!isVisible) return undefined;

    if (shouldReduceMotion) {
      setDisplayValue(numericValue);
      return undefined;
    }

    let animationFrame;
    let startTime;

    const animateValue = (time) => {
      if (!startTime) {
        startTime = time;
      }

      const elapsed = time - startTime;

      const progress = Math.min(
        elapsed / duration,
        1
      );

      const easedProgress =
        1 - Math.pow(1 - progress, 3);

      setDisplayValue(
        numericValue * easedProgress
      );

      if (progress < 1) {
        animationFrame =
          requestAnimationFrame(animateValue);
      }
    };

    animationFrame =
      requestAnimationFrame(animateValue);

    return () => {
      cancelAnimationFrame(animationFrame);
    };
  }, [
    numericValue,
    duration,
    isVisible,
    shouldReduceMotion,
  ]);

  const formattedValue =
    new Intl.NumberFormat(locale, {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    }).format(displayValue);

  return (
    <motion.span
      ref={elementRef}
      className={className}
      initial={
        shouldReduceMotion
          ? false
          : {
              opacity: 0,
            }
      }
      animate={
        isVisible
          ? {
              opacity: 1,
            }
          : undefined
      }
    >
      {prefix}
      {formattedValue}
      {suffix}
    </motion.span>
  );
}

export default AnimatedNumber;