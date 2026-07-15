import {
  useEffect,
  useState,
} from "react";

import {
  AlertTriangle,
  CalendarDays,
  CheckCircle2,
  Database,
  FileJson,
  Goal,
  Palette,
  ReceiptText,
  Upload,
  UserRound,
  WalletCards,
  X,
} from "lucide-react";

import toast from "react-hot-toast";

import {
  readFinanceBackupFile,
  restoreFinanceBackup,
} from "../../utils/financeBackup";

/* =========================================================
   PREVIEW CARD
========================================================= */

function PreviewCard({
  icon: Icon,
  label,
  value,
}) {
  return (
    <div className="flex min-w-0 items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50/80 p-3 dark:border-white/10 dark:bg-white/[0.035]">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-cyan-500/10 text-cyan-600 dark:text-cyan-400">
        <Icon size={17} />
      </div>

      <div className="min-w-0">
        <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-slate-500 dark:text-slate-400">
          {label}
        </p>

        <p className="mt-0.5 truncate text-sm font-bold text-slate-900 dark:text-white">
          {value}
        </p>
      </div>
    </div>
  );
}

/* =========================================================
   DATE FORMATTER
========================================================= */

function formatBackupDate(value) {
  if (!value) {
    return "Unknown";
  }

  const date = new Date(value);

  if (
    Number.isNaN(date.getTime())
  ) {
    return "Unknown";
  }

  return new Intl.DateTimeFormat(
    "en-IN",
    {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }
  ).format(date);
}

/* =========================================================
   MAIN COMPONENT
========================================================= */

