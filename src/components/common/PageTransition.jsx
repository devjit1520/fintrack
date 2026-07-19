import {
  motion,
} from "framer-motion";

function PageTransition({
  children,
}) {
  return (
    <motion.div
      initial={{
        opacity: 0,
        y: 7,
      }}
      animate={{
        opacity: 1,
        y: 0,
      }}
      exit={{
        opacity: 0,
        y: -4,
      }}
      transition={{
        duration: 0.16,
        ease: "easeOut",
      }}
      className="min-w-0"
    >
      {children}
    </motion.div>
  );
}

export default PageTransition;