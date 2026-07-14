import { Moon, Sun } from "lucide-react";
import { useTheme } from "../../context/ThemeContext";

function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="
        flex
        h-10
        w-10
        items-center
        justify-center
        rounded-xl
        border
        border-slate-200
        dark:border-slate-700
        bg-white
        dark:bg-slate-900
        transition-all
        hover:scale-105
        hover:border-cyan-500
      "
    >
      {theme === "dark" ? (
        <Sun size={20} className="text-yellow-500" />
      ) : (
        <Moon size={20} className="text-slate-700" />
      )}
    </button>
  );
}

export default ThemeToggle;