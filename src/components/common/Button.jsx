import { motion, useReducedMotion } from "framer-motion";
import { LoaderCircle } from "lucide-react";
import clsx from "clsx";

const variants = {
  primary:
    "bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-500/20 hover:from-cyan-400 hover:to-blue-500",

  success:
    "bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-lg shadow-emerald-500/20 hover:from-emerald-400 hover:to-teal-400",

  danger:
    "bg-gradient-to-r from-rose-500 to-red-600 text-white shadow-lg shadow-rose-500/20 hover:from-rose-400 hover:to-red-500",

  secondary:
    "border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800",

  ghost:
    "bg-transparent text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800/80",
};

const sizes = {
  sm: "min-h-9 rounded-lg px-3 text-sm",
  md: "min-h-11 rounded-xl px-4 text-sm",
  lg: "min-h-12 rounded-xl px-5 text-base",
};

function Button({
  children,
  type = "button",
  variant = "primary",
  size = "md",
  loading = false,
  disabled = false,
  fullWidth = false,
  leftIcon: LeftIcon,
  rightIcon: RightIcon,
  className = "",
  onClick,
  ...props
}) {
  const shouldReduceMotion = useReducedMotion();
  const isDisabled = disabled || loading;

  return (
    <motion.button
      type={type}
      disabled={isDisabled}
      onClick={onClick}
      whileHover={
        shouldReduceMotion || isDisabled
          ? undefined
          : {
              y: -2,
              scale: 1.01,
            }
      }
      whileTap={
        shouldReduceMotion || isDisabled
          ? undefined
          : {
              y: 0,
              scale: 0.98,
            }
      }
      transition={{
        duration: 0.18,
        ease: "easeOut",
      }}
      className={clsx(
        "inline-flex items-center justify-center gap-2 font-semibold",
        "transition-colors duration-200",
        "focus-visible:outline-none focus-visible:ring-2",
        "focus-visible:ring-cyan-500/70 focus-visible:ring-offset-2",
        "dark:focus-visible:ring-offset-slate-950",
        "disabled:pointer-events-none disabled:cursor-not-allowed",
        "disabled:opacity-60",
        variants[variant] || variants.primary,
        sizes[size] || sizes.md,
        fullWidth && "w-full",
        className
      )}
      {...props}
    >
      {loading ? (
        <LoaderCircle
          size={18}
          className="animate-spin"
        />
      ) : (
        LeftIcon && <LeftIcon size={18} />
      )}

      <span>{loading ? "Please wait..." : children}</span>

      {!loading && RightIcon && (
        <RightIcon size={18} />
      )}
    </motion.button>
  );
}

export default Button;