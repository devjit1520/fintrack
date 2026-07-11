import { motion } from "framer-motion";
import { Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";

function FloatingActionButton() {
  const navigate = useNavigate();

  return (
    <motion.button
      whileHover={{
        scale: 1.1,
        rotate: 90,
      }}
      whileTap={{
        scale: 0.9,
      }}
      onClick={() => navigate("/transactions")}
      className="
        fixed
        bottom-8
        right-8
        z-50
        flex
        h-16
        w-16
        items-center
        justify-center
        rounded-full
        bg-gradient-to-r
        from-cyan-500
        to-blue-600
        text-white
        shadow-2xl
        shadow-cyan-500/40
      "
    >
      <Plus size={30} />
    </motion.button>
  );
}

export default FloatingActionButton;