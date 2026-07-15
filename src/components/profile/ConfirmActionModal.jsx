import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { AlertTriangle, ShieldAlert, X } from "lucide-react";

function ConfirmActionModal({
  open,
  onClose,
  onConfirm,
  title,
  description,
  confirmText = "CONFIRM",
  buttonText = "Confirm",
  loading = false,
}) {
  const inputRef = useRef(null);
  const [typedValue, setTypedValue] = useState("");

  useEffect(() => {
    if (!open) {
      setTypedValue("");
      return undefined;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const focusTimer = window.setTimeout(() => inputRef.current?.focus(), 120);

    const handleEscape = (event) => {
      if (event.key === "Escape" && !loading) {
        onClose?.();
      }
    };

    document.addEventListener("keydown", handleEscape);

    return () => {
      window.clearTimeout(focusTimer);
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", handleEscape);
    };
  }, [loading, onClose, open]);

  const normalizedConfirmText = String(confirmText || "CONFIRM").trim();
  const canConfirm = typedValue.trim() === normalizedConfirmText;

  const handleSubmit = (event) => {
    event.preventDefault();

    if (canConfirm && !loading) {
      onConfirm?.();
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/75 p-4 backdrop-blur-sm"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget && !loading) {
              onClose?.();
            }
          }}
        >
          <motion.form
            role="dialog"
            aria-modal="true"
            aria-labelledby="confirm-action-title"
            onSubmit={handleSubmit}
            initial={{ opacity: 0, y: 18, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 18, scale: 0.97 }}
            transition={{ duration: 0.24, ease: "easeOut" }}
            className="relative w-full max-w-md overflow-hidden rounded-3xl border border-rose-500/20 bg-white shadow-2xl dark:bg-slate-900"
          >
            <div className="h-1.5 bg-gradient-to-r from-rose-500 via-red-500 to-orange-500" />

            <div className="p-5 sm:p-6">
              <div className="flex items-start justify-between gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-rose-500/10 text-rose-600 dark:text-rose-400">
                  <ShieldAlert size={23} />
                </div>

                <button
                  type="button"
                  onClick={onClose}
                  disabled={loading}
                  aria-label="Close confirmation"
                  className="flex h-9 w-9 items-center justify-center rounded-xl text-slate-500 transition hover:bg-slate-100 hover:text-slate-900 disabled:opacity-50 dark:hover:bg-white/10 dark:hover:text-white"
                >
                  <X size={18} />
                </button>
              </div>

              <h2
                id="confirm-action-title"
                className="mt-5 text-xl font-bold text-slate-900 dark:text-white sm:text-2xl"
              >
                {title}
              </h2>

              <p className="mt-3 text-sm leading-6 text-slate-500 dark:text-slate-400">
                {description}
              </p>

              <div className="mt-5 flex items-start gap-3 rounded-2xl border border-rose-500/20 bg-rose-500/[0.06] p-4">
                <AlertTriangle
                  size={18}
                  className="mt-0.5 shrink-0 text-rose-600 dark:text-rose-400"
                />
                <p className="text-xs leading-5 text-rose-700 dark:text-rose-400">
                  This action may permanently change locally stored data. Confirm only when you understand the result.
                </p>
              </div>

              <label className="mt-5 block text-sm font-semibold text-slate-700 dark:text-slate-200">
                Type <span className="text-rose-600 dark:text-rose-400">{normalizedConfirmText}</span> to continue
              </label>

              <input
                ref={inputRef}
                type="text"
                value={typedValue}
                onChange={(event) => setTypedValue(event.target.value)}
                disabled={loading}
                autoComplete="off"
                spellCheck="false"
                placeholder={normalizedConfirmText}
                className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-900 outline-none transition focus:border-rose-500 focus:ring-4 focus:ring-rose-500/10 dark:border-white/10 dark:bg-slate-950/60 dark:text-white"
              />

              <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={onClose}
                  disabled={loading}
                  className="rounded-xl border border-slate-200 px-5 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:opacity-50 dark:border-white/10 dark:text-slate-200 dark:hover:bg-white/[0.05]"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={!canConfirm || loading}
                  className="inline-flex min-w-40 items-center justify-center gap-2 rounded-xl bg-rose-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-rose-500/20 transition hover:bg-rose-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {loading && (
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-r-transparent" />
                  )}
                  {loading ? "Processing..." : buttonText}
                </button>
              </div>
            </div>
          </motion.form>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default ConfirmActionModal;
