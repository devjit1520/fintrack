import { motion } from "framer-motion";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "../../context/ThemeContext";

function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={() => {
  // console.log("Before:", theme);
  toggleTheme();

  setTimeout(() => {
    // console.log(
    //   "HTML class:",
    //   document.documentElement.className
    // );
  }, 50);
}}
      className="relative flex h-11 w-20 items-center rounded-full border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 p-1 transition-all duration-300"
    >
      <motion.div
        animate={{
          x: theme === "dark" ? 36 : 0,
        }}
        transition={{
          type: "spring",
          stiffness: 400,
          damping: 30,
        }}
        className={`absolute flex h-9 w-9 items-center justify-center rounded-full shadow-lg ${
          theme === "dark"
            ? "bg-cyan-500"
            : "bg-yellow-400"
        }`}
      >
        {theme === "dark" ? (
          <Moon size={18} className="text-white" />
        ) : (
          <Sun size={18} className="text-slate-900" />
        )}
      </motion.div>

      <div className="flex w-full justify-between px-2">
        <Sun size={16} className="text-yellow-500" />
        <Moon size={16} className="text-cyan-400" />
      </div>
    </button>
  );
}

export default ThemeToggle;