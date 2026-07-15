import { useEffect } from "react";
import {
  AnimatePresence,
  motion,
  useReducedMotion,
} from "framer-motion";
import { X } from "lucide-react";

function ModalShell({
  open,
  onClose,
  title,
  description = "",
  children,
  footer,
  size = "md",
  closeOnBackdrop = true,
}) {
  const shouldReduceMotion = useReducedMotion();

  const modalSizes = {
    sm: "max-w-md",
    md: "max-w-xl",
    lg: "max-w-2xl",
    xl: "max-w-4xl",
  };

  useEffect(() => {
    if (!open) return undefined;

    const previousOverflow =
      document.body.style.overflow;

    document.body.style.overflow = "hidden";

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        onClose?.();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow =
        previousOverflow;

      window.removeEventListener(
        "keydown",
        handleKeyDown
      );
    };
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-end justify-center p-0 sm:items-center sm:p-5"
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
          exit={{
            opacity: 0,
          }}
        >
          <motion.button
            type="button"
            aria-label="Close modal"
            className="absolute inset-0 cursor-default bg-slate-950/70 backdrop-blur-sm"
            onClick={
              closeOnBackdrop ? onClose : undefined
            }
          />

          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-title"
            initial={
              shouldReduceMotion
                ? false
                : {
                    opacity: 0,
                    y: 32,
                    scale: 0.97,
                  }
            }
            animate={{
              opacity: 1,
              y: 0,
              scale: 1,
            }}
            exit={{
              opacity: 0,
              y: 20,
              scale: 0.98,
            }}
            transition={{
              duration: 0.28,
              ease: [0.22, 1, 0.36, 1],
            }}
            className={[
              "relative z-10 flex max-h-[92vh] w-full flex-col",
              "overflow-hidden rounded-t-3xl border",
              "border-slate-200 bg-white shadow-2xl",
              "dark:border-slate-700/80 dark:bg-slate-900",
              "sm:rounded-3xl",
              modalSizes[size] || modalSizes.md,
            ].join(" ")}
          >
            <div className="flex items-start justify-between gap-4 border-b border-slate-200 px-5 py-4 dark:border-slate-800 sm:px-6">
              <div className="min-w-0">
                <h2
                  id="modal-title"
                  className="text-lg font-bold tracking-tight text-slate-900 dark:text-white"
                >
                  {title}
                </h2>

                {description && (
                  <p className="mt-1 text-sm leading-6 text-slate-500 dark:text-slate-400">
                    {description}
                  </p>
                )}
              </div>

              <motion.button
                type="button"
                aria-label="Close"
                onClick={onClose}
                whileHover={
                  shouldReduceMotion
                    ? undefined
                    : {
                        rotate: 90,
                        scale: 1.05,
                      }
                }
                whileTap={{
                  scale: 0.92,
                }}
                className="flex size-10 shrink-0 items-center justify-center rounded-xl border border-slate-200 text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-900 dark:border-slate-700 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white"
              >
                <X size={20} />
              </motion.button>
            </div>

            <div className="custom-scroll-area flex-1 overflow-y-auto px-5 py-5 sm:px-6">
              {children}
            </div>

            {footer && (
              <div className="border-t border-slate-200 bg-slate-50/80 px-5 py-4 dark:border-slate-800 dark:bg-slate-950/30 sm:px-6">
                {footer}
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default ModalShell;