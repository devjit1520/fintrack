import {
  useEffect,
  useState,
} from "react";

import {
  AlertTriangle,
  Palette,
  Trash2,
  UserRound,
  X,
} from "lucide-react";

import toast from "react-hot-toast";

import {
  clearFinanceData,
} from "../../utils/financeBackup";

function ClearDataModal({
  open,
  onClose,
}) {
  const [confirmation, setConfirmation] =
    useState("");

  const [keepProfile, setKeepProfile] =
    useState(true);

  const [
    keepAppearance,
    setKeepAppearance,
  ] = useState(true);

  const [clearing, setClearing] =
    useState(false);

  useEffect(() => {
    if (!open) {
      return undefined;
    }

    const previousOverflow =
      document.body.style.overflow;

    document.body.style.overflow =
      "hidden";

    const handleKeyDown = (
      event
    ) => {
      if (
        event.key === "Escape" &&
        !clearing
      ) {
        onClose();
      }
    };

    window.addEventListener(
      "keydown",
      handleKeyDown
    );

    return () => {
      document.body.style.overflow =
        previousOverflow;

      window.removeEventListener(
        "keydown",
        handleKeyDown
      );
    };
  }, [
    open,
    onClose,
    clearing,
  ]);

  useEffect(() => {
    if (!open) {
      setConfirmation("");
      setKeepProfile(true);
      setKeepAppearance(true);
      setClearing(false);
    }
  }, [open]);

  if (!open) {
    return null;
  }

  const canClear =
    confirmation.trim().toUpperCase() ===
    "DELETE";

  const handleClear = () => {
    if (!canClear) {
      return;
    }

    setClearing(true);

    try {
      clearFinanceData({
        keepProfile,
        keepAppearance,
      });

      toast.success(
        "Finance data cleared"
      );

      window.setTimeout(() => {
        window.location.reload();
      }, 700);
    } catch (error) {
      console.error(
        "Failed to clear finance data:",
        error
      );

      toast.error(
        "Could not clear finance data"
      );

      setClearing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <button
        type="button"
        aria-label="Close clear data modal"
        onClick={
          clearing
            ? undefined
            : onClose
        }
        className="absolute inset-0 bg-slate-950/70 backdrop-blur-sm"
      />

      <div className="relative z-10 w-full max-w-lg overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl dark:border-white/10 dark:bg-slate-900">
        {/* Header */}

        <div className="flex items-start justify-between gap-4 border-b border-slate-200 p-5 dark:border-white/10 sm:p-6">
          <div className="flex items-start gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-rose-500/10 text-rose-600 dark:text-rose-400">
              <Trash2 size={21} />
            </div>

            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                Clear Finance Data
              </h2>

              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                Permanently remove local
                financial records.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={clearing}
            className="flex h-9 w-9 items-center justify-center rounded-xl text-slate-500 transition hover:bg-slate-100 hover:text-slate-900 disabled:opacity-50 dark:hover:bg-white/10 dark:hover:text-white"
          >
            <X size={19} />
          </button>
        </div>

        <div className="space-y-5 p-5 sm:p-6">
          {/* Warning */}

          <div className="flex items-start gap-3 rounded-2xl border border-rose-500/20 bg-rose-500/10 p-4">
            <AlertTriangle
              size={20}
              className="mt-0.5 shrink-0 text-rose-600 dark:text-rose-400"
            />

            <div>
              <p className="text-sm font-semibold text-rose-700 dark:text-rose-400">
                This action cannot be undone
              </p>

              <p className="mt-1 text-xs leading-5 text-rose-700/80 dark:text-rose-400/80">
                All transactions, budgets,
                and goals stored in this
                browser will be removed.
                Export a backup first when
                the data may be needed later.
              </p>
            </div>
          </div>

          {/* Preserve options */}

          <div className="space-y-3">
            <label className="flex cursor-pointer items-start gap-3 rounded-2xl border border-slate-200 bg-slate-50/70 p-4 dark:border-white/10 dark:bg-white/[0.03]">
              <input
                type="checkbox"
                checked={keepProfile}
                onChange={(event) =>
                  setKeepProfile(
                    event.target.checked
                  )
                }
                className="mt-1 h-4 w-4 rounded accent-cyan-500"
              />

              <UserRound
                size={18}
                className="mt-0.5 shrink-0 text-cyan-500"
              />

              <div>
                <p className="text-sm font-semibold text-slate-900 dark:text-white">
                  Keep profile details
                </p>

                <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                  Preserve your name,
                  contact information and
                  preferences.
                </p>
              </div>
            </label>

            <label className="flex cursor-pointer items-start gap-3 rounded-2xl border border-slate-200 bg-slate-50/70 p-4 dark:border-white/10 dark:bg-white/[0.03]">
              <input
                type="checkbox"
                checked={keepAppearance}
                onChange={(event) =>
                  setKeepAppearance(
                    event.target.checked
                  )
                }
                className="mt-1 h-4 w-4 rounded accent-cyan-500"
              />

              <Palette
                size={18}
                className="mt-0.5 shrink-0 text-violet-500"
              />

              <div>
                <p className="text-sm font-semibold text-slate-900 dark:text-white">
                  Keep appearance settings
                </p>

                <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                  Preserve the selected
                  theme and accent color.
                </p>
              </div>
            </label>
          </div>

          {/* Confirmation */}

          <div>
            <label className="text-sm font-semibold text-slate-900 dark:text-white">
              Type{" "}
              <span className="text-rose-500">
                DELETE
              </span>{" "}
              to confirm
            </label>

            <input
              type="text"
              value={confirmation}
              onChange={(event) =>
                setConfirmation(
                  event.target.value
                )
              }
              autoComplete="off"
              placeholder="DELETE"
              className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-rose-500 focus:ring-4 focus:ring-rose-500/10 dark:border-white/10 dark:bg-white/[0.04] dark:text-white"
            />
          </div>

          {/* Actions */}

          <div className="flex flex-col-reverse gap-3 border-t border-slate-200 pt-5 dark:border-white/10 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={onClose}
              disabled={clearing}
              className="rounded-xl border border-slate-200 px-5 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:opacity-50 dark:border-white/10 dark:text-slate-200 dark:hover:bg-white/[0.05]"
            >
              Cancel
            </button>

            <button
              type="button"
              onClick={handleClear}
              disabled={
                !canClear || clearing
              }
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-rose-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-rose-500/20 transition hover:bg-rose-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {clearing ? (
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-r-transparent" />
              ) : (
                <Trash2 size={17} />
              )}

              {clearing
                ? "Clearing..."
                : "Clear Data"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ClearDataModal;