import {
  useMemo,
  useState,
} from "react";

import { motion } from "framer-motion";

import {
  AlertTriangle,
  Bug,
  Check,
  ChevronDown,
  Clipboard,
  Home,
  RefreshCcw,
  RotateCcw,
  ShieldAlert,
} from "lucide-react";

function ErrorFallback({
  error,
  errorInfo,
  errorReference,
  onRetry,
}) {
  const [copied, setCopied] =
    useState(false);

  const [detailsOpen, setDetailsOpen] =
    useState(false);

  const isDevelopment =
    import.meta.env.DEV;

  const errorReport = useMemo(() => {
    const message =
      error?.message ||
      "Unknown application error";

    const stack =
      error?.stack ||
      "No JavaScript stack available";

    const componentStack =
      errorInfo?.componentStack ||
      "No React component stack available";

    return `
FINTRACK PRO ERROR REPORT
=========================

Reference:
${errorReference || "Unavailable"}

Time:
${new Date().toISOString()}

Page:
${window.location.href}

Message:
${message}

JavaScript Stack:
${stack}

React Component Stack:
${componentStack}

Browser:
${navigator.userAgent}
    `.trim();
  }, [
    error,
    errorInfo,
    errorReference,
  ]);

  const handleCopyReport =
    async () => {
      try {
        await navigator.clipboard.writeText(
          errorReport
        );

        setCopied(true);

        window.setTimeout(() => {
          setCopied(false);
        }, 2000);
      } catch (copyError) {
        console.error(
          "Could not copy error report:",
          copyError
        );
      }
    };

  const handleReload = () => {
    window.location.reload();
  };

  const handleGoHome = () => {
    window.location.assign("/");
  };

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-slate-50 p-4 text-slate-900 dark:bg-slate-950 dark:text-white sm:p-6">
      {/* Background effects */}

      <div className="pointer-events-none absolute -left-32 -top-32 h-96 w-96 rounded-full bg-rose-500/10 blur-3xl" />

      <div className="pointer-events-none absolute -bottom-32 -right-32 h-96 w-96 rounded-full bg-violet-500/10 blur-3xl" />

      <motion.section
        initial={{
          opacity: 0,
          y: 24,
          scale: 0.98,
        }}
        animate={{
          opacity: 1,
          y: 0,
          scale: 1,
        }}
        transition={{
          duration: 0.45,
          ease: "easeOut",
        }}
        className="relative w-full max-w-2xl overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl shadow-slate-200/50 dark:border-white/10 dark:bg-slate-900 dark:shadow-black/30"
      >
        {/* Top accent */}

        <div className="h-1.5 bg-gradient-to-r from-rose-500 via-orange-500 to-amber-500" />

        <div className="p-6 sm:p-8">
          {/* Icon */}

          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl border border-rose-500/20 bg-rose-500/10 text-rose-500 shadow-lg shadow-rose-500/10">
            <ShieldAlert size={30} />
          </div>

          {/* Main content */}

          <div className="mt-6 text-center">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-rose-500/20 bg-rose-500/10 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.16em] text-rose-600 dark:text-rose-400">
              <AlertTriangle size={12} />

              Application error
            </span>

            <h1 className="mt-4 text-2xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-3xl">
              Something went wrong
            </h1>

            <p className="mx-auto mt-3 max-w-lg text-sm leading-6 text-slate-500 dark:text-slate-400">
              FinTrack encountered an
              unexpected problem while
              rendering this page. Your
              locally stored financial data
              has not been deleted.
            </p>
          </div>

          {/* Error reference */}

          <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50/80 p-4 text-center dark:border-white/10 dark:bg-white/[0.035]">
            <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-slate-500 dark:text-slate-400">
              Error reference
            </p>

            <p className="mt-1 break-all font-mono text-sm font-bold text-slate-900 dark:text-white">
              {errorReference ||
                "Unavailable"}
            </p>
          </div>

          {/* Actions */}

          <div className="mt-6 grid gap-3 sm:grid-cols-3">
            <button
              type="button"
              onClick={onRetry}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-cyan-500/20 transition hover:-translate-y-0.5 active:scale-[0.98]"
            >
              <RotateCcw size={17} />

              Try Again
            </button>

            <button
              type="button"
              onClick={handleReload}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition hover:border-cyan-500/30 hover:bg-cyan-500/5 hover:text-cyan-600 dark:border-white/10 dark:bg-white/[0.04] dark:text-slate-200 dark:hover:text-cyan-400"
            >
              <RefreshCcw size={17} />

              Reload App
            </button>

            <button
              type="button"
              onClick={handleGoHome}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition hover:border-violet-500/30 hover:bg-violet-500/5 hover:text-violet-600 dark:border-white/10 dark:bg-white/[0.04] dark:text-slate-200 dark:hover:text-violet-400"
            >
              <Home size={17} />

              Dashboard
            </button>
          </div>

          {/* Error details */}

          {isDevelopment && (
            <div className="mt-6 overflow-hidden rounded-2xl border border-amber-500/20 bg-amber-500/[0.06]">
              <button
                type="button"
                onClick={() =>
                  setDetailsOpen(
                    (current) =>
                      !current
                  )
                }
                className="flex w-full items-center justify-between gap-4 p-4 text-left"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400">
                    <Bug size={17} />
                  </div>

                  <div>
                    <p className="text-sm font-semibold text-slate-900 dark:text-white">
                      Developer details
                    </p>

                    <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
                      Visible only during
                      development
                    </p>
                  </div>
                </div>

                <ChevronDown
                  size={18}
                  className={`shrink-0 text-slate-500 transition-transform ${
                    detailsOpen
                      ? "rotate-180"
                      : ""
                  }`}
                />
              </button>

              {detailsOpen && (
                <motion.div
                  initial={{
                    opacity: 0,
                    height: 0,
                  }}
                  animate={{
                    opacity: 1,
                    height: "auto",
                  }}
                  className="border-t border-amber-500/15 p-4"
                >
                  <p className="text-xs font-semibold text-slate-700 dark:text-slate-200">
                    Error message
                  </p>

                  <pre className="mt-2 max-h-28 overflow-auto whitespace-pre-wrap break-words rounded-xl bg-slate-950 p-3 font-mono text-xs leading-5 text-rose-300">
                    {error?.message ||
                      "Unknown error"}
                  </pre>

                  <p className="mt-4 text-xs font-semibold text-slate-700 dark:text-slate-200">
                    Component stack
                  </p>

                  <pre className="mt-2 max-h-56 overflow-auto whitespace-pre-wrap break-words rounded-xl bg-slate-950 p-3 font-mono text-xs leading-5 text-slate-300">
                    {errorInfo?.componentStack ||
                      "No component stack available"}
                  </pre>

                  <button
                    type="button"
                    onClick={
                      handleCopyReport
                    }
                    className="mt-4 inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-semibold text-slate-700 transition hover:border-cyan-500/30 hover:text-cyan-600 dark:border-white/10 dark:bg-white/[0.05] dark:text-slate-200 dark:hover:text-cyan-400"
                  >
                    {copied ? (
                      <Check
                        size={15}
                        className="text-emerald-500"
                      />
                    ) : (
                      <Clipboard
                        size={15}
                      />
                    )}

                    {copied
                      ? "Report Copied"
                      : "Copy Error Report"}
                  </button>
                </motion.div>
              )}
            </div>
          )}

          {/* Safety message */}

          <div className="mt-6 flex items-start gap-2 rounded-xl border border-emerald-500/20 bg-emerald-500/[0.06] px-4 py-3">
            <Check
              size={16}
              className="mt-0.5 shrink-0 text-emerald-500"
            />

            <p className="text-xs leading-5 text-emerald-700 dark:text-emerald-400">
              Your transactions, budgets,
              goals and backups remain stored
              in the browser unless you
              explicitly clear them.
            </p>
          </div>
        </div>
      </motion.section>
    </main>
  );
}

export default ErrorFallback;