function ImportBackupModal({
  open,
  onClose,
}) {
  const [selectedFile, setSelectedFile] =
    useState(null);

  const [validation, setValidation] =
    useState(null);

  const [error, setError] =
    useState("");

  const [reading, setReading] =
    useState(false);

  const [restoring, setRestoring] =
    useState(false);

  const [
    replacementConfirmed,
    setReplacementConfirmed,
  ] = useState(false);

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
        !restoring
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
    restoring,
  ]);

  useEffect(() => {
    if (!open) {
      setSelectedFile(null);
      setValidation(null);
      setError("");
      setReading(false);
      setRestoring(false);
      setReplacementConfirmed(false);
    }
  }, [open]);

  if (!open) {
    return null;
  }

  const handleFileChange = async (
    event
  ) => {
    const file =
      event.target.files?.[0];

    setSelectedFile(file || null);
    setValidation(null);
    setError("");
    setReplacementConfirmed(false);

    if (!file) {
      return;
    }

    setReading(true);

    try {
      const result =
        await readFinanceBackupFile(
          file
        );

      setValidation(result);

      if (!result.valid) {
        setError(
          result.errors.join(" ")
        );
      }
    } catch (fileError) {
      setValidation(null);

      setError(
        fileError.message ||
          "The backup could not be read."
      );
    } finally {
      setReading(false);
    }
  };

  const handleRestore = () => {
    if (
      !validation?.valid ||
      !validation.backup ||
      !replacementConfirmed
    ) {
      return;
    }

    setRestoring(true);

    try {
      restoreFinanceBackup(
        validation.backup
      );

      toast.success(
        "Backup restored successfully"
      );

      window.setTimeout(() => {
        window.location.reload();
      }, 700);
    } catch (restoreError) {
      console.error(
        "Backup restore failed:",
        restoreError
      );

      toast.error(
        restoreError.message ||
          "Backup restore failed"
      );

      setRestoring(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}

      <button
        type="button"
        aria-label="Close import backup modal"
        onClick={
          restoring
            ? undefined
            : onClose
        }
        className="absolute inset-0 bg-slate-950/70 backdrop-blur-sm"
      />

      {/* Modal */}

      <div className="relative z-10 max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-3xl border border-slate-200 bg-white shadow-2xl dark:border-white/10 dark:bg-slate-900">
        {/* Header */}

        <div className="sticky top-0 z-10 flex items-start justify-between gap-4 border-b border-slate-200 bg-white/95 p-5 backdrop-blur-xl dark:border-white/10 dark:bg-slate-900/95 sm:p-6">
          <div className="flex items-start gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-cyan-500/10 text-cyan-600 dark:text-cyan-400">
              <Upload size={21} />
            </div>

            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                Restore Backup
              </h2>

              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                Preview and restore a FinTrack
                JSON backup.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={restoring}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-slate-500 transition hover:bg-slate-100 hover:text-slate-900 disabled:cursor-not-allowed disabled:opacity-50 dark:hover:bg-white/10 dark:hover:text-white"
          >
            <X size={19} />
          </button>
        </div>

        <div className="space-y-5 p-5 sm:p-6">
          {/* File selector */}

          <label className="block cursor-pointer rounded-3xl border-2 border-dashed border-slate-300 bg-slate-50/70 p-7 text-center transition hover:border-cyan-500/50 hover:bg-cyan-500/[0.03] dark:border-white/15 dark:bg-white/[0.025]">
            <input
              type="file"
              accept=".json,application/json"
              onChange={
                handleFileChange
              }
              className="sr-only"
            />

            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-cyan-500/10 text-cyan-600 dark:text-cyan-400">
              {reading ? (
                <span className="h-6 w-6 animate-spin rounded-full border-2 border-current border-r-transparent" />
              ) : (
                <FileJson size={27} />
              )}
            </div>

            <h3 className="mt-4 text-sm font-semibold text-slate-900 dark:text-white">
              Select FinTrack backup
            </h3>

            <p className="mt-2 text-xs leading-5 text-slate-500 dark:text-slate-400">
              Choose a JSON backup file.
              Maximum size: 5 MB.
            </p>

            {selectedFile && (
              <p className="mt-3 break-all text-xs font-semibold text-cyan-600 dark:text-cyan-400">
                {selectedFile.name}
              </p>
            )}
          </label>

          {/* Error */}

          {error && (
            <div className="flex items-start gap-3 rounded-2xl border border-rose-500/20 bg-rose-500/10 p-4 text-rose-700 dark:text-rose-400">
              <AlertTriangle
                size={19}
                className="mt-0.5 shrink-0"
              />

              <div>
                <p className="text-sm font-semibold">
                  Backup validation failed
                </p>

                <p className="mt-1 text-xs leading-5">
                  {error}
                </p>
              </div>
            </div>
          )}

          {/* Valid preview */}

          {validation?.valid && (
            <>
              <div className="flex items-start gap-3 rounded-2xl border border-emerald-500/20 bg-emerald-500/10 p-4">
                <CheckCircle2
                  size={19}
                  className="mt-0.5 shrink-0 text-emerald-600 dark:text-emerald-400"
                />

                <div>
                  <p className="text-sm font-semibold text-emerald-700 dark:text-emerald-400">
                    Valid FinTrack backup
                  </p>

                  <p className="mt-1 text-xs leading-5 text-emerald-700/80 dark:text-emerald-400/80">
                    Review the information
                    below before replacing
                    your current data.
                  </p>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
                  Backup preview
                </h3>

                <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  <PreviewCard
                    icon={ReceiptText}
                    label="Transactions"
                    value={
                      validation.preview
                        .transactionCount
                    }
                  />

                  <PreviewCard
                    icon={WalletCards}
                    label="Budgets"
                    value={
                      validation.preview
                        .budgetCount
                    }
                  />

                  <PreviewCard
                    icon={Goal}
                    label="Goals"
                    value={
                      validation.preview
                        .goalCount
                    }
                  />

                  <PreviewCard
                    icon={UserRound}
                    label="Profile"
                    value={
                      validation.preview
                        .profileIncluded
                        ? validation.preview
                            .profileName
                        : "Not included"
                    }
                  />

                  <PreviewCard
                    icon={Palette}
                    label="Theme"
                    value={
                      validation.preview
                        .theme
                    }
                  />

                  <PreviewCard
                    icon={CalendarDays}
                    label="Exported"
                    value={formatBackupDate(
                      validation.preview
                        .exportedAt
                    )}
                  />
                </div>
              </div>

              {/* Warnings */}

              {validation.warnings
                .length > 0 && (
                <div className="rounded-2xl border border-amber-500/20 bg-amber-500/10 p-4">
                  <div className="flex items-center gap-2 text-amber-700 dark:text-amber-400">
                    <AlertTriangle
                      size={17}
                    />

                    <p className="text-sm font-semibold">
                      Import warnings
                    </p>
                  </div>

                  <div className="mt-2 space-y-1">
                    {validation.warnings.map(
                      (
                        warning,
                        index
                      ) => (
                        <p
                          key={`${warning}-${index}`}
                          className="text-xs leading-5 text-amber-700/80 dark:text-amber-400/80"
                        >
                          • {warning}
                        </p>
                      )
                    )}
                  </div>
                </div>
              )}

              {/* Replacement confirmation */}

              <label className="flex cursor-pointer items-start gap-3 rounded-2xl border border-rose-500/20 bg-rose-500/[0.06] p-4">
                <input
                  type="checkbox"
                  checked={
                    replacementConfirmed
                  }
                  onChange={(event) =>
                    setReplacementConfirmed(
                      event.target.checked
                    )
                  }
                  className="mt-1 h-4 w-4 rounded border-slate-300 accent-rose-500"
                />

                <div>
                  <p className="text-sm font-semibold text-slate-900 dark:text-white">
                    Replace current local data
                  </p>

                  <p className="mt-1 text-xs leading-5 text-slate-500 dark:text-slate-400">
                    I understand that current
                    transactions, budgets,
                    goals, profile and
                    appearance settings will
                    be replaced.
                  </p>
                </div>
              </label>
            </>
          )}

          {/* Footer */}

          <div className="flex flex-col-reverse gap-3 border-t border-slate-200 pt-5 dark:border-white/10 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={onClose}
              disabled={restoring}
              className="rounded-xl border border-slate-200 px-5 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:opacity-50 dark:border-white/10 dark:text-slate-200 dark:hover:bg-white/[0.05]"
            >
              Cancel
            </button>

            <button
              type="button"
              onClick={handleRestore}
              disabled={
                !validation?.valid ||
                !replacementConfirmed ||
                restoring
              }
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-cyan-500/20 transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0"
            >
              {restoring ? (
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-r-transparent" />
              ) : (
                <Database size={17} />
              )}

              {restoring
                ? "Restoring..."
                : "Restore Backup"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ImportBackupModal;