import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ChevronUp } from "lucide-react";

function BackToTop() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShow(window.scrollY > 250);
    };

    window.addEventListener("scroll", handleScroll);

    return () =>
      window.removeEventListener(
        "scroll",
        handleScroll
      );
  }, []);

  if (!show) return null;

  return (
    <motion.button
      initial={{
        opacity: 0,
        scale: 0,
      }}
      animate={{
        opacity: 1,
        scale: 1,
      }}
      whileHover={{
        scale: 1.1,
      }}
      whileTap={{
        scale: 0.9,
      }}
      onClick={() =>
        window.scrollTo({
          top: 0,
          behavior: "smooth",
        })
      }
      className="
        fixed
        bottom-28
        right-8
        z-50
        flex
        h-14
        w-14
        items-center
        justify-center
        rounded-full
        bg-slate-800
        text-white
        shadow-xl
      "
    >
      <ChevronUp />
    </motion.button>
  );
}

export default BackToTop;